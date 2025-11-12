# Tests

This directory contains all automated tests for the Copilot Premium Usage Analyzer.

## Directory Structure

### `acceptance/` - End-to-End Acceptance Tests
Golden master tests that verify the entire application workflow:
- **golden-master.spec.js** - Main acceptance test suite
  - Dashboard rendering with sample data
  - Validation error handling
  - Capacity-only mode
- **fixtures/** - Test data files
  - `sample_premiumRequestUsageReport.csv` - Sample CSV for testing
- **golden-master.spec.js-snapshots/** - Visual regression test snapshots

**Run acceptance tests:**
```bash
npm test tests/acceptance
```

### `unit/` - Unit Tests
Focused tests for individual components:
- **app.spec.js** - JavaScript function unit tests
  - `calculateMetrics()` function
  - `checkInputs()` validation
  - Productivity calculations
  - Currency formatting
- **styles.spec.js** - CSS integration tests
  - Stylesheet loading verification
  - Responsive design behavior
  - Style application validation

**Run unit tests:**
```bash
npm test tests/unit
```

## Running All Tests

```bash
npm test
```

## Test Framework

- **Playwright** - Modern end-to-end testing
- All tests run in Chromium browser
- http-server provides local test environment on port 8080
