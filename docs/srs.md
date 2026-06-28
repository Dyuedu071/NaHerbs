# SRS – NaHerbs Website MVP

**Dự án:** NaHerbs Website  
**Tài liệu:** Software Requirements Specification (SRS)  
**Phiên bản:** v2.0 – Next.js Stack  
**Ngày cập nhật:** 2026-06-28  
**Backend:** `naherb-api` – Spring Boot REST API  
**Frontend:** `naherb-web` – Next.js  
**Database:** Supabase PostgreSQL

---

## 1. Giới thiệu

### 1.1 Mục đích

Tài liệu SRS mô tả yêu cầu phần mềm cho NaHerbs Website MVP với stack mới: Spring Boot backend, Next.js frontend và Supabase PostgreSQL. Tài liệu dùng cho thiết kế, phát triển, kiểm thử, nghiệm thu và đồng bộ giữa frontend/backend.

### 1.2 Phạm vi hệ thống

Hệ thống gồm:

1. Website public Next.js: home, product, category, blog, about, contact, chatbot.
2. Customer e-commerce: đăng ký/đăng nhập, cart, checkout, COD, QR chuyển khoản, my orders.
3. Admin CMS: quản lý sản phẩm/SKU/blog/order/payment/chatbot/site settings.
4. Backend Spring Boot: REST API, business logic, auth, data access, AI orchestration.
5. Database Supabase PostgreSQL: schema dùng chung cho toàn hệ thống.

### 1.3 Định nghĩa

| Thuật ngữ | Định nghĩa |
|---|---|
| Next.js | Frontend framework dùng React, hỗ trợ server rendering và metadata SEO |
| Product | Sản phẩm cha, ví dụ “Gối Công Thái Học Thảo Dược” |
| ProductVersion | Phiên bản của sản phẩm, ví dụ “Có Nhiệt”, “Không Nhiệt” |
| ProductSku | Biến thể bán được, lưu giá/kho riêng; thường là version + màu/mùi/loại |
| COD | Thanh toán khi nhận hàng |
| QR fixed | Mã QR chuyển khoản cố định của tài khoản ngân hàng chủ website |
| Manual payment confirmation | Admin tự xác nhận thanh toán sau khi kiểm tra tài khoản ngân hàng |
| CMS | Trang quản trị nội dung và vận hành |
| RAG/Retrieval | Cơ chế lấy dữ liệu sản phẩm/blog từ DB để chatbot trả lời có căn cứ |

---

## 2. Mô tả tổng quan

### 2.1 User classes

| Actor | Mô tả | Quyền chính |
|---|---|---|
| Guest | Người chưa đăng nhập | Xem public pages, hỏi chatbot, đọc blog |
| Customer | Khách hàng đã đăng nhập | Cart, checkout, order history |
| Admin | 1 role admin toàn quyền | Quản lý CMS, order, payment, chatbot |
| AI Provider | Dịch vụ AI bên ngoài | Sinh câu trả lời theo context backend cung cấp |

### 2.2 Operating environment

- Frontend: Next.js chạy Node runtime hoặc deployment tương thích Next.js.
- Backend: Spring Boot chạy trên JVM.
- Database: Supabase PostgreSQL, schema `naherb`.
- Production: HTTPS.
- API base path: `/api/v1`.

### 2.3 Design constraints

- Next.js không truy cập database trực tiếp.
- Database schema không được tự động tạo/sửa bởi Hibernate trên production.
- Spring Boot `ddl-auto` dùng `validate` hoặc `none`.
- SQL schema Supabase được quản lý bằng script versioned thủ công.
- Admin MVP chỉ có 1 role.
- Customer bắt buộc đăng nhập từ lúc thêm hàng vào cart.
- QR payment không tự đối soát ngân hàng.

---

## 3. External interface requirements

### 3.1 Website UI

