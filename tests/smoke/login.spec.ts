import { test } from '@playwright/test';
import { LoginPage } from '../../src/pages/auth/LoginPage.js';

const username = process.env.RPINSYS_TEST_USER ?? 'wanhasyraf';
const password = process.env.RPINSYS_TEST_PASS ?? 'abc123';

if (!process.env.RPINSYS_BASE_URL) {
    throw new Error('Missing RPINSYS_BASE_URL in environment configuration');
}

test.describe('smoke login', () => {
    test('should log in and verify the dashboard with valid credentials', async ({ page }) => {
        const loginPage = new LoginPage(page);

        await loginPage.open();
        await loginPage.login(username, password);
        await loginPage.expectSuccessfulLogin();
    });
});  
