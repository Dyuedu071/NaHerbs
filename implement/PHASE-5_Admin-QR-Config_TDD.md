# TEST-DRIVEN DEVELOPMENT SPECIFICATION
# NaHerbs — Phase 5 (Admin QR Payment Config — Upload ảnh QR + thông tin ngân hàng)

**Document ID:** `NAHERB-QRCFG-TDD-005`
**Version:** `1.0`
**Date:** `2026-07-03`
**Spec gốc:** `NAHERB-QRCFG-IMP-005` (`implement/PHASE-5_Admin-QR-Config_EDS.md`)
**Depends on:** `NAHERB-FOUNDATION-TDD-001` (Cloudinary/Media test infra), `NAHERB-CHATBOT-TDD-004` (admin auth test pattern)
**Author:** Tuấn Anh — Fullstack Developer
**Standard:** ISO/IEC/IEEE 29119-3

> **Quy ước TDD:** Viết test trước (`*.spec.ts` / `*IntegrationTests.java`) → chạy → xác nhận FAIL 🔴 → implement → PASS 🟢 → refactor 🔵.
> Test không được mark ✅ nếu `mvn test` / `npm test` chưa xanh.
> Test data: **KHÔNG dùng** ảnh QR/tài khoản ngân hàng thật của shop — dùng fixture `test_qr.png` (1×1 PNG) và tên NH mock (`TEST_BANK`).

---

## CHANGELOG

| Ngày | Người thực hiện | Nội dung thay đổi |
|------|-----------------|-------------------|
| 2026-07-03 | Tuấn Anh | Khởi tạo TDD Phase 5 — Admin QR Config |

---

## MỤC LỤC

