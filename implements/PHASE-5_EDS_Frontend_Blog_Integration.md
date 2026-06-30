# Phase 5: Engineering Design Specification - Tích hợp Frontend gọi API tạo bài viết Blog

## 1. Mục tiêu (Objective)
- Tích hợp giao diện tạo bài viết Blog (Admin) ở Frontend (Next.js) với API Backend (`POST /api/v1/admin/blog`).
- Cho phép người quản trị (Admin) điền thông tin (Tiêu đề, SEO, Nội dung TinyMCE, Trạng thái) và lưu bài viết vào hệ thống.
- Xử lý các phản hồi từ API (Thành công, Lỗi Validation 400, Lỗi Trùng Slug 409, Lỗi Hệ thống 500) và hiển thị thông báo thân thiện bằng thư viện `react-toastify` hoặc thư viện thông báo tương đương có sẵn trong dự án.

## 2. Phạm vi công việc (Scope)
1. Cập nhật trang `naherb-web/src/app/admin/posts/create/page.tsx`:
   - Lấy giá trị input (Title, Slug, SEO Title, SEO Description, Content, Status).
   - Thêm UI chọn Trạng thái (DRAFT / PUBLISHED).
   - Validation cơ bản ở Client-side (ví dụ: title không được trống, độ dài SEO).
2. Tích hợp Axios Fetch / Service:
   - Viết API helper (vd: `postApi.ts` hoặc gọi trực tiếp fetch/axios) trỏ đến `http://localhost:8080/api/v1/admin/blog`.
3. Xử lý logic lúc nhấn nút "Lưu Nháp" và "Xuất Bản":
   - Nếu nhấn "Lưu Nháp": Gửi status là `DRAFT`.
   - Nếu nhấn "Xuất Bản": Gửi status là `PUBLISHED`.
4. Xử lý Response từ Backend:
   - Thành công: Chuyển hướng người dùng về trang danh sách bài viết (`/admin/posts`) hoặc thông báo thành công.
   - Thất bại: Hiển thị lỗi tương ứng lên màn hình.

## 3. Thiết kế luồng dữ liệu (Data Flow)

### 3.1 Gửi dữ liệu đi (Request Payload)
Frontend sẽ chuẩn bị JSON gửi sang BE theo schema sau:
```json
{
  "title": "Tiêu đề bài viết",
  "slug": "", // (Có thể để trống để BE tự generate)
  "content": "<p>Nội dung HTML từ TinyMCE</p>",
  "summary": "Tóm tắt ngắn (optional)",
  "seoTitle": "Tiêu đề SEO",
  "seoDescription": "Mô tả SEO",
  "status": "DRAFT", // hoặc PUBLISHED
  "isFeatured": false,
  "productIds": [] // Tạm thời rỗng nếu chưa làm giao diện chọn sản phẩm
}
```

### 3.2 Xử lý HTTP Request
- Endpoint: `POST /api/v1/admin/blog`
- Headers:
  - `Content-Type`: `application/json`
  - Auth token (Cookie access token - nếu Backend yêu cầu).

### 3.3 Phản hồi (Response Handling)
- `201 Created`: Bài viết tạo thành công. Toast success -> Chuyển hướng về danh sách bài.
- `400 Bad Request`: Validation Error. Parse thông báo lỗi và hiển thị cảnh báo.
- `409 Conflict`: Lỗi trùng Slug (nếu người dùng cố tình nhập slug). Toast error nhắc nhở đổi slug.

## 4. Chi tiết triển khai UI

- **Thêm Field "Slug":**
  - Trong quá trình thiết kế ban đầu chưa có field nhập Slug.
  - Sẽ thêm 1 input "Đường dẫn tĩnh (Slug)" dưới trường Tiêu đề (có placeholder gợi ý rằng hệ thống sẽ tự sinh nếu để trống).
- **Trạng thái bài viết:**
  - Logic phân loại DRAFT vs PUBLISHED dựa trên việc Admin click nút "Lưu Nháp" hay "Xuất Bản".
- **Giao diện loading:**
  - Trong lúc gọi API, disable các nút bấm và hiển thị spinner để tránh Submit nhiều lần.

## 5. Security & Authentication
- Đảm bảo gọi API sử dụng credential của Admin (nếu đã có middleware hoặc axios interceptor gắn Cookie/Token).
- Endpoint được bảo vệ bằng Spring Security ở Backend (Đã test integration trước đó).

## 6. Kế hoạch kiểm thử (Test Plan)
1. **Happy Case 1:** Nhập Title, Content, SEO fields hợp lệ, nhấn Lưu Nháp. Kết quả: Chuyển trang và báo thành công.
2. **Happy Case 2:** Nhấn Xuất bản, báo thành công, bài viết được lưu với status PUBLISHED.
3. **Bad Case 1:** Bỏ trống Title. Bấm Lưu -> Client-side báo lỗi hoặc Backend trả 400.
4. **Bad Case 2:** SEO Title nhập > 60 ký tự. Backend trả 400 -> Frontend hiển thị toast báo lỗi.
5. **Bad Case 3:** Tự nhập Slug đã tồn tại. Backend trả 409 -> Frontend báo lỗi trùng đường dẫn.

---
**Prepared By:** Antigravity Agent
**Date:** 2026-06-30
