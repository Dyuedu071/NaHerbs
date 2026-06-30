# TEST-DRIVEN DEVELOPMENT SPECIFICATION
# NaHerbs — Phase 2 (Customer Profile)

**Document ID:** `NAHERB-PROFILE-TDD-002`
**Version:** `1.0`
**Date:** `2026-06-30`
**Status:** `In Review`
**Author:** Tuấn Anh — Backend Developer
**Spec gốc:** `NAHERB-PROFILE-IMP-002`
**Depends on:** `NAHERB-FOUNDATION-TDD-001`

---

## CHANGELOG

| Ngày | Người thực hiện | Nội dung |
|------|-----------------|----------|
| 2026-06-30 | Tuấn Anh | Khởi tạo TDD Phase 2 |
| 2026-06-30 | Tuấn Anh | Tham chiếu Phase 3 Addresses |

---

## 1. Logic Issues Resolved

| # | Spec / giả định | Thực tế | Fix trong test |
|---|-----------------|---------|----------------|
| L1 | JWT `sub` = accountId UUID | `JwtService` dùng email làm `sub` | `CurrentAccountHelper` lookup qua `AccountRepository` |
| L2 | `deleteAll()` accounts | FK từ profiles, carts | Xóa cart → profile → account trong `@BeforeEach` |
| L3 | Rate limit login 3/phút | Nhiều login trong suite test | `application.properties` test: capacity=1000 |

---

## 2. Test Conditions

| ID | Condition | Test Cases |
|----|-----------|------------|
| TC-COND-010 | GET profile không auth → 401 | `PRF-TC-001` |
| TC-COND-011 | GET profile sau login → 200 envelope | `PRF-TC-002` |
| TC-COND-012 | PUT profile cập nhật fields | `PRF-TC-003` |
| TC-COND-013 | PUT sync `/auth/me` name | `PRF-TC-003` |
| TC-COND-014 | PUT phone trùng → 409 | `PRF-TC-004` |
| TC-COND-015 | PUT fullName rỗng → 400 | `PRF-TC-005` |
| TC-COND-016 | `requireAccountId` từ email JWT | `FND-TC-003` |

---

## 3. Test Case Specification

### FND-TC-003 — CurrentAccountHelper email → UUID

**Test File:** `security/CurrentAccountHelperTests.java`
**Status:** 🟢 GREEN

---

### PRF-TC-001 — GET profile requires auth

**Test File:** `AccountProfileIntegrationTests.java`
**Steps:** `GET /api/account/profile` không cookie → 401
**Status:** 🟢 GREEN

---

### PRF-TC-002 — GET profile returns ApiResponse

**Test File:** `AccountProfileIntegrationTests.getAndUpdateProfileForAuthenticatedCustomer`
**Oracle:** `openapi.yml AccountProfile`, `success=true`, `fullName`, `contactEmail`
**Status:** 🟢 GREEN

---

### PRF-TC-003 — PUT profile updates and syncs auth/me

**Test File:** `AccountProfileIntegrationTests.getAndUpdateProfileForAuthenticatedCustomer`
**Steps:**
1. Login → GET profile
2. PUT với CSRF + cookies
3. GET `/api/auth/me` → `name` = fullName mới

**Status:** 🟢 GREEN

---

### PRF-TC-004 — Duplicate phone conflict

**Test File:** `AccountProfileIntegrationTests.updateProfileRejectsDuplicatePhone`
**Expected:** 409, message `Số điện thoại đã được sử dụng`
**Status:** 🟢 GREEN

---

### PRF-TC-005 — Validation fullName required

**Test File:** `AccountProfileIntegrationTests.updateProfileValidatesRequiredFullName`
**Expected:** 400
**Status:** 🟢 GREEN

---

## 4. Red-Green-Refactor Tracker

| TC ID | Test File | 🔴 RED | 🟢 GREEN |
|-------|-----------|--------|----------|
| `PRF-TC-001` | `AccountProfileIntegrationTests` | [x] | [x] |
| `PRF-TC-002` | `AccountProfileIntegrationTests` | [x] | [x] |
| `PRF-TC-003` | `AccountProfileIntegrationTests` | [x] | [x] |
| `PRF-TC-004` | `AccountProfileIntegrationTests` | [x] | [x] |
| `PRF-TC-005` | `AccountProfileIntegrationTests` | [x] | [x] |
| `FND-TC-003` | `CurrentAccountHelperTests` | [x] | [x] |

---

## 5. Exit Criteria

- [x] `mvn test` — 12 tests pass
- [x] `GET/PUT /api/account/profile` khớp OpenAPI
- [x] Checklist tick profile endpoints
- [ ] Tech Lead review

---

## 6. Verification Samples

```bash
# 1. Login (lưu cookie)
curl -c cookies.txt -b cookies.txt -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -H "X-XSRF-TOKEN: <csrf>" \
  -d '{"email":"user@naherb.vn","password":"password123"}'

# 2. GET profile
curl -b cookies.txt http://localhost:8080/api/account/profile

# 3. PUT profile
curl -b cookies.txt -X PUT http://localhost:8080/api/account/profile \
  -H "Content-Type: application/json" \
  -H "X-XSRF-TOKEN: <csrf>" \
  -d '{"fullName":"Tuấn Anh","phone":"0901234567"}'
```

---

*TDD Spec v1.0 — NaHerbs Phase 2 — Tuấn Anh*
