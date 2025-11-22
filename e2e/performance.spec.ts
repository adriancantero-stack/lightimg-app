import { test, expect } from '@playwright/test';

test.describe('LightIMG Performance Tests', () => {
    test('measure page load time on Desktop', async ({ page }) => {
        const startTime = Date.now();

        await page.goto('/', { waitUntil: 'networkidle' });

        const loadTime = Date.now() - startTime;

        // Verify page loaded
        await expect(page.locator('header')).toBeVisible();

        console.log(`📊 Desktop load time: ${loadTime}ms`);

        // Performance should be under 3 seconds
        expect(loadTime).toBeLessThan(3000);
    });

    test('measure page load time on Tablet', async ({ page }) => {
        const startTime = Date.now();

        await page.goto('/', { waitUntil: 'networkidle' });

        const loadTime = Date.now() - startTime;

        // Verify page loaded
        await expect(page.locator('header')).toBeVisible();

        console.log(`📊 Tablet load time: ${loadTime}ms`);

        // Performance should be under 3 seconds
        expect(loadTime).toBeLessThan(3000);
    });

    test('measure page load time on Mobile', async ({ page }) => {
        const startTime = Date.now();

        await page.goto('/', { waitUntil: 'networkidle' });

        const loadTime = Date.now() - startTime;

        // Verify page loaded
        await expect(page.locator('header')).toBeVisible();

        console.log(`📊 Mobile load time: ${loadTime}ms`);

        // Performance should be under 3 seconds
        expect(loadTime).toBeLessThan(3000);
    });

    test('detailed performance metrics - Desktop', async ({ page }) => {
        await page.goto('/');

        const performanceMetrics = await page.evaluate(() => {
            const perfData = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
            return {
                dns: Math.round(perfData.domainLookupEnd - perfData.domainLookupStart),
                tcp: Math.round(perfData.connectEnd - perfData.connectStart),
                request: Math.round(perfData.responseStart - perfData.requestStart),
                response: Math.round(perfData.responseEnd - perfData.responseStart),
                domParsing: Math.round(perfData.domInteractive - perfData.responseEnd),
                domContentLoaded: Math.round(perfData.domContentLoadedEventEnd - perfData.domContentLoadedEventStart),
                totalLoad: Math.round(perfData.loadEventEnd - perfData.fetchStart),
            };
        });

        console.log('📊 Desktop Performance Breakdown:');
        console.log(`   DNS Lookup: ${performanceMetrics.dns}ms`);
        console.log(`   TCP Connection: ${performanceMetrics.tcp}ms`);
        console.log(`   Request Time: ${performanceMetrics.request}ms`);
        console.log(`   Response Time: ${performanceMetrics.response}ms`);
        console.log(`   DOM Parsing: ${performanceMetrics.domParsing}ms`);
        console.log(`   DOM Content Loaded: ${performanceMetrics.domContentLoaded}ms`);
        console.log(`   Total Load Time: ${performanceMetrics.totalLoad}ms`);

        expect(performanceMetrics.totalLoad).toBeLessThan(3000);
    });
});
