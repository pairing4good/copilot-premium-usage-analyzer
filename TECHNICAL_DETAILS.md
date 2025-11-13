# Technical Details & Implementation Guide

This document provides comprehensive technical details for using and understanding the GitHub Copilot Premium Usage Analyzer.

## 🧮 Calculation Methodology

### Core Assumption

**1 Premium Request = 15 Minutes of AI-Assisted Developer Capacity**

GitHub Copilot Premium allocates a monthly quota measured in **premium requests** (units of AI usage). Each seat receives 300 premium requests per month.

**The Calculation:**
```
300 premium requests × 15 minutes per request = 4,500 minutes
4,500 minutes ÷ 60 = 75 hours of AI-assisted developer capacity per seat
```

This assumption is based on the value that AI pair programming features (like extended conversations with Claude or GPT-4) provide as **virtual developer capacity** added to your team. Each premium request represents an interaction with Copilot Chat where AI assistance handles work that would otherwise require manual developer effort—asking questions, generating code, debugging, or reviewing—effectively adding 15 minutes of productive capacity to your team for each interaction.

> **📖 Validation:** The [CASE_STUDY_METRICS.md](CASE_STUDY_METRICS.md) document validates this 15-minute metric through real-world development of this tool, showing it's actually conservative (representing 65-94% of actual value delivered).

### Detailed Calculations

#### Token-to-Time Conversion

**Core Formula:**
```
Total Available Minutes = Number of Seats × 300 tokens × 15 minutes per token
Total Available Hours = Total Available Minutes ÷ 60
```

**Example with 8 seats:**
```
8 seats × 300 tokens × 15 minutes = 36,000 minutes
36,000 minutes ÷ 60 = 600 hours of AI developer capacity
```

#### AI Capacity Used Calculation

AI capacity used is calculated based on actual token usage:

```
Capacity Used (Minutes) = Tokens Used × 15 minutes per token
Capacity Used (Hours) = Capacity Used (Minutes) ÷ 60
```

**Example:**
```
851 tokens used × 15 minutes = 12,765 minutes
12,765 minutes ÷ 60 = 212.75 hours of AI capacity utilized
```

#### Unused Potential Calculation

```
Unused Tokens = Total Available Tokens - Tokens Used
Unused Capacity (Minutes) = Unused Tokens × 15 minutes per token
Unused Capacity (Hours) = Unused Capacity (Minutes) ÷ 60
```

**Example:**
```
(2,400 - 851) = 1,549 unused tokens
1,549 tokens × 15 minutes = 23,235 minutes
23,235 minutes ÷ 60 = 387.25 hours of unused AI capacity
```

**Validation:** AI Capacity Used + Unused Potential = Total Opportunity ✓

#### Dollar Value Calculation

All dollar values are calculated using **your specified hourly developer rate** (defaults to $100/hour if not customized):

```
Dollar Value = Hours × Hourly Rate
```

**Example with default $100/hour rate:**
- Total Opportunity: 600 hrs × $100 = $60,000
- AI Capacity Used: 213 hrs × $100 = $21,300
- Unused Potential: 387 hrs × $100 = $38,700

**Example with custom $120/hour rate:**
- Total Opportunity: 600 hrs × $120 = $72,000
- AI Capacity Used: 213 hrs × $120 = $25,560
- Unused Potential: 387 hrs × $120 = $46,440

#### Adoption Rate

```
Adoption Rate = (Active Users ÷ Total Seats) × 100
```

Where "Active Users" = developers who used at least 1 premium token during the reporting period.

#### Token Utilization

```
Token Utilization = (Tokens Used ÷ Total Available Tokens) × 100
```

**Example:**
```
(851 ÷ 2,400) × 100 = 35.5%
```

## 📋 CSV Format Requirements

The tool expects GitHub's standard Premium Request Usage Report format:

```csv
date,username,product,sku,model,quantity,unit_type,applied_cost_per_quantity,gross_amount,discount_amount,net_amount,exceeds_quota,total_monthly_quota,organization,cost_center_name
2025-10-01,developer1,copilot,copilot_premium_request,Claude Sonnet 4,5,requests,0.04,0.20,0.20,0,False,300,your-org,
```

**Required columns:**
- `username` - Developer identifier
- `quantity` - Number of tokens used
- `model` - AI model name
- `date` - Usage date
- `net_amount` - Cost in dollars
- `total_monthly_quota` - Monthly token allocation (typically 300)

**Optional but recommended columns:**
- `product` - Product identifier
- `sku` - SKU identifier
- `organization` - Organization name
- `cost_center_name` - Cost center

## ⚙️ Configuration Options

### Developer Rate Customization

