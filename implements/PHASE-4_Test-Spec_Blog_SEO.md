# TEST-DRIVEN DEVELOPMENT SPECIFICATION TEMPLATE
# Mẫu Đặc tả Kiểm thử Hướng Phát triển - Module Blog & SEO

**Document ID:** `NAHERB-CMS-TDD-001`
**Version:** `1.1`
**Date:** `2026-06-30`
**Status:** `Draft`
**Standard:** ISO/IEC/IEEE 29119-3:2021 — Software Testing Part 3: Test Documentation
**Author:** `Antigravity`
**Reviewed by:** `[ ] Tech Lead — Pending`
**Classification:** `Internal`

**References:**
- `01_Requirements/SRS.md` — Functional requirements
- `docs/PHASE-3_EDS_Blog_SEO.md` — Technical Specification

---

## CHANGELOG

> **Policy 4.4 — Immutable History:** Không bao giờ xóa thông tin cũ.

| Ngày | Người thực hiện | Nội dung thay đổi |
|------|-----------------|-------------------|
| `2026-06-30` | `Antigravity` | Khởi tạo tài liệu — TDD spec cho Blog & SEO |
| `2026-06-30` | `Antigravity` | Cập nhật logic TDD cho SEO limits, Duplicate Slug, Product Links, Caching |

---

## MỤC LỤC

