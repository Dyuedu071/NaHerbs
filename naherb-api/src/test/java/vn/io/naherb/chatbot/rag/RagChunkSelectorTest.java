package vn.io.naherb.chatbot.rag;

import static org.assertj.core.api.Assertions.assertThat;

import java.util.ArrayList;
import java.util.List;
import org.junit.jupiter.api.Test;

class RagChunkSelectorTest {

    @Test
    void selectPerDocumentEnsuresCoverageAcrossDocuments() {
        List<RagRetrievalService.RetrievedChunk> ranked = new ArrayList<>();
        for (int index = 0; index < 10; index++) {
            ranked.add(new RagRetrievalService.RetrievedChunk(
                    "blog chunk " + index, "Blog doc", 1.0 - (index * 0.05), 0.9, 0.8));
        }
        ranked.add(new RagRetrievalService.RetrievedChunk(
                "gối công thái học có 2 phiên bản", "Product doc", 0.55, 0.5, 0.9));

        List<RagRetrievalService.RetrievedChunk> selected =
                RagChunkSelector.selectPerDocument(ranked, 3, 8);

        assertThat(selected).anyMatch(chunk -> chunk.documentTitle().equals("Product doc"));
        assertThat(selected.stream().map(RagRetrievalService.RetrievedChunk::documentTitle).distinct())
                .hasSize(2);
    }

    @Test
    void skipsSeoKeywordSection() {
        String seoSection =
                """
                # Mục blog

                # Từ khóa làm SEO

                | gối thảo dược |
                | tinh dầu thiên nhiên |
                """;

        assertThat(RagChunkSelector.shouldSkipKnowledgeSection(seoSection)).isTrue();
    }
}