1. [Thông tin Module](#1-thông-tin-module)
2. [Logic Issues Resolved](#2-logic-issues-resolved)
3. [Test Design Specification](#3-test-design-specification)
4. [Test Case Specification](#4-test-case-specification)
5. [Red-Green-Refactor Tracker](#5-red-green-refactor-tracker)
6. [Entry / Exit Criteria](#6-entry--exit-criteria)
7. [Rollback Plan](#7-rollback-plan)
8. [Anti-Pattern Detection](#8-anti-pattern-detection)

---

## 1. Thông tin Module

| Field | Value |
|-------|-------|
| **Feature ID** | `QR-CFG` |
| **Module** | `Admin QR Payment Configuration — Site Settings / Payment` |
| **Spec gốc** | `NAHERB-QRCFG-IMP-005` |
| **Priority** | 🔴 P0 |
| **Sprint** | `S5 (2026-07-04 → 2026-07-11)` |
| **Milestone** | `M5 — Payment COD/QR manual confirmation` (backlog M5-01…M5-07) |
| **Data Classification** | `Internal` (bank info của shop, không phải PII khách) |
| **Compliance** | SRS §7.3 (Security), BR-06, BR-11, BR-12 |
| **Upstream Dependencies** | `MediaService` (Cloudinary), `SiteSettingService`, `SecurityConfig` |
| **Downstream Consumers** | `QrInstructionService` (checkout BANK_QR flow) |

### 1.1 AI Generation Context

| Field | Value |
|-------|-------|
| **AI Assisted?** | Yes |
| **Constraint Source** | EDS §14 CASE 2.0 Constraint Block |
| **Constraints Injected** | ADR-016 (Cloudinary reuse), ADR-017 (site_settings camelCase), ADR-018 (delete-old-then-set-new), BR-06/BR-11 |
| **Model** | Cursor Agent (Claude) |
| **Trust Level** | `T2 → T3 (pending Red Gate)` |

---

## 2. Logic Issues Resolved

> **Bắt buộc điền trước khi viết test.** Ghi lại các sai lệch giữa spec/thiết kế và codebase thực tế.

| # | Spec / giả định | Thực tế trong repo | Fix áp dụng trong test |
|---|-----------------|--------------------|------------------------|
| L1 | Tưởng phải tạo enum `MediaType.QR` | `MediaType` **đã có** value `QR` (`vn.io.naherb.common.enums.MediaType`) | Test dùng thẳng `MediaType.QR`, không thêm enum |
| L2 | Tưởng phải tạo endpoint mới `/admin/qr-config` | `PUT /api/admin/settings` **đã** upsert key/value bất kỳ | Test integration bám endpoint sẵn có, không expect endpoint mới |
| L3 | Tưởng response `MediaController` là `ApiResponse<...>` | Thực tế trả `Map<String, String>` phẳng `{ "location": ..., "id": ... }` | Test assert `response.body.location` / `response.body.id`, không unwrap `.data` |
| L4 | Tưởng key snake_case `bank_qr_image_url` | `QrInstructionService` đọc camelCase là canonical (`firstValue(..., "bankName", "bank.name", "bank_name")`) | Test PUT settings dùng `bankName`, `bankQrImageUrl`,… camelCase |
| L5 | Test upload cần Cloudinary thật | CI không có Cloudinary key → test flaky | Dùng `@MockBean Cloudinary` trả fake `{ secure_url, public_id }` cho unit/integration |
| L6 | `QrInstructionService` yêu cầu order type `PaymentMethod.BANK_QR` | Nếu order COD → trả `null` | Test happy path phải seed order với `paymentMethod=BANK_QR` |
| L7 | Frontend Toast API tưởng dùng `alert()` | Repo có `useToast()` context với API `showToast(msg, kind)` | Test frontend mock `useToast` và assert được gọi đúng |

---

## 3. Test Design Specification

### 3.1 Scope

```
Module Admin QR Config gồm các layer:
├── Backend Integration (Spring Boot Test + MockMvc + @MockBean Cloudinary)
│   ├── MediaController (POST/DELETE /api/v1/admin/media)  ← reuse test
│   ├── SiteSettingController (GET/PUT /api/admin/settings)  ← reuse test
│   └── QrInstructionService (unit test đọc từ SiteSettings)  ← reuse
└── Frontend Component (Vitest + React Testing Library)
    ├── QrPaymentConfigSection.spec.tsx  ← NEW
    └── AdminSettingsPage.payment-tab.spec.tsx  ← NEW (tab render + save flow)
```

### 3.2 Test Basis

| Source | Items derived |
|--------|--------------|
| `docs/srs.md` FR-ADM-07 | Admin update bank info + QR image |
| `docs/srs.md` BR-06 | QR cố định — không auto-verify |
| `docs/srs.md` BR-11 | Chỉ admin cấu hình được |
| `docs/srs.md` §7.3 | Rate limit / không log secret |
| EDS `NAHERB-QRCFG-IMP-005` §7.2 | Endpoints reuse, không thêm mới |
| EDS §8 | Error codes QR-CFG-001..005 |
| EDS §9 | Auth matrix (GUEST/USER/ADMIN) |
| EDS §14 | AI Prompt Constraints |

### 3.3 Test Conditions & Coverage

| Condition ID | Test Condition | Coverage Item | Test Cases |
|--------------|---------------|---------------|-----------|
| `QR-CFG-COND-001` | Admin upload valid PNG QR → asset saved với `type=QR` | `MediaService.uploadImage` + `POST /api/v1/admin/media/upload` | `QR-CFG-TC-001` |
| `QR-CFG-COND-002` | Non-admin (guest) không upload được | `SecurityConfig` `/api/v1/admin/**` | `QR-CFG-TC-002` |
| `QR-CFG-COND-003` | Customer role không upload được | `hasRole('ADMIN')` | `QR-CFG-TC-003` |
| `QR-CFG-COND-004` | File > 10MB bị reject | `MediaService.uploadImage` validate size | `QR-CFG-TC-004` |
| `QR-CFG-COND-005` | Mime không hợp lệ (`.pdf`) bị reject | `MediaService.uploadImage` validate mime | `QR-CFG-TC-005` |
| `QR-CFG-COND-006` | PUT settings upsert đủ 5 bank key | `SiteSettingService.saveSettings` | `QR-CFG-TC-006` |
| `QR-CFG-COND-007` | `QrInstructionService.buildFor` trả đủ 4 field cho order BANK_QR | `QrInstructionService` | `QR-CFG-TC-007` |
| `QR-CFG-COND-008` | Delete old media khi upload mới thành công (best-effort) | Frontend `handleQrUpload` | `QR-CFG-TC-008` |
| `QR-CFG-COND-009` | Public endpoint `/api/v1/settings/site-info` KHÔNG expose bank keys | `SiteSettingController.getPublicSiteInfo` | `QR-CFG-TC-SEC-001` |
| `QR-CFG-COND-010` | Frontend empty state → dropzone | `QrPaymentConfigSection` | `QR-CFG-TC-101` |
| `QR-CFG-COND-011` | Frontend filled state → preview + 2 nút | `QrPaymentConfigSection` | `QR-CFG-TC-102` |
| `QR-CFG-COND-012` | Frontend chọn `.pdf` → toast error, không call API | `QrPaymentConfigSection` | `QR-CFG-TC-103` |
| `QR-CFG-COND-013` | Frontend chọn > 10MB → toast error, không call API | `QrPaymentConfigSection` | `QR-CFG-TC-104` |
| `QR-CFG-COND-014` | Save button → PUT `/admin/settings` với đủ 5 bank key | `AdminSettingsPage` | `QR-CFG-TC-105` |

### 3.4 Test Techniques

| Technique (ISO 29119-4) | Applied to | Rationale |
|-------------------------|------------|-----------|
| Equivalence Partitioning | File mime (image vs non-image) | Chia domain hợp lệ / không hợp lệ |
| Boundary Value Analysis | File size 10MB ± 1 byte | Reject đúng ranh giới 10485760 bytes |
| State Transition | Empty → Uploading → Filled → Replaced | Đảm bảo UI state đúng qua upload lifecycle |
| Role-based (auth) | GUEST / USER / ADMIN | Đảm bảo BR-11 |
| Negative testing | mime, size, non-auth | Guard mọi input xấu |

### 3.5 Test Data / Fixtures

| Fixture ID | Type | Value / Logic | Mục đích |
|-----------|------|---------------|---------|
| `FX-QR-001` | file | `test_qr.png` — 1×1 PNG (~70 bytes) | Happy path upload |
| `FX-QR-002` | file | `test_big.png` — dummy 11 MB | Trigger QR-CFG-001 |
| `FX-QR-003` | file | `test_doc.pdf` | Trigger QR-CFG-002 |
| `FX-QR-004` | Cloudinary mock | `{ secure_url: "https://mock.cloudinary/qr_uuid.png", public_id: "naherb/qr_images/qr_uuid" }` | Không gọi Cloudinary thật |
| `FX-QR-005` | seed `site_settings` | 5 key bank: `TEST_BANK / TEST OWNER / 9999888877 / <mock url> / <uuid>` | Test QrInstructionService |
| `FX-QR-006` | JWT | `{ sub: "admin-uuid", role: "ADMIN" }` | Auth admin |
| `FX-QR-007` | JWT | `{ sub: "user-uuid", role: "USER" }` | Auth customer (test 403) |
| `FX-QR-008` | Order entity | `Order(paymentMethod=BANK_QR, orderCode="NAHERBS-TEST-001")` | Input cho `QrInstructionService.buildFor` |

---

## 4. Test Case Specification

> **TC ID format:** `QR-CFG-TC-[NNN]`
> - `001-099`: Backend integration
> - `100-199`: Frontend component/page
> - `SEC-XXX`: Security test cases

### Props Isolation Boilerplate — Frontend

```typescript
// naherb-web/src/components/admin/settings/__tests__/factory.ts

import type { QrPaymentSettings } from "../QrPaymentConfigSection";

export const baseQrSettings: QrPaymentSettings = {
  bankName: "",
  bankAccountName: "",
  bankAccountNumber: "",
  bankQrImageUrl: "",
  bankQrMediaId: "",
};

export const makeQrSettings = (
  overrides: Partial<QrPaymentSettings> = {}
): QrPaymentSettings => ({ ...baseQrSettings, ...overrides });

export const makeToast = () => {
  const calls: Array<{ msg: string; kind: "success" | "error" }> = [];
  return {
    showToast: (msg: string, kind: "success" | "error") =>
      calls.push({ msg, kind }),
    calls,
  };
};
```

---

### QR-CFG-TC-001 — Admin upload valid PNG QR

**Severity:** `CRITICAL`
**Feature Under Test:** `POST /api/v1/admin/media/upload` với `type=QR`
**Test File:** `naherb-api/src/test/java/vn/io/naherb/media/AdminQrMediaIntegrationTests.java`
**TDD Phase:** 🔴 RED
**Condition Ref:** `QR-CFG-COND-001`
**Oracle Source:** `EDS §7.2` (endpoint reuse), `ADR-016`

**Preconditions:**
- `FX-QR-001` (file `test_qr.png` từ `src/test/resources/`).
- `FX-QR-004` (Cloudinary mock trả `secure_url` + `public_id`).
- `FX-QR-006` (JWT admin).

**Test Steps:**
1. Arrange: `@MockBean Cloudinary` với `uploader().upload(...)` return `Map` chứa `secure_url` và `public_id`.
2. Act: `mockMvc.perform(multipart("/api/v1/admin/media/upload").file(...).param("type", "QR").header("Authorization", "Bearer " + adminJwt))`.
3. Assert:
   - `status().isOk()`
   - `jsonPath("$.location").value("https://mock.cloudinary/qr_uuid.png")`
   - `jsonPath("$.id").exists()`
   - DB: `SELECT * FROM naherb.media_assets WHERE id = ?` — có row với `type = 'QR'`, `url = 'https://mock...'`, `storage_path = 'naherb/qr_images/qr_uuid'`.

**Expected Result (PASS):** 200 + asset persisted với `type=QR`.
**Expected Result (FAIL):** `type` bị lưu là `OTHER` (bug), hoặc DB không có row (không persist).

**Current Status:** 🔴 Not written

---

### QR-CFG-TC-002 — Guest không upload được (401)

**Severity:** `HIGH`
**OWASP:** `A01:2021 — Broken Access Control`
**Feature Under Test:** `SecurityConfig` guard `/api/v1/admin/**`
**Test File:** cùng file với TC-001.
**TDD Phase:** 🔴 RED
**Condition Ref:** `QR-CFG-COND-002`
**Oracle Source:** `BR-11`, `SecurityConfig` line 160

**Test Steps:**
1. Act: `multipart("/api/v1/admin/media/upload").file(...)` — KHÔNG header `Authorization`.
2. Assert: `status().isUnauthorized()` (401).

**Current Status:** 🔴 Not written

---

### QR-CFG-TC-003 — Customer role không upload được (403)

**Severity:** `HIGH`
**OWASP:** `A01:2021`
**Feature Under Test:** `SecurityConfig` `hasRole('ADMIN')`
**Test File:** cùng file.
**TDD Phase:** 🔴 RED
**Condition Ref:** `QR-CFG-COND-003`

**Test Steps:**
1. Login customer, lấy JWT `role=USER`.
2. Act: upload với header `Authorization: Bearer <user-jwt>`.
3. Assert: `status().isForbidden()` (403).

**Current Status:** 🔴 Not written

---

### QR-CFG-TC-004 — File > 10MB bị reject

**Severity:** `MEDIUM`
**Feature Under Test:** `MediaService.uploadImage` validate `file.getSize() > 10 * 1024 * 1024`
**Test File:** cùng file.
**TDD Phase:** 🔴 RED
**Condition Ref:** `QR-CFG-COND-004`
**Oracle Source:** `MediaService.java` line 26

**Test Steps:**
1. Arrange: tạo `MockMultipartFile("file", "big.png", "image/png", new byte[10 * 1024 * 1024 + 1])`.
2. Act: upload với JWT admin.
3. Assert:
   - `status().isBadRequest()` (400)
   - `jsonPath("$.error").value(containsString("10MB"))`
   - Cloudinary mock **KHÔNG** được gọi (`verify(cloudinary, never()).uploader()`).
   - DB `media_assets` count không tăng.

**Current Status:** 🔴 Not written

---

### QR-CFG-TC-005 — File `.pdf` bị reject

**Severity:** `MEDIUM`
**Feature Under Test:** `MediaService.uploadImage` mime whitelist
**Test File:** cùng file.
**TDD Phase:** 🔴 RED
**Condition Ref:** `QR-CFG-COND-005`
**Oracle Source:** `MediaService.java` line 32-38

**Test Steps:**
1. Arrange: `MockMultipartFile("file", "doc.pdf", "application/pdf", ...)`.
2. Act: upload với admin JWT.
3. Assert:
   - `status().isBadRequest()` (400)
   - `jsonPath("$.error").value(containsString("Invalid file format"))`
   - Cloudinary mock KHÔNG được gọi.

**Current Status:** 🔴 Not written

---

### QR-CFG-TC-006 — PUT settings upsert đủ 5 bank key

**Severity:** `CRITICAL`
**Feature Under Test:** `SiteSettingService.saveSettings` + `PUT /api/admin/settings`
**Test File:** `naherb-api/src/test/java/vn/io/naherb/setting/AdminSettingsQrIntegrationTests.java`
**TDD Phase:** 🔴 RED
**Condition Ref:** `QR-CFG-COND-006`
**Oracle Source:** `EDS §5.3`, `ADR-017`

**Preconditions:** Bảng `site_settings` trống các bank key.

**Test Steps:**
1. Act: PUT `/api/admin/settings` body:
   ```json
   {
     "bankName": "TEST_BANK",
     "bankAccountName": "TEST OWNER",
     "bankAccountNumber": "9999888877",
     "bankQrImageUrl": "https://mock.cloudinary/qr.png",
     "bankQrMediaId": "550e8400-e29b-41d4-a716-446655440000"
   }
   ```
2. Assert:
   - `status().isOk()` + `jsonPath("$.success").value(true)`.
   - DB: `SELECT setting_key, setting_value FROM naherb.site_settings WHERE setting_key IN (...)` — trả đúng 5 row với value như payload.
3. Act lần 2: PUT với `bankName = "TEST_BANK_2"`.
4. Assert: DB chỉ có 1 row `bankName` với value mới → upsert đúng, không duplicate.

**Current Status:** 🔴 Not written

---

### QR-CFG-TC-007 — QrInstructionService đọc đủ 4 field cho order BANK_QR

**Severity:** `CRITICAL`
**Feature Under Test:** `QrInstructionService.buildFor(order)`
**Test File:** `naherb-api/src/test/java/vn/io/naherb/order/QrInstructionServiceTest.java`
**TDD Phase:** 🔴 RED
**Condition Ref:** `QR-CFG-COND-007`
**Oracle Source:** `QrInstructionService.java` line 41-58

**Preconditions:** Seed `FX-QR-005` (5 bank key). Order `FX-QR-008` với `paymentMethod=BANK_QR`, `orderCode="NAHERBS-TEST-001"`.

**Test Steps:**
1. Act: `qrInstructionService.buildFor(order)`.
2. Assert (return value):
   - `bankName` == `"TEST_BANK"`
   - `accountName` == `"TEST OWNER"`
   - `accountNumber` == `"9999888877"`
   - `qrImageUrl` == `<mock cloudinary url>`
   - `transferContent` == `"NAHERBS-TEST-001"`

**Extra scenario:**
3. Order với `paymentMethod=COD` → `buildFor` trả `null`.

**Current Status:** 🔴 Not written

---

### QR-CFG-TC-008 — Frontend delete old media khi upload mới

**Severity:** `MEDIUM`
**Feature Under Test:** `handleQrUpload` trong `AdminSettingsPage`
**Test File:** `naherb-web/src/app/admin/settings/__tests__/handleQrUpload.spec.ts`
**TDD Phase:** 🔴 RED
**Condition Ref:** `QR-CFG-COND-008`
**Oracle Source:** `ADR-018`, `EDS §11.2 Bước 3`

**Preconditions:**
- Mock `AXIOS_INSTANCE.post('/v1/admin/media/upload')` → resolve `{ location: "url-new", id: "id-new" }`.
- Mock `AXIOS_INSTANCE.delete(...)` → spy.
- Initial state: `bankQrMediaId = "id-old"`.

**Test Steps:**
1. Act: `await handleQrUpload(new File([...], "qr.png", { type: "image/png" }))`.
2. Assert:
   - `AXIOS_INSTANCE.post` được gọi 1 lần với path `/v1/admin/media/upload` và formData chứa `type=QR`.
   - State sau upload: `bankQrImageUrl = "url-new"`, `bankQrMediaId = "id-new"`.
   - `AXIOS_INSTANCE.delete` được gọi với path `/v1/admin/media/id-old`.
   - `showToast("Đã tải ảnh QR mới", "success")`.

**Edge case:**
3. Nếu `AXIOS_INSTANCE.delete` reject → chỉ `console.warn`, **không** rollback state upload mới, **không** toast error.

**Current Status:** 🔴 Not written

---

### QR-CFG-TC-101 — Empty state hiển thị dropzone

**Severity:** `MEDIUM`
**Feature Under Test:** `<QrPaymentConfigSection>` render (chưa có ảnh)
**Test File:** `naherb-web/src/components/admin/settings/__tests__/QrPaymentConfigSection.spec.tsx`
**TDD Phase:** 🔴 RED
**Condition Ref:** `QR-CFG-COND-010`
**Oracle Source:** `EDS §10.3`

**Test Steps:**
1. `render(<QrPaymentConfigSection {...defaultProps} settings={makeQrSettings({ bankQrImageUrl: "" })} />)`.
2. Assert:
   - Thấy text "Chọn ảnh QR".
   - Thấy text "PNG / JPG / WEBP, tối đa 10MB".
   - Không thấy nút "Đổi ảnh khác" / "Xoá ảnh".
   - `<input type="file" accept="image/png,image/jpeg,image/webp">` tồn tại (hidden).

**Current Status:** 🔴 Not written

---

### QR-CFG-TC-102 — Filled state hiển thị preview + 2 nút

**Severity:** `MEDIUM`
**Feature Under Test:** `<QrPaymentConfigSection>` render (đã có ảnh)
**Test File:** cùng file.
**TDD Phase:** 🔴 RED
**Condition Ref:** `QR-CFG-COND-011`
**Oracle Source:** `EDS §10.4`

**Test Steps:**
1. `render(<QrPaymentConfigSection {...defaultProps} settings={makeQrSettings({ bankQrImageUrl: "https://cdn.test/qr.png", bankName: "TEST_BANK", bankAccountName: "TEST OWNER", bankAccountNumber: "9999888877" })} />)`.
2. Assert:
   - `<img src="https://cdn.test/qr.png">` tồn tại.
   - Nút "Đổi ảnh khác" tồn tại.
   - Nút "Xoá ảnh" tồn tại và có class chứa `text-error-text`.
   - Preview panel bên phải hiển thị `"TEST_BANK"`, `"TEST OWNER"`, `"9999888877"`.

**Current Status:** 🔴 Not written

---

### QR-CFG-TC-103 — Chọn `.pdf` → toast error, không call API

**Severity:** `HIGH`
**Feature Under Test:** `handleQrUpload` client-side validation
**Test File:** cùng file `handleQrUpload.spec.ts`.
**TDD Phase:** 🔴 RED
**Condition Ref:** `QR-CFG-COND-012`

**Test Steps:**
1. Mock `AXIOS_INSTANCE.post` → spy.
2. Act: chọn file `new File(["x"], "doc.pdf", { type: "application/pdf" })`.
3. Assert:
   - `showToast` được gọi với `kind = "error"`.
   - `AXIOS_INSTANCE.post` KHÔNG được gọi.

**Ghi chú:** Client-side chỉ check qua `accept="image/*"` — bổ sung validate mime trong handler:

```ts
if (!file.type.startsWith("image/")) {
  showToast("Chỉ chấp nhận ảnh (PNG/JPG/WEBP)", "error");
  return;
}
```

**Current Status:** 🔴 Not written

---

### QR-CFG-TC-104 — Chọn file > 10MB → toast error, không call API

**Severity:** `HIGH`
**Feature Under Test:** `handleQrUpload` client-side validation
**Test File:** cùng file.
**TDD Phase:** 🔴 RED
**Condition Ref:** `QR-CFG-COND-013`
**Oracle Source:** `EDS §11.2 Bước 3`

**Test Steps:**
1. Mock `AXIOS_INSTANCE.post` → spy.
2. Act: chọn file `new File([new ArrayBuffer(10 * 1024 * 1024 + 1)], "big.png", { type: "image/png" })`.
3. Assert:
   - `showToast("Ảnh vượt quá 10MB", "error")`.
   - `AXIOS_INSTANCE.post` KHÔNG được gọi.

**Boundary:**
4. Chọn file `= 10 * 1024 * 1024` bytes → PHẢI upload được (không reject).

**Current Status:** 🔴 Not written

---

### QR-CFG-TC-105 — Save button PUT settings với đủ 5 bank key

**Severity:** `CRITICAL`
**Feature Under Test:** `AdminSettingsPage.handleSave`
**Test File:** `naherb-web/src/app/admin/settings/__tests__/AdminSettingsPage.payment-tab.spec.tsx`
**TDD Phase:** 🔴 RED
**Condition Ref:** `QR-CFG-COND-014`

**Preconditions:**
- Mock `AXIOS_INSTANCE.get('/admin/settings')` → resolve empty.
- Mock `AXIOS_INSTANCE.put('/admin/settings')` → spy.

**Test Steps:**
1. Render trang, mở tab `payment`.
2. Nhập:
   - "Tên ngân hàng" → `TEST_BANK`
   - "Tên chủ tài khoản" → `TEST OWNER`
   - "Số tài khoản" → `9999888877`
3. Mock upload success: `bankQrImageUrl` set thành `"https://cdn.test/qr.png"`, `bankQrMediaId = "id-1"`.
4. Click "Lưu thay đổi".
5. Assert: `AXIOS_INSTANCE.put` được gọi với path `/admin/settings` và body chứa **ít nhất** 5 key:
   ```json
   {
     "bankName": "TEST_BANK",
     "bankAccountName": "TEST OWNER",
     "bankAccountNumber": "9999888877",
     "bankQrImageUrl": "https://cdn.test/qr.png",
     "bankQrMediaId": "id-1"
   }
   ```
6. Assert toast: `showToast("Đã lưu cài đặt thành công!", "success")`.

**Current Status:** 🔴 Not written

---

### SECURITY TEST CASES

---

### QR-CFG-TC-SEC-001 — Public endpoint KHÔNG expose bank fields

**Severity:** `CRITICAL`
**OWASP:** `A01:2021 — Broken Access Control` / `A08:2021 — Software and Data Integrity Failures`
**CWE:** `CWE-200 — Exposure of Sensitive Information`
**Feature Under Test:** `SiteSettingController.getPublicSiteInfo`
**Test File:** `naherb-api/src/test/java/vn/io/naherb/setting/PublicSiteInfoIntegrationTests.java`
**TDD Phase:** 🔴 RED
**Condition Ref:** `QR-CFG-COND-009`
**Oracle Source:** `SiteSettingController.java` line 36-45 (publicKeys whitelist)

**Preconditions:** Seed đủ 5 bank key vào `site_settings` (`FX-QR-005`).

**Test Steps:**
1. Act: `GET /api/v1/settings/site-info` KHÔNG auth.
2. Assert:
   - `status().isOk()`.
   - Response body **KHÔNG chứa** bất kỳ key nào trong: `bankName`, `bankAccountName`, `bankAccountNumber`, `bankQrImageUrl`, `bankQrMediaId`.

**Expected Result (PASS = an toàn):** Response chỉ chứa keys trong whitelist (`store_*`), tuyệt đối không lộ số TK ngân hàng.
**Expected Result (FAIL = lỗ hổng):** Bất kỳ bank key nào xuất hiện trong response → **P0 incident** (rò rỉ thông tin tài khoản shop).

**Current Status:** 🔴 Not written

---

### QR-CFG-TC-SEC-002 — Non-admin không đọc được `/api/admin/settings`

**Severity:** `HIGH`
**OWASP:** `A01:2021`
**Feature Under Test:** `SecurityConfig` guard `/api/admin/**`
**Test File:** cùng file `AdminSettingsQrIntegrationTests.java`.
**TDD Phase:** 🔴 RED

**Test Steps:**
1. Act: `GET /api/admin/settings` với JWT customer role.
2. Assert: `status().isForbidden()` (403).

3. Act: `GET /api/admin/settings` KHÔNG auth.
4. Assert: `status().isUnauthorized()` (401).

**Current Status:** 🔴 Not written

---

### INTEGRATION E2E (Manual — không tự động)

### QR-CFG-TC-E2E-001 — Full flow: config → checkout → modal

**Severity:** `HIGH`
**Feature Under Test:** Toàn bộ luồng phase 5 + tương tác với phase checkout đã có
**Environment:** Local dev (`npm run dev` + `mvn spring-boot:run` + Supabase local hoặc test schema).

**Steps:**
1. Login admin → `/admin/settings` → tab "Thanh toán QR".
2. Điền 3 bank field + upload PNG `test_qr.png` → thấy preview.
3. Click "Lưu thay đổi" → toast success.
4. Refresh trang → dữ liệu vẫn còn (load từ DB).
5. Kiểm tra Cloudinary Dashboard → file có ở folder `naherb/qr_images/`.
6. Kiểm tra Supabase: `SELECT setting_key, setting_value FROM naherb.site_settings WHERE setting_key LIKE 'bank%';` → 5 row đúng.
7. Đăng nhập customer khác tab → thêm SP vào cart → `/gio-hang` → checkout BANK_QR → modal QR hiện đúng ảnh + bank info.
8. Vào lại admin, tab "Thanh toán QR" → click "Đổi ảnh khác" chọn PNG khác → Lưu → thấy Cloudinary có file mới, file cũ đã bị xoá.

**Expected:** Mọi bước đều thành công. Không có error 500 trong log backend, không có JS console error.

---

## 5. Red-Green-Refactor Tracker

| TC ID | Test File | 🔴 RED confirmed | 🟢 GREEN (commit) | 🔵 REFACTOR note |
|-------|-----------|-----------------|-------------------|------------------|
| `QR-CFG-TC-001` | `AdminQrMediaIntegrationTests.java` | [ ] | — | — |
| `QR-CFG-TC-002` | ditto | [ ] | — | — |
| `QR-CFG-TC-003` | ditto | [ ] | — | — |
| `QR-CFG-TC-004` | ditto | [ ] | — | — |
| `QR-CFG-TC-005` | ditto | [ ] | — | — |
| `QR-CFG-TC-006` | `AdminSettingsQrIntegrationTests.java` | [ ] | — | — |
| `QR-CFG-TC-007` | `QrInstructionServiceTest.java` | [ ] | — | (đã có sẵn service — chủ yếu test integration key mới) |
| `QR-CFG-TC-008` | `handleQrUpload.spec.ts` | [ ] | — | — |
| `QR-CFG-TC-101` | `QrPaymentConfigSection.spec.tsx` | [ ] | — | — |
| `QR-CFG-TC-102` | ditto | [ ] | — | — |
| `QR-CFG-TC-103` | `handleQrUpload.spec.ts` | [ ] | — | — |
| `QR-CFG-TC-104` | ditto | [ ] | — | — |
| `QR-CFG-TC-105` | `AdminSettingsPage.payment-tab.spec.tsx` | [ ] | — | — |
| `QR-CFG-TC-SEC-001` | `PublicSiteInfoIntegrationTests.java` | [ ] | — | — |
| `QR-CFG-TC-SEC-002` | `AdminSettingsQrIntegrationTests.java` | [ ] | — | — |

### 5.1 Red Gate Protocol

**Stub cho Red Phase (frontend):**

```typescript
// Trước khi implement — export stub throw
export const handleQrUpload = async (_file: File): Promise<never> => {
  throw new Error("Not implemented — Red Phase stub");
};

export function QrPaymentConfigSection(_props: QrPaymentConfigSectionProps): JSX.Element {
  throw new Error("Not implemented — Red Phase stub");
}
```

**Backend stub:** Vì `MediaController` / `SiteSettingController` **đã tồn tại**, Red Phase cho `QR-CFG-TC-001`..`007`, `SEC-*` chỉ cần đảm bảo test được viết **trước** khi thêm bất kỳ thay đổi phụ nào (vd: thêm key public whitelist thì SEC-001 sẽ báo lỗi).

**Red Gate Verification:**

| TC ID | Stub / Baseline | Expected | Actual | Note |
|-------|-----------------|----------|--------|------|
| `QR-CFG-TC-001` | Cloudinary mock chưa cấu hình | 🔴 FAIL (500) | ☐ | Sau khi mock → 🟢 |
| `QR-CFG-TC-101` | Stub throw | 🔴 FAIL | ☐ | |
| `QR-CFG-TC-105` | Chưa có tab payment | 🔴 FAIL (không tìm được tab) | ☐ | |
| `QR-CFG-TC-SEC-001` | Chưa seed data | 🔴 FAIL (không có key nào) | ☐ | Sau khi seed → 🟢 (whitelist đã đúng) |

> **Nếu bất kỳ test PASS bất thường trước implement:** Dừng lại, kiểm tra shared state / hallucinated import.

---

## 6. Entry / Exit Criteria

### Entry Criteria

- [x] EDS `NAHERB-QRCFG-IMP-005` đã review.
- [x] Cloudinary env vars có trong `.env.backend`.
- [x] `MediaType.QR` tồn tại trong enum (đã verify).
- [x] `SiteSettingController` `PUT /admin/settings` chạy được (đã có `AdminSettingsPage` tab general).
- [ ] `useToast()` context mount ở `AdminLayout`.

### Exit Criteria (Definition of Done)

- [ ] `mvn test -pl naherb-api` — toàn bộ integration tests (`AdminQrMediaIntegrationTests`, `AdminSettingsQrIntegrationTests`, `QrInstructionServiceTest`, `PublicSiteInfoIntegrationTests`) xanh.
- [ ] `npm test` (naherb-web) — component tests xanh, coverage `QrPaymentConfigSection.tsx` ≥ 80% lines.
- [ ] Không có `any` type trong `QrPaymentConfigSection.tsx` và `handleQrUpload`.
- [ ] Không log filename/base64/Cloudinary body ra stdout (grep `console.log` trong file mới → không có).
- [ ] Manual E2E `QR-CFG-TC-E2E-001` pass đủ 8 bước.
- [ ] `Prettier` + `ESLint` clean cho file mới.

**Exit bổ sung (CASE 2.0):**

- [ ] **Red Gate (§5.1)** — mọi TC frontend FAIL với stub trước khi implement.
- [ ] **Contract Existence** — mọi import trong test resolve:
  ```bash
  cd naherb-web && npx tsc --noEmit src/components/admin/settings/__tests__/*.spec.tsx
  ```
- [ ] **Props Isolation** — `QrPaymentConfigSection.spec.tsx` dùng `makeQrSettings()` factory, không share state.
- [ ] **Oracle Source** — mọi assert reference tới FR/BR/ADR trong TDS §3.2.

### Suspension Criteria

- Cloudinary API key thật hết hạn (không upload E2E được) → block E2E, unit/integration vẫn chạy được với mock.
- `useToast()` context bị lỗi → block frontend tests.

---

## 7. Rollback Plan

Vì phase này **không có schema migration**, rollback đơn giản:

```bash
# Frontend: revert commit
cd naherb-web
git revert <phase-5-frontend-commit-hash>
npm run build

# Backend: KHÔNG cần revert nếu chỉ thêm test — backend không có prod code mới.
# Nếu Cloudinary key đã đổi → khôi phục key cũ trong .env.backend.

# Data: nếu bankQrImageUrl mới hỏng, dev có thể update SQL trực tiếp:
UPDATE naherb.site_settings
SET setting_value = '<old-url>'
WHERE setting_key = 'bankQrImageUrl';
```

Gap vẫn OPEN → giữ nguyên entry trong `docs/backlog.md` (M5-01/02/03).

---

## 8. Anti-Pattern Detection

| AP-ID | Anti-Pattern | Dấu hiệu trong TDD spec | Check | Gate |
|-------|-------------|-------------------------|-------|------|
| AP-AI-001 | Unconstrained Generation | TC không reference EDS/ADR | ☐ | G-0 — mọi TC ref §3.3 |
| AP-AI-002 | Green-from-Birth | Test PASS với stub throw (§5.1) | ☐ | G-2 ★ |
| AP-AI-003 | Implicit Decision | Test assume endpoint mới không có trong EDS §7.2 | ☐ | G-1 |
| AP-AI-004 | Layer Violation | Test frontend gọi thẳng Cloudinary bypass backend | ☐ | G-4 |
| AP-AI-005 | Hallucinated Contract | Test import `QrConfigService` (không tồn tại — đúng ra là `SiteSettingService`) | ☐ | G-3 |

**Review checklist:**

- [ ] `QR-CFG-TC-001..007` bám vào endpoints thật trong `MediaController` / `SiteSettingController` (không tạo endpoint mới).
- [ ] `QR-CFG-TC-101..105` dùng `makeQrSettings()` factory — không mutate shared state.
- [ ] `QR-CFG-TC-SEC-001` verify whitelist thực sự chặn — không assert lỏng "response.body != null".
- [ ] Không có TC nào require production Cloudinary key.

| AP detected | TC ID | Mô tả | Fix action | Fixed? |
|------------|-------|-------|------------|--------|
| — | — | — | — | — |

---

## 9. Test file layout (đề xuất)

```
naherb-api/src/test/java/vn/io/naherb/
├── media/AdminQrMediaIntegrationTests.java             [NEW — TC-001..005]
├── setting/
│   ├── AdminSettingsQrIntegrationTests.java            [NEW — TC-006, TC-SEC-002]
│   └── PublicSiteInfoIntegrationTests.java             [NEW — TC-SEC-001]
└── order/QrInstructionServiceTest.java                 [NEW — TC-007]

naherb-api/src/test/resources/
└── media/test_qr.png                                    [NEW — FX-QR-001]

naherb-web/src/
├── app/admin/settings/__tests__/
│   ├── AdminSettingsPage.payment-tab.spec.tsx           [NEW — TC-105]
│   └── handleQrUpload.spec.ts                            [NEW — TC-008, TC-103, TC-104]
└── components/admin/settings/
    ├── QrPaymentConfigSection.tsx                       [NEW — production]
    └── __tests__/
        ├── QrPaymentConfigSection.spec.tsx              [NEW — TC-101, TC-102]
        └── factory.ts                                    [NEW — Props Isolation]
```

---

*TDD Spec v1.0 — NaHerbs Phase 5 (Admin QR Payment Config) — Tuấn Anh*
*Bám templates/PHASE-4_Test-Spec.md + EDS NAHERB-QRCFG-IMP-005.*
