# NaHerbs

Monorepo gồm:

- `naherb-api`: Spring Boot 3, Spring Security, PostgreSQL, Redis, JWT/refresh HttpOnly cookie, CSRF/CORS và Swagger.
- `naherb-web`: React/Vite, Axios, React Router, Tailwind CSS và Zustand.

## Chạy local

Hai ứng dụng cùng đọc file `.env` ở thư mục gốc. Khởi tạo cấu hình local nếu chưa có:

```powershell
Copy-Item .env.example .env
```

Khởi động PostgreSQL và Redis bằng Docker Compose:

```powershell
docker compose up -d
docker compose ps
```

Dữ liệu được giữ trong hai named volume `naherb_postgres_data` và
`naherb_redis_data`. Sau khi hai service healthy, chạy API:

```powershell
cd naherb-api
mvn spring-boot:run
```

Spring Boot import `../.env`; Vite dùng `envDir: '..'`. Các bí mật thật chỉ đặt trong
`.env` (đã gitignore), còn `.env.example` là mẫu để commit.

Chạy web:

```powershell
cd naherb-web
npm.cmd install
npm.cmd run dev
```

Dừng hạ tầng bằng `docker compose down`. Chỉ dùng
`docker compose down -v` khi chủ động muốn xoá toàn bộ dữ liệu local.

Vite proxy `/api` tới `http://localhost:8080`. Swagger UI ở
`http://localhost:8080/swagger-ui.html`.

## Luồng xác thực

1. Web gọi `GET /api/auth/csrf` để nhận cookie `XSRF-TOKEN`.
2. Axios gửi `X-XSRF-TOKEN` cho các request thay đổi dữ liệu.
3. `POST /api/auth/login` trả JSON user và đặt access JWT cùng refresh token vào hai
   HttpOnly cookie riêng.
4. Access JWT mặc định sống 15 phút. Refresh token opaque sống 7 ngày; Redis chỉ lưu
   SHA-256 hash với TTL.
5. Axios tự gọi `POST /api/auth/refresh` một lần khi gặp 401, xoay refresh token rồi
   retry request ban đầu.
6. Logout xoá refresh token khỏi Redis, blacklist access JWT theo `jti` với TTL bằng
   thời gian sống còn lại, đồng thời xoá cả hai cookie.
7. Zustand chỉ giữ JSON user; không lưu token trong localStorage, sessionStorage hay state.

Ở production HTTPS, đặt `COOKIE_SECURE=true`. Nếu frontend/backend thật sự cross-site,
dùng `COOKIE_SAME_SITE=None`, HTTPS và origin CORS cụ thể.

## Kiểm tra

```powershell
cd naherb-api
mvn test

cd ..\naherb-web
npm.cmd run lint
npm.cmd run build
```
