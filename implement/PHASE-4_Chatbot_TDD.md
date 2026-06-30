# TEST-DRIVEN DEVELOPMENT SPECIFICATION
# NaHerbs — Phase 4 (Chatbot + RAG)

**Document ID:** `NAHERB-CHATBOT-TDD-004`
**Version:** `1.0`
**Date:** `2026-06-30`
**Spec gốc:** `NAHERB-CHATBOT-IMP-004`
**Depends on:** `NAHERB-FOUNDATION-TDD-001`

---

## CHANGELOG

| Ngày | Người | Nội dung |
|------|-------|----------|
| 2026-06-30 | Tuấn Anh | Khởi tạo TDD Phase 4 |

---

## 1. Logic Issues Resolved

| # | Spec / giả định | Thực tế | Fix |
|---|-----------------|---------|-----|
| L1 | pgvector chưa có trên H2 | Test dùng H2 in-memory | Embedding JSON + cosine Java |
| L2 | OpenAI cần API key | CI/test không gọi thật | `MockOpenAiTestConfig` `@Primary` |
| L3 | Ingest file lớn lúc test | Chậm / flaky | Test dùng `src/test/resources/chatbot-knowledge/sample.md` |

---

## 2. Test Conditions

| ID | Condition | Test Cases |
|----|-----------|------------|
| TC-COND-030 | GET public config không auth | `CHAT-TC-001` |
| TC-COND-031 | POST conversation không auth | `CHAT-TC-002` |
| TC-COND-032 | POST message + RAG mock | `CHAT-TC-003` |
| TC-COND-033 | Admin config cần ROLE_ADMIN | `CHAT-TC-004` |
| TC-COND-034 | User thường không vào admin config | `CHAT-TC-005` |

---

## 3. Test Cases

### CHAT-TC-001 — Public config

**File:** `ChatbotIntegrationTests.java`
**Status:** 🟢 GREEN

### CHAT-TC-002 — Create conversation

**Steps:** POST `/api/chatbot/conversations` → 201, có `id`, `sessionId`
**Status:** 🟢 GREEN

### CHAT-TC-003 — Send message with RAG

**Steps:** ingest sample knowledge → POST message → 200, có `answer`, `disclaimer`
**Status:** 🟢 GREEN

### CHAT-TC-004 — Admin get/update config

**Steps:** login admin → GET/PUT `/api/admin/chatbot/config`
**Status:** 🟢 GREEN

### CHAT-TC-005 — User denied admin

**Steps:** login user → GET admin config → 403
**Status:** 🟢 GREEN

---

## 4. Red-Green Tracker

| TC ID | 🔴 RED | 🟢 GREEN |
|-------|--------|----------|
| `CHAT-TC-001` | [x] | [x] |
| `CHAT-TC-002` | [x] | [x] |
| `CHAT-TC-003` | [x] | [x] |
| `CHAT-TC-004` | [x] | [x] |
| `CHAT-TC-005` | [x] | [x] |

---

## 5. Exit Criteria

- [x] `mvn test` — 20 tests pass
- [x] 5 endpoint chatbot checklist ticked
- [ ] Tech Lead review

---

*TDD Spec v1.0 — NaHerbs Phase 4 — Tuấn Anh*
