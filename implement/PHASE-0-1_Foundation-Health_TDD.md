# TEST-DRIVEN DEVELOPMENT SPECIFICATION
# NaHerbs — Phase 0 (Foundation) + Phase 1 (Health)

**Document ID:** `NAHERB-FOUNDATION-TDD-001`
**Version:** `1.0`
**Date:** `2026-06-30`
**Status:** `In Review`
**Standard:** ISO/IEC/IEEE 29119-3:2021
**Author:** Tuấn Anh — Backend Developer
**Reviewed by:** `[ ] Tech Lead — Pending`
**DPO Sign-off:** `N/A` *(Public data only)*
**Approved by:** `[ ] Pending`
**Classification:** `Internal`

**References:**
- `docs/srs.md` — §3.2 API response format
- `implement/PHASE-0-1_Foundation-Health_EDS.md` — NAHERB-FOUNDATION-IMP-001
- `docs/openapi.yml` — `ApiResponseHealth`, `GET /health`
- `api_endpoints_checklist.md` — Health (@TuanAnh)
- `naherb-api/src/test/java/vn/io/naherb/AuthFlowIntegrationTests.java` — test pattern

> **Quy ước TDD:** Viết test Java trước → `mvn test` FAIL 🔴 → implement → PASS 🟢.
> Test stack: JUnit 5, Spring Boot Test, MockMvc, H2 in-memory.
> Không dùng PII thật — email test: `health-test@naherb.vn`.

---

## CHANGELOG

| Ngày | Người thực hiện | Nội dung thay đổi |
|------|-----------------|-------------------|
| 2026-06-30 | Tuấn Anh | Khởi tạo TDD spec Phase 0 + Phase 1 |
| 2026-06-30 | Tuấn Anh | Cập nhật FND-TC-002: JWT subject = email; tham chiếu Phase 2 |

---

## 1. Thông tin Module

| Field | Value |
|-------|-------|
| **Feature / Gap ID** | `GAP-FOUNDATION-001` |
| **Module** | `Foundation + Health` |
| **Spec gốc** | `NAHERB-FOUNDATION-IMP-001` |
| **Priority** | 🔴 P0 |
| **Sprint** | `S1 (2026-06-30 → 2026-07-11)` |
| **Milestone** | `M1-01 — App chạy local, /health OK` |
| **Data Classification** | `Public` |
| **Compliance Scope** | `N/A` |
| **Upstream Dependencies** | Spring Actuator, SecurityConfig |
| **Downstream Consumers** | Profile, Address, Chatbot modules (Tuấn Anh) |

### 1.1 AI Generation Context (CASE 2.0)

| Field | Value |
|-------|-------|
| **AI Assisted?** | `Yes` |
| **Constraint Source** | `NAHERB-FOUNDATION-IMP-001 §17` |
| **Constraints Injected** | ApiResponse envelope, `/api/health` public, HealthEndpoint delegate |
| **Model** | Cursor Agent |
| **Trust Level** | `T2 → T3 (pending Red Gate)` |

---

## 2. Logic Issues Resolved

| # | Spec gốc (sai / thiếu) | Thực tế (codebase) | Fix áp dụng trong test |
|---|------------------------|-------------------|------------------------|
| L1 | SRS API base `/api/v1` | `AuthController` dùng `/api/auth`, Orval base `.../api` | Test gọi `GET /api/health` |
| L2 | OpenAPI path `/health` on server `/api/v1` | `api-client.ts` baseURL `/api` | Full path `/api/health` |
| L3 | Actuator tại `/api/v1/health` | Custom endpoint cần format `ApiResponseHealth` | Test assert envelope, không assert actuator raw JSON |
| L4 | `AuthController` không dùng `ApiResponse` | Legacy DTO trực tiếp | Chỉ Health dùng envelope; không test auth format |

---

## 3. Test Design Specification (TDS)

### TDS-01 — Scope

```
naherb-api Phase 0–1:
├── common/response/ApiResponse.java       (unit: factory methods)
├── security/CurrentAccountHelper.java     (unit: JWT subject → UUID)
├── config/SecurityConfig.java             (integration: permitAll)
├── health/HealthController.java           (integration: MockMvc)
└── health/HealthService.java              (unit: mock HealthEndpoint)
```

### TDS-02 — Test Basis

| Source | Items Derived |
|--------|--------------|
| `SRS.md` §3.2 | Response `{ success, message, data, errors }` |
| `openapi.yml` `ApiResponseHealth` | `data.status` = `"UP"` |
| `EDS §17 C3` | Health không cần JWT |
| `M1-01` backlog | Health endpoint OK local |

