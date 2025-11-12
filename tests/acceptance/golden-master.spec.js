const { test, expect } = require('@playwright/test');
const path = require('path');

const SAMPLE_CSV_PATH = path.join(__dirname, 'fixtures/sample_premiumRequestUsageReport.csv');

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
});
