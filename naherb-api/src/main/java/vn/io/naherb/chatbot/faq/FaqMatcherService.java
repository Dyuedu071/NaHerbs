package vn.io.naherb.chatbot.faq;

import java.text.Normalizer;
import java.util.Comparator;
import java.util.List;
import java.util.Locale;
import java.util.Optional;
import java.util.regex.Pattern;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import vn.io.naherb.chatbot.ChatbotConfigService;
import vn.io.naherb.chatbot.dto.ChatbotFaqEntry;
import vn.io.naherb.chatbot.rag.RetrievalScoring;

@Service
@RequiredArgsConstructor
public class FaqMatcherService {

    private static final double MATCH_THRESHOLD = 0.62;
    private static final Pattern DIACRITICS = Pattern.compile("\\p{M}+");

    private final ChatbotConfigService chatbotConfigService;

    public Optional<FaqMatch> match(String userMessage) {
        if (!StringUtils.hasText(userMessage)) {
            return Optional.empty();
        }

        String normalizedQuery = normalize(userMessage);
        List<ChatbotFaqEntry> entries = chatbotConfigService.getFaqEntries();
        if (entries.isEmpty()) {
            return Optional.empty();
        }

        return entries.stream()
                .map(entry -> new ScoredFaq(entry, scoreEntry(normalizedQuery, userMessage, entry)))
                .filter(scored -> scored.score() >= MATCH_THRESHOLD)
                .max(Comparator.comparingDouble(ScoredFaq::score))
                .map(scored -> new FaqMatch(scored.entry().answer(), scored.score()));
    }

    private double scoreEntry(String normalizedQuery, String rawQuery, ChatbotFaqEntry entry) {
        String normalizedQuestion = normalize(entry.question());
        if (normalizedQuery.equals(normalizedQuestion)) {
            return 1.0;
        }
        if (normalizedQuery.contains(normalizedQuestion) || normalizedQuestion.contains(normalizedQuery)) {
            return 0.92;
        }

        double questionScore = RetrievalScoring.keywordOverlapScore(rawQuery, entry.question())
                + RetrievalScoring.phraseOverlapScore(rawQuery, entry.question());
        double keywordScore = 0;
        if (entry.keywords() != null) {
            for (String keyword : entry.keywords()) {
                if (!StringUtils.hasText(keyword)) {
                    continue;
                }
                String normalizedKeyword = normalize(keyword);
                if (normalizedQuery.contains(normalizedKeyword)) {
                    keywordScore += 0.35;
                }
            }
        }
        return Math.min(1.0, questionScore + keywordScore);
    }

    private static String normalize(String value) {
        String lowered = value.toLowerCase(Locale.ROOT).trim();
        String withoutDiacritics =
                DIACRITICS.matcher(Normalizer.normalize(lowered, Normalizer.Form.NFD)).replaceAll("");
        return withoutDiacritics.replaceAll("\\s+", " ");
    }

    private record ScoredFaq(ChatbotFaqEntry entry, double score) {}

    public record FaqMatch(String answer, double score) {}
}
