package vn.io.naherb.chatbot.retrieval;


import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;
import lombok.RequiredArgsConstructor;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;
import vn.io.naherb.chatbot.ChatbotConfigService;
import vn.io.naherb.chatbot.dto.RecommendedProductResponse;
import vn.io.naherb.chatbot.rag.RetrievalScoring;
import vn.io.naherb.common.enums.ContentStatus;
import vn.io.naherb.common.enums.SkuStatus;
import vn.io.naherb.common.enums.StockStatus;
import vn.io.naherb.product.Product;
import vn.io.naherb.product.ProductImage;
import vn.io.naherb.product.ProductSku;
import vn.io.naherb.product.repository.ProductImageRepository;
import vn.io.naherb.product.repository.ProductRepository;
import vn.io.naherb.product.repository.ProductSkuRepository;

@Service
@RequiredArgsConstructor
public class ProductRetrievalService {

    private static final double MIN_RECOMMENDATION_SCORE = 0.35;

    private final ProductRepository productRepository;
    private final ProductSkuRepository skuRepository;
    private final ProductImageRepository imageRepository;
    private final ChatbotConfigService chatbotConfigService;

    public ProductChatIntent detectIntent(String message) {
        return ProductChatIntentDetector.detect(message);
    }

    @Transactional(readOnly = true)
    public String buildCatalogOverviewContext() {
        List<Product> published =
                productRepository.findByStatusOrderByDisplayOrderAsc(ContentStatus.PUBLISHED);
        if (published.isEmpty()) {
            return "THỐNG KÊ SẢN PHẨM TỪ HỆ THỐNG:\n- Hiện chưa có sản phẩm published trên website.";
        }

        List<String> featuredNames = published.stream()
                .filter(Product::isFeatured)
                .map(Product::getName)
                .limit(5)
                .toList();
        if (featuredNames.isEmpty()) {
            featuredNames = published.stream().map(Product::getName).limit(5).toList();
        }

        StringBuilder builder = new StringBuilder("THỐNG KÊ SẢN PHẨM TỪ HỆ THỐNG:\n");
        builder.append("- Tổng số sản phẩm đang bán trên website: ")
                .append(published.size())
                .append('\n');
        builder.append("- Một số sản phẩm tiêu biểu: ")
                .append(String.join(", ", featuredNames))
                .append('\n');
        builder.append("- Danh sách đầy đủ: ");
        builder.append(published.stream().map(Product::getName).collect(Collectors.joining(", ")));
        builder.append(
                "\nKhi người dùng hỏi số lượng sản phẩm, hãy nêu con số chính xác từ dòng tổng số ở trên.");
        return builder.toString().trim();
    }

    @Transactional(readOnly = true)
    public Optional<PriceRankingQuery> resolvePriceRanking(String message) {
        int defaultLimit = chatbotConfigService.getMaxProductsPerAnswer();
        Optional<PriceRankingQuery> query = ProductChatIntentDetector.parsePriceRanking(message, defaultLimit);
        if (query.isEmpty()) {
            return query;
        }
        String normalized = ProductChatIntentDetector.normalize(message);
        if (isFullPriceListWithoutLimit(normalized)) {
            int total = countPublishedProductsWithPrice();
            if (total > 0) {
                return Optional.of(new PriceRankingQuery(query.get().sort(), total));
            }
        }
        return query;
    }

    @Transactional(readOnly = true)
    public String buildPriceRankingContext(PriceRankingQuery query) {
        List<RecommendedProductResponse> ranked = getProductsByPriceRank(query);
        if (ranked.isEmpty()) {
            return "GIÁ SẢN PHẨM TỪ HỆ THỐNG:\n- Chưa có sản phẩm published với giá trong hệ thống.";
        }

        int total = countPublishedProductsWithPrice();
        StringBuilder builder = new StringBuilder(
                "GIÁ SẢN PHẨM TỪ HỆ THỐNG (chỉ dùng giá ở đây, bỏ qua giá trong markdown):\n");
        builder.append("- Tổng số sản phẩm đang bán: ").append(total).append('\n');

        if (query.sort() == PriceSort.MOST_EXPENSIVE) {
            builder.append("- Top ")
                    .append(ranked.size())
                    .append(" sản phẩm giá cao nhất:\n");
            builder.append(
                    "Khi hỏi sản phẩm đắt nhất, chỉ liệt kê đúng tên và giá từ danh sách sau theo thứ tự giảm dần.\n");
        } else {
            builder.append("- Top ")
                    .append(ranked.size())
                    .append(" sản phẩm giá thấp nhất:\n");
            builder.append(
                    "Khi hỏi sản phẩm rẻ nhất, chỉ liệt kê đúng tên và giá từ danh sách sau theo thứ tự tăng dần.\n");
        }

        int index = 1;
        for (RecommendedProductResponse product : ranked) {
            builder.append("  ")
                    .append(index++)
                    .append(". ")
                    .append(product.name())
                    .append(" | ")
                    .append(product.salePrice())
                    .append(" VNĐ\n");
        }
        return builder.toString().trim();
    }

