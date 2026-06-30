import { test, expect } from "@playwright/test";
import { LoginPage } from "../pages/LoginPage";
import { NavigationMenu } from "../pages/NavigationMenu";
import { CategoriesPage } from "../pages/CategoriesPage";
import { ItemsPage } from "../pages/ItemsPage";

test.describe("Integration: Items Filter by Category", () => {
  
    const testData = [
        { menu: 'Food Menu', items: ['Miso soup', 'Ebi tempura'] },
        { menu: 'Drink Menu', items: ['7 Up', 'Mochi Cappuccino'] }
    ];

    for (const data of testData) {
        test(`Should filter items for ${data.menu}`, async ({ page }) => {
            const loginPage = new LoginPage(page);
            const navigation = new NavigationMenu(page);
            const categoriesPage = new CategoriesPage(page);
            const itemsPage = new ItemsPage(page);

            await loginPage.navigate();
            await loginPage.login("qa.test@tabski.com", "Test123!@#");
            
            await navigation.goToCategories();
            const categoryName = categoriesPage.generateUniqueName('integration');
            
            await categoriesPage.createCategory(categoryName, { 
    menu: data.menu, 
    items: data.items 
});
            await categoriesPage.verifySuccessNotification("Successfully created");

            await navigation.goToItems();
            await itemsPage.filterByCategory(categoryName, data.menu);
            
            await expect(itemsPage.itemRows).toHaveCount(2);
            await expect(itemsPage.itemRows).toContainText(data.items);
        });
        
    }
    
});

