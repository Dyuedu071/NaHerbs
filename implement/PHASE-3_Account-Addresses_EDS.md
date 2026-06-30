# ENGINEERING DOCUMENTATION STANDARD (EDS) v2.0
# NaHerbs — Phase 3 (Customer Addresses)

| Field | Value |
|-------|-------|
| **Document ID** | `NAHERB-ADDRESS-IMP-003` |
| **Version** | `1.0` |
| **Date** | `2026-06-30` |
| **Status** | `In Review` |
| **Document Owner** | Tuấn Anh |
| **Author** | Tuấn Anh — Backend Developer |
| **Depends on** | `NAHERB-FOUNDATION-IMP-001`, `NAHERB-PROFILE-IMP-002` |

---

## CHANGELOG

| Ngày | Người thực hiện | Nội dung thay đổi |
|------|-----------------|-------------------|
| 2026-06-30 | Tuấn Anh | Tạo tài liệu Phase 3 — Customer Addresses |
| 2026-06-30 | Tuấn Anh | Thêm cột `note` vào entity; mapper OpenAPI ↔ JPA |

---

## 1. Tổng quan Module

| Field | Value |
|-------|-------|
| **Module Name** | `Customer Addresses` |
| **Bounded Context** | `Account` |
| **Data Classification** | `PII` |
| **Downstream Consumers** | Checkout (`POST /checkout` — Hoàng), account UI |

**Mô hình địa chỉ Việt Nam (2 cấp):** `provinceCity` + `wardCommune` + `addressDetail` — **không có quận/huyện**.

---

## 2. Ma trận Truy vết

| Requirement ID | Mô tả | Thành phần Code | ADR |
|----------------|-------|-----------------|-----|
| CHECKLIST | `GET /account/addresses` | `AccountAddressController.list` | — |
| CHECKLIST | `POST /account/addresses` | `createAddress` | ADR-007 |
| CHECKLIST | `PUT /account/addresses/{id}` | `updateAddress` | — |
| CHECKLIST | `DELETE /account/addresses/{id}` | `deleteAddress` | ADR-008 |
| CHECKLIST | `PATCH .../default` | `setDefaultAddress` | ADR-007 |
| OpenAPI | Field mapping | `AccountAddressMapper` | ADR-009 |

---

## 3. Architecture Decision Records

### ADR-007 — Quy tắc địa chỉ mặc định

- Địa chỉ **đầu tiên** của account luôn `isDefault=true`.
- Khi tạo/cập nhật với `isDefault=true` → unset các địa chỉ default khác.
- `PATCH .../default` → set một địa chỉ làm default duy nhất.

### ADR-008 — Xóa địa chỉ default

Khi xóa địa chỉ đang default và còn địa chỉ khác → promote địa chỉ **cũ nhất** (`createdAt` min) lên default.

### ADR-009 — Entity ↔ OpenAPI field mapping

| OpenAPI | JPA column |
|---------|------------|
| `provinceCity` | `province_name` |
| `wardCommune` | `ward_name` |
| `addressDetail` | `address_line` |
| `email` | `receiver_email` |
| `note` | `note` (cột mới) |

---

## 4. API Specification

| Method | Path | Auth | CSRF | Status |
|--------|------|------|------|--------|
| `GET` | `/api/account/addresses` | JWT | — | 200 |
| `POST` | `/api/account/addresses` | JWT | ✅ | 201 |
| `PUT` | `/api/account/addresses/{addressId}` | JWT | ✅ | 200 |
| `DELETE` | `/api/account/addresses/{addressId}` | JWT | ✅ | 200 |
| `PATCH` | `/api/account/addresses/{addressId}/default` | JWT | ✅ | 200 |

**Ownership:** Mọi thao tác dùng `findByIdAndAccount_Id` — address không thuộc account → **404**.

---

## 5. Static Modeling

```
vn.io.naherb.account/
├── AccountAddressController
├── AccountAddressService
├── AccountAddressRepository
├── AccountAddressMapper
├── AccountAddress (entity)
└── dto/
    ├── AccountAddressResponse
    └── UpsertAddressRequest
```

---

## 6. Bảng mã lỗi

| Code | HTTP | Message (VI) |
|------|------|--------------|
| `ADR-001` | 400 | Dữ liệu không hợp lệ |
| `ADR-002` | 401 | Chưa đăng nhập |
| `ADR-003` | 404 | Không tìm thấy địa chỉ |

---

## 7. Authorization Matrix

| Endpoint | GUEST | USER (own) |
|----------|-------|------------|
| Tất cả `/api/account/addresses/**` | ❌ | ✅ own only |

---

## 8. Verification

```bash
curl -b cookies.txt http://localhost:8080/api/account/addresses

curl -b cookies.txt -X POST http://localhost:8080/api/account/addresses \
  -H "Content-Type: application/json" \
  -H "X-XSRF-TOKEN: <csrf>" \
  -d '{"receiverName":"Tuấn Anh","receiverPhone":"0901234567","provinceCity":"TP. HCM","wardCommune":"P. Bến Nghé","addressDetail":"123 Nguyễn Huệ"}'
```

---

## PHỤ LỤC

| Document | Path |
|----------|------|
| Phase 2 Profile | `implement/PHASE-2_Account-Profile_EDS.md` |
| Phase 3 TDD | `implement/PHASE-3_Account-Addresses_TDD.md` |
| OpenAPI | `docs/openapi.yml` — `AccountAddress`, `UpsertAddressRequest` |

---

*EDS v2.0 — NaHerbs Phase 3 — Tuấn Anh*
