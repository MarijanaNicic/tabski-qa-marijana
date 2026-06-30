import { Locator, Page, expect } from "@playwright/test";

export class CategoriesPage {
    static deleteAllMarijanaCategories() {
      throw new Error("Method not implemented.");
    }
    readonly page: Page;

    readonly createCategoryButton: Locator;
    readonly searchInput: Locator;
    readonly tableRows: Locator;
    readonly emptyStateMessage: Locator;

    readonly categoryNameInput: Locator;
    readonly assignMenusDropdown: Locator;
    readonly assignItemsDropdown: Locator;
    readonly saveButton: Locator;
    readonly cancelButton: Locator;
    readonly confirmEditButton: Locator;
    readonly deleteConfirmButton: Locator;

    readonly successMessage: Locator;
    readonly nameRequiredError: Locator;

    constructor(page: Page) {
        this.page = page;

        this.createCategoryButton = page.getByRole('button', { name: 'New Category' });
        this.searchInput = page.getByPlaceholder('Search categories...');
        this.tableRows = page.locator('tbody tr');
        this.emptyStateMessage = page.locator('.ant-empty-description');

        this.categoryNameInput = page.getByRole('textbox', { name: 'Category Name' });
        this.assignMenusDropdown = page.locator('div.ant-select[name="menus"]');
        this.assignItemsDropdown = page.locator('div.ant-select[name="items"]');
        this.saveButton = page.getByRole('button', { name: 'Create Category' });
        this.confirmEditButton = page.getByRole('button', { name: 'Confirm' });
        this.cancelButton = page.getByRole('button', { name: 'Cancel' });
        this.deleteConfirmButton = page.getByRole('button', { name: 'Delete' });

        this.successMessage = page.locator('.ant-message-success');
        this.nameRequiredError = page.getByText('Category name is required');
    }

    
    async openForm(): Promise<void> {
        await this.createCategoryButton.click();
        await this.categoryNameInput.waitFor({ state: 'visible' });
    }

    async cancelForm(): Promise<void> {
        await this.cancelButton.click();
    }

    async submitForm(): Promise<void> {
        await this.saveButton.click();
    }


    generateUniqueName(suffix: string): string {
        return `test-kategorija-marijana-${suffix}-${Date.now()}`;
    }


    async enterCategoryName(name: string): Promise<void> {
        await this.categoryNameInput.clear();
        await this.categoryNameInput.fill(name);
    }

  
    async assignMenu(menuName: string): Promise<void> {
        await this.assignMenusDropdown.scrollIntoViewIfNeeded();
        await this.assignMenusDropdown.click();
        await this.page.waitForTimeout(500);

        await this.page.keyboard.type(menuName, { delay: 100 });
        await this.page.waitForTimeout(1000);
        await this.page.keyboard.press('Enter');
        await this.page.keyboard.press('Escape');
    }

  
    async assignItems(items: string[]): Promise<void> {
        await this.assignItemsDropdown.click();
        await this.page.waitForTimeout(500);

        for (const item of items) {
            await this.page.keyboard.type(item, { delay: 100 });
            await this.page.waitForTimeout(1000);
            await this.page.keyboard.press('Enter');
            await this.page.waitForTimeout(500);

            if (items.indexOf(item) !== items.length - 1) {
                await this.page.keyboard.press('Escape');
                await this.assignItemsDropdown.click();
                await this.page.waitForTimeout(500);
            }
        }

        await this.page.keyboard.press('Escape');
    }

    
    async removeMenu(menuName: string): Promise<void> {
        const menuChip = this.assignMenusDropdown.locator('.ant-select-selection-item', { hasText: menuName });
        await menuChip.locator('.ant-select-selection-item-remove').click();
    }

    async removeItem() {
        await this.assignItemsDropdown.click();
        await this.page.keyboard.press('Backspace');
          await this.page.keyboard.press('Backspace');
    }


    async createCategory(name: string, options?: { menu?: string; items?: string[] }): Promise<void> {
        await this.openForm();
        await this.enterCategoryName(name);

        if (options?.menu) {
            await this.assignMenu(options.menu);
        }
        if (options?.items?.length) {
            await this.assignItems(options.items);
        }

        await this.submitForm();
        await this.verifySuccessNotification("Successfully created");

    }

    
    getNotification(message: string): Locator {
        return this.page.getByText(message, { exact: false });
    }

    getCategoryRow(name: string): Locator {
        return this.tableRows.filter({ hasText: name });
    }

    async getCategoryData(name: string) {
        const row = this.getCategoryRow(name);
        return {
            menuColumn: row.locator('td').nth(1),
            itemsColumn: row.locator('td').nth(2),
        };
    }

    async searchCategory(name: string): Promise<void> {
        await this.searchInput.clear();
        await this.searchInput.fill(name);
        await this.page.keyboard.press('Enter');
        await this.page.waitForLoadState('networkidle');
    }

    async verifySuccessNotification(message: string = "Successfully created"): Promise<void> {
        await expect(this.getNotification(message)).toBeVisible();
    }

    async verifyCategoryExists(name: string): Promise<void> {
        await this.searchCategory(name);
        await expect(this.getCategoryRow(name)).toBeVisible();
    }
    
    async openCategoryOptions(name: string): Promise<void> {
        const row = this.getCategoryRow(name);
        await row.getByTestId('category-options').click();
    }

    async editCategory(name: string): Promise<void> {
        await this.openCategoryOptions(name);
        await this.page.getByTestId('category-item-edit').click();
        await this.categoryNameInput.waitFor({ state: 'visible' });
    }

    async deleteCategory(name: string) {
        
        const row = this.getCategoryRow(name);
        const textContent = await row.innerText();

        if (textContent.includes("Menu") || textContent.includes("soup")) {
            await this.editCategory(name);
    
            await this.removeMenu('Food Menu'); 
            await this.removeItem();
            
            await this.confirmEditButton.click();
            await this.page.waitForLoadState('networkidle'); 
        }

        await this.openCategoryOptions(name);
        await this.page.getByTestId('category-item-delete').click();
        await this.deleteConfirmButton.click();
    }
  
}

