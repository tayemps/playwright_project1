import { expect } from '@playwright/test';
import { test } from '../fixtures/auth-fixture.js';
import { DashboardPage } from '../../src/pages/app/DashboardPage.js';
import { LoginPage } from '../../src/pages/auth/LoginPage.js';
import { ensureDashboardReady } from '../fixtures/auth-helpers.ts';

const dashboardPath = process.env.RPINSYS_DASHBOARD_PATH ?? '/dashboard';
const authUsername = process.env.RPINSYS_TEST_USER ?? '';
const authPassword = process.env.RPINSYS_TEST_PASS ?? '';

test.describe('RPInSys dashboard smoke test', () => {
    test('loads dashboard and shows key widgets', async ({ page }) => {
        const dashboard = new DashboardPage(page);
        const login = new LoginPage(page);

        await ensureDashboardReady(page, dashboard, login, authUsername, authPassword, dashboardPath);

        await expect(page.getByRole('heading', { name: /selamat datang/i })).toBeVisible({ timeout: 15000 });
        await expect(page.locator('span.dashboard-hero-kicker')).toBeVisible();
        await expect(page.locator('div.dashboard-hero-copy p')).toContainText(/pantau carta, laporan dan ringkasan operasi harian dalam satu paparan/i);

        await expect(page.locator('a.topbar-modern-link.topbar-modern-nav-link', { hasText: /halaman utama/i })).toBeVisible();
        await expect(page.locator('a.topbar-modern-link.topbar-modern-nav-link', { hasText: /operasi plk & kpa/i })).toBeVisible();
        await expect(page.locator('a.topbar-modern-link.topbar-modern-nav-link', { hasText: /admin/i })).toBeVisible();

        await expect(page.getByText(/pemantauan analitik/i)).toBeVisible();
        const analyticsSelect = page.locator('#dashboard-tab-select');
        await expect(analyticsSelect).toBeVisible();

        const optionCount = await analyticsSelect.locator('option').count();
        expect(optionCount).toBeGreaterThan(1);

        await analyticsSelect.selectOption('#bilssk');
        await expect(analyticsSelect).toHaveValue('#bilssk');

        await analyticsSelect.selectOption('#bilmemo');
        await expect(analyticsSelect).toHaveValue('#bilmemo');

        await expect(page.locator('#graph-container canvas#DataAsas')).toBeAttached();
        await expect(page.locator('button#id_filterproject')).toBeAttached();
    });
});
