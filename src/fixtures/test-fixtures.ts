import { test as base, expect, type Page } from '@playwright/test';
import { LoginPage } from '../pages/auth/LoginPage.js';
import { HomePage } from '../pages/app/HomePage.js';

type Fixtures = {
    loginPage: LoginPage;
    homePage: HomePage;
};

export const test = base.extend<Fixtures>({
    loginPage: async ({ page }, use) => {
        await use(new LoginPage(page));
    },
    homePage: async ({ page }, use) => {
        await use(new HomePage(page));
    },
});

export { expect };
