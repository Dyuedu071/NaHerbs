# SDD – NaHerbs Website MVP

**Dự án:** NaHerbs Website  
**Tài liệu:** Software Design Document (SDD)  
**Phiên bản:** v2.0 – Next.js Stack  
**Ngày cập nhật:** 2026-06-28  
**Backend:** `naherb-api` – Spring Boot REST API  
**Frontend:** `naherb-web` – Next.js  
**Database:** Supabase PostgreSQL

---

## 1. Mục đích

Tài liệu SDD mô tả thiết kế phần mềm cho NaHerbs Website MVP sau khi chuyển frontend từ React + Vite sang Next.js. Thiết kế tập trung vào SEO cho public pages, e-commerce MVP, COD/QR manual payment, admin CMS, chatbot AI và Supabase PostgreSQL.

---

## 2. Architecture overview

### 2.1 Architecture decision

Hệ thống dùng kiến trúc frontend/backend tách rời:

- `naherb-web`: Next.js, chịu trách nhiệm UI, SEO rendering, metadata, route organization.
- `naherb-api`: Spring Boot, chịu trách nhiệm REST API, auth, business rules, data persistence, chatbot orchestration.
- Supabase PostgreSQL: database chung.
- AI Provider: gọi qua backend adapter.

Next.js **không truy cập database trực tiếp**. Mọi dữ liệu đi qua `naherb-api`.

### 2.2 System Context Diagram

```plantuml
@startuml
!theme plain
skinparam shadowing false
skinparam componentStyle rectangle
skinparam defaultFontName Arial

title NaHerbs MVP v2.0 - System Context

actor "Guest" as Guest
actor "Customer" as Customer
actor "Admin" as Admin

rectangle "naherb-web\nNext.js" as Web {
  component "Public SEO Pages" as PublicPages
  component "Customer App\nCart/Checkout/Orders" as CustomerApp
  component "Admin UI" as AdminUI
  component "Chatbot Widget" as ChatWidget
}

rectangle "naherb-api\nSpring Boot REST API" as Api {
  component "Auth" as Auth
  component "Product/CMS" as Product
  component "Cart/Order/Payment" as Order
  component "Blog/SEO" as Blog
  component "Chatbot Orchestration" as Chatbot
}

database "Supabase PostgreSQL\nschema: naherb" as DB
folder "Media Storage\nSupabase Storage/S3" as Storage
cloud "AI Provider" as AI
cloud "Manual Bank Account Check" as Bank

Guest --> Web : Browse, SEO, Chatbot
Customer --> Web : Cart, Checkout, Orders
Admin --> Web : CMS, Orders, Payment Confirmation
Web --> Api : REST/JSON
Api --> DB : JDBC/JPA
Api --> Storage : Upload/Serve images
Api --> AI : Controlled prompts
Admin --> Bank : Check bank transfer outside system
@enduml
```

### 2.3 Container Diagram

```plantuml
@startuml
!theme plain
skinparam shadowing false
skinparam componentStyle rectangle
skinparam defaultFontName Arial

title NaHerbs MVP - Container Diagram

node "Browser" {
  artifact "Next.js rendered pages" as Browser
}

node "Web Runtime" {
  component "naherb-web\nNext.js App Router" as Next
}

node "API Runtime" {
  component "naherb-api\nSpring Boot" as Spring
}

database "Supabase PostgreSQL" as PG
folder "Media Storage" as Media
cloud "AI Provider" as AI

Browser --> Next : HTTPS pages/assets
Next --> Spring : Server-side fetch + client API calls
Spring --> PG : JDBC/JPA
Spring --> Media : Storage SDK / URL
Spring --> AI : HTTPS
@enduml
```

### 2.4 Deployment View

```plantuml
@startuml
!theme plain
skinparam shadowing false
skinparam defaultFontName Arial

title NaHerbs Deployment - Next.js + Spring Boot + Supabase

node "Client" {
  artifact "Browser" as Client
}

node "Web Hosting" {
  artifact "naherb-web\nNext.js" as Next
}

node "API Hosting" {
  artifact "naherb-api.jar\nSpring Boot" as API
}

cloud "Supabase" {
  database "PostgreSQL\nschema naherb" as DB
  folder "Storage Buckets" as Bucket
}

cloud "AI Provider" as AI

Client --> Next : HTTPS
Next --> API : HTTPS /api/v1
API --> DB : JDBC SSL
API --> Bucket : Media storage
API --> AI : HTTPS
@enduml
```

