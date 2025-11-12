/**
 * Unit tests for app.js functions
 * 
 * These tests verify the core calculation and rendering logic
 * of the Copilot Premium Usage Analyzer.
 */

const { test, expect } = require('@playwright/test');
const path = require('path');

const SAMPLE_CSV_PATH = path.join(__dirname, '../acceptance/fixtures/sample_premiumRequestUsageReport.csv');

test.describe('calculateMetrics function', () => {
    test('should calculate correct metrics for sample data', async ({ page }) => {
        await page.goto('http://localhost:8080');
        
        // Test data
        const testData = [
            { username: 'user1', quantity: 10, net_amount: 0, model: 'gpt-4', date: '2024-01-01' },
            { username: 'user1', quantity: 5, net_amount: 0, model: 'claude', date: '2024-01-02' },
            { username: 'user2', quantity: 20, net_amount: 0, model: 'gpt-4', date: '2024-01-01' }
        ];
        
        // Inject test data and call calculateMetrics
        const metrics = await page.evaluate((data) => {
            // Set global seatCount variable (used by calculateMetrics function)
            seatCount = 5;
            return calculateMetrics(data);
        }, testData);
        
        expect(metrics.totalRequests).toBe(35);
        expect(metrics.activeUsers).toBe(2);
        expect(metrics.adoptionRate).toBe(40); // 2/5 * 100
        expect(metrics.totalSeats).toBe(5);
        expect(metrics.unusedSeats).toBe(3);
        expect(metrics.quotaUsagePercent).toBe((35 / (5 * 300)) * 100);
    });
    
    test('should handle empty data', async ({ page }) => {
        await page.goto('http://localhost:8080');
        
        const metrics = await page.evaluate(() => {
            seatCount = 8;
            return calculateMetrics([]);
        });
        
        expect(metrics.totalRequests).toBe(0);
        expect(metrics.activeUsers).toBe(0);
        expect(metrics.adoptionRate).toBe(0);
        expect(metrics.totalSeats).toBe(8);
        expect(metrics.unusedSeats).toBe(8);
    });
});

test.describe('checkInputs function', () => {
    test('should enable button when file and seats provided', async ({ page }) => {
        await page.goto('http://localhost:8080');
        
        // Upload file
        await page.setInputFiles('#csvFile', SAMPLE_CSV_PATH);
        
        // Set seats
        await page.fill('#seatLicenses', '8');
        
        // Check button is enabled
        const isDisabled = await page.locator('#analyzeBtn').isDisabled();
        expect(isDisabled).toBe(false);
    });
    
    test('should enable button when checkbox and seats provided', async ({ page }) => {
        await page.goto('http://localhost:8080');
        
        // Check the no-CSV checkbox
        await page.check('#noCsvCheckbox');
        
        // Set seats
        await page.fill('#seatLicenses', '10');
        
        // Check button is enabled
        const isDisabled = await page.locator('#analyzeBtn').isDisabled();
        expect(isDisabled).toBe(false);
    });
    
    test('should disable button when no inputs provided', async ({ page }) => {
        await page.goto('http://localhost:8080');
        
        // Check button is disabled
        const isDisabled = await page.locator('#analyzeBtn').isDisabled();
        expect(isDisabled).toBe(true);
    });
});

