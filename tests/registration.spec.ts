import { test } from '@playwright/test';
import { RegistrationPage } from '../../src/pages/auth/RegistrationPage.js';

test.describe('Registration flow', () => {
    test('registers successfully with valid data', async ({ page }) => {
        const response = await page.goto('http://ostest.rpinsys.com/register', { waitUntil: 'domcontentloaded' });
        test.skip(response?.status() === 404, 'Registration route is not available on the current site');

        const registrationPage = new RegistrationPage(page, 'http://ostest.rpinsys.com/register');
        await registrationPage.open();
        await registrationPage.register('Test User', 'test@example.com', 'Pass123!', 'Pass123!');
        await registrationPage.expectSuccessfulRegistration();
    });

    test('shows validation feedback for invalid data', async ({ page }) => {
        const response = await page.goto('http://ostest.rpinsys.com/register', { waitUntil: 'domcontentloaded' });
        test.skip(response?.status() === 404, 'Registration route is not available on the current site');

        const registrationPage = new RegistrationPage(page, 'http://ostest.rpinsys.com/register');
        await registrationPage.open();
        await registrationPage.register('Test User', 'invalid-email', 'short', 'different');
        await registrationPage.expectValidationError();
    });
});
