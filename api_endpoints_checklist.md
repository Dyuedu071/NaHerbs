# NaHerbs API Endpoints Checklist

This checklist is generated from `docs/openapi.yml`.

## Health
- [x] `GET` /health - Health check (@TuanAnh)
## SEO
- [ ] `GET` /site-settings/public - Get public site settings (@Duy)
- [ ] `GET` /seo/sitemap-data - Data for Next.js sitemap.ts (@Duy)
## Public Products
- [x] `GET` /product-categories - List published product categories (@Chien)
- [x] `GET` /products - List published products (@Chien)
- [x] `GET` /products/{slug} - Get product detail by slug (@Chien)
## Public Blog
- [x] `GET` /blog-posts - List published blog posts (@Duy)
- [x] `GET` /blog-posts/{slug} - Get blog post detail (@Duy)
## Customer Auth
- [x] `POST` /auth/register - Register customer account and initialize profile
- [x] `POST` /auth/login - Login customer
## Customer Profile
- [x] `GET` /auth/me - Get current account and profile
- [x] `GET` /account/profile - Get current account profile (@TuanAnh)
- [x] `PUT` /account/profile - Update current account profile (@TuanAnh)
## Cart
- [ ] `GET` /cart - Get current customer's cart (@Hoang)
- [ ] `DELETE` /cart - Clear cart (@Hoang)
- [ ] `POST` /cart/items - Add item to cart (@Hoang)
- [ ] `PATCH` /cart/items/{itemId} - Update cart item quantity (@Hoang)
- [ ] `DELETE` /cart/items/{itemId} - Remove cart item (@Hoang)
## Checkout
- [ ] `POST` /checkout - Create order from cart (@Hoang)
## Customer Orders
- [ ] `GET` /orders/my - List current customer's orders (@Hoang)
- [ ] `GET` /orders/my/{orderId} - Get current customer's order detail (@Hoang)
## Chatbot
- [x] `GET` /chatbot/config/public - Get public chatbot config (@TuanAnh)
- [x] `POST` /chatbot/conversations - Create chatbot conversation (@TuanAnh)
- [x] `POST` /chatbot/messages - Send chatbot message (@TuanAnh)
## Admin Auth
- [x] `POST` /admin/auth/login - Login admin
## Admin Products
- [x] `GET` /admin/products - List products for admin (@Chien)
- [ ] `POST` /admin/products - Create product (@Chien)
- [ ] `PUT` /admin/products/{productId} - Update product (@Chien)
- [ ] `DELETE` /admin/products/{productId} - Archive product (@Chien)
- [ ] `POST` /admin/products/{productId}/versions - Create product version (@Chien)
- [ ] `POST` /admin/products/{productId}/skus - Create product SKU (@Chien)
- [ ] `PUT` /admin/product-skus/{skuId} - Update SKU (@Chien)
- [ ] `PATCH` /admin/product-skus/{skuId}/stock - Update SKU stock (@Chien)
## Admin Orders
- [ ] `GET` /admin/orders - List orders for admin (@Hoang)
- [ ] `GET` /admin/orders/{orderId} - Admin get order detail (@Hoang)
- [ ] `PATCH` /admin/orders/{orderId}/status - Update order status (@Hoang)
- [ ] `PATCH` /admin/orders/{orderId}/payment-status - Manually update payment status, used for QR confirmation (@Hoang)
## Admin Blog
- [ ] `GET` /admin/blog-posts - List blog posts admin (@Duy)
- [x] `POST` /admin/blog-posts - Create blog post (@Duy)
## Admin Chatbot
- [x] `GET` /admin/chatbot/config - Get chatbot config (@TuanAnh)
- [x] `PUT` /admin/chatbot/config - Update chatbot config (@TuanAnh)
## Admin Settings
- [ ] `GET` /admin/site-settings - Get site settings (@Duy)
- [ ] `PUT` /admin/site-settings - Update site settings (@Duy)
## Customer Addresses
- [x] `GET` /account/addresses - List current account shipping addresses (@TuanAnh)
- [x] `POST` /account/addresses - Create shipping address for current account (@TuanAnh)
- [x] `PUT` /account/addresses/{addressId} - Update shipping address (@TuanAnh)
- [x] `DELETE` /account/addresses/{addressId} - Delete shipping address (@TuanAnh)
- [x] `PATCH` /account/addresses/{addressId}/default - Set address as default (@TuanAnh)
## auth
- [x] `POST` /auth/google - Login or Register with Google
- [x] `POST` /auth/register-otp - Send OTP for registration
