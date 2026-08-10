import { Page, Locator } from '@playwright/test';

export class BasePage {
    readonly page: Page;

    constructor(page: Page) {
        this.page = page;
    }

    async goto(path = '/') {
        await this.page.goto(path);
    }

    async waitForLoaded() {
        await this.page.waitForLoadState('domcontentloaded');
    }

    async getTitle() {
        return this.page.title();
    }

    async getLocator(selector: string): Promise<Locator> {
        return this.page.locator(selector);
    }
}
