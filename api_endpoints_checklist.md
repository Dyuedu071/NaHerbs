# NaHerbs API Endpoints Checklist

This checklist is generated from `docs/openapi.yml`.

## Health

- [X] `GET` /health - Health check (@TuanAnh)

## SEO

- [ ] `GET` /site-settings/public - Get public site settings (@Duy)
- [ ] `GET` /seo/sitemap-data - Data for Next.js sitemap.ts (@Duy)

## Public Products

- [X] `GET` /product-categories - List published product categories (@Chien)
- [X] `GET` /products - List published products (@Chien)
- [X] `GET` /products/{slug} - Get product detail by slug (@Chien)

## Public Blog

- [X] `GET` /blog-posts - List published blog posts (@Duy)
- [X] `GET` /blog-posts/{slug} - Get blog post detail (@Duy)

## Customer Auth

- [X] `POST` /auth/register - Register customer account and initialize profile
- [X] `POST` /auth/login - Login customer

## Customer Profile

- [X] `GET` /auth/me - Get current account and profile
- [X] `GET` /account/profile - Get current account profile (@TuanAnh)
- [X] `PUT` /account/profile - Update current account profile (@TuanAnh)

## Cart

- [X] `GET` /cart - Get current customer's cart (@Hoang)
- [X] `DELETE` /cart - Clear cart (@Hoang)
- [X] `POST` /cart/items - Add item to cart (@Hoang)
- [X] `PATCH` /cart/items/{itemId} - Update cart item quantity (@Hoang)
- [X] `DELETE` /cart/items/{itemId} - Remove cart item (@Hoang)

## Checkout

- [X] `POST` /checkout - Create order from cart (@Hoang)

## Customer Orders

- [X] `GET` /orders/my - List current customer's orders (@Hoang)
- [X] `GET` /orders/my/{orderId} - Get current customer's order detail (@Hoang)

## Chatbot

- [X] `GET` /chatbot/config/public - Get public chatbot config (@TuanAnh)
- [X] `POST` /chatbot/conversations - Create chatbot conversation (@TuanAnh)
- [X] `POST` /chatbot/messages - Send chatbot message (@TuanAnh)

## Admin Auth

- [X] `POST` /admin/auth/login - Login admin

## Admin Products

- [X] `GET` /admin/products - List products for admin (@Chien)
- [X] `POST` /admin/products - Create product (@Chien)
- [X] `PUT` /admin/products/{productId} - Update product (@Chien)
- [X] `DELETE` /admin/products/{productId} - Archive product (@Chien)
- [X] `POST` /admin/products/{productId}/versions - Create product version (@Chien)
- [X] `POST` /admin/products/{productId}/skus - Create product SKU (@Chien)
- [X] `PUT` /admin/product-skus/{skuId} - Update SKU (@Chien)
- [X] `PATCH` /admin/product-skus/{skuId}/stock - Update SKU stock (@Chien

## Admin Orders

- [X] `GET` /admin/orders - List orders for admin (@Hoang)
- [X] `GET` /admin/orders/{orderId} - Admin get order detail (@Hoang)
- [X] `PATCH` /admin/orders/{orderId}/status - Update order status (@Hoang)
- [X] `PATCH` /admin/orders/{orderId}/payment-status - Manually update payment status, used for QR confirmation (@Hoang)

## Admin Blog

- [ ] `GET` /admin/blog-posts - List blog posts admin (@Duy)
- [X] `POST` /admin/blog-posts - Create blog post (@Duy)

## Admin Chatbot

- [X] `GET` /admin/chatbot/config - Get chatbot config (@TuanAnh)
- [X] `PUT` /admin/chatbot/config - Update chatbot config (@TuanAnh)

## Admin Settings

- [ ] `GET` /admin/site-settings - Get site settings (@Duy)
- [ ] `PUT` /admin/site-settings - Update site settings (@Duy)

## Customer Addresses

- [X] `GET` /account/addresses - List current account shipping addresses (@TuanAnh)
- [X] `POST` /account/addresses - Create shipping address for current account (@TuanAnh)
- [X] `PUT` /account/addresses/{addressId} - Update shipping address (@TuanAnh)
- [X] `DELETE` /account/addresses/{addressId} - Delete shipping address (@TuanAnh)
- [X] `PATCH` /account/addresses/{addressId}/default - Set address as default (@TuanAnh)

## auth

- [X] `POST` /auth/google - Login or Register with Google
- [X] `POST` /auth/register-otp - Send OTP for registration