### TDS-03 — Test Conditions

| Condition ID | Test Condition | Coverage Item | Test Cases |
|-------------|---------------|---------------|------------|
| TC-COND-001 | Anonymous GET health → 200 | `HealthController.getHealth()` | `HLT-TC-001` |
| TC-COND-002 | Body khớp ApiResponse envelope | JSON schema | `HLT-TC-002` |
| TC-COND-003 | `data.status` là UP khi app healthy | `HealthService.resolveStatus()` | `HLT-TC-003` |
| TC-COND-004 | ApiResponse.ok() tạo success=true | `ApiResponse.ok()` | `FND-TC-001` |
| TC-COND-005 | CurrentAccountHelper parse JWT subject | `CurrentAccountHelper` | `FND-TC-002` |

### TDS-04 — Test Techniques

| Technique | Applied To | Rationale |
|-----------|------------|-----------|
| Equivalence Partitioning | Auth vs no-auth on `/api/health` | Chỉ 1 partition hợp lệ: no auth |
| Boundary Value | `errors` array | Phải empty `[]` on success |
| Error Guessing | Gọi `/api/account/profile` không JWT → 401 | Verify security vẫn hoạt động |

### TDS-05 — Test Data Requirements

| Fixture ID | Type | Value | Mục đích |
|-----------|------|-------|---------|
| `FX-001` | env | H2 in-memory (`application.properties` test) | Integration tests |
| `FX-002` | JWT | `sub` = UUID string | CurrentAccountHelper unit test |
| `FX-003` | Mock | `HealthEndpoint` → Status.UP | HealthService unit test |

---

## 4. Test Case Specification

### Props Isolation Pattern (Java)

```java
// Mỗi @Test độc lập — không shared mutable state giữa tests
// Database: @BeforeEach clean nếu cần (Health không cần DB seed)

private static final UUID TEST_ACCOUNT_ID =
    UUID.fromString("550e8400-e29b-41d4-a716-446655440000");
```

---

### FND-TC-001 — ApiResponse.ok() factory

**Severity:** `HIGH`
**Feature Under Test:** `ApiResponse.ok(T data)`
**Test File:** `naherb-api/src/test/java/vn/io/naherb/common/response/ApiResponseTests.java`
**TDD Phase:** 🟢 GREEN
**Condition Ref:** `TC-COND-004`
**Oracle Source:** `SRS §3.2`, `openapi.yml ApiResponse`

**Preconditions:** None

**Test Steps:**
1. Gọi `ApiResponse.ok(Map.of("status", "UP"))`
2. Assert `success == true`, `message == "OK"`, `data` not null, `errors` empty

**Expected Result (PASS):**
- `success=true`, `message="OK"`, `errors.isEmpty()`

**Current Status:** 🟢 Implemented

---

### FND-TC-002 — CurrentAccountHelper requireAccountId

**Severity:** `HIGH`
**Feature Under Test:** `CurrentAccountHelper.requireAccountEmail()`, `requireAccountId()`
**Test File:** `naherb-api/src/test/java/vn/io/naherb/security/CurrentAccountHelperTests.java`
**Oracle Source:** `EDS ADR-006`, `JwtService` subject = email

**Expected:** `requireAccountEmail` trả email; `requireAccountId` lookup `AccountRepository` → UUID

**Current Status:** 🟢 Implemented (cập nhật Phase 2)

---

### HLT-TC-001 — GET /api/health without authentication

**Severity:** `CRITICAL`
**Feature Under Test:** `GET /api/health`
**Test File:** `naherb-api/src/test/java/vn/io/naherb/HealthControllerTests.java`
**TDD Phase:** 🟢 GREEN
**Condition Ref:** `TC-COND-001`
**Oracle Source:** `openapi.yml GET /health`, `EDS §9`

**Preconditions:**
- `@SpringBootTest` + `@AutoConfigureMockMvc`
- `@Import(InMemoryTokenStoreTestConfig.class)`

**Test Steps:**
1. `mockMvc.perform(get("/api/health"))`
2. Assert status 200
3. Assert `$.success` = true
4. Assert `$.data.status` = "UP"

**Expected Result (PASS):** HTTP 200, envelope đúng

**Expected Result (FAIL):** 401/403 → SecurityConfig chưa permitAll

**Current Status:** 🟢 Implemented

---

### HLT-TC-002 — Health response errors array empty

