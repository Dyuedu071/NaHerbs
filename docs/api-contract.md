# API Contract – NaHerbs Website MVP

**Phiên bản:** v2.0 – Next.js Stack  
**Backend:** `naherb-api` – Spring Boot  
**Frontend:** `naherb-web` – Next.js  
**Database:** Supabase PostgreSQL

---

## 1. Quy ước chung

### 1.1 Base URL

```text
Local API:      http://localhost:8080/api/v1
Production API: https://api.naherbs.vn/api/v1
Same-domain:    https://naherbs.vn/api/v1
```

Next.js nên dùng:

```text
API_BASE_URL                  # server-side fetch
NEXT_PUBLIC_API_BASE_URL      # client-side fetch nếu không dùng same-domain proxy
```

### 1.2 Response format

```json
{
  "success": true,
  "message": "OK",
  "data": {},
  "errors": []
}
```

Validation error:

```json
{
  "success": false,
  "message": "Validation failed",
  "data": null,
  "errors": [
    { "field": "phone", "message": "Số điện thoại không hợp lệ" }
  ]
}
```

### 1.3 Auth

```http
Authorization: Bearer <access_token>
```

- Public APIs: no auth.
- Customer APIs: customer token.
- Admin APIs: admin token.

### 1.4 Pagination

```json
{
  "items": [],
  "page": 0,
  "size": 12,
  "totalItems": 100,
  "totalPages": 9
}
```

---

## 2. Public APIs

### GET `/health`

Health check.

### GET `/site-settings/public`

Returns public settings: logo, hotline, Zalo, Facebook, email, address, default disclaimer, bank QR config visibility.

### GET `/product-categories`

Query:

| Param | Type | Notes |
|---|---|---|
| `status` | string | optional, default published/active only |

### GET `/products`

Query:

| Param | Type | Notes |
|---|---|---|
| `keyword` | string | search |
| `categorySlug` | string | filter |
| `need` | string | nhu cầu: co-vai-gay, lung, mat, ngai-cuu, tinh-dau |
| `inStockOnly` | boolean | only SKU in stock |
| `sort` | string | latest, price_asc, price_desc |
| `page` | int | default 0 |
| `size` | int | default 12 |

Response item:

```json
{
  "id": "uuid",
  "name": "Gối Công Thái Học Thảo Dược",
  "slug": "goi-cong-thai-hoc-thao-duoc",
  "thumbnailUrl": "https://...",
  "shortDescription": "...",
  "minSalePrice": 399000,
  "maxSalePrice": 399000,
  "stockStatus": "IN_STOCK"
}
```

### GET `/products/{slug}`

Returns product detail:

```json
{
  "id": "uuid",
  "name": "Gối Công Thái Học Thảo Dược",
  "slug": "goi-cong-thai-hoc-thao-duoc",
  "category": { "id": "uuid", "name": "Gối thảo dược", "slug": "goi-thao-duoc" },
  "shortDescription": "...",
  "detailDescription": "...",
  "usageInstruction": "...",
  "safetyNote": "...",
  "seoTitle": "...",
  "seoDescription": "...",
  "versions": [
    {
      "id": "uuid",
      "name": "Có Nhiệt",
      "skus": [
        {
          "id": "uuid",
          "skuCode": "NH-GCTH-CN-BE",
          "name": "Có Nhiệt - Màu Be",
          "color": "Be",
          "scent": null,
          "type": null,
          "originalPrice": 789000,
          "salePrice": 399000,
          "stockQuantity": 50,
          "stockStatus": "IN_STOCK",
          "thumbnailUrl": "https://..."
        }
      ]
    }
  ],
  "images": [],
  "relatedProducts": []
}
```

### GET `/blog-posts`

Public list published blog posts.

### GET `/blog-posts/{slug}`

Public blog detail.

### GET `/seo/sitemap-data`

Used by Next.js `app/sitemap.ts`.

Response:

```json
{
  "staticPages": ["/", "/san-pham", "/blog"],
  "products": [{ "slug": "goi-cong-thai-hoc", "updatedAt": "2026-06-28T00:00:00Z" }],
  "categories": [],
  "blogPosts": []
}
```

---

## 3. Customer auth APIs

### POST `/auth/register`

Request:

```json
{
  "fullName": "Nguyễn Văn A",
  "email": "a@example.com",
  "phone": "0987654321",
  "password": "Password123"
}
```

### POST `/auth/login`

Request:

```json
{
  "login": "a@example.com",
  "password": "Password123"
}
```

Response:

```json
{
  "accessToken": "jwt",
  "tokenType": "Bearer",
  "expiresIn": 86400,
  "user": { "id": "uuid", "fullName": "Nguyễn Văn A", "email": "a@example.com" }
}
```

### GET `/auth/me`

Customer profile from token.

---

## 4. Cart APIs – customer auth required

### GET `/cart`

Returns active cart.

### POST `/cart/items`

Request:

```json
{
  "skuId": "uuid",
  "quantity": 1
}
```

Rules:

- SKU must be active and in stock.
- Quantity must not exceed stock.

### PATCH `/cart/items/{itemId}`

Request:

```json
{ "quantity": 2 }
```

### DELETE `/cart/items/{itemId}`

Remove item.

### DELETE `/cart`

Clear cart.

---

## 5. Checkout & Order APIs – customer auth required

### POST `/checkout`

Request:

