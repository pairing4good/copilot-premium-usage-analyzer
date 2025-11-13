# Frequently Asked Questions (FAQ)

## General Questions

### Why does my "Unused Potential" seem high?

This is common in the first few months of Copilot Premium rollout. High unused potential typically indicates one of these scenarios:

- **Awareness gap** - Developers don't know premium features are available
- **Training gap** - Team doesn't know how to effectively use Chat, premium models, or agent features
- **Early adoption phase** - Natural ramp-up period as developers learn new workflows
- **Feature access** - In some cases, organizational policies may restrict access

**Action items:**
- Focus on training and evangelizing success stories from power users
- Verify premium features are enabled in GitHub settings
- Communicate availability organization-wide
- Share specific use cases and workflows from high adopters

### What's a "good" adoption rate?

Adoption benchmarks vary by organization maturity and rollout timeline:

- **0-30%: Low** - Needs immediate attention
  - Indicates awareness or access issues
  - Suggests training is needed
  - May indicate features aren't properly enabled
  
- **30-60%: Moderate** - Room for improvement
  - Normal during initial rollout phase
  - Focus on scaling what works
  - Identify and replicate power user patterns
  
- **60%+: Strong** - Optimization focus
  - Good adoption baseline established
  - Shift to maximizing utilization per user
  - Focus on advanced features and workflows

**Context matters:** A 40% adoption rate in month 1 is excellent; the same rate in month 6 needs investigation.

### How often should I run this analysis?

**Recommended frequency: Monthly**

Monthly analysis provides:
- Trend tracking over time
- Impact measurement of training initiatives
- Identification of seasonal patterns
- Data for license reallocation decisions

**Consider weekly analysis during:**
- Initial Premium rollout (first 2-3 months)
- Active adoption campaigns
- Training program deployment
- Quarterly planning periods

**Avoid over-analyzing:**
- Daily/weekly reports create noise without actionable insights
- Usage patterns need time to stabilize
- Developers need space to develop natural AI workflows

### Can I customize the hourly developer rate?

**Yes!** This is essential for accurate ROI calculations.

**How to customize:**
1. Enter your organization's actual average developer hourly rate in the "Average Developer Hourly Rate" field on the upload form
2. This should include:
   - Base salary (annualized and divided by working hours)
   - Benefits (health insurance, retirement, etc.)
   - Overhead (office space, equipment, software licenses, etc.)

**Default:** $100/hour (conservative industry average)

**Typical ranges:** $75-150/hour depending on:
- Geographic location (SF/NYC vs. remote/distributed)
- Developer seniority (junior vs. senior vs. principal)
- Total compensation package
- Company overhead structure

**All dollar values** in the report will automatically use your specified rate for accurate financial metrics.

## Technical Questions

### What if my CSV has a different format?

The tool requires GitHub's standard Premium Request Usage Report export format. 

**Required columns:**
- `username` - Developer identifier
- `quantity` - Number of tokens used
- `model` - AI model name
- `date` - Usage date
- `net_amount` - Cost in dollars
- `total_monthly_quota` - Monthly token allocation

**If you have custom data:**
- You'll need to map it to the expected column structure
- Use a spreadsheet tool to rename/reorder columns
- Ensure data types match (dates as YYYY-MM-DD, numbers as integers)

**Export location:** GitHub Organization Settings → Billing → Usage Reports → "Premium Request Usage Report"

### Does this work with regular Copilot (non-Premium)?

**No.** This tool is specifically designed for Premium feature usage which has token-based quotas.

**Why the distinction:**
- Standard Copilot provides inline completions (not tracked in usage reports)
- Premium Copilot includes Chat, premium models, and agent features (tracked as premium requests)
- Only Premium subscriptions generate the CSV data this tool analyzes

**If you have Standard:** Consider upgrading to Premium to access advanced features and capacity tracking.

### What's the difference between "Time Saved" and actual productivity?

**"Time Saved" = AI Capacity Consumed**
- Represents premium requests used × 15 minutes
- Measures how much AI assistance was leveraged
- Proxy metric for productivity impact

**"Actual Productivity" = Business Outcomes**
- Features shipped faster
- Bugs resolved quicker
- Code quality improvements
- Developer satisfaction gains

**Use Time Saved as:**
- A floor estimate (conservative baseline)
- Directional indicator of AI adoption
- Comparative metric month-over-month

**Don't use Time Saved as:**
- Exact productivity measurement
- Direct developer performance metric
- Replacement for outcome-based KPIs

**Reality:** The 15-minute metric is validated through case studies ([CASE_STUDY_METRICS.md](CASE_STUDY_METRICS.md)) and represents conservative value. Actual productivity impact varies by task complexity and developer experience.

## Usage & Adoption Questions

### Why is my seat count required to be higher than my CSV users?

The tool validates that **seat count ≥ unique users in CSV** to ensure accurate calculations.

