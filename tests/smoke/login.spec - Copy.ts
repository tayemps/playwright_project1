import { test } from '@playwright/test';
import { LoginPage } from '../../src/pages/auth/LoginPage.js';

test.describe('Login flow', () => {
    test('allows a valid user to sign in', async ({ page }) => {
        const loginPage = new LoginPage(page);

        await loginPage.open();
        await loginPage.login('wanhasyraf', 'abc123');
        await page.waitForURL(/dashboard/i, { timeout: 30000 });
        await loginPage.expectSuccessfulLogin();
    });

    test('rejects invalid credentials', async ({ page }) => {
        const loginPage = new LoginPage(page);

        await loginPage.open();
        await loginPage.login('wrong-user', 'wrong-pass');
        await loginPage.expectFailedLogin();
    });
});