1. [Thông tin Module](#1-thông-tin-module)
2. [Logic Issues Resolved](#2-logic-issues-resolved)
3. [Test Design Specification (TDS)](#3-test-design-specification-tds)
4. [Test Case Specification](#4-test-case-specification)
5. [Red-Green-Refactor Tracker](#5-red-green-refactor-tracker)
6. [Entry / Exit Criteria](#6-entry--exit-criteria)
7. [Rollback Plan](#7-rollback-plan)

---

## 1. Thông tin Module

| Field | Value |
|-------|-------|
| **Feature / Gap ID** | `GAP-BLG-001` |
| **Module** | `Blog & SEO Management` |
| **Spec gốc** | `NAHERB-CMS-IMP-001` |
| **Priority** | 🟠 P1 |
| **Sprint** | `S3` |
| **Data Classification** | `Public` |
| **Upstream Dependencies** | `Category API` |
| **Downstream Consumers** | `Storefront Web (Next.js)` |

---

## 2. Logic Issues Resolved

| # | Spec gốc (sai / thiếu) | Thực tế (schema / policy) | Fix áp dụng trong test |
|---|------------------------|--------------------------|------------------------|
| L1 | Chưa rõ định dạng Slug | `slug` là UNIQUE varchar | Đảm bảo logic tạo tự động: dấu thành không dấu, thay space bằng `-`. Nếu trùng thì thêm `-2`, `-3`. |
| L2 | Đổi title bài viết | Có thể làm thay đổi URL cũ | Fix: Không tự update slug nếu sửa title, trừ khi admin tự nhập slug mới. |
| L3 | Xử lý ảnh bài viết | File đẩy lên frontend, backend chỉ nhận HTML | Fix: Test HTML parse, check `content` giữ nguyên thẻ `<img src="cloudinary...">`. Đổi state `TEMP` sang `ATTACHED`. |
| L4 | Giới hạn SEO | User nhập quá dài làm vỡ UI, bị Google phạt | Fix: Validate `seo_title` max 60 chars, `seo_description` max 160 chars. |
| L5 | Liên kết sản phẩm | Gắn 100 sản phẩm làm web giật lag | Fix: Max 6 products/bài. Public API không lấy product `INACTIVE` hoặc `DELETED`. |
| L6 | Lưu lượng truy cập | DB quá tải do Bot crawl liên tục | Fix: Tích hợp Redis Caching cho Public API GET. |

---

## 3. Test Design Specification (TDS)

### TDS-01 — Scope / Phạm vi

```
Blog & SEO Module bao gồm các layer:
├── Controllers (API Endpoints)
├── Services (Business logic xử lý bài viết, sinh slug, parse HTML)
├── Caching (Redis)
└── Repositories (Truy vấn DB `blog_posts`, `products`)
```

### TDS-03 — Test Conditions and Coverage Items

| Condition ID | Test Condition | Coverage Item | Test Cases |
|-------------|---------------|---------------|-----------|
| TC-COND-001 | Tạo bài viết mới thành công với SEO hợp lệ | `BlogController.createPost()` | `BLG-TC-001` |
| TC-COND-002 | Trả lỗi Validation 400 nếu SEO quá độ dài quy định | `BlogController.createPost()` | `BLG-TC-002` |
| TC-COND-003 | Sinh tự động Slug không trùng (thêm -2) | `BlogService.generateSlug()` | `BLG-TC-003` |
| TC-COND-004 | Trả lỗi 409 khi nhập thủ công Slug bị trùng | `BlogController.createPost()` | `BLG-TC-004` |
| TC-COND-005 | Giữ nguyên thẻ `<img src="cloudinary...">` trong content | `BlogController.createPost()` | `BLG-TC-005` |
| TC-COND-006 | Báo lỗi 400 nếu gán quá 6 sản phẩm vào blog | `BlogService.linkProducts()` | `BLG-TC-006` |
| TC-COND-007 | Lấy blog list có phân trang và Cache Redis Hit | `BlogController.listPosts()` | `BLG-TC-007` |
| TC-COND-008 | Không trả về Sản phẩm `INACTIVE` trong Public API | `BlogService.getPostBySlug()` | `BLG-TC-INT-001` |

---

## 4. Test Case Specification

### BLG-TC-002 — Báo lỗi 400 khi độ dài SEO vi phạm

**Severity:** `MEDIUM`
**Feature Under Test:** `BlogController.createPost()`
**Test File:** `BlogControllerTest.java`
**TDD Phase:** 🔴 RED
**Condition Ref:** `TC-COND-002`
**Oracle Source:** `BR-SEO-001`

**Test Steps:**
1. Call `POST /api/v1/admin/blogs` với `seo_title` dài 65 ký tự.
2. Kiểm tra response.

**Expected Result (PASS):**
- Status: `400 Bad Request`
- JSON báo lỗi "seo_title không được vượt quá 60 ký tự" (Mã `BLG-004`).

**Current Status:** 🔴 Not written

---

### BLG-TC-003 — Tự động sinh Slug không trùng (Append suffix)

**Severity:** `HIGH`
**Feature Under Test:** `BlogService.generateSlug()`
**Test File:** `BlogServiceTest.java`
**TDD Phase:** 🔴 RED
**Condition Ref:** `TC-COND-003`

**Preconditions:**
- Database đã tồn tại bài viết có slug: `"cach-tri-mat-ngu-hieu-qua"`.

**Test Steps:**
1. Gọi hàm sinh slug `generateSlug("Cách Trị Mất Ngủ Hiệu Quả!", null)`.

**Expected Result (PASS):**
- Trả về `"cach-tri-mat-ngu-hieu-qua-2"`.

**Current Status:** 🔴 Not written

---

### BLG-TC-006 — Giới hạn 6 sản phẩm liên kết

**Severity:** `MEDIUM`
**Feature Under Test:** `BlogService.linkProducts()`
**Test File:** `BlogServiceTest.java`
**TDD Phase:** 🔴 RED

**Test Steps:**
1. Admin gọi API Update Blog, truyền vào mảng 7 UUID của products.

**Expected Result (PASS):**
- System chặn lại và ném Exception `ValidationException` hoặc `400 Bad Request` (Mã `BLG-005`).

**Current Status:** 🔴 Not written

---

### INTEGRATION TEST CASES

### BLG-TC-INT-001 — Không hiển thị Product INACTIVE trong Public API

**Severity:** `HIGH`
**Feature Under Test:** `Public Blog Get API`
**Test File:** `BlogIntegrationTest.java`
**TDD Phase:** 🔴 RED
**Oracle Source:** `ADR-002`

**Preconditions:**
- DB có BlogPost `P1`.
- Linked Product `A` (Status = `ACTIVE`).
- Linked Product `B` (Status = `INACTIVE`).

**Test Steps:**
1. Khách hàng call `GET /api/v1/blogs/{slug-P1}`

**Expected Result (PASS):**
- API trả về 200 OK.
- Trong danh sách sản phẩm liên kết, **chỉ có Product A**. Product B bị lọc bỏ hoàn toàn.

**Current Status:** 🔴 Not written

---

## 5. Red-Green-Refactor Tracker

| TC ID | Test File | 🔴 RED confirmed | 🟢 GREEN (commit) | 🔵 REFACTOR note |
|-------|-----------|-----------------|-------------------|------------------|
| `BLG-TC-002` | `BlogControllerTest.java` | `[ ]` | ` ` | |
| `BLG-TC-003` | `BlogServiceTest.java` | `[ ]` | ` ` | |
| `BLG-TC-006` | `BlogServiceTest.java` | `[ ]` | ` ` | |
| `BLG-TC-INT-001` | `BlogIntegrationTest.java` | `[ ]` | ` ` | |

---

## 6. Entry / Exit Criteria

### Exit Criteria (Điều kiện kết thúc — DoD)
- [ ] `mvn test` pass toàn bộ 100%.
- [ ] Kiểm tra bằng k6 load test đảm bảo API GET chạm Redis thay vì DB.

---

## 7. Rollback Plan

```bash
git checkout -- src/main/java/vn/io/naherb/blog
```
