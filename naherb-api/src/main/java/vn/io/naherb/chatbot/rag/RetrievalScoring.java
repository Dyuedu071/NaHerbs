package vn.io.naherb.chatbot.rag;

import java.util.Locale;

public final class RetrievalScoring {

    private static final double COSINE_WEIGHT = 0.5;
    private static final double KEYWORD_WEIGHT = 0.25;
    private static final double PHRASE_WEIGHT = 0.25;

    private RetrievalScoring() {}

    public static double relevanceScore(String query, String content, double cosineSimilarity) {
        double keyword = keywordOverlapScore(query, content);
        double phrase = phraseOverlapScore(query, content);
        return (cosineSimilarity * COSINE_WEIGHT) + (keyword * KEYWORD_WEIGHT) + (phrase * PHRASE_WEIGHT);
    }

    public static double keywordOverlapScore(String query, String content) {
        if (query == null || content == null || query.isBlank() || content.isBlank()) {
            return 0;
        }
        String normalizedContent = normalize(content);
        String[] tokens = normalize(query).split("\\s+");
        int considered = 0;
        int hits = 0;
        for (String token : tokens) {
            if (token.length() < 2) {
                continue;
            }
            considered++;
            if (normalizedContent.contains(token)) {
                hits++;
            }
        }
        if (considered == 0) {
            return 0;
        }
        return (double) hits / considered;
    }

    public static double phraseOverlapScore(String query, String content) {
        if (query == null || content == null || query.isBlank() || content.isBlank()) {
            return 0;
        }
        String normalizedContent = normalize(content);
        String[] tokens = normalize(query).split("\\s+");
        if (tokens.length < 2) {
            return keywordOverlapScore(query, content);
        }

        int considered = 0;
        int hits = 0;
        for (int phraseLength = 2; phraseLength <= Math.min(5, tokens.length); phraseLength++) {
            for (int start = 0; start <= tokens.length - phraseLength; start++) {
                StringBuilder builder = new StringBuilder();
                for (int index = 0; index < phraseLength; index++) {
                    if (index > 0) {
                        builder.append(' ');
                    }
                    builder.append(tokens[start + index]);
                }
                String phrase = builder.toString();
                if (phrase.length() < 6) {
                    continue;
                }
                considered++;
                if (normalizedContent.contains(phrase)) {
                    hits++;
                }
            }
        }
        if (considered == 0) {
            return 0;
        }
        return (double) hits / considered;
    }

    static double combinedScore(double cosineSimilarity, double keywordScore) {
        return (cosineSimilarity * 0.6) + (keywordScore * 0.4);
    }

    private static String normalize(String value) {
        return value.toLowerCase(Locale.ROOT).trim();
    }
}