    @Transactional(readOnly = true)
    public List<RecommendedProductResponse> getProductsByPriceRank(PriceRankingQuery query) {
        return getProductsByPriceRank(query.sort(), query.limit());
    }

    @Transactional(readOnly = true)
    public List<RecommendedProductResponse> getProductsByPriceRank(PriceSort sort, int limit) {
        List<Product> published = productRepository.findByStatusOrderByDisplayOrderAsc(ContentStatus.PUBLISHED);
        if (published.isEmpty()) {
            return List.of();
        }

        List<UUID> productIds = published.stream().map(Product::getId).toList();
        Map<UUID, Product> productsById =
                published.stream().collect(Collectors.toMap(Product::getId, product -> product));
        Map<UUID, List<ProductSku>> skusByProduct = skuRepository.findByProductIdIn(productIds).stream()
                .filter(sku -> sku.getStatus() == SkuStatus.ACTIVE)
                .filter(sku -> sku.getSalePrice() != null)
                .collect(Collectors.groupingBy(sku -> sku.getProduct().getId()));
        Map<UUID, List<ProductImage>> imagesByProduct = imageRepository.findByProductIdIn(productIds).stream()
                .collect(Collectors.groupingBy(image -> image.getProduct().getId()));

        List<RankedSku> ranked = new ArrayList<>();
        for (Product product : published) {
            List<ProductSku> skus = skusByProduct.getOrDefault(product.getId(), List.of());
            ProductSku cheapestSku = selectSku(skus);
            if (cheapestSku == null) {
                continue;
            }
            ranked.add(new RankedSku(product, cheapestSku));
        }

        ranked.sort(sort == PriceSort.MOST_EXPENSIVE
                ? Comparator.comparing((RankedSku entry) -> entry.sku().getSalePrice()).reversed()
                : Comparator.comparing(rankedSku -> rankedSku.sku().getSalePrice()));

        String reason = sort == PriceSort.MOST_EXPENSIVE
                ? "Giá cao nhất trong danh mục"
                : "Giá thấp nhất trong danh mục";

        List<RecommendedProductResponse> results = new ArrayList<>();
        for (RankedSku entry : ranked.stream().limit(Math.max(1, limit)).toList()) {
            Product product = productsById.get(entry.product().getId());
            if (product == null) {
                continue;
            }
            String thumbnail = resolveThumbnail(
                    imagesByProduct.getOrDefault(product.getId(), List.of()), entry.sku());
            results.add(new RecommendedProductResponse(
                    product.getId(),
                    entry.sku().getId(),
                    product.getName(),
                    product.getSlug(),
                    entry.sku().getSkuName(),
                    entry.sku().getSalePrice().longValue(),
                    entry.sku().getStockStatus(),
                    thumbnail,
                    reason));
        }
        return results;
    }

    private boolean isFullPriceListWithoutLimit(String normalized) {
        return normalized.matches(
                        ".*(bang gia|gia cua.*san pham|cac san pham.*gia|liet ke.*gia|"
                                + "san pham.*bao nhieu tien|danh sach gia|xep.*theo gia).*")
                && !normalized.matches(".*\\d{1,2}\\s*(?:san pham|sp)\\b.*")
                && !normalized.matches(".*(?:cho toi|cho|top|lay|liet ke|ke|goi y)\\s*\\d{1,2}\\b.*");
    }

    private int countPublishedProductsWithPrice() {
        List<Product> published = productRepository.findByStatusOrderByDisplayOrderAsc(ContentStatus.PUBLISHED);
        if (published.isEmpty()) {
            return 0;
        }
        List<UUID> productIds = published.stream().map(Product::getId).toList();
        Map<UUID, List<ProductSku>> skusByProduct = skuRepository.findByProductIdIn(productIds).stream()
                .filter(sku -> sku.getStatus() == SkuStatus.ACTIVE)
                .filter(sku -> sku.getSalePrice() != null)
                .collect(Collectors.groupingBy(sku -> sku.getProduct().getId()));
        int count = 0;
        for (Product product : published) {
            if (selectSku(skusByProduct.getOrDefault(product.getId(), List.of())) != null) {
                count++;
            }
        }
        return count;
    }