The tool allows you to **customize the hourly developer rate** to match your organization's actual costs. The default is **$100/hour**, which represents a conservative industry average for fully-loaded software developer costs (salary + benefits + overhead).

**To set your organization's rate:**
- Enter your actual average hourly cost in the "Average Developer Hourly Rate" field on the upload form
- This rate should include:
  - Base salary (annualized and divided by working hours)
  - Benefits (health insurance, retirement, etc.)
  - Overhead (office space, equipment, software licenses, etc.)
  - Typical fully-loaded rates range from $75-150/hour depending on location and seniority

**All dollar values in the report** (Total Opportunity, AI Capacity Used, Unused Potential, ROI calculations) will automatically use your specified rate, providing accurate financial metrics specific to your organization.

### Seat Count Validation

When uploading a CSV file, **the number of seat licenses you enter must be at least equal to the number of unique users in the CSV file.** This ensures accurate adoption rate and utilization calculations. If your seat count is too low, the tool will display an error message and prompt you to increase it to the minimum required value.

**Example:** If your CSV contains usage from 8 unique developers, you must enter at least 8 for the number of seat licenses.

### Capacity-Only Mode (No CSV)

If premium request analytics are not yet available for your organization (common in the first month of Premium adoption or if features aren't enabled), you can still use this tool:

1. Check the box: ☑️ "No premium request analytics CSV available (calculate capacity only)"
2. Enter your number of Copilot seat licenses
3. Click "Analyze Report"

The tool will show you:
- **Total AI capacity** your organization has available (hours per month)
- **Potential productivity gains** if premium features were fully utilized
- **Dollar value** of your pre-paid AI capacity

This "capacity-only" view is valuable for:
- **Initial planning** - Understanding the scale of AI assistance you've purchased
- **Baseline setting** - Establishing what full utilization would look like
- **Business case building** - Demonstrating potential ROI to justify enabling premium features
- **First-month scenarios** - Before usage data is available from GitHub

## ⚠️ Important Considerations

### Token Expiration

**Premium tokens reset monthly and cannot be carried forward.** Unused capacity is permanently lost at the end of each billing cycle. The tool highlights this with a warning:

> ⚠️ Premium request quota resets monthly. Unused quota is lost if not used.

### Mid-Month Reports

If you run a report mid-month, the "Unused Potential" represents tokens that are still available. The calculation remains valid—it shows what portion of the month's capacity has been used vs. what remains.

### Accuracy Limitations

These calculations provide **directional insights** rather than precise measurements. Actual productivity impact varies based on:
- Task complexity
- Developer experience with AI tools
- Code quality requirements
- Domain-specific factors

Use these metrics to identify trends and opportunities, not as absolute measures of value.

## 🛠️ Technical Stack

**Dependencies:**
- [Chart.js](https://www.chartjs.org/) - Data visualization
- [PapaParse](https://www.papaparse.com/) - CSV parsing

**Browser Support:**
- Chrome/Edge 90+
- Firefox 88+
- Safari 14+

**Features:**
- Fully responsive design (mobile-friendly)
- Print-optimized layouts for reports
- Smooth animations and transitions
- No backend required
- 100% client-side processing

## 🔒 Privacy & Security

This tool runs **entirely in your browser**. No data is sent to any server:
- CSV processing happens locally using JavaScript
- All calculations are performed client-side
- Your usage data never leaves your machine
- No tracking, analytics, or data collection

Safe to use with sensitive organizational data.

## 🧪 Testing & Code Quality

This project uses [Playwright](https://playwright.dev/) for automated golden master (snapshot) testing and [ESLint](https://eslint.org/) for code quality enforcement.

### Running Tests

```bash
# Run all tests
npm test

# Run tests in headed mode (see browser)
npm run test:headed

# Update snapshots after intentional changes
npm run test:update

# Open test UI
npm run test:ui
```

### Code Quality

```bash
# Run linter to check code quality
npm run lint

# Auto-fix linting issues
npm run lint:fix
```

### Test Coverage

The test suite includes:
- **Golden master tests** with visual regression testing
- **Validation error scenarios** (e.g., insufficient seat count)
- **Capacity-only mode** testing (no CSV upload)
- **Full dashboard rendering** with sample data
- **Agent feature detection** tests (Code Review & Coding Agent)

### CI/CD Pipeline

The project uses GitHub Actions to automatically:
1. Run ESLint on all JavaScript files
2. Execute all Playwright tests
3. Upload test results and snapshots

All checks run on every push and pull request to ensure code quality and functionality.

## 🤝 Contributing

This is an open-source tool for the developer community. Contributions welcome:
- Bug reports
- Feature suggestions
- Code improvements
- Documentation enhancements

## 📄 License

MIT License - See LICENSE file for details
