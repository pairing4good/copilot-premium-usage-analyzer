const { test, expect } = require('@playwright/test');
const path = require('path');

const SAMPLE_CSV_PATH = path.join(__dirname, 'fixtures/sample_premiumRequestUsageReport.csv');
const PARTIAL_MONTH_CSV_PATH = path.join(__dirname, 'fixtures/sample_partialMonth.csv');

test.describe('Copilot Premium Usage Analyzer - Golden Master Test', () => {
  test('should render dashboard correctly with sample data', async ({ page }) => {
    // Navigate to the application
    await page.goto('/');

    // Wait for page to load
    await expect(page.locator('h1')).toContainText('GitHub Copilot Premium Usage Analyzer');

    // Upload the CSV file
    const fileInput = page.locator('#csvFile');
    await fileInput.setInputFiles(SAMPLE_CSV_PATH);

    // Set seat licenses to 8
    await page.locator('#seatLicenses').fill('8');

    // Verify hourly rate is already set to 100 (default value)
    await expect(page.locator('#hourlyRate')).toHaveValue('100');

    // Click the Analyze Report button
    await page.locator('#analyzeBtn').click();

    // Wait for dashboard to be visible
    await expect(page.locator('#dashboard')).toHaveClass(/active/);

    // Wait for all charts and content to fully render
    await page.waitForLoadState('networkidle');
    await page.waitForSelector('#insightsContainer', { state: 'visible' });
    await page.waitForTimeout(2000); // Give charts time to render

    // Take snapshot of the entire dashboard
    await expect(page.locator('#dashboard')).toHaveScreenshot('dashboard-overview.png', {
      fullPage: true,
      animations: 'disabled',
    });

    // Take snapshot of executive summary section
    await expect(page.locator('#metricsGrid')).toHaveScreenshot('metrics-grid.png', {
      animations: 'disabled',
    });

    // Take snapshot of productivity section
    await expect(page.locator('#productivityContent')).toHaveScreenshot('productivity-section.png', {
      animations: 'disabled',
    });

    // Take snapshot of insights section
    await expect(page.locator('#insightsContainer')).toHaveScreenshot('insights-section.png', {
      animations: 'disabled',
    });

    // Verify key metrics values
    await expect(page.locator('#metricsGrid')).toContainText('Total Premium Tokens Used');
    await expect(page.locator('#metricsGrid')).toContainText('Adoption Rate');
    await expect(page.locator('#metricsGrid')).toContainText('Token Utilization');

    // Verify productivity metrics
    await expect(page.locator('#productivityContent')).toContainText('Total Opportunity');
    await expect(page.locator('#productivityContent')).toContainText('Time Saved');
    await expect(page.locator('#productivityContent')).toContainText('Unused Potential');
  });

  test('should show validation error when seat count is less than users in CSV', async ({ page }) => {
    // Navigate to the application
    await page.goto('/');

    // Upload the CSV file
    const fileInput = page.locator('#csvFile');
    await fileInput.setInputFiles(SAMPLE_CSV_PATH);

    // Set seat licenses to a number less than users in CSV (assuming CSV has at least 2 users)
    await page.locator('#seatLicenses').fill('1');

    // Click the Analyze Report button
    await page.locator('#analyzeBtn').click();

    // Verify error message is displayed
    const errorMessage = page.locator('#errorMessage');
    await expect(errorMessage).toBeVisible();
    await expect(errorMessage).toContainText('Validation Error');
    await expect(errorMessage).toContainText('must be at least equal to the number of unique users');

    // Take snapshot of error state
    await expect(page.locator('.upload-section')).toHaveScreenshot('validation-error.png', {
      animations: 'disabled',
    });
  });

  test('should render capacity-only mode correctly', async ({ page }) => {
    // Navigate to the application
    await page.goto('/');

    // Set seat licenses to 8
    await page.locator('#seatLicenses').fill('8');

    // Check the "No CSV" checkbox
    await page.locator('#noCsvCheckbox').check();

    // Verify hourly rate is set to 100
    await expect(page.locator('#hourlyRate')).toHaveValue('100');

    // Click the Analyze Report button
    await page.locator('#analyzeBtn').click();

    // Wait for dashboard to be visible
    await expect(page.locator('#dashboard')).toHaveClass(/active/);

    // Wait for all content to fully load
    await page.waitForLoadState('networkidle');
    await page.waitForSelector('#insightsContainer', { state: 'visible' });
    await page.waitForTimeout(2000); // Give charts time to render

    // Take snapshot of capacity-only dashboard
    await expect(page.locator('#dashboard')).toHaveScreenshot('capacity-only-dashboard.png', {
      fullPage: false,
      animations: 'disabled',
    });

    // Verify capacity-only insights are shown
    await expect(page.locator('#insightsContainer')).toContainText('Capacity-Only Analysis');
  });

  test('should calculate correctly with 4 seats and $75/hr rate', async ({ page }) => {
    await page.goto('/');
    
    await page.locator('#seatLicenses').fill('4');
    await page.locator('#hourlyRate').fill('75');
    await page.locator('#noCsvCheckbox').check();
    await page.locator('#analyzeBtn').click();
    
    await expect(page.locator('#dashboard')).toHaveClass(/active/);
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(1000);
    
    // Verify calculations: 4 seats × 300 tokens × 15 min = 18,000 min = 300 hrs
    // 300 hrs × $75 = $22,500
    await expect(page.locator('#productivityContent')).toContainText('$22,500');
    await expect(page.locator('#productivityContent')).toContainText('300 hrs');
  });

  test('should calculate correctly with 5 seats and $105/hr rate', async ({ page }) => {
    await page.goto('/');
    
    await page.locator('#seatLicenses').fill('5');
    await page.locator('#hourlyRate').fill('105');
    await page.locator('#noCsvCheckbox').check();
    await page.locator('#analyzeBtn').click();
    
    await expect(page.locator('#dashboard')).toHaveClass(/active/);
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(1000);
    
    // Verify calculations: 5 seats × 300 tokens × 15 min = 22,500 min = 375 hrs
    // 375 hrs × $105 = $39,375
    await expect(page.locator('#productivityContent')).toContainText('$39,375');
    await expect(page.locator('#productivityContent')).toContainText('375 hrs');
  });

  test('should calculate correctly with 10 seats and $150/hr rate', async ({ page }) => {
    await page.goto('/');
    
    await page.locator('#seatLicenses').fill('10');
    await page.locator('#hourlyRate').fill('150');
    await page.locator('#noCsvCheckbox').check();
    await page.locator('#analyzeBtn').click();
    
    await expect(page.locator('#dashboard')).toHaveClass(/active/);
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(1000);
    
    // Verify calculations: 10 seats × 300 tokens × 15 min = 45,000 min = 750 hrs
    // 750 hrs × $150 = $112,500
    await expect(page.locator('#productivityContent')).toContainText('$112,500');
    await expect(page.locator('#productivityContent')).toContainText('750 hrs');
  });

  test('should handle minimum viable team of 3 seats', async ({ page }) => {
    await page.goto('/');
    
    await page.locator('#seatLicenses').fill('3');
    await page.locator('#noCsvCheckbox').check();
    await page.locator('#analyzeBtn').click();
    
    await expect(page.locator('#dashboard')).toHaveClass(/active/);
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(1000);
    
    // Verify calculations: 3 seats × 300 tokens × 15 min = 13,500 min = 225 hrs
    // 225 hrs × $100 = $22,500
    await expect(page.locator('#productivityContent')).toContainText('$22,500');
    await expect(page.locator('#productivityContent')).toContainText('225 hrs');
  });

  test('should reject zero seats', async ({ page }) => {
    await page.goto('/');
    
    await page.locator('#seatLicenses').fill('0');
    await page.locator('#noCsvCheckbox').check();
    
    // Button should remain disabled with invalid input
    const analyzeBtn = page.locator('#analyzeBtn');
    await expect(analyzeBtn).toBeDisabled();
  });

  test('should verify token utilization calculation with CSV data', async ({ page }) => {
    await page.goto('/');
    
    const fileInput = page.locator('#csvFile');
    await fileInput.setInputFiles(SAMPLE_CSV_PATH);
    await page.locator('#seatLicenses').fill('8');
    await page.locator('#analyzeBtn').click();
    
    await expect(page.locator('#dashboard')).toHaveClass(/active/);
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);
    
    // Verify Token Utilization percentage is calculated and displayed
    // Formula: (Tokens Used ÷ Total Available Tokens) × 100
    // With 8 seats: 8 × 300 = 2,400 total tokens
    const metricsGrid = page.locator('#metricsGrid');
    await expect(metricsGrid).toContainText('Token Utilization');
    await expect(metricsGrid).toContainText('%');
  });

  test('should detect and display Code Review and Coding Agent usage', async ({ page }) => {
    await page.goto('/');
    
    // Use the partial month CSV that includes Code Review and Coding Agent
    const fileInput = page.locator('#csvFile');
    await fileInput.setInputFiles(PARTIAL_MONTH_CSV_PATH);
    await page.locator('#seatLicenses').fill('5');
    await page.locator('#analyzeBtn').click();
    
    await expect(page.locator('#dashboard')).toHaveClass(/active/);
    await page.waitForLoadState('networkidle');
    await page.waitForSelector('#insightsContainer', { state: 'visible' });
    await page.waitForTimeout(2000);
    
    // Verify agent features are detected and shown as separate insights
    const insightsContainer = page.locator('#insightsContainer');
    await expect(insightsContainer).toContainText('Code Review Agent Usage');
    await expect(insightsContainer).toContainText('Coding Agent Deployment');
    
    // Verify the insights explain the benefits
    await expect(insightsContainer).toContainText('automated code review');
    await expect(insightsContainer).toContainText('security vulnerabilities');
    await expect(insightsContainer).toContainText('autonomous agents');
    await expect(insightsContainer).toContainText('expanding team capacity');
    
    // Take snapshot of agent features detection
    await expect(insightsContainer).toHaveScreenshot('agent-features-detected.png', {
      animations: 'disabled',
    });
  });

  test('should show Code Review detection in standard CSV', async ({ page }) => {
    await page.goto('/');
    
    // Use the standard CSV which includes Code Review (16 reviews)
    const fileInput = page.locator('#csvFile');
    await fileInput.setInputFiles(SAMPLE_CSV_PATH);
    await page.locator('#seatLicenses').fill('8');
    await page.locator('#analyzeBtn').click();
    
    await expect(page.locator('#dashboard')).toHaveClass(/active/);
    await page.waitForLoadState('networkidle');
    await page.waitForSelector('#insightsContainer', { state: 'visible' });
    await page.waitForTimeout(2000);
    
    // Verify Code Review detection
    const insightsContainer = page.locator('#insightsContainer');
    await expect(insightsContainer).toContainText('Code Review Agent Usage');
    await expect(insightsContainer).toContainText('16 automated code review');
    await expect(insightsContainer).toContainText('security vulnerabilities');
  });
});