```json
{
  "receiverName": "Nguyễn Văn A",
  "receiverPhone": "0987654321",
  "receiverAddress": "Hà Nội",
  "note": "Giao giờ hành chính",
  "paymentMethod": "BANK_QR"
}
```

Response:

```json
{
  "orderId": "uuid",
  "orderCode": "NAHERBS-20260628-0001",
  "orderStatus": "PENDING_CONFIRMATION",
  "paymentMethod": "BANK_QR",
  "paymentStatus": "WAITING_BANK_TRANSFER",
  "totalAmount": 399000,
  "qrInstruction": {
    "bankName": "...",
    "accountName": "...",
    "accountNumber": "...",
    "qrImageUrl": "https://...",
    "transferContent": "NAHERBS-20260628-0001"
  }
}
```

### GET `/orders/my`

List current customer's orders.

### GET `/orders/my/{orderId}`

Get current customer's order detail.

### POST `/orders/my/{orderId}/cancel`

Customer cancel if allowed.

---

## 6. Chatbot APIs

### GET `/chatbot/config/public`

Returns enabled, welcome message, disclaimer, suggestions.

### POST `/chatbot/conversations`

Create anonymous/customer conversation.

### POST `/chatbot/messages`

Request:

```json
{
  "conversationId": "uuid-or-null",
  "sessionId": "browser-session-id",
  "message": "Tôi mỏi cổ vai gáy thì dùng sản phẩm nào?",
  "sourcePage": "/san-pham/goi-cong-thai-hoc"
}
```

Response:

```json
{
  "conversationId": "uuid",
  "answer": "...",
  "disclaimer": "...",
  "recommendedProducts": [
    {
      "productId": "uuid",
      "skuId": "uuid",
      "name": "Gối Công Thái Học Thảo Dược",
      "slug": "goi-cong-thai-hoc-thao-duoc",
      "skuName": "Có Nhiệt - Màu Be",
      "salePrice": 399000,
      "stockStatus": "IN_STOCK",
      "thumbnailUrl": "https://...",
      "reason": "Phù hợp nhu cầu thư giãn cổ vai gáy."
    }
  ],
  "suggestedActions": []
}
```

---

## 7. Admin auth APIs

### POST `/admin/auth/login`

Admin login.

### GET `/admin/auth/me`

Admin profile.

---

## 8. Admin product APIs

### GET `/admin/products`

Admin list products with filters.

### POST `/admin/products`

Create product.

### PUT `/admin/products/{productId}`

Update product.

### PATCH `/admin/products/{productId}/status`

Request:

```json
{ "status": "PUBLISHED" }
```

### DELETE `/admin/products/{productId}`

Soft delete/archive product.

### POST `/admin/products/{productId}/versions`

Create product version.

### PUT `/admin/product-versions/{versionId}`

Update version.

### POST `/admin/products/{productId}/skus`

Create SKU.

Request:

```json
{
  "versionId": "uuid",
  "skuCode": "NH-GCTH-CN-BE",
  "name": "Có Nhiệt - Màu Be",
  "color": "Be",
  "scent": null,
  "type": null,
  "originalPrice": 789000,
  "salePrice": 399000,
  "stockQuantity": 50,
  "status": "ACTIVE"
}
```

### PUT `/admin/product-skus/{skuId}`

Update SKU.

### PATCH `/admin/product-skus/{skuId}/stock`

Request:

```json
{ "stockQuantity": 40, "note": "Điều chỉnh sau kiểm kho" }
```

---

## 9. Admin order/payment APIs

### GET `/admin/orders`

Query:

| Param | Type |
|---|---|
| `keyword` | string |
| `orderStatus` | string |
| `paymentMethod` | string |
| `paymentStatus` | string |
| `page` | int |
| `size` | int |

### GET `/admin/orders/{orderId}`

Order detail.

### PATCH `/admin/orders/{orderId}/status`

Request:

```json
{ "orderStatus": "CONFIRMED", "note": "Đã gọi xác nhận" }
```

### PATCH `/admin/orders/{orderId}/payment-status`

Used for manual QR confirmation.

Request:

```json
{
  "paymentStatus": "PAID",
  "note": "Đã kiểm tra tài khoản ngân hàng, giao dịch khớp mã đơn."
}
```

Rules:

- Admin only.
- Write payment event audit.

---

## 10. Admin blog/chatbot/settings APIs

### Blog

- `GET /admin/blog-posts`
- `POST /admin/blog-posts`
- `PUT /admin/blog-posts/{postId}`
- `PATCH /admin/blog-posts/{postId}/status`
- `DELETE /admin/blog-posts/{postId}`

### Chatbot

- `GET /admin/chatbot/config`
- `PUT /admin/chatbot/config`
- `GET /admin/chatbot/conversations`
- `GET /admin/chatbot/conversations/{conversationId}`

### Site settings

- `GET /admin/site-settings`
- `PUT /admin/site-settings`

---

## 11. Error codes

| Code | Meaning |
|---|---|
| `AUTH_REQUIRED` | Missing/invalid token |
| `FORBIDDEN` | No permission |
| `VALIDATION_ERROR` | Invalid request |
| `RESOURCE_NOT_FOUND` | Not found |
| `DUPLICATE_VALUE` | Slug/email/SKU/order conflict |
| `INSUFFICIENT_STOCK` | Quantity exceeds stock |
| `INVALID_ORDER_STATE` | Cannot transition order/payment status |
| `AI_UNAVAILABLE` | AI provider failed |
