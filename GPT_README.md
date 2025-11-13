# Copilot Premium Usage Analyzer

An executive-ready dashboard that turns GitHub Copilot Premium usage data into clear insight on AI adoption, capacity, and ROI. Use it to understand where your organization is gaining leverage from premium Copilot features and where untapped opportunity remains.

## Getting Started

1. **Launch instantly on the web:** [pairing4good.github.io/copilot-premium-usage-analyzer](https://pairing4good.github.io/copilot-premium-usage-analyzer/)
2. **Prefer offline use?** Download `index.html` and the `src/` folder, then open `index.html` in any modern browser.
3. **Gather your inputs:** Optional GitHub "Premium Request Usage Report" CSV, total Copilot seat licenses, and your organization's average fully loaded hourly developer rate.
4. **Upload, review, decide:** Drop the CSV (or run without it), confirm the seat count and rate, then click **Analyze Report** for an executive summary and deeper diagnostics.

---

## Why Leaders Care

- **Quantify AI leverage:** See how much of your pre-paid Copilot Premium capacity your teams actually use.
- **Spot missed ROI:** Identify unused premium requests that represent lost productivity your org already funded.
- **Guide enablement investments:** Track adoption of advanced Copilot models, chat, and agent capabilities across teams.
- **Tell a financial story:** Translate usage into hours and dollars saved using your own cost benchmarks.

## What's a Premium Request?

A **premium request** is one Copilot interaction that draws on the premium model quota (300 per seat each month). These requests unlock:
- **Conversational AI pair programming** for complex questions, legacy code exploration, and onboarding.
- **Context-aware code generation** that spans files, repositories, and languages using models like GPT-4 and Claude Sonnet.
- **Autonomous agent support** (Copilot Code Review and Copilot Coding Agent) that handles reviews, refactors, fixes, and documentation in the background.

Every premium request represents roughly **15 minutes of AI-assisted capacity** your organization has already purchased. If a developer doesn't use them, that time disappears at month's end.

## What the Tool Measures

- **Adoption:** Share of licensed developers engaging premium features.
- **Utilization:** Percentage of the monthly premium request quota consumed.
- **AI Capacity:** Hours of virtual developer time unlocked (used vs. still on the table).
- **Financial Impact:** Dollar value of realized and unrealized AI capacity using your cost inputs.
- **Model & Agent Signals:** Mix of premium models in use and detection of Code Review/Coding Agent activity to confirm autonomous assistance is activated.

## How to Use the Tool

![Upload Form](screenshots/001-form.png)

1. Export the optional **Premium Request Usage Report** from GitHub Billing.
2. Open the tool on the web or locally and upload the CSV (or select "No premium request analytics CSV available").
3. Enter your total Copilot seats and average fully loaded hourly developer rate (default $100/hour can be adjusted).
4. Click **Analyze Report** to get an executive-friendly dashboard.

## What You'll See

![Executive Dashboard](screenshots/002-exec.png)

- **Executive Overview:** Adoption, utilization, and capacity headlines that show whether you're realizing the premium investment.
- **Capacity Breakdown:** Total hours available, hours used, and hours left untapped, plus the associated dollar values.
- **Opportunity Alerts:** Automated insights highlighting low utilization, inactive seats, or lack of agent usage.

![Detailed Report](screenshots/003-detail.png)

- **Key Insights & Recommendations:** AI-generated guidance tailored to your data, including steps to turn on premium models or enable agent workflows if missing.
- **Model Distribution:** Visual mix of GPT, Claude, and agent engagements to confirm advanced capabilities are live.
- **User Highlights:** Top adopters and daily usage trends to recognize champions and target enablement efforts.
- **Full Detail Table:** Line-by-line view of usage for finance, operations, or platform teams that need exact counts.

## Turning Insight into Action

- **Enable Premium Everywhere:** Zero or near-zero premium usage usually means premium models or chat aren't toggled on. Activate them to unlock the value you've already purchased.
- **Coach Underutilized Teams:** Use adoption and usage data to target enablement, office hours, or playbooks where they'll have the biggest impact.
- **Celebrate Power Users:** Highlight early adopters to drive peer-led learning and quick wins.
- **Track Progress Monthly:** Re-run the analyzer to show leadership how utilization changes after enablement efforts and to quantify ROI gains.

## Privacy & Trust

- All analysis runs in the browser. No data leaves your machine.
- The tool only reads the CSV you upload and does not store it.
- Suitable for sensitive organizational reports.

Leaders who know their premium request utilization can act quickly to turn unused quota into measurable developer capacity, accelerating delivery while extracting full value from their Copilot Premium investment.
