import { test, expect } from '@playwright/test';
import { LoginPage } from '../../src/pages/auth/LoginPage.js';
import { DashboardPage } from '../../src/pages/app/DashboardPage.js';

test.describe('Dashboard - Full Page Testing', () => {
    let loginPage: LoginPage;
    let dashboardPage: DashboardPage;

    test.beforeEach(async ({ page }) => {
        loginPage = new LoginPage(page);
        dashboardPage = new DashboardPage(page);

        // Login before each test
        await loginPage.open();
        await loginPage.login('wanhasyraf', 'abc123');
        await dashboardPage.verifyDashboardLoaded();
    });

    test('dashboard loads with all main sections visible', async ({ page }) => {
        await expect(dashboardPage.welcomeHeading).toContainText(/WAN HASYRAF/i);
        await expect(dashboardPage.analyticsCategory).toBeVisible();
        await expect(dashboardPage.nodeFilter).toBeVisible();
        await expect(dashboardPage.projectChart).toBeVisible();
    });

    test('user can select different analytics categories', async () => {
        await dashboardPage.selectAnalyticsCategory('SSK');
        await dashboardPage.applyFilter();
        await expect(dashboardPage.page).toHaveURL(/dashboard/);
    });

    test('user can navigate to OPERASI PLK & KPA section', async () => {
        await dashboardPage.navigateTo('operasi');
        await expect(dashboardPage.page).toHaveURL(/perladangan/);
    });

    test('user can navigate to Admin section', async () => {
        await dashboardPage.navigateTo('admin');
        await expect(dashboardPage.page).toHaveURL(/admin/);
    });

    test('user can clear applied filters', async () => {
        await dashboardPage.applyFilter();
        await dashboardPage.clearFilters();
        await expect(dashboardPage.page).toHaveURL(/dashboard/);
    });

    test('user can logout from dashboard', async () => {
        await dashboardPage.logout();
        await expect(dashboardPage.page).toHaveURL(/login/);
    });

    test('dashboard displays user profile information', async () => {
        await expect(dashboardPage.userProfile).toBeVisible();
    });

    test('analytics dropdown has multiple category options', async ({ page }) => {
        await dashboardPage.categoryDropdown.click();
        const options = await page.locator('[role="option"]').count();
        expect(options).toBeGreaterThan(1);
    });

    test('filter button is clickable and responsive', async () => {
        await dashboardPage.filterButton.click();
        await dashboardPage.page.waitForLoadState('networkidle');
        await expect(dashboardPage.page).toHaveURL(/dashboard/);
    });

    test('home navigation returns to dashboard', async () => {
        await dashboardPage.navigateTo('home');
        await expect(dashboardPage.page).toHaveURL(/^http:\/\/ostest\.rpinsys\.com\/?$/);
    });
});