---

## 3. Repository design

```text
naherb/
├── naherb-api/             # Spring Boot backend
├── naherb-web/             # Next.js frontend
├── docs/                   # PRD, SRS, SDD, API contract, UI/UX
├── database/
│   └── supabase/           # SQL scripts chạy thủ công/versioned
└── README.md
```

### 3.1 `naherb-api` package structure

```text
com.naherb.api
├── common
│   ├── config
│   ├── exception
│   ├── response
│   ├── security
│   └── util
├── auth
├── customer
├── product
├── cart
├── order
├── payment
├── blog
├── media
├── chatbot
├── lead
├── seo
└── setting
```

### 3.2 `naherb-web` Next.js structure

```text
naherb-web/
├── src/
│   ├── app/
│   │   ├── page.tsx
│   │   ├── layout.tsx
│   │   ├── san-pham/
│   │   │   ├── page.tsx
│   │   │   └── [slug]/page.tsx
│   │   ├── danh-muc/[slug]/page.tsx
│   │   ├── blog/
│   │   │   ├── page.tsx
│   │   │   └── [slug]/page.tsx
│   │   ├── cart/page.tsx
│   │   ├── checkout/page.tsx
│   │   ├── account/orders/page.tsx
│   │   ├── admin/
│   │   ├── sitemap.ts
│   │   └── robots.ts
│   ├── components/
│   ├── features/
│   ├── services/
│   │   ├── api-client.ts
│   │   └── generated/       # generated from openapi.yml
│   ├── types/
│   └── utils/
├── public/
├── next.config.ts
└── package.json
```

---

## 4. Rendering design in Next.js

| Page group | Suggested rendering | Notes |
|---|---|---|
| Home | Server/Static render | SEO page |
| Product list/category | Server render | Fetch from API with pagination/filter |
| Product detail | Server render | Dynamic metadata, Product JSON-LD |
| Blog list/detail | Server render | Article metadata, JSON-LD |
| Cart/checkout/account | Client-heavy + noindex | Requires customer token |
| Admin | Client-heavy + noindex | Requires admin token |
| Chatbot widget | Client component | Calls backend chatbot API |

### 4.1 Next.js API calling rule

- Server Components call internal API URL: `API_BASE_URL`.
- Client Components call public API URL or same-domain proxy: `NEXT_PUBLIC_API_BASE_URL`.
- All business validation remains in Spring Boot.

### 4.2 SEO responsibilities

Next.js implements:

- `generateMetadata()` for dynamic product/blog metadata.
- `app/sitemap.ts` fetches published slugs from `GET /api/v1/seo/sitemap-data`.
- `app/robots.ts` marks admin/cart/checkout/account noindex.
- JSON-LD components for Product, Article, Breadcrumb.

---

## 5. Backend design

### 5.1 Layered architecture

| Layer | Responsibility |
|---|---|
| Controller | REST endpoints, request validation |
| DTO/Mapper | Request/response shape |
| Service | Business rules |
| Repository | Spring Data JPA |
| Entity | PostgreSQL table mapping |
| Security | JWT, password hash, role/customer separation |
| Integration | AI provider, media storage |

### 5.2 Backend Component Diagram

```plantuml
@startuml
!theme plain
skinparam shadowing false
skinparam componentStyle rectangle
skinparam defaultFontName Arial

title naherb-api - Component Diagram

package "naherb-api" {
  [AuthController] as AuthC
  [ProductController] as ProductC
  [CartController] as CartC
  [OrderController] as OrderC
  [AdminController] as AdminC
  [BlogController] as BlogC
  [ChatbotController] as ChatC
  [SeoController] as SeoC

  [AuthService] as AuthS
  [ProductService] as ProductS
  [InventoryService] as InvS
  [CartService] as CartS
  [CheckoutService] as CheckoutS
  [OrderService] as OrderS
  [PaymentService] as PayS
  [BlogService] as BlogS
  [ChatbotService] as ChatS
  [KnowledgeRetrievalService] as KnowledgeS
  [AIProviderAdapter] as AIS
  [GuardrailService] as GuardS
  [SeoService] as SeoS
  [Repositories] as Repo
}

database "Supabase PostgreSQL" as DB
cloud "AI Provider" as AI

AuthC --> AuthS
ProductC --> ProductS
CartC --> CartS
OrderC --> OrderS
AdminC --> ProductS
AdminC --> OrderS
AdminC --> PayS
BlogC --> BlogS
ChatC --> ChatS
SeoC --> SeoS

CartS --> InvS
CheckoutS --> InvS
CheckoutS --> OrderS
OrderS --> PayS
ChatS --> KnowledgeS
KnowledgeS --> ProductS
KnowledgeS --> BlogS
ChatS --> AIS
ChatS --> GuardS
AIS --> AI
ProductS --> Repo
CartS --> Repo
OrderS --> Repo
PayS --> Repo
BlogS --> Repo
ChatS --> Repo
Repo --> DB
@enduml
```