- Public pages phải responsive desktop/tablet/mobile.
- Header hiển thị logo, menu, search, cart icon, login/account.
- Footer hiển thị thông tin liên hệ, disclaimer, link chính sách.
- Chatbot widget hiển thị ở public pages.
- Các trang cart/checkout/account/admin phải noindex.

### 3.2 API interface

- REST/JSON.
- Response format chuẩn:

```json
{
  "success": true,
  "message": "OK",
  "data": {},
  "errors": []
}
```

- Auth dùng `Authorization: Bearer <token>` cho customer/admin APIs.

### 3.3 Database interface

- Spring Boot truy cập Supabase PostgreSQL qua JDBC/JPA.
- Dùng schema `naherb`.
- Dữ liệu quan trọng có `created_at`, `updated_at`.
- Xóa mềm cho dữ liệu vận hành quan trọng.

---

## 4. Functional requirements

### 4.1 Public website & SEO

#### FR-WEB-01. Home page

Hệ thống phải hiển thị trang chủ giới thiệu thương hiệu, hero, danh mục sản phẩm, sản phẩm nổi bật, lợi ích, blog nổi bật, chatbot và CTA.

Acceptance criteria:

- Trang chủ có metadata SEO.
- Render tốt trên mobile.
- CTA dẫn đến sản phẩm/cart/contact/chatbot.

#### FR-WEB-02. Product listing

Hệ thống phải hiển thị danh sách sản phẩm published, có filter theo category/need, search, sort và pagination.

Acceptance criteria:

- Chỉ product published xuất hiện.
- Giá hiển thị từ SKU active.
- Có link detail theo slug.

#### FR-WEB-03. Product detail

Hệ thống phải hiển thị chi tiết sản phẩm, version, SKU, giá, tồn kho, ảnh, mô tả, hướng dẫn dùng, disclaimer, sản phẩm liên quan và CTA.

Acceptance criteria:

- Chọn version/màu/mùi cập nhật SKU, giá, stock.
- Không cho add cart nếu SKU hết hàng hoặc chưa chọn SKU bắt buộc.
- Có Product JSON-LD và metadata.

#### FR-WEB-04. Blog listing/detail

Hệ thống phải hiển thị blog list/detail có SEO metadata, nội dung, ảnh, sản phẩm liên quan và disclaimer nếu nội dung sức khỏe.

#### FR-WEB-05. Sitemap/robots

Next.js phải sinh sitemap và robots.

- Public pages được index.
- Cart/checkout/account/admin/login/register được noindex.

### 4.2 Customer auth

#### FR-AUTH-01. Register

Khách có thể tạo tài khoản bằng họ tên, email/số điện thoại và mật khẩu.

#### FR-AUTH-02. Login/logout

Customer đăng nhập để thêm cart, checkout và xem đơn.

#### FR-AUTH-03. Auth requirement for cart

Khi guest bấm thêm vào giỏ hàng, hệ thống phải yêu cầu đăng nhập/đăng ký trước hoặc sau đó tiếp tục add item.

### 4.3 Cart

#### FR-CART-01. Add item

Customer đã đăng nhập có thể thêm SKU vào cart.

Acceptance criteria:

- SKU phải active, product published, stock > 0.
- Quantity > 0.
- Nếu item đã tồn tại trong cart, cộng quantity nhưng không vượt tồn kho.

#### FR-CART-02. View/update/remove cart

Customer có thể xem cart, cập nhật số lượng, xóa item.

#### FR-CART-03. Cart price calculation

Cart tính subtotal theo sale price hiện tại của SKU. Giá cuối cùng được snapshot khi tạo order.

### 4.4 Checkout & order

#### FR-ORD-01. Checkout

Customer tạo đơn từ cart với thông tin người nhận, địa chỉ, phone, note và payment method.

Acceptance criteria:

- Re-check stock khi checkout.
- Snapshot product name, SKU name, price tại thời điểm đặt hàng.
- Tạo `order_code` duy nhất.
- Trừ tồn kho theo chính sách MVP khi order được tạo.

#### FR-ORD-02. COD order

