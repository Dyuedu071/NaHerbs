# PRD – NaHerbs Website MVP

**Dự án:** NaHerbs Website  
**Tài liệu:** Product Requirements Document (PRD)  
**Phiên bản:** v2.0 – Next.js Stack  
**Ngày cập nhật:** 2026-06-28  
**Backend:** `naherb-api` – Spring Boot REST API  
**Frontend:** `naherb-web` – Next.js  
**Database:** Supabase PostgreSQL  
**Ngôn ngữ MVP:** Tiếng Việt

---

## 1. Tóm tắt sản phẩm

NaHerbs Website MVP là website thương mại điện tử nhẹ cho thương hiệu NaHerbs, tập trung vào sản phẩm chăm sóc sức khỏe tại nhà từ thảo dược thiên nhiên: gối công thái học thảo dược, túi/gối chườm, gối chữ U, bịt mắt thảo dược, tinh dầu, cốc xông ngải cứu, bộ xông ngải cứu và điếu ngải cứu.

MVP cần đáp ứng 4 mục tiêu chính:

1. Xây dựng website chính thức có SEO tốt cho sản phẩm và blog.
2. Cho khách xem sản phẩm, blog, hỏi chatbot và đọc nội dung thương hiệu mà không cần đăng nhập.
3. Cho khách đăng ký/đăng nhập từ lúc bắt đầu thêm sản phẩm vào giỏ hàng và tiếp tục checkout.
4. Cho admin quản lý sản phẩm, SKU, kho, blog, đơn hàng, thanh toán COD/QR thủ công và chatbot.

### 1.1 Thay đổi stack ở v2.0

Phiên bản v2.0 thay đổi frontend từ React + Vite sang **Next.js** để giải quyết hạn chế SEO của SPA. `naherb-web` dùng Next.js để render tốt các trang public cần index như home, danh sách sản phẩm, chi tiết sản phẩm, blog và bài viết. `naherb-api` vẫn là Spring Boot, giữ toàn bộ business logic và truy cập Supabase PostgreSQL.

---

## 2. Tech stack chốt

| Thành phần | Công nghệ | Trách nhiệm chính |
|---|---|---|
| `naherb-web` | Next.js, React, TypeScript | UI public, SEO, cart/checkout UI, customer UI, admin UI, chatbot widget |
| `naherb-api` | Spring Boot, Spring Security, Spring Data JPA | REST API, auth, business rules, CMS, cart, order, payment, chatbot orchestration |
| Database | Supabase PostgreSQL | Lưu dữ liệu chung: customer, admin, product, SKU, order, blog, chatbot |
| Media | Supabase Storage hoặc S3-compatible/local volume | Ảnh sản phẩm, ảnh blog, logo, QR cố định |
| AI Provider | OpenAI/Gemini/compatible | Sinh câu trả lời chatbot, nhưng backend kiểm soát context và guardrail |

### 2.1 Nguyên tắc kiến trúc

- Next.js không truy cập database trực tiếp.
- Next.js gọi `naherb-api` qua REST API.
- Spring Boot là nguồn sự thật cho product, SKU, giá, tồn kho, cart, order, payment status, blog, admin và chatbot.
- Supabase chỉ là database/storage; không dùng Supabase Auth làm auth chính trong MVP.
- Không dùng Flyway tự chạy migration trong Spring Boot. SQL schema được quản lý bằng script versioned và chạy thủ công qua Supabase SQL Editor hoặc Supabase CLI.

---

## 3. Vấn đề cần giải quyết

### 3.1 Người dùng cuối

Người dùng cần:

- Hiểu NaHerbs là thương hiệu gì.
- Tìm sản phẩm phù hợp theo nhu cầu: cổ vai gáy, đau lưng, thư giãn mắt, xông ngải, tinh dầu, quà tặng sức khỏe.
- Xem biến thể sản phẩm rõ ràng: phiên bản, màu, mùi, loại, giá, tồn kho.
- Hỏi AI chatbot để được tư vấn sản phẩm đang có trên website.
- Thêm sản phẩm vào giỏ hàng, checkout và chọn COD hoặc chuyển khoản QR.
- Theo dõi trạng thái đơn hàng sau khi đặt.

### 3.2 Đội vận hành NaHerbs

Admin cần:

- Quản lý sản phẩm theo mô hình Product → Version → SKU.
- Quản lý tồn kho riêng theo SKU.
- Quản lý blog SEO và nội dung thương hiệu.
- Xử lý đơn hàng COD/QR.
- Với QR cố định, tự kiểm tra tài khoản ngân hàng và xác nhận đơn đã thanh toán.
- Cấu hình chatbot, disclaimer, câu hỏi gợi ý và xem lịch sử hội thoại.

---

## 4. Scope MVP

### 4.1 Trong phạm vi MVP

#### Public website – Next.js SEO pages

- Trang chủ.
- Trang giới thiệu NaHerbs.
- Trang danh sách sản phẩm.
- Trang danh mục sản phẩm.
- Trang chi tiết sản phẩm.
- Trang blog.
- Trang chi tiết blog.
- Trang liên hệ.
- Chatbot widget.
- Sitemap, robots, canonical URL, metadata, Open Graph, JSON-LD Product/Article/Breadcrumb.