---

## 6. Database design

### 6.1 ERD

```plantuml
@startuml
!theme plain
skinparam shadowing false
skinparam linetype ortho
skinparam defaultFontName Arial

title NaHerbs ERD - Product SKU + Cart/Order + Chatbot

entity "customers" as customers {
  * id : uuid <<PK>>
  --
  email : varchar <<UK>>
  phone : varchar <<UK>>
  password_hash : varchar
  full_name : varchar
  status : varchar
}

entity "admin_users" as admin_users {
  * id : uuid <<PK>>
  --
  email : varchar <<UK>>
  password_hash : varchar
  full_name : varchar
  status : varchar
}

entity "product_categories" as categories {
  * id : uuid <<PK>>
  --
  name : varchar
  slug : varchar <<UK>>
  status : varchar
}

entity "products" as products {
  * id : uuid <<PK>>
  --
  category_id : uuid <<FK>>
  name : varchar
  slug : varchar <<UK>>
  short_description : text
  detail_description : text
  status : varchar
  seo_title : varchar
  seo_description : text
}

entity "product_versions" as versions {
  * id : uuid <<PK>>
  --
  product_id : uuid <<FK>>
  name : varchar
  display_order : int
  status : varchar
}

entity "product_skus" as skus {
  * id : uuid <<PK>>
  --
  product_id : uuid <<FK>>
  version_id : uuid <<FK>>
  sku_code : varchar <<UK>>
  name : varchar
  color : varchar
  scent : varchar
  type : varchar
  original_price : numeric
  sale_price : numeric
  stock_quantity : int
  status : varchar
}

entity "product_images" as images {
  * id : uuid <<PK>>
  --
  product_id : uuid <<FK>>
  sku_id : uuid <<FK, nullable>>
  url : varchar
  alt_text : varchar
  is_thumbnail : boolean
}

entity "carts" as carts {
  * id : uuid <<PK>>
  --
  customer_id : uuid <<FK>>
  status : varchar
}

entity "cart_items" as cart_items {
  * id : uuid <<PK>>
  --
  cart_id : uuid <<FK>>
  sku_id : uuid <<FK>>
  quantity : int
}

entity "orders" as orders {
  * id : uuid <<PK>>
  --
  customer_id : uuid <<FK>>
  order_code : varchar <<UK>>
  payment_method : varchar
  payment_status : varchar
  order_status : varchar
  total_amount : numeric
  receiver_name : varchar
  receiver_phone : varchar
  receiver_address : text
}

entity "order_items" as order_items {
  * id : uuid <<PK>>
  --
  order_id : uuid <<FK>>
  sku_id : uuid <<FK>>
  product_name_snapshot : varchar
  sku_name_snapshot : varchar
  unit_price : numeric
  quantity : int
  line_total : numeric
}

entity "payment_events" as payment_events {
  * id : uuid <<PK>>
  --
  order_id : uuid <<FK>>
  event_type : varchar
  from_status : varchar
  to_status : varchar
  admin_id : uuid <<FK, nullable>>
  note : text
}

entity "blog_posts" as blog_posts {
  * id : uuid <<PK>>
  --
  title : varchar
  slug : varchar <<UK>>
  content : text
  status : varchar
  seo_title : varchar
}

entity "chatbot_conversations" as convs {
  * id : uuid <<PK>>
  --
  session_id : varchar
  customer_id : uuid <<FK, nullable>>
  detected_need : varchar
  status : varchar
}

entity "chatbot_messages" as msgs {
  * id : uuid <<PK>>
  --
  conversation_id : uuid <<FK>>
  role : varchar
  content : text
  product_refs : jsonb
}

categories ||--o{ products
products ||--o{ versions
products ||--o{ skus
versions ||--o{ skus
products ||--o{ images
skus ||--o{ images
customers ||--o{ carts
carts ||--o{ cart_items
skus ||--o{ cart_items
customers ||--o{ orders
orders ||--o{ order_items
skus ||--o{ order_items
orders ||--o{ payment_events
admin_users ||--o{ payment_events
customers ||--o{ convs
convs ||--o{ msgs
@enduml
```

