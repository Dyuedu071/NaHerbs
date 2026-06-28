# Backlog – NaHerbs Website MVP

**Phiên bản:** v2.0 – Next.js Stack  
**Ngày cập nhật:** 2026-06-28  
**Backend:** `naherb-api` – Spring Boot  
**Frontend:** `naherb-web` – Next.js  
**Database:** Supabase PostgreSQL

---

## 1. Scope chốt

- Public SEO website bằng Next.js.
- Backend Spring Boot REST API.
- Supabase PostgreSQL schema `naherb`.
- Customer đăng nhập từ lúc thêm sản phẩm vào giỏ hàng.
- Cart, checkout, order.
- Payment COD và QR cố định, xác nhận thủ công bởi admin.
- Admin 1 role toàn quyền.
- Product → Version → SKU; tồn kho riêng theo SKU.
- Chatbot AI dùng dữ liệu product/blog trong DB qua backend.
- Không dùng Flyway auto migration.

---

## 2. Milestones

### M1 – Foundation & contract

| ID | Task | Repo | Priority | Acceptance criteria |
|---|---|---|---|---|
| M1-01 | Init `naherb-api` Spring Boot | api | P0 | App chạy local, `/api/v1/health` OK |
| M1-02 | Init `naherb-web` Next.js + TypeScript | web | P0 | App chạy local port 3000 |
| M1-03 | Setup OpenAPI contract workflow | docs/web/api | P0 | `openapi.yml` generate được TS client |
| M1-04 | Setup Supabase connection | api | P0 | Spring Boot connect được Supabase PostgreSQL SSL |
| M1-05 | Create versioned Supabase SQL scripts | database | P0 | Có `001_init_schema.sql`, chạy được trong Supabase SQL Editor |
| M1-06 | Configure response/error format | api | P0 | API trả format thống nhất |
| M1-07 | Configure Next.js env/API client | web | P0 | Server/client API calling pattern rõ |

### M2 – Auth & security

| ID | Task | Repo | Priority | Acceptance criteria |
|---|---|---|---|---|
| M2-01 | Customer register/login/logout | api | P0 | Token customer hoạt động |
| M2-02 | Admin login | api | P0 | Token admin hoạt động |
| M2-03 | Spring Security route protection | api | P0 | Public/customer/admin tách quyền đúng |
| M2-04 | Login/register UI | web | P0 | User đăng nhập/đăng ký được |
| M2-05 | Auth guard for cart/checkout | web | P0 | Guest add cart bị yêu cầu login |
| M2-06 | noindex for auth/account/admin pages | web | P1 | Metadata robots noindex đúng |

### M3 – Product catalog & SEO

| ID | Task | Repo | Priority | Acceptance criteria |
|---|---|---|---|---|
| M3-01 | Product/category/version/SKU entities | api | P0 | JPA validate với DB schema |
| M3-02 | Public product list API | api | P0 | Filter/search/page hoạt động |
| M3-03 | Public product detail API | api | P0 | Trả product + versions + SKUs + images |
| M3-04 | Admin product CRUD APIs | api | P0 | CRUD product/version/SKU |
| M3-05 | Product listing page Next.js | web | P0 | `/san-pham` responsive, fetch API |
| M3-06 | Product detail page Next.js | web | P0 | SKU selector, price/stock update |
| M3-07 | Dynamic metadata for product | web | P0 | Title/description/OG/Product JSON-LD đúng |
| M3-08 | Seed/import initial products | database/api | P0 | Tối thiểu 10 product khởi tạo |

### M4 – Cart & checkout

| ID | Task | Repo | Priority | Acceptance criteria |
|---|---|---|---|---|
| M4-01 | Cart entities/APIs | api | P0 | Add/view/update/remove cart item |
| M4-02 | Inventory validation service | api | P0 | Không add/checkout quá stock |
| M4-03 | Cart page UI | web | P0 | Xem/update/remove item |
| M4-04 | Checkout API | api | P0 | Tạo order từ cart transactionally |
| M4-05 | Checkout page UI | web | P0 | Nhập thông tin nhận hàng, chọn COD/QR |
| M4-06 | Order success page | web | P0 | Hiển thị order code, payment instruction |
| M4-07 | My orders API/UI | api/web | P1 | Customer xem đơn của mình |

### M5 – Payment COD/QR manual confirmation

