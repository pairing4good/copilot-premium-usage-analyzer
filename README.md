# GitHub Copilot Premium Usage Analyzer

A comprehensive analytics tool for engineering leaders to measure AI developer capacity utilization and ROI from GitHub Copilot Premium features.

## 📊 Purpose

This tool transforms raw GitHub Copilot Premium usage data into actionable insights for technical leadership. It answers critical questions about your AI investment:

- **How much of our AI capacity are we actually using?**
- **What's the ROI on our Copilot Premium licenses?**
- **Which developers are leveraging AI effectively?**
- **Are we leaving productivity gains on the table?**

## 🚀 Quick Start

1. **Export your usage report** from GitHub's billing dashboard
   - Navigate to your GitHub organization settings
   - Go to Billing → Usage reports
   - Download the "Premium Request Usage Report" CSV

2. **Open the tool** 
   - Simply open `index.html` in any modern web browser
   - No installation or server required

3. **Upload and analyze**
   - Upload your CSV file
   - Enter your total number of Copilot seat licenses
   - Click "Analyze Report"

## 📈 What You'll See

### Executive Summary (Above the Fold)

**AI Usage Overview**
- Total Premium Tokens Used
- Adoption Rate (% of licenses actively using premium features)
- Token Utilization (% of available AI capacity consumed)

**AI Developer Capacity Utilization**
- Total Opportunity (total AI hours available across all licenses)
- Time Saved (AI hours actually used)
- Unused Potential (AI hours going unused)

### Detailed Analysis (Below the Fold)

- **Key Insights & Recommendations** - AI-generated analysis of adoption patterns, usage concentration, and optimization opportunities
- **Model Distribution** - Which AI models (Claude, GPT, etc.) your team prefers
- **User Activity** - Top 5 power users by token consumption
- **Daily Usage Trends** - Usage patterns over time
- **User Details Table** - Complete breakdown by developer

## 🧮 How Calculations Work

### Token-to-Time Conversion

GitHub Copilot Premium allocates a monthly quota measured in **tokens** (units of AI usage). Each seat receives 300 tokens per month.

**Core Formula:**
```
Total Available Minutes = Number of Seats × 300 tokens
Total Available Hours = Total Available Minutes ÷ 60
```

**Example with 8 seats:**
```
8 seats × 300 tokens = 2,400 minutes
2,400 minutes ÷ 60 = 40 hours of AI developer capacity
```

### Time Saved Calculation

Time saved is calculated proportionally based on actual token usage:

```
Time Saved Hours = (Tokens Used ÷ Total Available Tokens) × Total Available Hours
```

**Example:**
```
851 tokens used ÷ 2,400 total tokens = 35.5%
35.5% × 40 hours = 14.2 hours saved
```

### Unused Potential Calculation

```
Unused Tokens = Total Available Tokens - Tokens Used
Unused Hours = (Unused Tokens ÷ Total Available Tokens) × Total Available Hours
```

**Example:**
```
(2,400 - 851) = 1,549 unused tokens
(1,549 ÷ 2,400) × 40 hours = 25.8 hours unused
```

**Validation:** Time Saved + Unused Potential = Total Opportunity ✓

### Dollar Value Calculation

All dollar values use a standard **$100/hour developer rate**:

```
Dollar Value = Hours × $100/hour
```

**Example:**
- Total Opportunity: 40 hrs × $100 = $4,000
- Time Saved: 14.2 hrs × $100 = $1,420
- Unused Potential: 25.8 hrs × $100 = $2,580

### Adoption Rate

```
Adoption Rate = (Active Users ÷ Total Seats) × 100
```

Where "Active Users" = developers who used at least 1 premium token during the reporting period.

### Token Utilization

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

## ⚠️ Important Notes

### Token Expiration

**Premium tokens reset monthly and cannot be carried forward.** Unused capacity is permanently lost at the end of each billing cycle. The tool highlights this with a warning:

> ⚠️ Premium request quota resets monthly. Unused quota (26 of 40 hours) is lost if not used.

### Mid-Month Reports