### 6.2 Supabase schema management

- Schema name: `naherb`.
- SQL scripts đặt trong `database/supabase/`.
- Không dùng Flyway auto migration.
- Spring Boot config production:

```yaml
spring:
  jpa:
    hibernate:
      ddl-auto: validate
    properties:
      hibernate:
        default_schema: naherb
```

---

## 7. Key sequence diagrams

### 7.1 Product detail SEO rendering

```plantuml
@startuml
!theme plain
skinparam shadowing false
skinparam defaultFontName Arial

title Product Detail Rendering with Next.js

actor User
participant "Browser" as Browser
participant "Next.js Page\n/san-pham/[slug]" as Next
participant "naherb-api\nProductController" as API
participant "ProductService" as Service
database "Supabase PostgreSQL" as DB

User -> Browser : Open product URL
Browser -> Next : Request page
Next -> API : GET /api/v1/products/{slug}
API -> Service : getProductDetail(slug)
Service -> DB : Query product + versions + skus + images
DB --> Service : Data
Service --> API : ProductDetailDTO
API --> Next : JSON
Next -> Next : generateMetadata + render HTML + JSON-LD
Next --> Browser : SEO-ready HTML
@enduml
```

### 7.2 Add cart requires login

```plantuml
@startuml
!theme plain
skinparam shadowing false
skinparam defaultFontName Arial

title Add To Cart Requires Customer Login

actor Guest
participant "Product Page" as Page
participant "Auth State" as Auth
participant "Login/Register Page" as Login
participant "Cart API" as CartAPI

Guest -> Page : Click Add to cart
Page -> Auth : Check customer token
Auth --> Page : Not logged in
Page -> Login : Redirect with returnUrl and pendingSku
Guest -> Login : Login/Register
Login -> Page : Return to product/cart action
Page -> CartAPI : POST /cart/items with token
CartAPI --> Page : Cart updated
@enduml
```

### 7.3 Checkout QR manual payment

```plantuml
@startuml
!theme plain
skinparam shadowing false
skinparam defaultFontName Arial

title QR Payment Manual Confirmation

actor Customer
actor Admin
participant "naherb-web Checkout" as Web
participant "OrderController" as OrderAPI
participant "CheckoutService" as Checkout
participant "InventoryService" as Inventory
participant "PaymentService" as Payment
database "DB" as DB
participant "Admin Order UI" as AdminUI

Customer -> Web : Submit checkout, paymentMethod=BANK_QR
Web -> OrderAPI : POST /checkout
OrderAPI -> Checkout : createOrderFromCart
Checkout -> Inventory : validateAndReserveStock
Inventory -> DB : Update stock
Checkout -> DB : Insert order + items
Checkout -> Payment : createWaitingBankTransfer
Payment -> DB : Insert payment event
OrderAPI --> Web : orderCode + QR instruction
Web --> Customer : Show fixed QR + transfer content
Admin -> AdminUI : Check bank account externally
AdminUI -> OrderAPI : PATCH /admin/orders/{id}/payment-status PAID
OrderAPI -> Payment : confirmManualPayment(adminId, note)
Payment -> DB : Update payment_status + payment_event
OrderAPI --> AdminUI : Updated order
@enduml
```

### 7.4 Chatbot answer

```plantuml
@startuml
!theme plain
skinparam shadowing false
skinparam defaultFontName Arial

title Chatbot Grounded Answer

actor User
participant "Next.js Chatbot Widget" as Widget
participant "ChatbotController" as Controller
participant "ChatbotService" as Chat
participant "KnowledgeRetrievalService" as Knowledge
participant "AIProviderAdapter" as AI
participant "GuardrailService" as Guardrail
database "DB" as DB

User -> Widget : Ask question
Widget -> Controller : POST /chatbot/messages
Controller -> Chat : handleMessage
Chat -> DB : Save user message
Chat -> Knowledge : retrieve products/blogs
Knowledge -> DB : Query published products/blogs
DB --> Knowledge : Context
Chat -> AI : Prompt + context
AI --> Chat : Draft answer
Chat -> Guardrail : Validate answer
Guardrail --> Chat : Safe answer
Chat -> DB : Save assistant message
Controller <-- Chat : answer + product cards
Widget <-- Controller : JSON
Widget --> User : Show answer
@enduml
```

