import { expect, Locator, Page } from '@playwright/test';
import { BasePage } from '../base/BasePage.js';

export class RegistrationPage extends BasePage {
    readonly fullNameInput: Locator;
    readonly emailInput: Locator;
    readonly passwordInput: Locator;
    readonly confirmPasswordInput: Locator;
    readonly submitButton: Locator;

    constructor(page: Page, private readonly url: string = 'http://ostest.rpinsys.com/register') {
        super(page);
        this.fullNameInput = page.getByRole('textbox', { name: /full name|name/i });
        this.emailInput = page.getByRole('textbox', { name: /email/i });
        this.passwordInput = page.getByRole('textbox', { name: /password/i });
        this.confirmPasswordInput = page.getByRole('textbox', { name: /confirm password|confirm/i });
        this.submitButton = page.getByRole('button', { name: /register|sign up|create account/i });
    }

    async open() {
        await this.goto(this.url);
        await this.fullNameInput.waitFor();
    }

    async register(fullName: string, email: string, password: string, confirmPassword: string) {
        await this.fullNameInput.fill(fullName);
        await this.emailInput.fill(email);
        await this.passwordInput.fill(password);
        await this.confirmPasswordInput.fill(confirmPassword);
        await this.submitButton.click();
    }

    async expectSuccessfulRegistration() {
        await expect(this.page.getByText(/thank you|welcome|account created|success/i).first()).toBeVisible();
    }

    async expectValidationError() {
        await expect(this.page.getByText(/required|invalid|error/i).first()).toBeVisible();
    }
}
