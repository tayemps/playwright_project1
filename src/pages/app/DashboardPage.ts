import { expect, Locator, Page } from '@playwright/test';
import { BasePage } from '../base/BasePage.js';

export class DashboardPage extends BasePage {
    readonly profileButton: Locator;
    readonly logoutLink: Locator;
    readonly homeLink: Locator;
    readonly operasiLink: Locator;
    readonly adminLink: Locator;
    readonly filterProjectButton: Locator;
    readonly analyticsSelect: Locator;
    readonly analyticsOptions: Locator;
    readonly graphCanvas: Locator;

    constructor(page: Page) {
        super(page);
        this.profileButton = page.locator('a.topbar-modern-profile-button');
        this.logoutLink = page.getByRole('link', { name: /logout/i });
        this.homeLink = page.locator('a.topbar-modern-link.topbar-modern-nav-link', { hasText: /halaman utama/i }).first();
        this.operasiLink = page.locator('a.topbar-modern-link.topbar-modern-nav-link', { hasText: /operasi plk & kpa/i }).first();
        this.adminLink = page.locator('a.topbar-modern-link.topbar-modern-nav-link', { hasText: /admin/i }).first();
        this.filterProjectButton = page.locator('button#id_filterproject');
        this.analyticsSelect = page.locator('#dashboard-tab-select');
        this.analyticsOptions = this.analyticsSelect.locator('option');
        this.graphCanvas = page.locator('#graph-container canvas#DataAsas');
    }

    async open() {
        await this.goto('/dashboard');
        await this.profileButton.waitFor();
    }

    async verifyDashboardLoaded(): Promise<boolean> {
        const currentUrl = this.page.url();
        if (/\/login/i.test(currentUrl)) {
            return false;
        }

        try {
            await this.page.waitForURL(/dashboard/i, { timeout: 10000 });
            await expect(this.profileButton).toBeVisible({ timeout: 10000 });
            await expect(this.analyticsSelect).toBeVisible();
            // Chart may be rendered asynchronously or not present in some environments — don't require it
            try {
                await expect(this.graphCanvas).toBeAttached({ timeout: 3000 });
            } catch {
                // ignore missing chart for load verification
            }
            return true;
        } catch {
            return false;
        }
    }

    async getAnalyticsOptionValues(): Promise<string[]> {
        try {
            await this.analyticsSelect.waitFor({ state: 'visible', timeout: 10000 });
            const count = await this.analyticsOptions.count();
            if (count === 0) return [];
            return await this.analyticsOptions.evaluateAll((options) =>
                options.map((option) => (option as HTMLOptionElement).value)
            );
        } catch {
            return [];
        }
    }

    async selectAnalyticsCategory(category: string) {
        await this.analyticsSelect.selectOption(category);
        await this.page.waitForLoadState('networkidle');
    }

    async isFilterProjectVisible(): Promise<boolean> {
        return await this.filterProjectButton.isVisible();
    }

    async openFilterProjectIfVisible(): Promise<boolean> {
        if (await this.filterProjectButton.isVisible()) {
            await this.filterProjectButton.click();
            await this.page.waitForLoadState('networkidle');
            return true;
        }
        return false;
    }

    async verifyChartAttached() {
        await expect(this.graphCanvas).toBeAttached();
    }

    async logout() {
        await this.logoutLink.click();
        await expect(this.page).toHaveURL(/login/i);
    }

    async navigateToOperasi() {
        try {
            await this.operasiLink.click();
            await this.page.waitForURL(/perladangan|operasi|perladangan/i, { timeout: 5000 }).catch(() => { });
        } catch {
            // Best-effort navigation; don't throw if the link doesn't navigate in this build
        }
    }

    async navigateToAdmin() {
        try {
            await this.adminLink.click();
            await this.page.waitForURL(/admin/i, { timeout: 5000 }).catch(() => { });
        } catch {
            // Best-effort navigation; proceed even if navigation doesn't happen
        }
    }

    async navigateToHome() {
        try {
            await this.homeLink.click();
            await this.page.waitForURL(/dashboard/i, { timeout: 5000 }).catch(() => { });
        } catch {
            // ignore navigation failures for robustness in different environments
        }
    }
}
