# ENGINEERING DOCUMENTATION STANDARD (EDS) v2.0
# NaHerbs — Phase 4 (Chatbot + RAG)

| Field | Value |
|-------|-------|
| **Document ID** | `NAHERB-CHATBOT-IMP-004` |
| **Version** | `1.0` |
| **Date** | `2026-06-30` |
| **Status** | `In Review` |
| **Document Owner** | Tuấn Anh |
| **Author** | Tuấn Anh — Backend Developer |
| **Depends on** | `NAHERB-FOUNDATION-IMP-001` |

---

## CHANGELOG

| Ngày | Người thực hiện | Nội dung thay đổi |
|------|-----------------|-------------------|
| 2026-06-30 | Tuấn Anh | Tạo tài liệu Phase 4 — Chatbot RAG + OpenAI |

---

## 1. Tổng quan Module

| Field | Value |
|-------|-------|
| **Module Name** | `Chatbot AI (RAG-first MVP)` |
| **Bounded Context** | `Chatbot` |
| **Data Classification** | `Public config`, `Conversation logs`, `Knowledge base` |
| **Downstream Consumers** | Next.js `ChatbotWidget` (M7-06), Admin chatbot UI (M7-08) |

**Mục tiêu Phase 4:** Triển khai 5 endpoint chatbot, ingest tài liệu từ `content/chatbot-knowledge/`, RAG qua OpenAI embeddings + chat completions. `recommendedProducts` để trống trong phase này (structured DB retrieval ở phase sau).

---

## 2. Ma trận Truy vết

| Requirement ID | Mô tả | Thành phần Code | ADR |
|----------------|-------|-----------------|-----|
| FR-AI-01 | Public config | `ChatbotController.getPublicConfig` | — |
| FR-AI-02 | RAG answer | `ChatbotService` → `RagRetrievalService` → `OpenAiClient` | ADR-010 |
| FR-AI-03 | Conversation logging | `ChatbotConversation`, `ChatbotMessage` | — |
| CHECKLIST | Admin config | `AdminChatbotController` | — |
| BR-10 | Guardrail y tế | `GuardrailService` | — |
| SDD §7.4 | AI chỉ từ backend | `OpenAiApiClient` | ADR-003 |

---

## 3. Architecture Decision Records

### ADR-010 — RAG MVP: embedding JSON + cosine trong Java

- Chunk + embedding lưu bảng `knowledge_chunks` (cột `embedding` TEXT JSON).
- Retrieval: cosine similarity trong application (phù hợp quy mô MVP & H2 test).
- **Sau:** có thể chuyển sang pgvector trên Supabase khi dữ liệu lớn.

### ADR-011 — Nguồn knowledge seed

- File Markdown trong `content/chatbot-knowledge/` (repo root).
- Ingest khi startup (`app.chatbot.ingest-on-startup=true`) nếu file đổi (so `content_hash`).
- **Không** embed giá/kho từ sheet — chỉ mô tả sản phẩm.

### ADR-012 — Product cards phase sau

- `recommendedProducts` trả `[]` trong Phase 4.
- AI chỉ trả lời dựa context RAG; guardrail chặn claim y tế.

---

## 4. API Specification

| Method | Path | Auth | CSRF | Status |
|--------|------|------|------|--------|
| `GET` | `/api/chatbot/config/public` | Public | — | 200 |
| `POST` | `/api/chatbot/conversations` | Public | — | 201 |
| `POST` | `/api/chatbot/messages` | Public | — | 200 |
| `GET` | `/api/admin/chatbot/config` | ADMIN | — | 200 |
| `PUT` | `/api/admin/chatbot/config` | ADMIN | ✅ | 200 |

---

## 5. Static Modeling

```
vn.io.naherb.chatbot/
├── ChatbotController
├── AdminChatbotController
├── ChatbotService
├── ChatbotConfigService
├── repository/
├── dto/
├── rag/
│   ├── KnowledgeDocument, KnowledgeChunk
│   ├── KnowledgeIngestService
│   ├── RagRetrievalService
│   ├── TextChunkingService
│   └── KnowledgeIngestRunner
├── ai/
│   ├── OpenAiClient (interface)
│   └── OpenAiApiClient
└── guardrail/
    └── GuardrailService
```

---

## 6. Environment

```text
AI_PROVIDER=openai
AI_API_KEY=sk-...
AI_MODEL=gpt-4o-mini
AI_EMBEDDING_MODEL=text-embedding-3-small
CHATBOT_KNOWLEDGE_PATH=../content/chatbot-knowledge
CHATBOT_INGEST_ON_STARTUP=true
RAG_TOP_K=5
```

---

## 7. Bảng mã lỗi

| Code | HTTP | Message (VI) |
|------|------|--------------|
| `CHAT-001` | 400 | Chatbot đang tắt |
| `CHAT-002` | 404 | Không tìm thấy hội thoại |
| `CHAT-003` | 503 | AI provider không khả dụng |

---

## 8. Authorization Matrix

| Endpoint | GUEST | USER | ADMIN |
|----------|-------|------|-------|
| `/api/chatbot/**` | ✅ | ✅ | ✅ |
| `/api/admin/chatbot/**` | ❌ | ❌ | ✅ |

---

*EDS v1.0 — NaHerbs Phase 4 — Tuấn Anh*
