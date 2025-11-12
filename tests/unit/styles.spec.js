/**
 * CSS Integration Tests
 * 
 * These tests verify that the external CSS file (styles.css) is properly loaded
 * and applying styles to the page elements.
 */

const { test, expect } = require('@playwright/test');
const path = require('path');

const SAMPLE_CSV_PATH = path.join(__dirname, '../acceptance/fixtures/sample_premiumRequestUsageReport.csv');

test.describe('CSS Stylesheet Integration', () => {
    test('should load external CSS file successfully', async ({ page }) => {
        // Listen for CSS file load
        const cssRequests = [];
        page.on('request', request => {
            if (request.url().includes('styles.css')) {
                cssRequests.push(request);
            }
        });
        
        await page.goto('http://localhost:8080');
        
        // Verify CSS file was requested
        expect(cssRequests.length).toBeGreaterThan(0);
        
        // Wait for CSS to be applied
        await page.waitForLoadState('networkidle');
        
        // Check that styles are applied to body
        const bodyBg = await page.locator('body').evaluate(el => 
            window.getComputedStyle(el).backgroundColor
        );
        
        // Should have the #f8f9fa background color (rgb(248, 249, 250))
        expect(bodyBg).toBe('rgb(248, 249, 250)');
    });
    
    test('should apply button gradient styles', async ({ page }) => {
        await page.goto('http://localhost:8080');
        await page.waitForLoadState('networkidle');
        
        // Check the analyze button color (gradient is applied via background, but when disabled it's overridden)
        const btnColor = await page.locator('#analyzeBtn').evaluate(el => 
            window.getComputedStyle(el).color
        );
        
        // Should have white color (rgb(255, 255, 255))
        expect(btnColor).toBe('rgb(255, 255, 255)');
    });
    
    test('should apply responsive grid layout', async ({ page }) => {
        await page.goto('http://localhost:8080');
        await page.waitForLoadState('networkidle');
        
        // Check upload section has grid display
        const uploadSectionDisplay = await page.locator('#uploadSection').evaluate(el => 
            window.getComputedStyle(el).display
        );
        
        expect(uploadSectionDisplay).toBe('grid');
    });
    
    test('should apply custom fonts', async ({ page }) => {
        await page.goto('http://localhost:8080');
        await page.waitForLoadState('networkidle');
        
        // Check body font family
        const fontFamily = await page.locator('body').evaluate(el => 
            window.getComputedStyle(el).fontFamily
        );
        
        // Should include system fonts
        expect(fontFamily).toContain('system');
    });
});

test.describe('CSS Responsive Design', () => {
    test('should apply mobile styles on small viewport', async ({ page }) => {
        // Set mobile viewport
        await page.setViewportSize({ width: 375, height: 667 });
        await page.goto('http://localhost:8080');
        await page.waitForLoadState('networkidle');
        
        // Upload CSV and set seats to show dashboard
        await page.setInputFiles('#csvFile', SAMPLE_CSV_PATH);
        await page.fill('#seatLicenses', '8');
        await page.click('#analyzeBtn');
        
        // Wait for dashboard to render
        await page.waitForLoadState('networkidle');
        await page.waitForSelector('#insightsContainer');
        await page.waitForTimeout(2000); // Wait for charts to render
        
        // Check metrics grid is single column on mobile
        const metricsGridCols = await page.locator('.metrics-grid').evaluate(el => 
            window.getComputedStyle(el).gridTemplateColumns
        );
        
        // On mobile (<699px) it should be 1 column (single value)
        expect(metricsGridCols.split(' ').length).toBe(1);
    });
    
    test('should apply desktop styles on large viewport', async ({ page }) => {
        // Set desktop viewport
        await page.setViewportSize({ width: 1400, height: 900 });
        await page.goto('http://localhost:8080');
        await page.waitForLoadState('networkidle');
        
        // Upload CSV and set seats to show dashboard
        await page.setInputFiles('#csvFile', SAMPLE_CSV_PATH);
        await page.fill('#seatLicenses', '8');
        await page.click('#analyzeBtn');
        
        // Wait for dashboard to render
        await page.waitForLoadState('networkidle');
        await page.waitForSelector('#insightsContainer');
        await page.waitForTimeout(2000); // Wait for charts to render
        
        // Check metrics grid is 3 columns on desktop
        const metricsGridCols = await page.locator('.metrics-grid').evaluate(el => 
            window.getComputedStyle(el).gridTemplateColumns
        );
        
        // On desktop (>699px) it should be 3 columns
        expect(metricsGridCols.split(' ').length).toBe(3);
    });
});
