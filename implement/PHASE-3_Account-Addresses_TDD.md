# TEST-DRIVEN DEVELOPMENT SPECIFICATION
# NaHerbs — Phase 3 (Customer Addresses)

**Document ID:** `NAHERB-ADDRESS-TDD-003`
**Version:** `1.0`
**Date:** `2026-06-30`
**Spec gốc:** `NAHERB-ADDRESS-IMP-003`
**Depends on:** `NAHERB-PROFILE-TDD-002`

---

## CHANGELOG

| Ngày | Người | Nội dung |
|------|-------|----------|
| 2026-06-30 | Tuấn Anh | Khởi tạo TDD Phase 3 |

---

## 1. Logic Issues Resolved

| # | Spec / giả định | Thực tế | Fix |
|---|-----------------|---------|-----|
| L1 | Entity thiếu `note` | OpenAPI có `note` | Thêm cột `note` vào `AccountAddress` |
| L2 | Field names khác OpenAPI | `provinceName` vs `provinceCity` | `AccountAddressMapper` |
| L3 | FK khi cleanup test | `account_addresses` → `accounts` | Xóa addresses trước profiles/accounts |

---

## 2. Test Conditions

| ID | Condition | Test Cases |
|----|-----------|------------|
| TC-COND-020 | GET list không auth → 401 | `ADR-TC-001` |
| TC-COND-021 | POST tạo địa chỉ đầu → default | `ADR-TC-002` |
| TC-COND-022 | CRUD + PATCH default + DELETE | `ADR-TC-002` |
| TC-COND-023 | PUT address của user khác → 404 | `ADR-TC-003` |

---

## 3. Test Cases

### ADR-TC-001 — List requires auth

**File:** `AccountAddressIntegrationTests.java`  
**Status:** 🟢 GREEN

### ADR-TC-002 — Full address lifecycle

**Steps:** create (default) → create second (isDefault) → list → put → patch default → delete → remaining default  
**Status:** 🟢 GREEN

### ADR-TC-003 — Cross-account isolation

**Steps:** User A tạo address; User B PUT cùng `addressId` → 404  
**Status:** 🟢 GREEN

---

## 4. Red-Green Tracker

| TC ID | 🔴 RED | 🟢 GREEN |
|-------|--------|----------|
| `ADR-TC-001` | [x] | [x] |
| `ADR-TC-002` | [x] | [x] |
| `ADR-TC-003` | [x] | [x] |

---

## 5. Exit Criteria

- [x] `mvn test` — 15 tests pass
- [x] 5 endpoints checklist ticked
- [x] Mapper khớp OpenAPI field names
- [ ] Tech Lead review

---

*TDD Spec v1.0 — NaHerbs Phase 3 — Tuấn Anh*
