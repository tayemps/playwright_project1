import { expect, Locator, Page } from '@playwright/test';
import { BasePage } from '../base/BasePage.js';

export class CheckoutPage extends BasePage {
    readonly emailInput: Locator;
    readonly addressInput: Locator;
    readonly phoneInput: Locator;
    readonly submitButton: Locator;

    constructor(page: Page, private readonly url: string = '/checkout') {
        super(page);
        this.emailInput = page.getByRole('textbox', { name: /email/i });
        this.addressInput = page.getByRole('textbox', { name: /address/i });
        this.phoneInput = page.getByRole('textbox', { name: /phone|mobile/i });
        this.submitButton = page.getByRole('button', { name: /place order|checkout|submit/i });
    }

    async open() {
        await this.goto(this.url);
        await this.emailInput.waitFor();
    }

    async fillCheckoutDetails(email: string, address: string, phone: string) {
        await this.emailInput.fill(email);
        await this.addressInput.fill(address);
        await this.phoneInput.fill(phone);
        await this.submitButton.click();
    }

    async expectOrderSuccess() {
        await expect(this.page.getByText(/thank you|order placed|success/i).first()).toBeVisible();
    }

    async expectValidationError() {
        await expect(this.page.getByText(/required|invalid|error/i).first()).toBeVisible();
    }
}
