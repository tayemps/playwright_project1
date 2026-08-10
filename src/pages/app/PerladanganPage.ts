import { expect, Locator, Page } from '@playwright/test';
import { BasePage } from '../base/BasePage.js';

export class PerladanganPage extends BasePage {
    readonly pageTitle: Locator;
    readonly pageDescription: Locator;
    readonly moduleCards: Locator;
    readonly sidebar: Locator;
    readonly sidebarMenu: Locator;
    readonly sidebarMenuItems: Locator;

    constructor(page: Page) {
        super(page);
        // Main page heading
        this.pageTitle = page.locator('h1:has-text("PERLADANGAN")');
        // Page description
        this.pageDescription = page.getByRole('heading', { name: /Modul operasi perladangan/i });
        // All module cards
        this.moduleCards = page.locator('.perladangan-home-card');
        // Sidebar elements
        this.sidebar = page.locator('aside, .sidebar, nav[role="navigation"], [class*="sidebar"]').first();
        this.sidebarMenu = page.locator('ul[class*="menu"], nav ul, aside ul').first();
        this.sidebarMenuItems = page.locator('aside li, nav li, [class*="sidebar"] li, .menu-item');
    }

    async open() {
        await this.goto('http://ostest.rpinsys.com/perladangan');
        await this.pageTitle.waitFor({ timeout: 10000 });
    }

    async verifyPerladanganPageLoaded() {
        await expect(this.page).toHaveURL(/perladangan/i);
        await expect(this.pageTitle).toBeVisible();
        await expect(this.pageDescription).toBeVisible();
    }

    async getModuleCardCount() {
        return await this.moduleCards.count();
    }

    async verifyAllModuleCardsVisible() {
        const count = await this.getModuleCardCount();
        expect(count).toBe(6);

        // Verify each card is visible
        for (let i = 0; i < count; i++) {
            const card = this.moduleCards.nth(i);
            await expect(card).toBeVisible();
        }
    }

    async getModuleCardTexts() {
        const cards = await this.moduleCards.all();
        const texts = [];

        for (const card of cards) {
            const text = await card.textContent();
            texts.push(text);
        }

        return texts;
    }

    async clickModuleCard(index: number) {
        const card = this.moduleCards.nth(index);
        await card.click();
    }

    // Sidebar methods
    async verifySidebarVisible() {
        await expect(this.sidebar).toBeVisible();
    }

    async getSidebarMenuItemCount() {
        return await this.sidebarMenuItems.count();
    }

    async getSidebarMenuTexts() {
        const items = await this.sidebarMenuItems.all();
        const texts = [];

        for (const item of items) {
            const text = await item.textContent();
            if (text && text.trim()) {
                texts.push(text.trim());
            }
        }

        return texts;
    }

    async verifySidebarHasMenuItems() {
        const count = await this.getSidebarMenuItemCount();
        expect(count).toBeGreaterThan(0);
    }

    async clickSidebarMenuItem(menuText: string) {
        const menuItem = this.page.locator(`li:has-text("${menuText}"), a:has-text("${menuText}"), button:has-text("${menuText}")`).first();
        await menuItem.click();
    }

    async verifySidebarMenuContainsItems(expectedItems: string[]) {
        const texts = await this.getSidebarMenuTexts();
        const fullText = texts.join('\n').toLowerCase();

        for (const item of expectedItems) {
            expect(fullText).toContain(item.toLowerCase());
        }
    }

    async expandSidebarSubmenu(menuText: string) {
        // Find the menu item and check if it has a submenu
        const menuItem = this.page.locator(`li:has-text("${menuText}"), a:has-text("${menuText}")`).first();
        const hasSubmenu = await menuItem.locator('+ ul, ~ ul, ul').count();

        if (hasSubmenu > 0) {
            await menuItem.click();
        }
    }

    async getSidebarMenuStructure() {
        return await this.page.evaluate(() => {
            const items: any[] = [];
            const lis = document.querySelectorAll('aside li, nav li, [class*="sidebar"] li');

            lis.forEach(li => {
                const text = li.textContent?.trim() || '';
                const hasSubmenu = li.querySelector('ul') !== null;
                const level = (li.getAttribute('data-level') || '0');

                if (text) {
                    items.push({
                        text: text.substring(0, 50), // First 50 chars
                        hasSubmenu,
                        level
                    });
                }
            });

            return items;
        });
    }
}
