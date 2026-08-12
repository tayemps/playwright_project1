import * as dotenv from 'dotenv';
import { chromium, expect } from '@playwright/test';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';
import { existsSync, mkdirSync } from 'fs';
import { LoginPage } from './src/pages/auth/LoginPage.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: resolve(__dirname, '.env') });

const loginUrl = process.env.RPINSYS_BASE_URL ?? 'http://ostest.rpinsys.com/login';
const username = process.env.RPINSYS_TEST_USER;
const password = process.env.RPINSYS_TEST_PASS;
const storageStatePath = resolve(__dirname, 'test-results', 'auth-storage-state.json');

if (!username) throw new Error('Missing RPINSYS_TEST_USER in environment configuration');
if (!password) throw new Error('Missing RPINSYS_TEST_PASS in environment configuration');

export default async (): Promise<void> => {
    if (!existsSync(storageStatePath)) {
        mkdirSync(resolve(__dirname, 'test-results'), { recursive: true });

        const browser = await chromium.launch();
        const page = await browser.newPage();

        await page.goto(loginUrl, { waitUntil: 'domcontentloaded' });

        const loginPage = new LoginPage(page);
        await loginPage.usernameInput.fill(username);
        await loginPage.passwordInput.fill(password);

        await Promise.all([
            page.waitForNavigation({ waitUntil: 'networkidle' }),
            loginPage.loginButton.click(),
        ]);

        await expect(loginPage.logoutLink).toBeVisible({ timeout: 30000 });
        await page.context().storageState({ path: storageStatePath });
        await browser.close();

        console.log(`Saved authenticated storage state to ${storageStatePath}`);
    } else {
        console.log(`Reusing existing authenticated storage state from ${storageStatePath}`);
    }
};
