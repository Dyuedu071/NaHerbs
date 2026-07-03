package vn.io.naherb.chatbot.retrieval;

import org.springframework.util.StringUtils;

final class ProductTextMatcher {

    private ProductTextMatcher() {}

    static boolean containsToken(String text, String token) {
        if (!StringUtils.hasText(text) || !StringUtils.hasText(token)) {
            return false;
        }
        return (" " + text.trim() + " ").contains(" " + token.trim() + " ");
    }

    static boolean containsPhrase(String text, String phrase) {
        if (!StringUtils.hasText(text) || !StringUtils.hasText(phrase)) {
            return false;
        }
        return text.contains(phrase.trim());
    }
}
