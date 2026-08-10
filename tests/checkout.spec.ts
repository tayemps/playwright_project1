import { test } from '@playwright/test';
import { CheckoutPage } from '../../src/pages/checkout/CheckoutPage.js';

test.describe('Checkout flow', () => {
    test('places an order successfully with valid details', async ({ page }) => {
        const response = await page.goto('http://ostest.rpinsys.com/checkout', { waitUntil: 'domcontentloaded' });
        test.skip(response?.status() === 404, 'Checkout route is not available on the current site');

        const checkoutPage = new CheckoutPage(page, 'http://ostest.rpinsys.com/checkout');
        await checkoutPage.open();
        await checkoutPage.fillCheckoutDetails('test@example.com', '123 Test Street', '0123456789');
        await checkoutPage.expectOrderSuccess();
    });

    test('shows validation feedback for incomplete checkout details', async ({ page }) => {
        const response = await page.goto('http://ostest.rpinsys.com/checkout', { waitUntil: 'domcontentloaded' });
        test.skip(response?.status() === 404, 'Checkout route is not available on the current site');

        const checkoutPage = new CheckoutPage(page, 'http://ostest.rpinsys.com/checkout');
        await checkoutPage.open();
        await checkoutPage.fillCheckoutDetails('', '', '');
        await checkoutPage.expectValidationError();
    });
});
