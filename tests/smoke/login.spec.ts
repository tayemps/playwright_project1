import { test, expect } from '@playwright/test';

const loginUrl = process.env.RPINSYS_BASE_URL;
const username = process.env.RPINSYS_TEST_USER;
const password = process.env.RPINSYS_TEST_PASS;

if (!loginUrl) throw new Error('Missing RPINSYS_BASE_URL in environment configuration');
if (!username) throw new Error('Missing RPINSYS_TEST_USER in environment configuration');
if (!password) throw new Error('Missing RPINSYS_TEST_PASS in environment configuration');

test.describe('smoke login', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto(loginUrl);
        await expect(page.getByRole('heading', { name: /login to your account/i })).toBeVisible();
        await expect(page.locator('form#login-form')).toBeVisible();
    });

    test('should log in using secure env credentials and verify successful dashboard access', async ({ page }) => {
        const usernameInput = page.getByPlaceholder('Username');
        const passwordInput = page.getByPlaceholder('Password');
        const loginButton = page.getByRole('button', { name: /^login$/i });

        await expect(usernameInput).toBeVisible();
        await expect(passwordInput).toBeVisible();
        await usernameInput.fill(username);
        await passwordInput.fill(password);

        await Promise.all([
            page.waitForNavigation({ waitUntil: 'networkidle' }),
            loginButton.click(),
        ]);

        await expect(page.locator('div.alert.alert-success')).toBeVisible();
        await expect(page).toHaveURL(/dashboard|home|profile/i);
    });
});