import { Locator, Page } from '@playwright/test';
import { BasePage } from '../base/BasePage.js';

export class HomePage extends BasePage {
    readonly welcomeHeading: Locator;

    constructor(page: Page) {
        super(page);
        this.welcomeHeading = page.locator('h1');
    }

    async openDashboard() {
        await this.goto('/');
    }
}