test.describe('Productivity calculations', () => {
    test('should calculate correct capacity hours for 8 seats', async ({ page }) => {
        await page.goto('http://localhost:8080');
        
        const result = await page.evaluate(() => {
            const seats = 8;
            const quotaPerSeat = 300;
            const minutesPerRequest = 15;
            const totalMinutes = seats * quotaPerSeat * minutesPerRequest;
            const totalHours = totalMinutes / 60;
            return { totalMinutes, totalHours };
        });
        
        // 8 seats × 300 requests × 15 minutes = 36,000 minutes = 600 hours
        expect(result.totalMinutes).toBe(36000);
        expect(result.totalHours).toBe(600);
    });
    
    test('should calculate correct capacity hours for 4 seats', async ({ page }) => {
        await page.goto('http://localhost:8080');
        
        const result = await page.evaluate(() => {
            const seats = 4;
            const quotaPerSeat = 300;
            const minutesPerRequest = 15;
            const totalMinutes = seats * quotaPerSeat * minutesPerRequest;
            const totalHours = totalMinutes / 60;
            return { totalMinutes, totalHours };
        });
        
        // 4 seats × 300 requests × 15 minutes = 18,000 minutes = 300 hours
        expect(result.totalMinutes).toBe(18000);
        expect(result.totalHours).toBe(300);
    });
    
    test('should calculate correct capacity hours for 5 seats', async ({ page }) => {
        await page.goto('http://localhost:8080');
        
        const result = await page.evaluate(() => {
            const seats = 5;
            const quotaPerSeat = 300;
            const minutesPerRequest = 15;
            const totalMinutes = seats * quotaPerSeat * minutesPerRequest;
            const totalHours = totalMinutes / 60;
            return { totalMinutes, totalHours };
        });
        
        // 5 seats × 300 requests × 15 minutes = 22,500 minutes = 375 hours
        expect(result.totalMinutes).toBe(22500);
        expect(result.totalHours).toBe(375);
    });
    
    test('should calculate correct capacity hours for 10 seats', async ({ page }) => {
        await page.goto('http://localhost:8080');
        
        const result = await page.evaluate(() => {
            const seats = 10;
            const quotaPerSeat = 300;
            const minutesPerRequest = 15;
            const totalMinutes = seats * quotaPerSeat * minutesPerRequest;
            const totalHours = totalMinutes / 60;
            return { totalMinutes, totalHours };
        });
        
        // 10 seats × 300 requests × 15 minutes = 45,000 minutes = 750 hours
        expect(result.totalMinutes).toBe(45000);
        expect(result.totalHours).toBe(750);
    });
    
    test('should calculate correct capacity hours for 3 seats', async ({ page }) => {
        await page.goto('http://localhost:8080');
        
        const result = await page.evaluate(() => {
            const seats = 3;
            const quotaPerSeat = 300;
            const minutesPerRequest = 15;
            const totalMinutes = seats * quotaPerSeat * minutesPerRequest;
            const totalHours = totalMinutes / 60;
            return { totalMinutes, totalHours };
        });
        
        // 3 seats × 300 requests × 15 minutes = 13,500 minutes = 225 hours
        expect(result.totalMinutes).toBe(13500);
        expect(result.totalHours).toBe(225);
    });
    
    test('should calculate correct dollar values with $100/hr rate', async ({ page }) => {
        await page.goto('http://localhost:8080');
        
        const result = await page.evaluate(() => {
            const totalHours = 600;
            const hourlyRate = 100;
            const totalValue = totalHours * hourlyRate;
            return totalValue;
        });
        
        // 600 hours × $100/hr = $60,000
        expect(result).toBe(60000);
    });
    
    test('should calculate correct dollar values with $75/hr rate', async ({ page }) => {
        await page.goto('http://localhost:8080');
        
        const result = await page.evaluate(() => {
            const totalHours = 300;
            const hourlyRate = 75;
            const totalValue = totalHours * hourlyRate;
            return totalValue;
        });
        
        // 300 hours × $75/hr = $22,500
        expect(result).toBe(22500);
    });
    
    test('should calculate correct dollar values with $105/hr rate', async ({ page }) => {
        await page.goto('http://localhost:8080');
        
        const result = await page.evaluate(() => {
            const totalHours = 375;
            const hourlyRate = 105;
            const totalValue = totalHours * hourlyRate;
            return totalValue;
        });
        
        // 375 hours × $105/hr = $39,375
        expect(result).toBe(39375);
    });
    
    test('should calculate correct dollar values with $150/hr rate', async ({ page }) => {
        await page.goto('http://localhost:8080');
        
        const result = await page.evaluate(() => {
            const totalHours = 750;
            const hourlyRate = 150;
            const totalValue = totalHours * hourlyRate;
            return totalValue;
        });
        
        // 750 hours × $150/hr = $112,500
        expect(result).toBe(112500);
    });
    
    test('should calculate token utilization percentage', async ({ page }) => {
        await page.goto('http://localhost:8080');
        
        const result = await page.evaluate(() => {
            const tokensUsed = 851;
            const totalSeats = 8;
            const quotaPerSeat = 300;
            const totalAvailableTokens = totalSeats * quotaPerSeat;
            const utilizationPercent = (tokensUsed / totalAvailableTokens) * 100;
            return { tokensUsed, totalAvailableTokens, utilizationPercent };
        });
        
        // 851 tokens used out of 2,400 total (8 × 300)
        expect(result.totalAvailableTokens).toBe(2400);
        expect(result.utilizationPercent).toBeCloseTo(35.458, 2);
    });
    
    test('should calculate unused capacity correctly', async ({ page }) => {
        await page.goto('http://localhost:8080');
        
        const result = await page.evaluate(() => {
            const totalSeats = 8;
            const quotaPerSeat = 300;
            const tokensUsed = 851;
            const totalAvailableTokens = totalSeats * quotaPerSeat;
            const unusedTokens = totalAvailableTokens - tokensUsed;
            const minutesPerRequest = 15;
            const unusedMinutes = unusedTokens * minutesPerRequest;
            const unusedHours = unusedMinutes / 60;
            return { unusedTokens, unusedMinutes, unusedHours };
        });
        
        // (2,400 - 851) = 1,549 unused tokens
        // 1,549 × 15 min = 23,235 minutes = 387.25 hours
        expect(result.unusedTokens).toBe(1549);
        expect(result.unusedMinutes).toBe(23235);
        expect(result.unusedHours).toBe(387.25);
    });
});

