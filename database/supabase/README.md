# Supabase Database Scripts – NaHerbs

NaHerbs dùng PostgreSQL trên Supabase làm database chung, vì vậy **không dùng Flyway tự động chạy migration khi Spring Boot start**.

## Cách dùng

Chạy theo thứ tự trong Supabase SQL Editor hoặc Supabase CLI:

```text
001_init_schema.sql
002_seed_minimal.sql
```

Khi cần thay đổi schema sau này, tạo script mới:

```text
003_add_xxx.sql
004_alter_yyy.sql
```

## Vì sao dùng schema `naherb`?

Database Supabase là database dùng chung. Schema riêng giúp tránh đụng tên bảng với các project khác.

Backend nên dùng:

```yaml
spring:
  jpa:
    hibernate:
      ddl-auto: validate
    properties:
      hibernate:
        default_schema: naherb
```

JDBC URL có thể thêm current schema:

```text
jdbc:postgresql://<host>:5432/postgres?currentSchema=naherb
```

## RLS

Hiện tại `naherb-web` không kết nối trực tiếp Supabase. Toàn bộ request đi qua `naherb-api`, vì vậy authorization nằm ở Spring Security.

Nếu sau này frontend dùng Supabase client trực tiếp, phải bật RLS và viết policy trước.