| ID | Task | Repo | Priority | Acceptance criteria |
|---|---|---|---|---|
| M5-01 | Payment status model | api/database | P0 | Order có payment method/status |
| M5-02 | QR instruction API | api | P0 | Trả QR URL, bank info, transfer content |
| M5-03 | QR payment UI | web | P0 | QR cố định + nội dung chuyển khoản rõ |
| M5-04 | Admin order list/detail APIs | api | P0 | Lọc order/payment status |
| M5-05 | Admin order management UI | web | P0 | Xem đơn, update status |
| M5-06 | Manual confirm payment API | api | P0 | Admin xác nhận PAID + payment event |
| M5-07 | Manual confirm payment UI | web | P0 | Có note, confirm dialog, audit visible |

### M6 – Blog & SEO content

| ID | Task | Repo | Priority | Acceptance criteria |
|---|---|---|---|---|
| M6-01 | Blog entities/APIs | api | P1 | List/detail published blog |
| M6-02 | Admin blog CRUD APIs | api | P1 | Create/edit/publish blog |
| M6-03 | Blog list/detail Next.js pages | web | P1 | SEO metadata + Article JSON-LD |
| M6-04 | Related products in blog | api/web | P1 | Blog detail có CTA sản phẩm |
| M6-05 | Seed initial blogs | database/api | P1 | Tối thiểu 5 bài blog |

### M7 – Chatbot AI

| ID | Task | Repo | Priority | Acceptance criteria |
|---|---|---|---|---|
| M7-01 | Chatbot config APIs | api | P0 | Bật/tắt, welcome, disclaimer, suggestions |
| M7-02 | Chatbot conversation/message tables | database/api | P0 | Lưu được hội thoại |
| M7-03 | Knowledge retrieval service | api | P0 | Tìm product/blog published từ câu hỏi |
| M7-04 | AI provider adapter | api | P0 | Gọi provider qua backend env key |
| M7-05 | Guardrail service | api | P0 | Chặn claim y tế/bịa sản phẩm |
| M7-06 | Chatbot widget UI | web | P0 | Floating widget responsive |
| M7-07 | Product cards in answer | web/api | P0 | Cards lấy từ backend, không từ AI tự bịa |
| M7-08 | Admin chatbot UI | web | P1 | Config + xem lịch sử |

### M8 – Site settings, media & UI polish

| ID | Task | Repo | Priority | Acceptance criteria |
|---|---|---|---|---|
| M8-01 | Site settings APIs | api | P1 | Hotline/Zalo/QR/bank info configurable |
| M8-02 | Media upload API | api | P1 | Upload image validated |
| M8-03 | Admin settings UI | web | P1 | Cập nhật settings |
| M8-04 | Header/footer responsive | web | P0 | Mobile/desktop tốt |
| M8-05 | UI/UX tokens applied | web | P1 | Theo `UI-UX design.md` |

### M9 – QA & deployment

| ID | Task | Repo | Priority | Acceptance criteria |
|---|---|---|---|---|
| M9-01 | Backend unit/integration tests | api | P1 | Product/cart/order/payment tests |
| M9-02 | Frontend smoke/e2e tests | web | P1 | Product → cart → checkout OK |
| M9-03 | SEO checklist | web | P0 | Sitemap/robots/metadata/JSON-LD OK |
| M9-04 | Security checklist | api/web | P0 | Auth, rate-limit, no secret leak |
| M9-05 | Production env docs | docs | P0 | Env vars documented |
| M9-06 | Deploy `naherb-api` | api | P0 | Health OK production |
| M9-07 | Deploy `naherb-web` | web | P0 | Public site OK production |

---

## 3. Definition of Done

Một task được xem là Done khi:

- Code chạy local.
- API khớp `openapi.yml` nếu có endpoint.
- Có validation/error handling.
- Có test hoặc checklist QA tối thiểu.
- Không hardcode secret.
- Không phá responsive UI.
- Với public page: có metadata SEO phù hợp.
- Với DB: schema thay đổi có SQL script versioned.

---

## 4. Critical path đề xuất

```text
M1 Foundation
→ M2 Auth
→ M3 Product/SKU
→ M4 Cart/Checkout
→ M5 QR/COD Orders
→ M6 Blog SEO
→ M7 Chatbot
→ M8 Polish
→ M9 Launch
```

Nếu cần ra MVP nhanh hơn:

```text
Sprint 1: Foundation + Auth + Product public
Sprint 2: Admin Product + Cart/Checkout + COD/QR
Sprint 3: Blog + SEO + Chatbot
Sprint 4: QA + Deploy
```
