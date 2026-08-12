import type { Page } from '@playwright/test';
import { DashboardPage } from '../../src/pages/app/DashboardPage.js';
import { LoginPage } from '../../src/pages/auth/LoginPage.js';

export async function ensureDashboardReady(
    page: Page,
    dashboard: DashboardPage,
    login: LoginPage,
    username: string,
    password: string,
    dashboardPath: string = '/dashboard'
) {
    await page.goto(dashboardPath, { waitUntil: 'networkidle' });

    const loginFormVisible = await page
        .getByRole('button', { name: /^login$/i })
        .isVisible()
        .catch(() => false);
    const isLoginPage = page.url().includes('/login') || loginFormVisible;

    if (isLoginPage) {
        await login.login(username, password);
        await login.expectSuccessfulLogin();
    }

    if (!(await dashboard.verifyDashboardLoaded())) {
        throw new Error('Dashboard did not load after navigation/login fallback.');
    }
}