If you run a report mid-month, the "Unused Potential" represents tokens that are still available. The calculation remains valid - it shows what portion of the month's capacity has been used vs. what remains.

### Developer Rate Assumption

The tool uses a fixed **$100/hour** rate for all calculations. This is a conservative industry average for software developer costs (salary + benefits + overhead). You can mentally adjust by your actual rates:

- If your rate is $120/hr: multiply dollar values by 1.2
- If your rate is $80/hr: multiply dollar values by 0.8

### Accuracy Limitations

These calculations provide **directional insights** rather than precise measurements. Actual productivity impact varies based on:
- Task complexity
- Developer experience with AI tools
- Code quality requirements
- Domain-specific factors

Use these metrics to identify trends and opportunities, not as absolute measures of value.

## 🎯 Use Cases

### For Engineering Managers

**Optimize license allocation:**
- Identify unused licenses that could be reallocated
- Track adoption rates across teams
- Measure month-over-month engagement trends

**Demonstrate ROI:**
- Show leadership the dollar value of AI capacity utilized
- Quantify productivity gains
- Justify continued or expanded investment

**Drive adoption:**
- Identify power users to become AI champions
- Target low-adoption teams for training
- Share success patterns across the organization

### For Engineering Directors/VPs

**Strategic planning:**
- Forecast capacity needs based on usage trends
- Compare cost per seat vs. value delivered
- Make data-driven decisions about scaling AI tools

**Executive reporting:**
- Clean, printable reports for board meetings
- Clear ROI metrics in business terms
- Benchmark utilization across departments

### For Finance/Operations

**Cost optimization:**
- Identify unused capacity
- Calculate cost per unit of value delivered
- Support budget planning for next cycle

## 🔒 Privacy & Security

This tool runs **entirely in your browser**. No data is sent to any server:
- CSV processing happens locally using JavaScript
- All calculations are performed client-side
- Your usage data never leaves your machine
- No tracking, analytics, or data collection

Safe to use with sensitive organizational data.

## 🛠️ Technical Details

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

## 📄 License

MIT License - See LICENSE file for details

## 🤝 Contributing

This is an open-source tool for the developer community. Contributions welcome:
- Bug reports
- Feature suggestions
- Code improvements
- Documentation enhancements

## 💡 Best Practices

### Monthly Reviews

Run this analysis monthly to:
- Track adoption trends over time
- Identify seasonal patterns
- Measure impact of training initiatives
- Adjust license allocations

### Team Discussions

Use insights to drive conversations:
- Share power user workflows
- Celebrate high adopters
- Understand barriers for low adopters
- Discuss optimization strategies

### Benchmark Tracking

Export or screenshot key metrics each month to track:
- Adoption rate trajectory
- Utilization percentage trends
- Cost efficiency improvements
- ROI evolution

## 📞 Support

For issues, questions, or suggestions:
- Open a GitHub issue
- Review existing discussions
- Check the FAQ section below

## ❓ FAQ

**Q: Why does my "Unused Potential" seem high?**  
A: This is common in the first few months of Copilot Premium rollout. Focus on training and evangelizing success stories from power users.

**Q: What's a "good" adoption rate?**  
A: 
- 0-30%: Low - needs immediate attention
- 30-60%: Moderate - room for improvement
- 60%+: Strong - optimization focus

**Q: How often should I run this analysis?**  
A: Monthly is recommended. More frequent analysis (weekly) can help during initial rollout or adoption campaigns.

**Q: Can I customize the $100/hour rate?**  
A: Currently the rate is hardcoded. You can manually adjust the dollar values in your analysis by the appropriate multiplier.

**Q: What if my CSV has a different format?**  
A: The tool requires GitHub's standard export format. If you have custom data, you'll need to map it to the expected column structure.

**Q: Does this work with regular Copilot (non-Premium)?**  
A: No, this tool is specifically designed for Premium feature usage which has token-based quotas. Regular Copilot suggestions don't appear in these reports.

**Q: What's the difference between "Time Saved" and actual productivity?**  
A: "Time Saved" represents AI capacity consumed. Actual productivity impact varies by task and developer. Use Time Saved as a proxy metric, not absolute truth.