**Severity:** `MEDIUM`
**Feature Under Test:** `GET /api/health` response shape
**Test File:** `HealthControllerTests.java`
**TDD Phase:** 🟢 GREEN
**Condition Ref:** `TC-COND-002`

**Test Steps:**
1. GET `/api/health`
2. Assert `$.errors` is array, size 0

**Current Status:** 🟢 Implemented

---

### HLT-TC-003 — HealthService delegates to Actuator

**Severity:** `HIGH`
**Feature Under Test:** `HealthService.resolveStatus()`
**Test File:** `naherb-api/src/test/java/vn/io/naherb/health/HealthServiceTests.java`
**TDD Phase:** 🟢 GREEN
**Condition Ref:** `TC-COND-003`
**Oracle Source:** `EDS ADR-002`

**Preconditions:** Mock `HealthEndpoint.health()` → Status.UP

**Test Steps:**
1. Mock endpoint returns UP
2. Call `resolveStatus()`
3. Assert returns `"UP"`

**Current Status:** 🟢 Implemented

---

### SEC-TC-001 — Protected route still requires auth

**Severity:** `CRITICAL`
**OWASP:** `A01:2021 — Broken Access Control`
**Feature Under Test:** `SecurityConfig` — regression
**Test File:** `HealthControllerTests.java`
**TDD Phase:** 🟢 GREEN

**Test Steps:**
1. `GET /api/auth/me` without cookies/JWT
2. Assert status 401

**Expected Result (PASS):** 401 — chỉ health được public, không làm hỏng security

**Current Status:** 🟢 Implemented

---

## 5. Red-Green-Refactor Tracker

| TC ID | Test File | 🔴 RED | 🟢 GREEN | 🔵 REFACTOR |
|-------|-----------|--------|----------|-------------|
| `FND-TC-001` | `ApiResponseTests.java` | `[x]` | `[x]` | — |
| `FND-TC-002` | `CurrentAccountHelperTests.java` | `[x]` | `[x]` | — |
| `HLT-TC-001` | `HealthControllerTests.java` | `[x]` | `[x]` | — |
| `HLT-TC-002` | `HealthControllerTests.java` | `[x]` | `[x]` | — |
| `HLT-TC-003` | `HealthServiceTests.java` | `[x]` | `[x]` | — |
| `SEC-TC-001` | `HealthControllerTests.java` | `[x]` | `[x]` | — |

### 5.1 Red Gate Protocol

**Stub cho Red Phase (đã vượt qua):**

```java
// HealthController red stub
@GetMapping
public ApiResponse<HealthStatusData> getHealth() {
    throw new UnsupportedOperationException("Not implemented — Red Phase stub");
}
```

**Red Gate Verification:** Tất cả HLT/FND tests FAIL trước khi implement → **GATE-2 PASS**

---

## 6. Entry / Exit Criteria

### Entry Criteria

- [x] EDS `NAHERB-FOUNDATION-IMP-001` drafted
- [x] Logic Issues (§2) confirmed
- [x] H2 test profile sẵn có

### Exit Criteria (DoD)

- [x] `mvn test` — tất cả tests xanh
- [x] `GET /api/health` khớp OpenAPI envelope
- [x] `SecurityConfig` permit health public
- [x] `api_endpoints_checklist.md` tick Health
- [ ] Tech Lead review EDS/TDD

---

## 7. Rollback Plan

```bash
git checkout -- naherb-api/src/main/java/vn/io/naherb/common/
git checkout -- naherb-api/src/main/java/vn/io/naherb/health/
git checkout -- naherb-api/src/main/java/vn/io/naherb/security/CurrentAccountHelper.java
git checkout -- naherb-api/src/main/java/vn/io/naherb/config/SecurityConfig.java
git checkout -- naherb-api/src/test/java/vn/io/naherb/health/
git checkout -- naherb-api/src/test/java/vn/io/naherb/common/
git checkout -- naherb-api/src/test/java/vn/io/naherb/security/CurrentAccountHelperTests.java
mvn test
```

---

## 8. CASE 2.0 Anti-Pattern Detection

| AP-ID | Check | Result |
|-------|-------|--------|
| AP-AI-001 | TC reference EDS constraints | ✅ |
| AP-AI-002 | Tests FAIL trước implement | ✅ |
| AP-AI-003 | ADR-001/002/003 documented | ✅ |
| AP-AI-004 | Controller không chứa business logic | ✅ |
| AP-AI-005 | Imports resolve trong codebase | ✅ |

---

*TDD Spec v1.0 — NaHerbs Phase 0 + Phase 1 — Tuấn Anh*