#### Customer e-commerce

- Đăng ký/đăng nhập khách hàng.
- Khách chỉ bắt buộc đăng nhập khi thêm sản phẩm vào giỏ hàng và các bước sau.
- Giỏ hàng theo tài khoản khách.
- Checkout.
- Phương thức thanh toán: COD và QR chuyển khoản cố định.
- Tạo đơn hàng.
- Xem đơn hàng của tôi.
- Trang kết quả đặt hàng.

#### Admin/CMS

- Đăng nhập admin.
- 1 role admin toàn quyền trong MVP.
- Dashboard.
- Quản lý sản phẩm.
- Quản lý phiên bản sản phẩm.
- Quản lý SKU/biến thể: màu, mùi, loại, giá, tồn kho.
- Quản lý ảnh.
- Quản lý blog.
- Quản lý đơn hàng.
- Xác nhận thanh toán thủ công cho QR.
- Quản lý chatbot config và lịch sử hội thoại.
- Quản lý site settings: hotline, Zalo, Facebook, email, địa chỉ, QR image, thông tin ngân hàng.

#### AI Chatbot

- Chatbot dùng dữ liệu sản phẩm và blog trong database.
- Chatbot được gọi qua `naherb-api`, không gọi AI provider trực tiếp từ Next.js.
- Chatbot gợi ý sản phẩm có thật, đang publish, ưu tiên còn hàng.
- Chatbot không tự bịa giá, tồn kho, công dụng hoặc sản phẩm.
- Chatbot có disclaimer an toàn sức khỏe.

### 4.2 Ngoài phạm vi MVP

- Payment gateway tự động.
- Tự động đối soát ngân hàng.
- Tích hợp vận chuyển tự động.
- ERP/kế toán.
- Loyalty/referral/voucher nâng cao.
- Đa ngôn ngữ.
- App mobile.
- Microservices.
- Chatbot chẩn đoán bệnh/kê đơn/thay thế bác sĩ.

---

## 5. Personas

| Persona | Mục tiêu | Pain point | Tính năng liên quan |
|---|---|---|---|
| Khách xem sản phẩm | Tìm sản phẩm chăm sóc sức khỏe tại nhà | Chưa biết sản phẩm nào phù hợp | Product SEO pages, chatbot, category |
| Nhân viên văn phòng | Giảm mỏi cổ vai gáy/lưng, thư giãn mắt | Ngồi máy tính nhiều, cần tư vấn nhanh | Chatbot, gối/túi chườm, blog |
| Người mua quà | Chọn quà sức khỏe cho người thân/nhân viên | Cần gợi ý dễ hiểu | Chatbot, product cards, cart/checkout |
| Khách đã đăng nhập | Mua hàng nhanh, theo dõi đơn | Không muốn nhập lại thông tin nhiều lần | Account, cart, orders |
| Admin NaHerbs | Vận hành sản phẩm, đơn hàng, blog | Cần quản lý giá/kho/QR thủ công | Admin CMS, order/payment management |

---

## 6. Product model

MVP dùng mô hình:

```text
Product → ProductVersion → ProductSku
```

- **Product**: sản phẩm chính, ví dụ “Gối Công Thái Học Thảo Dược”.
- **ProductVersion**: phiên bản, ví dụ “Có Nhiệt”, “Không Nhiệt”, “Combo”.
- **ProductSku**: biến thể bán được, là tổ hợp cụ thể của version + thuộc tính như màu/mùi/loại. SKU lưu giá và tồn kho riêng.

Ví dụ:

```text
Product: Gối Công Thái Học Thảo Dược
  Version: Có Nhiệt
    SKU: Có Nhiệt - Màu Be - 399.000đ - stock 50
  Version: Không Nhiệt
    SKU: Không Nhiệt - Màu Nâu Chùa - 399.000đ - stock 50
```

---

## 7. Thanh toán MVP

### 7.1 COD

- Khách chọn COD khi checkout.
- Đơn có `paymentMethod = COD`.
- `paymentStatus = UNPAID` hoặc `COD_PENDING`.
- Admin xác nhận đơn và xử lý giao hàng thủ công.

### 7.2 QR chuyển khoản cố định

- Website hiển thị QR cố định của tài khoản ngân hàng chủ website.
- Nội dung chuyển khoản nên chứa mã đơn hàng, ví dụ: `NAHERBS-{orderCode}`.
- Hệ thống không tự kiểm tra giao dịch ngân hàng.
- Admin/nhân sự tự xem tài khoản ngân hàng, sau đó vào admin xác nhận `paymentStatus = PAID`.
- Đơn chưa được xác nhận thanh toán sẽ ở trạng thái chờ xác nhận.

---

## 8. SEO strategy với Next.js

Next.js được dùng để cải thiện SEO cho các trang public:

