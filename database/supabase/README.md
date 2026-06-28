# NaHerbs UUID Schema + OpenAPI

Bộ file này đã được chỉnh theo yêu cầu: **dùng UUID cho tất cả khóa chính/khóa ngoại nghiệp vụ**, bao gồm `accounts.id`, `account_profiles.account_id`, `account_addresses.account_id`, `carts.account_id`, `orders.account_id`, `leads.account_id`, `payments.verified_by_account_id`, và `chatbot_conversations.account_id`.

## File

- `001_init_schema.sql`: schema Supabase PostgreSQL dùng `uuid primary key default gen_random_uuid()` cho `accounts` và các bảng nghiệp vụ.
- `002_seed_minimal.sql`: seed tối thiểu, tương thích UUID.
- `openapi.yml` / `openapi.yaml`: API contract đã đổi các `accountId`, `addressId`, `shippingAddressId` sang `string` `format: uuid`.

## Lưu ý bắt buộc cho Spring Boot

Entity `Account` hiện tại của bạn đang dùng:

```java
@Id
@GeneratedValue(strategy = GenerationType.IDENTITY)
private Long id;
```

Nếu database dùng UUID thì entity cần đổi sang dạng tương tự:

```java
@Id
@GeneratedValue(strategy = GenerationType.UUID)
private UUID id;
```

Hoặc nếu muốn để database tự sinh `gen_random_uuid()`, có thể bỏ generator Java và để Hibernate đọc UUID sau insert tùy cách mapping/cấu hình. Cách đơn giản với Hibernate 6/Spring Boot 3 là dùng `GenerationType.UUID`.

Các entity khác có FK tới account cũng phải đổi `Long accountId` / `Account.id` sang `UUID`.

## Thứ tự chạy Supabase

1. Nếu database đang là bản thử nghiệm, drop schema cũ trước:

```sql
drop schema if exists naherb cascade;
```

2. Chạy `001_init_schema.sql`.
3. Chạy `002_seed_minimal.sql`.

Dự án này vẫn giữ nguyên quy ước: **không dùng Flyway auto migration**, schema được chạy thủ công bằng Supabase SQL Editor hoặc Supabase CLI.
