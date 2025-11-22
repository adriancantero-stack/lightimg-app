import { test, expect } from '@playwright/test';

test.describe('LightIMG Smoke Tests', () => {
    test('homepage loads without errors', async ({ page }) => {
        const errors: string[] = [];

        // Capture console errors
        page.on('console', (msg) => {
            if (msg.type() === 'error') {
                errors.push(msg.text());
            }
        });

        await page.goto('/');

        // Wait for page to load
        await page.waitForLoadState('networkidle');

        // Check main elements exist
        await expect(page.locator('header')).toBeVisible();
        await expect(page.getByText(/Make Images Lighter|Deixe suas imagens/i)).toBeVisible();

        // Check upload area exists
        await expect(page.locator('input[type="file"]')).toBeAttached();

        // Verify no console errors
        expect(errors).toHaveLength(0);
    });

    test('navigation works', async ({ page }) => {
        await page.goto('/');

        // Test navigation to How It Works
        const howItWorksLink = page.getByRole('link', { name: /How it works|Como funciona/i });
        await howItWorksLink.click();
        await expect(page).toHaveURL(/.*how-it-works/);

        // Navigate back to home
        await page.goto('/');

        // Test navigation to FAQ
        const faqLink = page.getByRole('link', { name: /FAQ/i });
        await faqLink.click();
        await expect(page).toHaveURL(/.*faq/);
    });

    test('privacy message is visible', async ({ page }) => {
        await page.goto('/');

        // Check that security/privacy message is displayed
        await expect(page.getByText(/processed in-memory|processadas em memória/i)).toBeVisible();
    });
});
