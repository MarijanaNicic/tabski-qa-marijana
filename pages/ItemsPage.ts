import { Page, Locator } from "@playwright/test";

export class ItemsPage {
    readonly page: Page;
    readonly filterDropdown: Locator;
    readonly treeSwitcher: Locator;
    readonly itemRows: Locator;

    constructor(page: Page) {
        this.page = page;
        
      
        this.filterDropdown = page.locator('.ant-select')
        .filter({ hasText: 'Filter items by category/menu' });
        
    this.treeSwitcher = page.locator('.ant-select-tree-switcher-icon').first();
    this.itemRows = page.locator('tbody tr').filter({ hasNotText: 'Item Name' });
       
    }

   async filterByCategory(categoryName: string, menuName: string) {
    
    await this.filterDropdown.click();

    await this.page.locator('.ant-select-tree-treenode', { hasText: menuName })
                   .locator('.ant-select-tree-switcher').click();

    const categoryNode = this.page.locator('.ant-select-tree-node-content-wrapper', { hasText: categoryName });
    
   
    await categoryNode.waitFor({ state: 'visible', timeout: 10000 });
    await categoryNode.click({ force: true });
    
    await this.page.keyboard.press('Escape');
}}
