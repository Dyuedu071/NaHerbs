package vn.io.naherb.chatbot.retrieval;

import static org.assertj.core.api.Assertions.assertThat;

import org.junit.jupiter.api.Test;

class ProductChatIntentDetectorTest {

    @Test
    void detectsCatalogOverviewQuestion() {
        assertThat(ProductChatIntentDetector.detect("Hiện tại web có bao nhiêu sản phẩm?"))
                .isEqualTo(ProductChatIntent.CATALOG_OVERVIEW);
    }

    @Test
    void detectsProductSearchQuestion() {
        assertThat(ProductChatIntentDetector.detect("Tôi mỏi cổ vai gáy, gợi ý gối thảo dược"))
                .isEqualTo(ProductChatIntent.PRODUCT_SEARCH);
    }

    @Test
    void detectsCheapestProductQuestion() {
        assertThat(ProductChatIntentDetector.detect("Sản phẩm nào rẻ nhất"))
                .isEqualTo(ProductChatIntent.PRICE_RANKING);
    }

    @Test
    void detectsMostExpensiveProductQuestion() {
        assertThat(ProductChatIntentDetector.detect("Cho tôi 3 sản phẩm đắt nhất"))
                .isEqualTo(ProductChatIntent.PRICE_RANKING);
    }

    @Test
    void parsesLimitForMostExpensiveQuestion() {
        assertThat(ProductChatIntentDetector.parsePriceRanking("Cho tôi 3 sản phẩm đắt nhất", 3))
                .contains(new PriceRankingQuery(PriceSort.MOST_EXPENSIVE, 3));
    }

    @Test
    void detectsNeckPainAsProductSearch() {
        assertThat(ProductChatIntentDetector.detect("Tôi đau cổ"))
                .isEqualTo(ProductChatIntent.PRODUCT_SEARCH);
    }

    @Test
    void ignoresGenericGreeting() {
        assertThat(ProductChatIntentDetector.detect("Xin chào NaHerbs"))
                .isEqualTo(ProductChatIntent.NONE);
    }
}
