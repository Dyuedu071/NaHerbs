# NaHerbs API Endpoints Checklist

This checklist is generated from `docs/openapi.yml`.

## Health
- [ ] `GET` /health - Health check
## SEO
- [ ] `GET` /site-settings/public - Get public site settings
- [ ] `GET` /seo/sitemap-data - Data for Next.js sitemap.ts
## Public Products
- [ ] `GET` /product-categories - List published product categories
- [ ] `GET` /products - List published products
- [ ] `GET` /products/{slug} - Get product detail by slug
## Public Blog
- [ ] `GET` /blog-posts - List published blog posts
- [ ] `GET` /blog-posts/{slug} - Get blog post detail
## Customer Auth
- [x] `POST` /auth/register - Register customer account and initialize profile
- [x] `POST` /auth/login - Login customer
## Customer Profile
- [x] `GET` /auth/me - Get current account and profile
- [ ] `GET` /account/profile - Get current account profile
- [ ] `PUT` /account/profile - Update current account profile
## Cart
- [ ] `GET` /cart - Get current customer's cart
- [ ] `DELETE` /cart - Clear cart
- [ ] `POST` /cart/items - Add item to cart
- [ ] `PATCH` /cart/items/{itemId} - Update cart item quantity
- [ ] `DELETE` /cart/items/{itemId} - Remove cart item
## Checkout
- [ ] `POST` /checkout - Create order from cart
## Customer Orders
- [ ] `GET` /orders/my - List current customer's orders
- [ ] `GET` /orders/my/{orderId} - Get current customer's order detail
## Chatbot
- [ ] `GET` /chatbot/config/public - Get public chatbot config
- [ ] `POST` /chatbot/conversations - Create chatbot conversation
- [ ] `POST` /chatbot/messages - Send chatbot message
## Admin Auth
- [x] `POST` /admin/auth/login - Login admin
## Admin Products
- [ ] `GET` /admin/products - List products for admin
- [ ] `POST` /admin/products - Create product
- [ ] `PUT` /admin/products/{productId} - Update product
- [ ] `DELETE` /admin/products/{productId} - Archive product
- [ ] `POST` /admin/products/{productId}/versions - Create product version
- [ ] `POST` /admin/products/{productId}/skus - Create product SKU
- [ ] `PUT` /admin/product-skus/{skuId} - Update SKU
- [ ] `PATCH` /admin/product-skus/{skuId}/stock - Update SKU stock
## Admin Orders
- [ ] `GET` /admin/orders - List orders for admin
- [ ] `GET` /admin/orders/{orderId} - Admin get order detail
- [ ] `PATCH` /admin/orders/{orderId}/status - Update order status
- [ ] `PATCH` /admin/orders/{orderId}/payment-status - Manually update payment status, used for QR confirmation
## Admin Blog
- [ ] `GET` /admin/blog-posts - List blog posts admin
- [ ] `POST` /admin/blog-posts - Create blog post
## Admin Chatbot
- [ ] `GET` /admin/chatbot/config - Get chatbot config
- [ ] `PUT` /admin/chatbot/config - Update chatbot config
## Admin Settings
- [ ] `GET` /admin/site-settings - Get site settings
- [ ] `PUT` /admin/site-settings - Update site settings
## Customer Addresses
- [ ] `GET` /account/addresses - List current account shipping addresses
- [ ] `POST` /account/addresses - Create shipping address for current account
- [ ] `PUT` /account/addresses/{addressId} - Update shipping address
- [ ] `DELETE` /account/addresses/{addressId} - Delete shipping address
- [ ] `PATCH` /account/addresses/{addressId}/default - Set address as default
## auth
- [x] `POST` /auth/google - Login or Register with Google
- [x] `POST` /auth/register-otp - Send OTP for registration
