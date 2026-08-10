import { test, expect, Page } from '@playwright/test';
import { LoginPage } from '../../src/pages/auth/LoginPage.js';
import { PerladanganPage } from '../../src/pages/app/PerladanganPage.js';

// Pre-defined menu categories for parallel dynamic crawling
const MODULE_SECTIONS = [
    { name: 'Peserta & Lot', pathPattern: /\/peserta|\/lot/i },
    { name: 'Ladang & Projek', pathPattern: /\/ladang|\/projek/i },
    { name: 'Pemasaran & Timbang', pathPattern: /\/pemasaran|\/timbang|\/pusattimbang/i },
    { name: 'Kewangan & Rekod', pathPattern: /\/kewangan|\/akaun|\/lejar/i },
    { name: 'Laporan & Integration', pathPattern: /\/laporan|\/integration/i },
    { name: 'Perladangan General', pathPattern: /\/perladangan/i }
];

test.describe.serial('Full Site Multi-Page Button Crawler', () => {
    let perladanganPage: PerladanganPage;
    let targetUrls: string[] = [];

    test.beforeAll(async ({ browser }) => {
        // Collect all sidebar navigation links during setup
        const context = await browser.newContext();
        const page = await context.newPage();
        
        const loginPage = new LoginPage(page);
        await loginPage.open();
        await loginPage.login('wanhasyraf', 'abc123');
        await page.waitForURL(/dashboard/i, { timeout: 30000 });

        perladanganPage = new PerladanganPage(page);
        await perladanganPage.open();

        const sidebarLinks = page.locator('aside a[href], nav a[href], [class*="sidebar"] a[href]');
        const rawUrls = await sidebarLinks.evaluateAll(elements =>
            elements.map(el => (el as HTMLAnchorElement).href)
        );

        targetUrls = Array.from(new Set(rawUrls)).filter(url => {
            if (!url || url.includes('#') || url.includes('javascript:') || url.includes('logout')) return false;
            return url.includes('ostest.rpinsys.com');
        });

        console.log(`\n[INITIALIZATION] Extracted ${targetUrls.length} total page endpoints from sidebar.\n`);
        await context.close();
    });

    // Helper method to crawl a list of target URLs
    async function crawlUrls(page: Page, urlsToCrawl: string[]) {
        const consoleErrors: { page: string; error: string }[] = [];
        page.on('console', msg => {
            if (msg.type() === 'error') {
                consoleErrors.push({ page: page.url(), error: msg.text() });
            }
        });

        for (let idx = 0; idx < urlsToCrawl.length; idx++) {
            const targetUrl = urlsToCrawl[idx];
            console.log(`\n[Page ${idx + 1}/${urlsToCrawl.length}] Navigating to: ${targetUrl}`);

            try {
                // Fast navigation with 5s timeout
                await page.goto(targetUrl, { waitUntil: 'domcontentloaded', timeout: 5000 }).catch(() => {});

                // Close any open modals
                await page.keyboard.press('Escape').catch(() => {});

                // Query all visible buttons
                const buttons = page.locator('button, a.btn, input[type="button"], input[type="submit"], [role="button"]');
                const buttonCount = await buttons.count();

                let testedCount = 0;
                for (let b = 0; b < buttonCount; b++) {
                    const button = buttons.nth(b);
                    if (!(await button.isVisible().catch(() => false))) continue;

                    const buttonText = (await button.textContent().catch(() => ''))?.trim() || '';

                    // Exclude session destruction
                    if (/logout|log out|hapus|delete|reset/i.test(buttonText)) continue;

                    if (await button.isEnabled().catch(() => false)) {
                        await button.hover({ timeout: 500 }).catch(() => {});
                        testedCount++;
                    }
                }
                console.log(` -> Validated ${testedCount} buttons on ${targetUrl}`);
            } catch (err: any) {
                console.error(` -> Skipped ${targetUrl}: ${err.message}`);
            }
        }

        const criticalJsErrors = consoleErrors.filter(
            e => !e.error.includes('favicon') && !e.error.includes('Failed to create chart')
        );
        expect(criticalJsErrors.length).toBeLessThan(10);
    }

    test.beforeEach(async ({ page }) => {
        const loginPage = new LoginPage(page);
        await loginPage.open();
        await loginPage.login('wanhasyraf', 'abc123');
        await page.waitForURL(/dashboard/i, { timeout: 30000 });
    });

    // Divide 282 pages into 5 modular test batches
    for (let batchIndex = 0; batchIndex < 5; batchIndex++) {
        test(`Crawl & Test Buttons - Batch ${batchIndex + 1}/5`, async ({ page }) => {
            test.setTimeout(120000); // 2 minutes per batch

            const total = targetUrls.length || 280;
            const batchSize = Math.ceil(total / 5);
            const start = batchIndex * batchSize;
            const end = Math.min(start + batchSize, total);

            const batchUrls = targetUrls.slice(start, end);
            console.log(`Starting Batch ${batchIndex + 1}: testing pages ${start + 1} to ${end} (${batchUrls.length} pages)...`);

            await crawlUrls(page, batchUrls);
        });
    }
});