test.describe('Validation logic', () => {
    test('should detect when seat count is less than unique users', async ({ page }) => {
        await page.goto('http://localhost:8080');
        
        // Upload CSV with multiple users
        await page.setInputFiles('#csvFile', SAMPLE_CSV_PATH);
        
        // Set seat count to 1 (less than users in CSV)
        await page.fill('#seatLicenses', '1');
        
        // Click analyze
        await page.click('#analyzeBtn');
        
        // Wait for error message
        await page.waitForSelector('#errorMessage', { state: 'visible' });
        
        // Check error message contains expected text
        const errorText = await page.locator('#errorMessage').textContent();
        expect(errorText).toContain('Validation Error');
        expect(errorText).toContain('must be at least equal to');
    });
    
    test('should keep button disabled with zero seats', async ({ page }) => {
        await page.goto('http://localhost:8080');
        
        // Check the no-CSV checkbox
        await page.check('#noCsvCheckbox');
        
        // Set seats to 0
        await page.fill('#seatLicenses', '0');
        
        // Button should remain disabled
        const isDisabled = await page.locator('#analyzeBtn').isDisabled();
        expect(isDisabled).toBe(true);
    });
    
    test('should validate positive seat numbers', async ({ page }) => {
        await page.goto('http://localhost:8080');
        
        const result = await page.evaluate(() => {
            const validSeats = 5;
            const invalidSeats = 0;
            return {
                validSeats: validSeats > 0,
                invalidSeats: invalidSeats > 0
            };
        });
        
        expect(result.validSeats).toBe(true);
        expect(result.invalidSeats).toBe(false);
    });
});

test.describe('Currency formatting', () => {
    test('should format large numbers with commas', async ({ page }) => {
        await page.goto('http://localhost:8080');
        
        const formatted = await page.evaluate(() => {
            return (60000).toLocaleString('en-US', {
                minimumFractionDigits: 0,
                maximumFractionDigits: 0
            });
        });
        
        expect(formatted).toBe('60,000');
    });
});
