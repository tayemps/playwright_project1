import { expect } from '@playwright/test';
import { test } from '../fixtures/auth-fixture.js';
import { DashboardPage } from '../../src/pages/app/DashboardPage.js';
import { LoginPage } from '../../src/pages/auth/LoginPage.js';
import { ensureDashboardReady } from '../fixtures/auth-helpers.ts';

test.describe.configure({ mode: 'serial' });

const dashboardPath = process.env.RPINSYS_DASHBOARD_PATH ?? '/dashboard';
const loginPath = process.env.RPINSYS_LOGIN_PATH ?? '/login';
const analyticsCategory = process.env.RPINSYS_DASHBOARD_CATEGORY ?? '#bilssk';
const analyticsCategoryAlt = process.env.RPINSYS_DASHBOARD_CATEGORY_ALT ?? '#bilmemo';
const authUsername = process.env.RPINSYS_TEST_USER ?? '';
const authPassword = process.env.RPINSYS_TEST_PASS ?? '';

test.describe('RPInSys dashboard regression', () => {
    test('dashboard hero and topbar regression checks', async ({ page }) => {
        const dashboard = new DashboardPage(page);
        const login = new LoginPage(page);

        await ensureDashboardReady(page, dashboard, login, authUsername, authPassword, dashboardPath);

        await expect(dashboard.homeLink).toBeVisible();
        await expect(dashboard.operasiLink).toBeVisible();
        await expect(dashboard.adminLink).toBeVisible();
        await expect(dashboard.logoutLink).toBeVisible();

        await expect(page.locator('span.dashboard-hero-kicker')).toBeVisible();
        await expect(page.locator('div.dashboard-hero-copy p')).toContainText(/pantau carta, laporan/i);
        await expect(page.getByText(/pemantauan analitik/i)).toBeVisible();
    });

    test('dashboard analytics and chart regression checks', async ({ page }) => {
        const dashboard = new DashboardPage(page);
        const login = new LoginPage(page);

        await ensureDashboardReady(page, dashboard, login, authUsername, authPassword, dashboardPath);

        const optionValues = await dashboard.getAnalyticsOptionValues();
        expect(optionValues.length).toBeGreaterThan(1);

        for (const value of optionValues) {
            await dashboard.selectAnalyticsCategory(value);
            await expect(dashboard.analyticsSelect).toHaveValue(value);
            await dashboard.verifyChartAttached();
        }

        const filterVisible = await dashboard.isFilterProjectVisible();
        expect(filterVisible).toBe(false);
        await expect(page.locator('button#id_filterproject')).toBeAttached();
    });

    test('dashboard logout and login recovery regression checks', async ({ page }) => {
        const dashboard = new DashboardPage(page);
        const login = new LoginPage(page);

        await ensureDashboardReady(page, dashboard, login, authUsername, authPassword, dashboardPath);

        await dashboard.logout();
        await expect(page).toHaveURL(new RegExp(`${loginPath.replace(/\//g, '\\/')}.*`, 'i'));

        await login.login(authUsername, authPassword);
        await login.expectSuccessfulLogin();
    });

    test('dashboard navigation regression checks', async ({ page }) => {
        const dashboard = new DashboardPage(page);
        const login = new LoginPage(page);

        await ensureDashboardReady(page, dashboard, login, authUsername, authPassword, dashboardPath);

        await dashboard.navigateToOperasi();
        await expect(page).toHaveURL(/perladangan/i);
        await expect(page.getByRole('heading', { name: /modul operasi perladangan/i })).toBeVisible();

        await ensureDashboardReady(page, dashboard, login, authUsername, authPassword, dashboardPath);

        await dashboard.navigateToAdmin();
        await expect(page).toHaveURL(/admin/i);
        await expect(page.getByRole('heading', { name: /admin/i })).toBeVisible();

        await ensureDashboardReady(page, dashboard, login);

        await dashboard.navigateToHome();
        await expect(page).toHaveURL(/dashboard/i);
        await expect(page.getByRole('heading', { name: /selamat datang/i })).toBeVisible();
    });
});