    @Transactional(readOnly = true)
    public List<RecommendedProductResponse> searchForChatbot(String message) {
        if (!StringUtils.hasText(message) || detectIntent(message) != ProductChatIntent.PRODUCT_SEARCH) {
            return List.of();
        }

        String normalizedQuery = ProductQueryNormalizer.stripStopWords(
                ProductChatIntentDetector.normalize(message));
        if (!StringUtils.hasText(normalizedQuery)) {
            return List.of();
        }

        int limit = chatbotConfigService.getMaxProductsPerAnswer();
        List<Product> published = productRepository.findAll(publishedProducts());
        if (published.isEmpty()) {
            return List.of();
        }

        List<ScoredProduct> ranked = published.stream()
                .map(product -> new ScoredProduct(product, scoreProduct(normalizedQuery, message, product)))
                .filter(scored -> scored.score() >= MIN_RECOMMENDATION_SCORE)
                .sorted(Comparator.comparingDouble(ScoredProduct::score).reversed())
                .limit(limit)
                .toList();

        if (ranked.isEmpty()) {
            ranked = published.stream()
                    .map(product -> new ScoredProduct(product, symptomBenefitScore(normalizedQuery, product)))
                    .filter(scored -> scored.score() >= 0.25)
                    .sorted(Comparator.comparingDouble(ScoredProduct::score).reversed())
                    .limit(limit)
                    .toList();
        }

        return mapToResponses(ranked);
    }

    public String buildProductContext(List<RecommendedProductResponse> products) {
        if (products == null || products.isEmpty()) {
            return "";
        }
        StringBuilder builder = new StringBuilder(
                "SẢN PHẨM TỪ HỆ THỐNG (ưu tiên gợi ý các sản phẩm này; chỉ dùng giá/tồn kho từ đây):\n");
        for (RecommendedProductResponse product : products) {
            builder.append("- ")
                    .append(product.name())
                    .append(" | giá: ")
                    .append(product.salePrice() != null ? product.salePrice() : "liên hệ")
                    .append(" | tồn kho: ")
                    .append(product.stockStatus())
                    .append(" | slug: ")
                    .append(product.slug())
                    .append('\n');
        }
        return builder.toString().trim();
    }

    private List<RecommendedProductResponse> mapToResponses(List<ScoredProduct> ranked) {
        if (ranked.isEmpty()) {
            return List.of();
        }

        List<UUID> productIds = ranked.stream().map(scored -> scored.product().getId()).toList();
        Map<UUID, List<ProductSku>> skusByProduct = skuRepository.findByProductIdIn(productIds).stream()
                .filter(sku -> sku.getStatus() == SkuStatus.ACTIVE)
                .collect(Collectors.groupingBy(sku -> sku.getProduct().getId()));
        Map<UUID, List<ProductImage>> imagesByProduct = imageRepository.findByProductIdIn(productIds).stream()
                .collect(Collectors.groupingBy(image -> image.getProduct().getId()));

        List<RecommendedProductResponse> results = new ArrayList<>();
        for (ScoredProduct scored : ranked) {
            Product product = scored.product();
            List<ProductSku> skus = skusByProduct.getOrDefault(product.getId(), List.of());
            ProductSku selectedSku = selectSku(skus);
            String thumbnail = resolveThumbnail(imagesByProduct.getOrDefault(product.getId(), List.of()), selectedSku);
            Long salePrice = selectedSku != null && selectedSku.getSalePrice() != null
                    ? selectedSku.getSalePrice().longValue()
                    : null;
            StockStatus stockStatus = selectedSku != null ? selectedSku.getStockStatus() : StockStatus.OUT_OF_STOCK;

            results.add(new RecommendedProductResponse(
                    product.getId(),
                    selectedSku != null ? selectedSku.getId() : null,
                    product.getName(),
                    product.getSlug(),
                    null,
                    salePrice,
                    stockStatus,
                    thumbnail,
                    buildReason(scored.score())));
        }
        return results;
    }

    private Specification<Product> publishedProducts() {
        return (root, query, cb) -> cb.equal(root.get("status"), ContentStatus.PUBLISHED);
    }