---

## 8. API design summary

- Public APIs: health, products, categories, blogs, chatbot suggestions, site settings.
- Customer APIs: auth, cart, checkout, my orders.
- Admin APIs: auth, product CMS, SKU, blog CMS, order management, payment confirmation, chatbot config.
- SEO APIs: sitemap data, product/blog SEO payload.

Detailed contract is in `api-contract.md` and `openapi.yml`.

---

## 9. Security design

### 9.1 Auth model

- Customer token and admin token share JWT mechanism but distinguish subject type/role.
- Admin endpoint prefix: `/api/v1/admin/**`.
- Customer endpoint prefix: `/api/v1/cart`, `/api/v1/checkout`, `/api/v1/orders/my`.
- Public endpoint no auth.

### 9.2 Frontend noindex routes

Next.js must mark these noindex:

```text
/cart
/checkout
/account/**
/admin/**
/login
/register
```

### 9.3 Manual QR confirmation audit

Every admin payment confirmation writes a `payment_events` record:

- order id
- old status
- new status
- admin id
- note
- timestamp

---

## 10. Error handling

| Case | HTTP | Handling |
|---|---:|---|
| Validation error | 400 | Field errors |
| Unauthorized | 401 | Login required |
| Forbidden | 403 | Not allowed |
| Not found | 404 | Resource not found |
| Conflict | 409 | Duplicate slug/email/order state conflict |
| Insufficient stock | 409 | Show stock error to user |
| AI provider unavailable | 503 | Chatbot fallback |
| Unexpected | 500 | Generic message, server log |

---

## 11. Testing design

### 11.1 Backend

- Product/SKU service unit tests.
- Inventory/checkout transaction tests.
- Order/payment status transition tests.
- Admin payment confirmation tests.
- Auth access control tests.
- Chatbot retrieval/guardrail tests.

### 11.2 Frontend

- Product detail SKU selection tests.
- Cart/checkout flow tests.
- QR instruction UI tests.
- SEO metadata tests for product/blog.
- Admin order/payment UI tests.

### 11.3 E2E critical flows

1. Guest opens product from URL → SEO page renders → login → add cart.
2. Customer checkout COD.
3. Customer checkout QR → admin confirms paid.
4. Admin creates product/version/SKU → public product page updates.
5. Chatbot suggests valid product cards.

---

## 12. Build & deployment

### 12.1 Local dev

```text
naherb-api:  http://localhost:8080
naherb-web:  http://localhost:3000
Supabase:    remote project or local Supabase
```

### 12.2 Environment variables

#### `naherb-api`

```text
DB_URL
DB_USERNAME
DB_PASSWORD
JWT_SECRET
UPLOAD_PROVIDER
AI_PROVIDER
AI_API_KEY
AI_MODEL
CORS_ALLOWED_ORIGINS
PUBLIC_WEB_BASE_URL
```

#### `naherb-web`

```text
API_BASE_URL
NEXT_PUBLIC_API_BASE_URL
NEXT_PUBLIC_SITE_URL
```

---

## 13. Design decisions

| ADR | Decision | Reason |
|---|---|---|
| ADR-01 | Next.js for `naherb-web` | SEO cho product/blog tốt hơn SPA |
| ADR-02 | Spring Boot remains backend authority | Business rules tập trung, dễ kiểm soát |
| ADR-03 | Next.js does not access DB directly | Tránh duplicate logic/security |
| ADR-04 | Supabase PostgreSQL, no Flyway auto-run | DB chung, schema quản lý thủ công an toàn hơn |
| ADR-05 | Product → Version → SKU | Tồn kho/giá theo biến thể thật |
| ADR-06 | Manual QR payment confirmation | Phù hợp tài khoản ngân hàng chủ website, chưa cần gateway |
| ADR-07 | Chatbot product cards generated by backend | Tránh AI bịa giá/kho/sản phẩm |

---

## 14. Conclusion

SDD v2.0 xác định rõ kiến trúc Next.js + Spring Boot + Supabase. Next.js giải quyết SEO và UI, Spring Boot giữ toàn bộ nghiệp vụ và dữ liệu. Thiết kế này phù hợp với MVP có product SEO, blog SEO, cart/checkout, COD/QR thủ công, admin CMS và chatbot AI grounded bằng dữ liệu trong database.
