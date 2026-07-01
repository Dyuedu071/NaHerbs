package vn.io.naherb.chatbot.rag;

import java.util.List;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface KnowledgeChunkRepository extends JpaRepository<KnowledgeChunk, UUID> {

    @Query("""
            select c from KnowledgeChunk c
            join fetch c.document d
            where d.status = vn.io.naherb.chatbot.rag.KnowledgeDocumentStatus.PUBLISHED
              and c.embedding is not null
              and length(trim(c.embedding)) > 0
            """)
    List<KnowledgeChunk> findAllPublished();

    @Query("""
            select count(c) from KnowledgeChunk c
            where c.document.id = :documentId
            """)
    long countByDocumentId(@Param("documentId") UUID documentId);

    @Query("""
            select count(c) from KnowledgeChunk c
            where c.document.id = :documentId
              and c.embedding is not null
              and length(trim(c.embedding)) > 0
            """)
    long countEmbeddedChunksByDocumentId(@Param("documentId") UUID documentId);

    @Query("""
            select count(c) from KnowledgeChunk c
            where c.embedding is not null
              and length(trim(c.embedding)) > 0
            """)
    long countWithEmbeddings();

    @Modifying
    @Query("delete from KnowledgeChunk c where c.document.id = :documentId")
    void deleteByDocumentId(@Param("documentId") UUID documentId);

    @Query("""
            select coalesce(max(c.chunkIndex), -1) from KnowledgeChunk c
            where c.document.id = :documentId
            """)
    int maxChunkIndexByDocumentId(@Param("documentId") UUID documentId);
}
