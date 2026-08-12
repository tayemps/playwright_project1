# Enterprise Playwright TypeScript Framework

This workspace provides a modern Playwright starter setup for scalable UI automation with TypeScript, a Page Object Model (POM) structure, and production-oriented configuration.

## What is included

- Playwright config tuned for CI and local execution
- Parallel test execution by default
- HTML reporting and failure-only traces
- A clean POM-driven folder structure for maintainability
- Avoids hardcoded waits; prefer Playwright auto-waiting and explicit assertions

## Quick start

```bash
npm install
npx playwright install --with-deps
```

## Common commands

```bash
npm run test
npm run test:headed
npm run test:debug
npm run test:ui
npm run report
```

## Environment variables

```bash
RPINSYS_BASE_URL="http://ostest.rpinsys.com/login"
RPINSYS_TEST_USER="<username>"
RPINSYS_TEST_PASS="<password>"
PW_WORKERS=4
```

## Recommended practices

- Use locators instead of CSS selectors when possible.
- Prefer `expect(...).toBeVisible()` and `toHaveText()` over manual waits.
- Keep page interactions inside page objects and test logic in spec files.
- Reuse fixtures and utility helpers rather than duplicating setup.

## POM folder structure

```text
src/
  pages/
    base/
      BasePage.ts
    auth/
      LoginPage.ts
    app/
      HomePage.ts
  fixtures/
    test-fixtures.ts
  utils/
    helpers.ts
tests/
  e2e/
    example.spec.ts
```

## Notes

The Playwright configuration intentionally uses environment-driven workers and CI-aware retries while keeping the default execution model modern and scalable.
