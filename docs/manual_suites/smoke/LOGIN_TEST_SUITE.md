# Login Test Suite - Smoke Tests

## Overview
This document provides smoke test cases for login functionality. Smoke tests are quick, focused tests that verify critical functionality works end-to-end. These tests run fast and provide confidence that the basic login flow is not broken.

---

## Test Environment Setup

**Application URL:** `${BASE_URL}/login`
**Browser:** Chrome (primary for smoke tests)
**OS:** Cross-platform (Windows, macOS, Linux)
**Test Data Source:** Environment variables

**Smoke Test Characteristics:**
- ⚡ Fast execution (< 5 seconds per test)
- 🎯 Critical path only
- 🔧 Minimal setup/teardown
- ✅ P0 priority scenarios
- 🚫 No edge cases or security deep-dives


---

## Smoke Test Cases

### Smoke Test 1: Should Log In and Verify Dashboard with Valid Credentials
**Priority:** P0 (Critical)
**Description:** Verify user can login with valid credentials and reach dashboard
**Execution Time:** ~2 seconds

**Test Conditions:**
- Username: `wanhasyraf` (from env: RPINSYS_TEST_USER)
- Password: `abc123` (from env: RPINSYS_TEST_PASS)
- Base URL: Must be set in env (RPINSYS_BASE_URL)

**Steps:**
1. Create LoginPage instance with page object
2. Call `loginPage.open()` - Navigate to login page and wait for username input
3. Call `loginPage.login(username, password)` - Fill credentials and click login button
4. Call `loginPage.expectSuccessfulLogin()` - Verify successful login

**Expected Results:**
- Username field is filled with correct credentials
- Password field is filled with correct credentials
- Login button is clicked
- Browser waits for network idle state
- URL changes to `/dashboard`
- Welcome heading "Selamat Datang" is visible
- Login succeeds without errors


---

## Test Execution Guidelines

### Quick Setup:
```bash
# Set environment variables
$env:RPINSYS_BASE_URL = "https://yourapp.com"
$env:RPINSYS_TEST_USER = "wanhasyraf"
$env:RPINSYS_TEST_PASS = "abc123"
```

### Run Smoke Tests:
```bash
# Run the smoke login test
npx playwright test tests/smoke/login.spec.ts

# Run with headed browser (see the browser)
npx playwright test tests/smoke/login.spec.ts --headed

# Run with trace (for debugging)
npx playwright test tests/smoke/login.spec.ts --trace on
```

### Expected Execution Time:
- Total execution time: ~2-5 seconds (1 test)
- Ideal for CI/CD pipelines and quick sanity checks
- Fast feedback on critical login functionality

---

## Smoke Test vs Full Regression

| Aspect | Smoke Test | Regression Test |
|--------|-----------|-----------------|
| **Execution Time** | ~2-5 seconds | 5-10 minutes |
| **Test Cases** | 1 critical | 20+ comprehensive |
| **Frequency** | Every build | Nightly/Weekly |
| **Purpose** | Quick sanity check | Deep validation |
| **Coverage** | Happy path only | All scenarios |
| **Defects Found** | Critical blockers | Edge cases |

---

## Sign-Off & Approval

| Role | Name | Date | Signature |
|------|------|------|-----------|
| QA Lead | ________ | ________ | ________ |
| Dev Lead | ________ | ________ | ________ |
| Product Manager | ________ | ________ | ________ |

---

## Document Version History

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 2.1 | 2026-08-17 | QA Team | Updated to match actual test script (1 test case only) |
| 2.0 | 2026-08-17 | QA Team | Converted to smoke test format |
| 1.0 | 2026-08-17 | QA Team | Initial comprehensive test suite created |

