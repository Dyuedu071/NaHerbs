package vn.io.naherb.chatbot.rag;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import vn.io.naherb.common.entity.BaseEntity;

@Entity
@Table(name = "knowledge_chunks")
@Getter
@Setter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class KnowledgeChunk extends BaseEntity {

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "document_id", nullable = false)
    private KnowledgeDocument document;

    @Column(name = "chunk_index", nullable = false)
    private int chunkIndex;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String content;

    @Column(columnDefinition = "TEXT")
    private String embedding;

    public KnowledgeChunk(KnowledgeDocument document, int chunkIndex, String content, String embedding) {
        this.document = document;
        this.chunkIndex = chunkIndex;
        this.content = content;
        this.embedding = embedding;
    }
}
