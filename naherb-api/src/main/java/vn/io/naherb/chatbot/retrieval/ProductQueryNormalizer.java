package vn.io.naherb.chatbot.retrieval;

import java.util.Set;

final class ProductQueryNormalizer {

    private static final Set<String> STOP_WORDS = Set.of(
            "san",
            "pham",
            "sanpham",
            "naherbs",
            "na",
            "herbs",
            "website",
            "web",
            "bao",
            "nhieu",
            "may",
            "khong",
            "hien",
            "tai",
            "cua",
            "tren",
            "la",
            "gi",
            "cho",
            "toi",
            "minh",
            "biet",
            "ve",
            "va",
            "cac",
            "mot",
            "nhung",
            "nhu",
            "the",
            "nao",
            "duoc",
            "dang",
            "ban",
            "mua",
            "xin",
            "chao",
            "cam",
            "on");

    private ProductQueryNormalizer() {}

    static String stripStopWords(String normalizedMessage) {
        StringBuilder builder = new StringBuilder();
        for (String token : normalizedMessage.split("\\s+")) {
            if (token.isBlank() || token.length() < 2 || STOP_WORDS.contains(token)) {
                continue;
            }
            if (builder.length() > 0) {
                builder.append(' ');
            }
            builder.append(token);
        }
        return builder.toString().trim();
    }
}
