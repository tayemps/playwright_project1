import { expect, Locator, Page } from '@playwright/test';
import { BasePage } from '../base/BasePage.js';

export class DashboardPage extends BasePage {
    readonly userProfile: Locator;
    readonly logoutLink: Locator;
    readonly homeLink: Locator;
    readonly filterButton: Locator;
    readonly clearButton: Locator;
    readonly categoryDropdown: Locator;

    constructor(page: Page) {
        super(page);
        this.userProfile = page.locator('img[src*="avatar"]');
        this.logoutLink = page.getByRole('link', { name: /logout/i });
        this.homeLink = page.getByRole('link', { name: /halaman utama/i });
        this.filterButton = page.getByRole('button', { name: /tapis senarai/i });
        this.clearButton = page.getByRole('link', { name: /kosongkan/i });
        this.categoryDropdown = page.locator('select').first();
    }

    async open() {
        await this.goto('http://ostest.rpinsys.com/dashboard');
        await this.userProfile.waitFor();
    }

    async verifyDashboardLoaded() {
        await expect(this.page).toHaveURL(/dashboard/i);
        await expect(this.userProfile).toBeVisible();
    }

    async selectAnalyticsCategory(category: string) {
        await this.categoryDropdown.selectOption(new RegExp(category, 'i'));
        await this.page.waitForLoadState('networkidle');
    }

    async applyFilter() {
        await this.filterButton.click();
        await this.page.waitForLoadState('networkidle');
    }

    async clearFilters() {
        await this.clearButton.click();
        await this.page.waitForLoadState('networkidle');
    }

    async logout() {
        await this.logoutLink.click();
        await expect(this.page).toHaveURL(/login/i);
    }

    async navigateToOperasi() {
        await this.page.locator('a:has-text("OPERASI PLK & KPA")').first().click();
        await this.page.waitForLoadState('networkidle');
    }

    async navigateToAdmin() {
        await this.page.locator('a:has-text("Admin")').first().click();
        await this.page.waitForLoadState('networkidle');
    }

    async navigateToHome() {
        await this.homeLink.click();
        await this.page.waitForLoadState('networkidle');
    }
}
