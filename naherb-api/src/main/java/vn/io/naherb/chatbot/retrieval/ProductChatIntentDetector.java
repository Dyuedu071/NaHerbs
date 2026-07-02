package vn.io.naherb.chatbot.retrieval;

import java.text.Normalizer;
import java.util.Locale;
import java.util.Optional;
import java.util.regex.Matcher;
import java.util.regex.Pattern;
import org.springframework.util.StringUtils;

final class ProductChatIntentDetector {

    private static final Pattern DIACRITICS = Pattern.compile("\\p{M}+");
    private static final Pattern CATALOG_OVERVIEW = Pattern.compile(
            ".*(bao nhieu san pham|co may san pham|tong.*san pham|danh sach san pham|"
                    + "web co.*san pham|website co.*san pham|naherbs co.*san pham|"
                    + "hien tai.*san pham|so luong san pham|co nhung san pham nao).*");
    private static final Pattern CHEAPEST_PRODUCT = Pattern.compile(
            ".*(re nhat|gia re nhat|san pham.*re nhat|san pham nao re|gia thap nhat|"
                    + "ban re nhat|re hon|gia re$|gia re ).*");
    private static final Pattern MOST_EXPENSIVE_PRODUCT = Pattern.compile(
            ".*(dat nhat|gia cao nhat|san pham.*dat nhat|san pham nao dat|gia dat nhat|"
                    + "ban dat nhat|dat hon|gia dat$|gia dat |gia cao nhat|top.*dat).*");
    private static final Pattern FULL_PRICE_LIST = Pattern.compile(
            ".*(bang gia|gia cua.*san pham|cac san pham.*gia|liet ke.*gia|"
                    + "san pham.*bao nhieu tien|danh sach gia|xep.*theo gia).*");
    private static final Pattern LIMIT_WITH_PRODUCT = Pattern.compile("(\\d{1,2})\\s*(?:san pham|sp)\\b");
    private static final Pattern LIMIT_AFTER_VERB = Pattern.compile(
            "(?:cho toi|cho|top|lay|liet ke|ke|goi y)\\s*(\\d{1,2})\\b");

    private ProductChatIntentDetector() {}

    static ProductChatIntent detect(String message) {
        if (!StringUtils.hasText(message)) {
            return ProductChatIntent.NONE;
        }
        String normalized = normalize(message);
        if (CATALOG_OVERVIEW.matcher(normalized).matches()) {
            return ProductChatIntent.CATALOG_OVERVIEW;
        }
        if (parsePriceRankingNormalized(normalized, 3).isPresent()) {
            return ProductChatIntent.PRICE_RANKING;
        }
        if (looksLikeProductSearch(normalized)) {
            return ProductChatIntent.PRODUCT_SEARCH;
        }
        return ProductChatIntent.NONE;
    }

    static Optional<PriceRankingQuery> parsePriceRanking(String message, int defaultLimit) {
        if (!StringUtils.hasText(message)) {
            return Optional.empty();
        }
        return parsePriceRankingNormalized(normalize(message), defaultLimit);
    }

    private static Optional<PriceRankingQuery> parsePriceRankingNormalized(String normalized, int defaultLimit) {
        if (!StringUtils.hasText(normalized)) {
            return Optional.empty();
        }

        PriceSort sort = null;
        if (CHEAPEST_PRODUCT.matcher(normalized).matches()) {
            sort = PriceSort.CHEAPEST;
        } else if (MOST_EXPENSIVE_PRODUCT.matcher(normalized).matches()) {
            sort = PriceSort.MOST_EXPENSIVE;
        } else if (FULL_PRICE_LIST.matcher(normalized).matches()) {
            sort = PriceSort.CHEAPEST;
        }

        if (sort == null) {
            return Optional.empty();
        }

        int limit = parseLimit(normalized, defaultLimit);
        if (FULL_PRICE_LIST.matcher(normalized).matches() && !LIMIT_WITH_PRODUCT.matcher(normalized).find()) {
            limit = Math.max(limit, defaultLimit);
        }
        return Optional.of(new PriceRankingQuery(sort, limit));
    }

    private static int parseLimit(String normalized, int defaultLimit) {
        Matcher productLimit = LIMIT_WITH_PRODUCT.matcher(normalized);
        if (productLimit.find()) {
            return clampLimit(Integer.parseInt(productLimit.group(1)));
        }
        Matcher verbLimit = LIMIT_AFTER_VERB.matcher(normalized);
        if (verbLimit.find()) {
            return clampLimit(Integer.parseInt(verbLimit.group(1)));
        }
        return defaultLimit;
    }

    private static int clampLimit(int limit) {
        return Math.min(20, Math.max(1, limit));
    }

    private static boolean looksLikeProductSearch(String normalized) {
        if (normalized.contains("san pham")
                || normalized.contains("goi")
                || normalized.contains("tui chuom")
                || normalized.contains("tinh dau")
                || normalized.contains("xong hoi")
                || normalized.contains("dieu ngai")
                || normalized.contains("tu van")
                || normalized.contains("goi y")
                || normalized.contains("phu hop")
                || normalized.contains("mua")
                || normalized.contains("gia")
                || normalized.contains("dau")
                || normalized.contains("moi")
                || normalized.contains("te ")
                || normalized.contains("buon")
                || normalized.contains("met")
                || normalized.contains("ngu")) {
            return true;
        }
        String meaningful = ProductQueryNormalizer.stripStopWords(normalized);
        return meaningful.split("\\s+").length >= 1 && meaningful.length() >= 3;
    }

    static String normalize(String value) {
        String lowered = value.toLowerCase(Locale.ROOT).trim().replace('đ', 'd');
        return DIACRITICS.matcher(Normalizer.normalize(lowered, Normalizer.Form.NFD)).replaceAll("");
    }
}
