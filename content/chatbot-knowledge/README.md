# Chatbot knowledge base (RAG seed)

Thư mục này chứa tài liệu Markdown dùng làm nguồn RAG cho chatbot NaHerbs.

## Quy tắc

- Chỉ đưa **mô tả sản phẩm, hướng dẫn dùng, FAQ, disclaimer** — không embed giá/tồn kho cố định.
- Giá và tồn kho lấy từ **database** khi có module product (phase sau).
- File `.md` UTF-8; tách section bằng heading `#`.

## Ingest

Backend (`naherb-api`) tự ingest khi startup nếu `CHATBOT_INGEST_ON_STARTUP=true`.

Env:

```text
CHATBOT_KNOWLEDGE_PATH=../content/chatbot-knowledge
AI_API_KEY=sk-...
```

Sau khi sửa file, restart API hoặc đổi nội dung (hash đổi) để re-index.

Nếu chatbot không trả lời đúng nội dung file mới, kiểm tra log startup:
`Tìm thấy X file markdown` và `Đã ingest Y chunks từ .../tên-file.md`.
Có thể xóa dữ liệu RAG cũ trong Supabase rồi restart API:

```sql
DELETE FROM naherb.knowledge_chunks;
DELETE FROM naherb.knowledge_documents;
```

## Tài liệu hiện có

| File | Mô tả |
|------|--------|
| `Mô tả sản phẩm chi tiết NaHerbs.md` | Mô tả chi tiết các sản phẩm NaHerbs |
| `Mô tả chung về Naherbs và các bài blog.md` | Giới thiệu thương hiệu, 4R, blog SEO |
