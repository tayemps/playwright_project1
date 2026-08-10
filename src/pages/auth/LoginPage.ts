import { expect, Locator, Page } from '@playwright/test';
import { BasePage } from '../base/BasePage.js';

export class LoginPage extends BasePage {
    readonly usernameInput: Locator;
    readonly passwordInput: Locator;
    readonly loginButton: Locator;

    constructor(page: Page) {
        super(page);
        this.usernameInput = page.getByRole('textbox', { name: /username/i });
        this.passwordInput = page.getByRole('textbox', { name: /password/i });
        this.loginButton = page.getByRole('button', { name: /^login$/i });
    }

    async open() {
        await this.goto('http://ostest.rpinsys.com/login');
        await this.usernameInput.waitFor();
    }

    async login(username: string, password: string) {
        await this.usernameInput.fill(username);
        await this.passwordInput.fill(password);
        await this.loginButton.click();
        // Give the page a moment to process login
        await this.page.waitForTimeout(1000);
    }

    async expectSuccessfulLogin() {
        await expect(this.page).toHaveURL(/dashboard/i);
        await expect(this.page.getByRole('heading', { name: /selamat datang/i })).toBeVisible();
    }

    async expectFailedLogin() {
        await expect(this.page).toHaveURL(/login/i);
        await expect(this.usernameInput).toBeVisible();
    }
}
