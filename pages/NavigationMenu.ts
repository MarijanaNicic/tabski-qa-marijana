import { Locator, Page } from "@playwright/test";

export class NavigationMenu {
    readonly page: Page;
    readonly inventoryMenu: Locator;
    readonly categoriesLink: Locator;
    readonly itemsLink: Locator;

    constructor(page: Page) {
        this.page = page;
        
        this.inventoryMenu = page.locator('.ant-menu-submenu-title', { hasText: 'Inventory' });

        this.categoriesLink = page.locator('[data-menu-id*="/inventory/categories"]');
        this.itemsLink = page.locator('[data-menu-id*="/inventory/items"]');
    }


    async expandInventoryIfNeeded() {
     
        const isOpen = await this.inventoryMenu.evaluate(el => {
            const submenu = el.closest('.ant-menu-submenu');
            return submenu ? submenu.classList.contains('ant-menu-submenu-open') : false;
        });

        if (!isOpen) {
            await this.inventoryMenu.click();
            await this.categoriesLink.waitFor({ state: 'visible' });
        }
    }

    async goToCategories() {
        await this.expandInventoryIfNeeded();
        await this.categoriesLink.click();
        await this.page.waitForURL(/.*\/inventory\/categories/);
    }

    async goToItems() {
        await this.expandInventoryIfNeeded();
        await this.itemsLink.click();
        await this.page.waitForURL(/.*\/inventory\/items/);
    }
}