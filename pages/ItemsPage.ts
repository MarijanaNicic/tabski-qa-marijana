import { Locator, Page, expect } from "@playwright/test";

export class ItemsPage {
    readonly page: Page;
    readonly filterDropdown: Locator;
    readonly tableRows: Locator;

    constructor(page: Page) {
        this.page = page;
        this.filterDropdown = page.locator('.ant-select-selector').filter({ hasText: 'Filter items by category/menu' });
        this.tableRows = page.locator('tr[data-testid^="items-table-row-"]');
    }

    /**
     * Filtrira artikle na osnovu dinamičkog stabla (Food ili Drink)
     */
    async filterByCategory(menuType: 'Food Menu' | 'Drink Menu', categoryName: string) {
        await this.filterDropdown.click();

        // Pronalazimo čvor na osnovu prosleđenog tipa menija ('Food Menu' ili 'Drink Menu')
        const menuNode = this.page.locator('.ant-select-tree-treenode', { hasText: menuType });
        const switcher = menuNode.locator('.ant-select-tree-switcher');
        
        // Provera da li je grana zatvorena (klasa iz Ant Design-a)
        const isClosed = await switcher.evaluate(el => el.classList.contains('ant-select-tree-switcher_close'));
        if (isClosed) {
            await switcher.click();
        }

        // Klik na našu unikatnu podkategoriju
        const categoryOption = this.page.locator('.ant-select-tree-node-content-wrapper', { hasText: categoryName });
        await categoryOption.waitFor({ state: 'visible' });
        await categoryOption.click();

        // Zatvaranje dropdown-a i čekanje stabilizacije
        await this.page.keyboard.press('Escape');
        await this.page.waitForLoadState('networkidle');
    }

    async verifyFilteredItemsCount(expectedCount: number = 2) {
        await expect(this.tableRows).toHaveCount(expectedCount);
    }
}