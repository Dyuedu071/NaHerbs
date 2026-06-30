package vn.io.naherb.chatbot.rag;

import static org.assertj.core.api.Assertions.assertThat;

import org.junit.jupiter.api.Test;

class RetrievalScoringTest {

    @Test
    void keywordOverlapBoostsMatchingVietnameseTerms() {
        String query = "giá trị cốt lõi của NaHerbs và mô hình 4R";
        String content =
                """
                * Giá trị cốt lõi
                Giá trị cốt lõi của NaHerbs được xây dựng dựa trên mô hình 4R:
                Responsibility, Respectability, Renovation, Reliability.
                """;

        double keyword = RetrievalScoring.keywordOverlapScore(query, content);
        assertThat(keyword).isGreaterThan(0.4);
    }

    @Test
    void phraseOverlapBoostsProductQuery() {
        String query = "gối công thái học có mấy phiên bản";
        String content =
                """
                ### Phiên bản 1: Gối công thái học thảo dược có nhiệt
                ### Phiên bản 2: Gối công thái học thảo dược không nhiệt
                Sản phẩm có hai phiên bản gồm có nhiệt và không nhiệt.
                """;

        double phrase = RetrievalScoring.phraseOverlapScore(query, content);
        assertThat(phrase).isGreaterThan(0.2);
    }

    @Test
    void combinedScoreBlendsCosineAndKeyword() {
        double combined = RetrievalScoring.combinedScore(0.5, 1.0);
        assertThat(combined).isGreaterThan(0.5);
        assertThat(combined).isLessThan(1.0);
    }
}