Nếu chọn COD:

- `payment_method = COD`.
- `payment_status = UNPAID` hoặc `COD_PENDING`.
- `order_status = PENDING_CONFIRMATION`.

#### FR-ORD-03. QR order

Nếu chọn QR:

- Hiển thị QR cố định.
- Hiển thị nội dung chuyển khoản gồm order code.
- `payment_status = WAITING_BANK_TRANSFER`.
- Admin xác nhận thủ công sau khi kiểm tra ngân hàng.

#### FR-ORD-04. My orders

Customer có thể xem danh sách và chi tiết đơn của chính mình.

### 4.5 Admin/CMS

#### FR-ADM-01. Admin login

Admin đăng nhập bằng email/password, nhận token admin.

#### FR-ADM-02. Product CMS

Admin CRUD product, category, version, SKU, media, SEO metadata và publish status.

#### FR-ADM-03. SKU inventory

Admin quản lý tồn kho riêng theo SKU.

#### FR-ADM-04. Blog CMS

Admin CRUD blog post, category, SEO metadata, publish status, related products.

#### FR-ADM-05. Order management

Admin xem danh sách/chi tiết đơn, đổi trạng thái đơn hàng và ghi chú nội bộ.

#### FR-ADM-06. Manual QR payment confirmation

Admin xác nhận `payment_status = PAID` cho đơn QR sau khi kiểm tra tài khoản ngân hàng.

Acceptance criteria:

- Phải lưu `confirmed_by`, `confirmed_at`, `admin_note`.
- Không cho customer tự xác nhận đã thanh toán.

#### FR-ADM-07. Site settings

Admin cập nhật hotline, Zalo, Facebook, email, địa chỉ, thông tin ngân hàng và QR image.

### 4.6 AI Chatbot

#### FR-AI-01. Chatbot widget

Next.js hiển thị chatbot widget trên public pages nếu backend config bật.

#### FR-AI-02. Chatbot answer

Backend nhận message, truy xuất product/blog published từ DB, gọi AI provider, validate guardrail, trả answer + product cards.

Acceptance criteria:

- Không gợi ý product hidden/draft.
- Không bịa giá/tồn kho/SKU.
- Mỗi câu trả lời tư vấn có disclaimer sức khỏe khi phù hợp.
- Có CTA mở product detail hoặc tạo lead/contact.

#### FR-AI-03. Conversation logging

Hệ thống lưu conversation/message ở mức cần thiết để admin xem và cải thiện tư vấn.

---

## 5. Data requirements

### 5.1 Core entities

- `admin_users`
- `customers`
- `product_categories`
- `products`
- `product_versions`
- `product_skus`
- `product_images`
- `carts`
- `cart_items`
- `orders`
- `order_items`
- `payment_events`
- `blog_categories`
- `blog_posts`
- `leads`
- `chatbot_configs`
- `chatbot_conversations`
- `chatbot_messages`
- `site_settings`

### 5.2 Important enums

```text
ProductStatus: DRAFT, PUBLISHED, HIDDEN, ARCHIVED
SkuStatus: ACTIVE, HIDDEN, OUT_OF_STOCK
OrderStatus: PENDING_CONFIRMATION, CONFIRMED, PACKING, SHIPPING, COMPLETED, CANCELLED
PaymentMethod: COD, BANK_QR
PaymentStatus: UNPAID, COD_PENDING, WAITING_BANK_TRANSFER, PAID, FAILED, REFUNDED
LeadStatus: NEW, CONTACTED, PROCESSING, DONE, IGNORED
ChatRole: USER, ASSISTANT, SYSTEM
```

---

## 6. Business rules

