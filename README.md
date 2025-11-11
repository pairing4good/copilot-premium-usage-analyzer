# GitHub Copilot Premium Usage Analyzer

A comprehensive analytics tool for engineering leaders to measure AI developer capacity utilization and ROI from GitHub Copilot Premium features.

## 📊 Purpose

This tool transforms raw GitHub Copilot Premium usage data into actionable insights for technical leadership. It answers critical questions about your AI investment:

- **How much of our AI capacity are we actually using?**
- **What's the ROI on our Copilot Premium licenses?**
- **Which developers are leveraging AI effectively?**
- **Are we leaving productivity gains on the table?**

## 🤖 Understanding GitHub Copilot Premium Tokens

### What Are Premium Tokens?

GitHub Copilot comes in two tiers:

**Standard Copilot** provides inline code completions and basic suggestions as you type - the familiar autocomplete experience.

**Copilot Premium** unlocks advanced AI capabilities through a **token-based quota system**. Each Premium seat receives 300 tokens per month to access powerful features that go far beyond simple autocomplete.

### What Premium Tokens Enable

Premium tokens power **GitHub Copilot Chat** - an interactive AI pair programming experience where developers can:

**🔍 Deep Code Understanding**
- Ask complex questions about unfamiliar codebases
- Get explanations of how legacy code works
- Understand architectural patterns and design decisions
- Trace dependencies and data flows

**🛠️ Advanced Development Tasks**
- Generate entire functions, classes, or modules from natural language descriptions
- Refactor code with intelligent suggestions
- Write comprehensive unit tests automatically
- Debug issues through conversational troubleshooting

**🎯 Context-Aware Assistance**
- Multi-file code analysis and generation
- Repository-wide context understanding
- Integration with your existing codebase patterns
- Access to premium AI models (GPT-4, Claude 3.5 Sonnet, etc.)

**📝 Documentation & Reviews**
- Generate API documentation
- Create README files and code comments
- Perform AI-assisted code reviews
- Explain pull request changes

### Why Teams Should Use Premium Tokens

**Without using premium tokens**, developers are limited to basic autocomplete - useful, but only scratching the surface of AI-assisted development.

**With premium tokens**, developers gain an AI pair programmer that can:
- Reduce time spent understanding unfamiliar code from hours to minutes
- Accelerate feature development by generating boilerplate and complex logic
- Improve code quality through AI-assisted testing and reviews
- Onboard new team members faster with instant codebase explanations
- Solve blocking issues through interactive debugging sessions

**The Bottom Line:** Premium tokens represent your team's capacity to leverage advanced AI for complex development tasks. Unused tokens = missed opportunities for velocity, quality, and developer satisfaction.

This analyzer helps you measure how effectively your team is using this AI capacity and identify opportunities to increase ROI.

### ⚠️ Critical: Premium Features Must Be Enabled

**Premium models and capabilities are disabled by default** in most GitHub Copilot configurations. Even if your organization is paying for Premium licenses, developers cannot access these advanced features until they are explicitly enabled.

#### Why This Matters for Your Organization

**If premium features are disabled:**
- ❌ Developers only get basic autocomplete (Standard Copilot behavior)
- ❌ No access to Copilot Chat or conversational AI assistance
- ❌ No premium AI models (GPT-4, Claude 3.5 Sonnet, etc.)
- ❌ **Your organization is paying for Premium but receiving Standard value**
- ❌ **300 tokens per seat per month go completely unused** - representing hundreds of hours of potential productivity gains left on the table

**If premium features are enabled:**
- ✅ Developers can access the full suite of AI pair programming tools
- ✅ Multi-turn conversations for complex problem solving
- ✅ Context-aware code generation across entire repositories
- ✅ **Actual ROI on your Premium investment**
- ✅ **Measurable productivity gains** that this analyzer can track

#### How to Enable Premium Features

Organization administrators should:

1. **Enable Copilot Chat**: In GitHub organization settings → Copilot → Enable "Copilot Chat in the IDE"
2. **Enable Premium Models**: Allow access to premium AI models (GPT-4, Claude, etc.)
3. **Communicate to Developers**: Ensure team members know these features are available and how to access them in their IDE (VS Code, Visual Studio, JetBrains, etc.)
4. **Monitor Usage**: Use this analyzer to track adoption and ensure you're getting value from your investment

**Important:** If your analyzer shows zero or very low token usage, premium features may not be enabled organization-wide. This represents a critical opportunity to unlock significant productivity gains your team is already paying for.

## 🚀 Quick Start

![Upload Form](screenshots/001-form.png)