**Why this matters:**
- **Adoption Rate** = (Active Users ÷ Total Seats) × 100
- If seats < users, the math breaks (you'd get >100% adoption)
- Indicates data mismatch that needs investigation

**Common causes:**
- CSV contains usage from more seats than you think you have
- Some developers may have left the organization but are still in historical data
- Trial or temporary licenses may have been included

**Resolution:**
- Enter the actual total number of licenses you're paying for
- Review GitHub billing to confirm exact seat count
- Ensure CSV export matches current billing period

### What does "mid-month report" mean?

Running the analyzer mid-month (before the billing cycle ends) is completely valid.

**What changes:**
- **"Unused Potential"** shows tokens still available this month
- **Utilization %** reflects usage so far (will grow as month progresses)
- **Total Opportunity** remains the same (based on full month allocation)

**Use mid-month reports to:**
- Track progress toward monthly goals
- Identify low adopters early for intervention
- Monitor impact of training initiatives in real-time
- Forecast end-of-month metrics

**Important:** Premium requests reset monthly. Unused quota cannot be carried forward.

### Can I track individual developer performance?

**Yes, with caveats.**

**The tool shows:**
- Top 5 users by token consumption
- Individual usage in the detailed user table
- Model preferences per developer

**Ethical considerations:**
- Use data to **support** developers, not punish low adoption
- High usage ≠ high productivity (context matters)
- Some roles naturally use AI more (greenfield vs. maintenance work)
- Privacy concerns if usage data is used punitively

**Best practices:**
- Celebrate power users and share their workflows
- Identify low adopters for training opportunities
- Focus on enablement, not enforcement
- Aggregate data for team-level insights when possible

## Privacy & Security Questions

### Is my data sent to any servers?

**No. Absolutely not.**

**How it works:**
- Tool runs 100% in your browser (client-side JavaScript)
- CSV parsing happens locally using PapaParse library
- All calculations performed in browser memory
- No network requests to external servers
- No data storage or transmission

**Verification:**
- Open browser developer tools → Network tab
- Upload a CSV and analyze
- You'll see zero network activity (except loading the page itself)

**Safe for:**
- Sensitive organizational data
- Confidential usage metrics
- Personal developer information
- Financial ROI calculations

### Can I use this offline?

**Yes!** 

**Instructions:**
1. Download `index.html` and the `src/` folder
2. Open `index.html` directly in your browser (double-click or File → Open)
3. Use normally without internet connection

**What works offline:**
- Full CSV analysis
- All calculations and visualizations
- Capacity-only mode
- Report generation

**What requires internet:**
- Initial download of Chart.js and PapaParse libraries (cached after first load)
- Viewing the online hosted version

## Interpretation Questions

### What if my utilization is very low (<10%)?

**Very low utilization** suggests fundamental barriers, not just slow adoption.

**Immediate actions:**
1. **Verify premium features are enabled** in GitHub org settings
2. **Check developer awareness** - Do they know Chat and premium models exist?
3. **Assess training** - Has the team been shown how to use these features?
4. **Review policies** - Are organizational restrictions blocking access?

**Investigation checklist:**
- [ ] GitHub org settings → Copilot → Chat enabled?
- [ ] Premium models (GPT-4, Claude) accessible?
- [ ] Developers received onboarding/training?
- [ ] Communication sent about feature availability?
- [ ] Any proxy/firewall restrictions?

**Common fix:** Often just enabling features and sending a team announcement unlocks massive adoption.

### How do I compare month-over-month?

The tool provides point-in-time analysis. For trends:

**Manual tracking:**
1. Screenshot or export key metrics each month
2. Create a spreadsheet with columns:
   - Month
   - Adoption Rate %
   - Utilization %
   - Hours Used
   - Dollar Value
3. Plot trends over 3-6 months

**What to track:**
- Adoption rate trajectory (increasing?)
- Utilization per active user (deepening?)
- Power user consistency (same people or spreading?)
- Model distribution changes (feature discovery?)

**Healthy trends:**
- Adoption climbing 5-10% month-over-month
- Utilization stabilizing >40% after 3 months
- Growing number of moderate users (not just power users)

### What's the difference between "Adoption Rate" and "Utilization Rate"?

**Adoption Rate = Breadth** (how many people are using it)
```
Adoption = (Active Users ÷ Total Seats) × 100
```
- Measures penetration across your team
- Answers: "How many developers are engaging with AI?"
- Target: 60%+ for mature deployments

**Utilization Rate = Depth** (how much capacity is being consumed)
```
Utilization = (Tokens Used ÷ Total Available) × 100
```
- Measures intensity of usage
- Answers: "How much of our AI capacity are we using?"
- Target: Varies by maturity (20-50%+ reasonable)

**Ideal scenario:** High adoption (60%+) + Moderate utilization (30-50%)
- Means most developers are engaged
- Using AI consistently but not burning out quota

**Red flags:**
- High utilization + Low adoption = Few power users, most inactive
- Low both = Enablement problem

## Benchmark Questions

### What benchmarks should I set for my organization?

Benchmarks depend on rollout maturity and organizational context.

**First 3 Months (Ramp-up Phase):**
- Adoption: 20-40%
- Utilization: 15-30%
- Focus: Training, awareness, removing barriers

**Months 4-6 (Growth Phase):**
- Adoption: 40-60%
- Utilization: 25-40%
- Focus: Scaling successful patterns, reducing laggards

**Mature Deployment (6+ Months):**
- Adoption: 60-80%
- Utilization: 35-50%
- Focus: Optimization, advanced features, ROI demonstration

**Context matters:**
- Greenfield teams may show higher utilization (lots of code generation)
- Maintenance teams may show lower but still valuable usage (debugging, understanding)
- Distributed teams may adopt slower than co-located

**Set realistic goals** based on your starting point and organizational readiness.

---

## Still Have Questions?

For issues, suggestions, or additional questions:
- **Documentation:** Check [TECHNICAL_DETAILS.md](TECHNICAL_DETAILS.md) for implementation details
- **Case Study:** See [CASE_STUDY_METRICS.md](CASE_STUDY_METRICS.md) for metric validation
