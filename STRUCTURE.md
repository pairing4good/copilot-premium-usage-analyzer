# Project Structure

```
copilot-premium-usage-analyzer/
├── index.html                      # Main application entry point (kept at root)
│
├── src/                            # Source files (assets loaded by index.html)
│   ├── app.js                      # JavaScript application logic
│   ├── styles.css                  # CSS stylesheet
│   ├── favicon.svg                 # Application icon
│   └── README.md                   # Documentation for source files
│
├── tests/                          # All test files
│   ├── acceptance/                 # End-to-end acceptance tests
│   │   ├── golden-master.spec.js   # Main E2E test suite
│   │   ├── fixtures/               # Test data files
│   │   │   └── sample_premiumRequestUsageReport.csv
│   │   └── golden-master.spec.js-snapshots/  # Visual regression snapshots
│   │
│   ├── unit/                       # Unit tests for components
│   │   ├── app.spec.js             # JavaScript function tests
│   │   └── styles.spec.js          # CSS integration tests
│   │
│   └── README.md                   # Documentation for tests
│
├── screenshots/                    # Marketing/documentation images
│
├── .github/                        # GitHub Actions workflows
│   └── workflows/
│       └── playwright.yml          # CI/CD pipeline
│
├── playwright.config.js            # Test configuration
├── package.json                    # Project dependencies
├── README.md                       # Main project documentation
└── LICENSE                         # MIT License

```

## Key Design Decisions

### index.html at Root
The main HTML file stays at the root for easy deployment to GitHub Pages and simple hosting.

### src/ Directory
All application assets (JS, CSS, icons) are organized in the `src/` directory to clearly separate source code from configuration and tests.

### tests/ Directory Structure
- **acceptance/** - Full end-to-end tests validating complete user workflows
- **unit/** - Isolated tests for individual functions and components

This structure makes it immediately clear:
- What `index.html` loads → Everything in `src/`
- Where acceptance tests are → `tests/acceptance/`
- Where unit tests are → `tests/unit/`
- Where test data lives → `tests/acceptance/fixtures/`