1. **Export your usage report** from GitHub's billing dashboard (Optional)
   - Navigate to your GitHub organization settings
   - Go to Billing → Usage reports
   - Download the "Premium Request Usage Report" CSV
   - **Note**: If you don't have access to usage reports yet, you can still use this tool to calculate your team's available AI capacity

2. **Open the tool** 
   - Simply open `index.html` in any modern web browser
   - No installation or server required

3. **Upload and analyze**
   - Upload your CSV file (if available)
   - Enter your total number of Copilot seat licenses
   - If you don't have a CSV file, check "No premium request analytics CSV available" to see your total capacity potential
   - Click "Analyze Report"

### Running Without a CSV File

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

## 📈 What You'll See

### Executive Summary (Above the Fold)

![Executive Dashboard](screenshots/002-exec.png)

**AI Usage Overview**
- Total Premium Tokens Used
- Adoption Rate (% of licenses actively using premium features)
- Token Utilization (% of available AI capacity consumed)

**AI Developer Capacity Utilization**
- Total Opportunity (total AI hours available across all licenses)
- Time Saved (AI hours actually used)
- Unused Potential (AI hours going unused)

### Detailed Analysis (Below the Fold)

![Detailed Report](screenshots/003-detail.png)

- **Key Insights & Recommendations** - AI-generated analysis of adoption patterns, usage concentration, and optimization opportunities
- **Model Distribution** - Which AI models (Claude, GPT, etc.) your team prefers
- **User Activity** - Top 5 power users by token consumption
- **Daily Usage Trends** - Usage patterns over time
- **User Details Table** - Complete breakdown by developer

## 🧮 How Calculations Work

### Core Assumption

**1 Premium Request = 15 Minutes of Developer Time**

GitHub Copilot Premium allocates a monthly quota measured in **premium requests** (units of AI usage). Each seat receives 300 premium requests per month.

**The Calculation:**
```
300 premium requests × 15 minutes per request = 4,500 minutes
4,500 minutes ÷ 60 = 75 hours of potential AI-assisted development time per developer
```

This assumption is based on the value that AI pair programming features (like extended conversations with Claude or GPT-4) provide in accelerating development work, code reviews, debugging, and architectural decisions. Each premium request represents an interaction with Copilot Chat where a developer asks a question, requests code generation, or seeks assistance - and we estimate each of these interactions saves approximately 15 minutes compared to solving the problem manually.

### Why Enable These Pre-Paid Features?

Organizations purchase Copilot Premium licenses as a **pre-paid investment** in developer productivity - paying upfront for 300 premium requests per developer per month. However, **these requests only deliver value when they're actually used**. 

Enabling premium features is critical because:

- **You've Already Paid For It**: Premium requests are included in your license cost whether used or not. Failing to enable them means paying for advanced AI capabilities while receiving only basic autocomplete functionality.

- **Unused Quota Is Lost**: Unlike software licenses that can be "saved," premium requests reset monthly. Every unused request represents wasted investment - if a team of 10 developers leaves their quota untapped, that's 3,000 hours (125 days) of potential productivity gains disappearing each month.

- **Competitive Advantage**: Teams that leverage AI pair programming ship features faster, onboard developers more quickly, and tackle technical debt more efficiently. Organizations that leave premium features disabled are essentially choosing to compete with one hand tied behind their back.

- **Measurable ROI**: With premium features enabled and this analyzer tracking usage, leadership can demonstrate concrete ROI through metrics like time saved, adoption rates, and productivity impact - turning an abstract "AI investment" into quantifiable business value.

**Bottom line**: If your organization is paying for Copilot Premium but hasn't enabled premium features, you're funding innovation for competitors while your own teams work without the AI advantage you've already purchased.

### Token-to-Time Conversion

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

### Time Saved Calculation

Time saved is calculated based on actual token usage:

```
Time Saved Minutes = Tokens Used × 15 minutes per token
Time Saved Hours = Time Saved Minutes ÷ 60
```

**Example:**
```
851 tokens used × 15 minutes = 12,765 minutes
12,765 minutes ÷ 60 = 212.75 hours saved
```

### Unused Potential Calculation

```
Unused Tokens = Total Available Tokens - Tokens Used
Unused Minutes = Unused Tokens × 15 minutes per token
Unused Hours = Unused Minutes ÷ 60
```

**Example:**
```
(2,400 - 851) = 1,549 unused tokens
1,549 tokens × 15 minutes = 23,235 minutes
23,235 minutes ÷ 60 = 387.25 hours unused
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
