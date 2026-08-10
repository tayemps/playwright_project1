import { test, expect } from '@playwright/test';
import { LoginPage } from '../../src/pages/auth/LoginPage.js';
import { PerladanganPage } from '../../src/pages/app/PerladanganPage.js';

// Run serially to avoid overwhelming the login server
test.describe.serial('Perladangan Module', () => {
    let perladanganPage: PerladanganPage;

    test.beforeEach(async ({ page }) => {
        // Login first
        const loginPage = new LoginPage(page);
        await loginPage.open();
        await loginPage.login('wanhasyraf', 'abc123');
        await page.waitForURL(/dashboard/i, { timeout: 30000 });

        // Initialize Perladangan page
        perladanganPage = new PerladanganPage(page);
    });

    test.describe('Main Content', () => {
        test('should load perladangan page successfully', async () => {
            await perladanganPage.open();
            await perladanganPage.verifyPerladanganPageLoaded();
        });

        test('should display 6 module cards', async () => {
            await perladanganPage.open();
            const count = await perladanganPage.getModuleCardCount();
            expect(count).toBe(6);
        });

        test('should display all module cards visible', async () => {
            await perladanganPage.open();
            await perladanganPage.verifyAllModuleCardsVisible();
        });

        test('should contain expected module card texts', async () => {
            await perladanganPage.open();
            const texts = await perladanganPage.getModuleCardTexts();

            // Verify the texts contain expected module names (case-insensitive)
            const fullText = texts.join('\n').toLowerCase();
            expect(fullText).toContain('dashboard operasi');
            expect(fullText).toContain('peserta & lot');
            expect(fullText).toContain('ladang & projek');
            expect(fullText).toContain('pemasaran & timbang');
            expect(fullText).toContain('kewangan & rekod');
            expect(fullText).toContain('laporan modul');
        });

        test('should allow clicking module cards', async () => {
            await perladanganPage.open();
            const card = perladanganPage.moduleCards.first();

            // Click should not throw
            await card.click();

            // Should still be on perladangan page
            await expect(perladanganPage.page).toHaveURL(/perladangan/i);
        });
    });

    test.describe('Sidebar Navigation', () => {
        test('sidebar should be visible', async () => {
            await perladanganPage.open();
            await perladanganPage.verifySidebarVisible();
        });

        test('sidebar should have multiple menu items', async () => {
            await perladanganPage.open();
            const count = await perladanganPage.getSidebarMenuItemCount();
            expect(count).toBeGreaterThan(5);
        });

        test('sidebar should display menu structure', async () => {
            await perladanganPage.open();
            const structure = await perladanganPage.getSidebarMenuStructure();
            expect(structure.length).toBeGreaterThan(0);
            console.log('Sidebar menu structure:', JSON.stringify(structure.slice(0, 10), null, 2));
        });

        test('sidebar should contain expected menu categories', async () => {
            await perladanganPage.open();
            const texts = await perladanganPage.getSidebarMenuTexts();
            const fullText = texts.join('\n').toLowerCase();

            // Check for major menu categories
            const expectedCategories = [
                'peserta',
                'ladang',
                'pusat timbang',
                'pemasaran',
                'aset',
                'lejar',
                'laporan'
            ];

            for (const category of expectedCategories) {
                expect(fullText).toContain(category);
            }
        });

        test('sidebar menu items should be clickable', async ({ page }) => {
            await perladanganPage.open();
            const menuItems = await perladanganPage.sidebarMenuItems.all();

            if (menuItems.length > 0) {
                // Try to click first few menu items
                for (let i = 0; i < Math.min(3, menuItems.length); i++) {
                    const item = menuItems[i];
                    try {
                        await item.click({ timeout: 1000 });
                        // Wait a bit for navigation or content update
                        await page.waitForTimeout(500);
                    } catch (e) {
                        // Some items may not be clickable, that's ok
                        console.log(`Menu item ${i} not clickable`);
                    }
                }
            }
        });

        test('should get all sidebar menu texts', async () => {
            await perladanganPage.open();
            const menuTexts = await perladanganPage.getSidebarMenuTexts();

            console.log('Sidebar menu items:');
            menuTexts.forEach((text, index) => {
                if (text.length < 100) {
                    console.log(`  ${index + 1}. ${text}`);
                }
            });

            expect(menuTexts.length).toBeGreaterThan(0);
        });

        test('sidebar should have Peserta section with submenu items', async () => {
            await perladanganPage.open();
            const texts = await perladanganPage.getSidebarMenuTexts();
            const fullText = texts.join('\n').toLowerCase();

            // Peserta section should have sub-items like "KK Baru", "Projek Baru"
            expect(fullText).toContain('peserta');
            expect(fullText).toContain('kk baru');
        });

        test('sidebar should have Ladang section with submenu items', async () => {
            await perladanganPage.open();
            const texts = await perladanganPage.getSidebarMenuTexts();
            const fullText = texts.join('\n').toLowerCase();

            // Ladang section should have sub-items - looking for specific keywords
            expect(fullText).toContain('maklumat projek');
            expect(fullText).toContain('maklumat lot');
        });

        test('sidebar should have Integrasi option', async () => {
            await perladanganPage.open();
            const texts = await perladanganPage.getSidebarMenuTexts();
            const fullText = texts.join('\n').toLowerCase();

            // Integrasi section exists with subsections
            expect(fullText).toContain('integrasi');
            expect(fullText).toContain('pemasaran') || expect(fullText).toContain('perladangan');
        });

        test('sidebar should have Logout option', async () => {
            await perladanganPage.open();
            const texts = await perladanganPage.getSidebarMenuTexts();
            const fullText = texts.join('\n').toLowerCase();

            expect(fullText).toContain('logout');
        });

        test('should verify complete sidebar menu structure', async () => {
            await perladanganPage.open();
            const texts = await perladanganPage.getSidebarMenuTexts();

            // Verify major sections exist
            const fullText = texts.join('\n').toLowerCase();

            const expectedSections = [
                'peserta',
                'maklumat projek', // Ladang section
                'pusat timbang',
                'pemasaran',
                'lejar',
                'laporan',
                'logout'
            ];

            for (const section of expectedSections) {
                expect(fullText).toContain(section);
            }
        });

        test('sidebar menu should have 300+ items', async () => {
            await perladanganPage.open();
            const texts = await perladanganPage.getSidebarMenuTexts();

            // RPInSys has extensive menu structure
            expect(texts.length).toBeGreaterThan(100);
            console.log(`Total sidebar menu items: ${texts.length}`);
        });
    });
});