| ID | Rule |
|---|---|
| BR-01 | Guest được xem public content nhưng không được thêm cart nếu chưa đăng nhập. |
| BR-02 | Product chỉ hiển thị public khi `PUBLISHED`. |
| BR-03 | SKU là đơn vị bán hàng và đơn vị tồn kho. |
| BR-04 | Không checkout SKU hidden/out-of-stock. |
| BR-05 | Giá trong order item phải snapshot tại thời điểm tạo order. |
| BR-06 | QR là mã cố định, hệ thống không tự xác nhận tiền về. |
| BR-07 | Chỉ admin được xác nhận payment QR là paid. |
| BR-08 | COD không yêu cầu paid trước khi xác nhận đơn. |
| BR-09 | Chatbot chỉ dùng product/blog published. |
| BR-10 | Chatbot không được đưa claim chữa bệnh/chẩn đoán/kê đơn. |
| BR-11 | Admin MVP chỉ có 1 role. |
| BR-12 | Schema Supabase không được tự động thay đổi bởi Hibernate production. |
| BR-13 | Next.js public SEO pages phải render metadata theo dữ liệu API. |
| BR-14 | Các route auth/cart/checkout/account/admin phải noindex. |

---

## 7. Non-functional requirements

### 7.1 SEO

- Product/blog detail phải có server-rendered content/metadata.
- Có sitemap/robots.
- Có canonical URL.
- Có Product/Article/Breadcrumb JSON-LD.

### 7.2 Performance

- Public pages tối ưu image/lazy load.
- Product/blog list có pagination.
- Chatbot hiển thị loading state.

### 7.3 Security

- Mật khẩu hash bằng BCrypt/Argon2 tương đương.
- Admin/customer APIs yêu cầu token.
- Customer chỉ xem order của mình.
- Admin APIs không expose cho public.
- Rate limit cho login, lead, chatbot, checkout.
- Không log token/password.

### 7.4 Reliability

- Checkout phải transactionally kiểm tra stock, tạo order, tạo order items, cập nhật cart.
- AI provider lỗi thì chatbot trả fallback.
- Manual payment confirmation phải có audit trail.

### 7.5 Maintainability

- OpenAPI là contract chung FE/BE.
- Backend module theo domain.
- Frontend Next.js tổ chức theo app routes và feature components.
- Supabase SQL scripts versioned.

---

## 8. Use cases

### UC-01. Guest xem product detail từ Google

1. User mở `/san-pham/[slug]`.
2. Next.js gọi API lấy product.
3. Trang render content, metadata, JSON-LD.
4. User chọn SKU và bấm thêm giỏ.
5. Nếu chưa login, hệ thống chuyển sang login/register.

### UC-02. Customer checkout QR

1. Customer đăng nhập.
2. Thêm SKU vào cart.
3. Mở checkout.
4. Chọn BANK_QR.
5. Hệ thống tạo order và hiển thị QR + order code.
6. Customer chuyển khoản thủ công.
7. Admin kiểm tra ngân hàng và xác nhận paid.

### UC-03. Admin xác nhận thanh toán QR

1. Admin mở danh sách order QR chờ chuyển khoản.
2. Kiểm tra giao dịch ngân hàng ngoài hệ thống.
3. Mở order detail.
4. Bấm “Xác nhận đã thanh toán”.
5. Hệ thống lưu payment event và đổi payment status.

### UC-04. Chatbot tư vấn sản phẩm

1. User hỏi nhu cầu.
2. Backend retrieval product/blog từ DB.
3. AI sinh câu trả lời.
4. Guardrail kiểm tra.
5. Backend trả answer + product cards.
6. User click xem product hoặc thêm cart/login.

---

## 9. Acceptance criteria tổng thể

- Public pages render tốt và SEO metadata đúng.
- Product/blog published hiển thị, hidden không hiển thị.
- Customer login/register hoạt động.
- Cart add/update/remove hoạt động theo SKU.
- Checkout COD/QR tạo order đúng.
- Admin quản lý product/version/SKU/stock được.
- Admin xác nhận payment QR thủ công được.
- Customer xem được đơn của mình.
- Chatbot gợi ý product thật từ DB và không bịa giá/kho/công dụng.
- API contract OpenAPI được frontend/backend dùng chung.