| Route | Render strategy | SEO |
|---|---|---|
| `/` | Server/Static render | index |
| `/san-pham` | Server render hoặc ISR-like fetch | index |
| `/san-pham/[slug]` | Server render | index, Product JSON-LD |
| `/danh-muc/[slug]` | Server render | index |
| `/blog` | Server render | index |
| `/blog/[slug]` | Server render | index, Article JSON-LD |
| `/cart`, `/checkout`, `/account`, `/admin/**` | Client-heavy/noindex | noindex |

Next.js chịu trách nhiệm:

- `generateMetadata()` cho product/blog.
- `app/sitemap.ts` lấy slug từ `naherb-api`.
- `app/robots.ts` cấu hình index/noindex.
- JSON-LD cho Product, Article, Breadcrumb.
- Open Graph image/title/description.

---

## 9. User stories ưu tiên

### 9.1 Public/customer

| ID | User story | Priority |
|---|---|---|
| US-CUS-01 | Là khách truy cập, tôi muốn xem trang chủ để hiểu NaHerbs bán gì. | P0 |
| US-CUS-02 | Là khách truy cập, tôi muốn xem danh sách/chi tiết sản phẩm có SEO tốt. | P0 |
| US-CUS-03 | Là khách truy cập, tôi muốn hỏi chatbot để được gợi ý sản phẩm phù hợp. | P0 |
| US-CUS-04 | Là khách, tôi muốn đăng nhập/đăng ký khi thêm sản phẩm vào giỏ hàng. | P0 |
| US-CUS-05 | Là khách hàng, tôi muốn chọn SKU cụ thể theo phiên bản/màu/mùi và thêm vào giỏ. | P0 |
| US-CUS-06 | Là khách hàng, tôi muốn checkout bằng COD hoặc QR chuyển khoản. | P0 |
| US-CUS-07 | Là khách hàng, tôi muốn xem lại trạng thái đơn hàng. | P1 |
| US-CUS-08 | Là người đọc blog, tôi muốn xem bài viết và sản phẩm liên quan. | P1 |

### 9.2 Admin

| ID | User story | Priority |
|---|---|---|
| US-ADM-01 | Là admin, tôi muốn đăng nhập để quản trị website. | P0 |
| US-ADM-02 | Là admin, tôi muốn quản lý Product → Version → SKU. | P0 |
| US-ADM-03 | Là admin, tôi muốn quản lý giá và tồn kho riêng theo SKU. | P0 |
| US-ADM-04 | Là admin, tôi muốn xem và cập nhật đơn hàng. | P0 |
| US-ADM-05 | Là admin, tôi muốn xác nhận thanh toán QR thủ công. | P0 |
| US-ADM-06 | Là admin, tôi muốn quản lý blog SEO. | P1 |
| US-ADM-07 | Là admin, tôi muốn cấu hình chatbot và xem lịch sử hội thoại. | P1 |

---

## 10. Success metrics

### Launch MVP

- 100% sản phẩm khởi tạo có trang detail render SEO tốt.
- 100% blog khởi tạo có title/meta/slug.
- Khách có thể đăng ký/đăng nhập và checkout thành công.
- Đơn COD và QR được tạo đúng.
- Admin xác nhận thanh toán QR thủ công được.
- Chatbot trả lời các nhóm nhu cầu chính và gợi ý sản phẩm có thật.
- Sitemap/robots hoạt động.

### Sau launch 1–3 tháng

- Organic impressions/clicks cho blog/product pages.
- Tỷ lệ click “Thêm vào giỏ hàng”.
- Tỷ lệ checkout thành công.
- Tỷ lệ QR payment được admin xác nhận.
- Tỷ lệ chatbot click sang sản phẩm.
- Top nhu cầu người dùng hỏi chatbot.

---

## 11. Rủi ro và hướng giảm thiểu

| Rủi ro | Ảnh hưởng | Giảm thiểu |
|---|---|---|
| Next.js và Spring Boot lệch contract API | FE/BE bug | Dùng `openapi.yml` làm source of truth |
| QR không tự đối soát | Admin có thể xác nhận chậm/sai | Có order code rõ, payment note, audit log |
| Stock theo SKU phức tạp | Sai tồn kho | Stock trừ khi tạo order, kiểm tra khi checkout |
| Chatbot bịa thông tin | Rủi ro thương hiệu/pháp lý | Backend retrieval + guardrail + product cards deterministic |
| Supabase chung không dùng Flyway | Schema drift | Versioned SQL scripts + checklist deploy |
| SEO vẫn yếu nếu page chỉ client render | Ít organic traffic | Next.js server render public pages, metadata, sitemap, JSON-LD |

---

## 12. Kết luận PRD

NaHerbs MVP v2.0 chuyển frontend sang Next.js để phù hợp với mục tiêu SEO và e-commerce nhẹ. Spring Boot tiếp tục là backend chính để đảm bảo business logic tập trung, Supabase PostgreSQL là database chung. MVP cần ưu tiên sản phẩm/blog SEO, cart/checkout, COD/QR thủ công, admin CMS và AI chatbot grounded trên dữ liệu thật.