    private double scoreProduct(String normalizedQuery, String rawMessage, Product product) {
        String searchable = String.join(
                " ",
                nullSafe(product.getName()),
                nullSafe(product.getShortDescription()),
                nullSafe(product.getBenefits()),
                nullSafe(product.getPrimaryKeyword()));
        String normalizedSearchable = ProductChatIntentDetector.normalize(searchable);
        return RetrievalScoring.keywordOverlapScore(normalizedQuery, normalizedSearchable)
                + RetrievalScoring.phraseOverlapScore(normalizedQuery, normalizedSearchable)
                + symptomBenefitScore(normalizedQuery, product)
                + neckSymptomBoost(normalizedQuery, product);
    }

    private double symptomBenefitScore(String normalizedQuery, Product product) {
        String benefits = ProductChatIntentDetector.normalize(nullSafe(product.getBenefits()));
        String description = ProductChatIntentDetector.normalize(
                nullSafe(product.getShortDescription()) + " " + nullSafe(product.getName()));
        if (!StringUtils.hasText(benefits) && !StringUtils.hasText(description)) {
            return 0;
        }

        double score = 0;
        for (String token : normalizedQuery.split("\\s+")) {
            if (token.length() < 2) {
                continue;
            }
            if (ProductTextMatcher.containsToken(benefits, token)
                    || ProductTextMatcher.containsToken(description, token)) {
                score += 0.35;
            }
        }

        if (ProductTextMatcher.containsToken(normalizedQuery, "co")
                && (ProductTextMatcher.containsPhrase(benefits, "co vai")
                        || ProductTextMatcher.containsToken(benefits, "co")
                        || ProductTextMatcher.containsToken(benefits, "vai")
                        || ProductTextMatcher.containsToken(benefits, "gay")
                        || ProductTextMatcher.containsPhrase(description, "co vai")
                        || ProductTextMatcher.containsToken(description, "vai"))) {
            score += 0.45;
        }
        return score;
    }

    private double neckSymptomBoost(String normalizedQuery, Product product) {
        boolean symptomQuery = normalizedQuery.contains("dau") || normalizedQuery.contains("moi");
        boolean neckRelated = ProductTextMatcher.containsToken(normalizedQuery, "co")
                || ProductTextMatcher.containsToken(normalizedQuery, "vai")
                || ProductTextMatcher.containsToken(normalizedQuery, "gay");
        if (!symptomQuery || !neckRelated) {
            return 0;
        }

        String text = ProductChatIntentDetector.normalize(String.join(
                " ",
                nullSafe(product.getName()),
                nullSafe(product.getShortDescription()),
                nullSafe(product.getBenefits())));
        double boost = 0;
        if (ProductTextMatcher.containsPhrase(text, "tui chuom")) {
            boost += 0.8;
        }
        if (ProductTextMatcher.containsPhrase(text, "goi cong thai hoc")
                || ProductTextMatcher.containsPhrase(text, "goi thao duoc")) {
            boost += 0.7;
        }
        if (ProductTextMatcher.containsPhrase(text, "ao choang chu u")) {
            boost += 0.55;
        }
        if (ProductTextMatcher.containsPhrase(text, "co vai")
                || ProductTextMatcher.containsToken(text, "vai")
                || ProductTextMatcher.containsPhrase(text, "co gay")) {
            boost += 0.25;
        }
        return boost;
    }

    private ProductSku selectSku(List<ProductSku> skus) {
        if (skus.isEmpty()) {
            return null;
        }
        return skus.stream()
                .filter(sku -> sku.getStockStatus() == StockStatus.IN_STOCK)
                .min(Comparator.comparing(ProductSku::getSalePrice, Comparator.nullsLast(Comparator.naturalOrder())))
                .orElse(skus.stream()
                        .min(Comparator.comparing(ProductSku::getSalePrice, Comparator.nullsLast(Comparator.naturalOrder())))
                        .orElse(skus.get(0)));
    }

    private String resolveThumbnail(List<ProductImage> images, ProductSku selectedSku) {
        return images.stream()
                .filter(ProductImage::isThumbnail)
                .findFirst()
                .map(ProductImage::getUrl)
                .orElseGet(() -> images.stream().findFirst().map(ProductImage::getUrl).orElse(null));
    }

    private String buildReason(double score) {
        if (score >= 0.8) {
            return "Phù hợp với nhu cầu bạn mô tả";
        }
        if (score >= 0.5) {
            return "Có thể hỗ trợ nhu cầu của bạn";
        }
        return "Sản phẩm NaHerbs đề xuất";
    }

    private String nullSafe(String value) {
        return value != null ? value : "";
    }

    private record ScoredProduct(Product product, double score) {}

    private record RankedSku(Product product, ProductSku sku) {}
}
