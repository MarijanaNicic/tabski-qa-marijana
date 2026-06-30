import { test, expect } from "@playwright/test";
import { LoginPage } from "../pages/LoginPage";
import { NavigationMenu } from "../pages/NavigationMenu";
import { CategoriesPage } from "../pages/CategoriesPage";



test.describe("Categories Module - Test Suite", () => {
  let loginPage: LoginPage;
  let navigation: NavigationMenu;
  let categoriesPage: CategoriesPage;

  const VALID_EMAIL = "qa.test@tabski.com";
  const VALID_PASSWORD = "Test123!@#";

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    navigation = new NavigationMenu(page);
    categoriesPage = new CategoriesPage(page);

    await loginPage.navigate();
    await loginPage.login(VALID_EMAIL, VALID_PASSWORD);
    await navigation.goToCategories();
    
    
  });
  test.describe("Positive Scenarios (Creation)", () => {
    test("TC_CAT_001 - Should successfully create a category with minimum required fields", async () => {
      const categoryName = categoriesPage.generateUniqueName('empty');

      await categoriesPage.createCategory(categoryName);

      await categoriesPage.verifySuccessNotification("Successfully created");
      await categoriesPage.verifyCategoryExists(categoryName);
    });

    test("TC_CAT_002 - Should successfully create a category with a Food menu assigned", async () => {
      const categoryName = categoriesPage.generateUniqueName('food');

      await categoriesPage.createCategory(categoryName, { menu: 'Food Menu' });

      await categoriesPage.verifySuccessNotification("Successfully created");
      await categoriesPage.searchCategory(categoryName);

      const row = await categoriesPage.getCategoryData(categoryName);
      await expect(row.menuColumn).toHaveText('Food Menu');
      await expect(row.itemsColumn).toHaveText('No items.');
    });

    test("TC_CAT_003 - Should successfully create a category with a Drink menu assigned", async () => {
      const categoryName = categoriesPage.generateUniqueName('drink');

      await categoriesPage.createCategory(categoryName, { menu: 'Drink Menu' });

      await categoriesPage.verifySuccessNotification("Successfully created");
      await categoriesPage.searchCategory(categoryName);

      const row = await categoriesPage.getCategoryData(categoryName);
      await expect(row.menuColumn).toHaveText('Drink Menu');
      await expect(row.itemsColumn).toHaveText('No items.');
    });

    test("TC_CAT_004 - Should successfully create a category with exactly 2 items assigned", async () => {
      const categoryName = categoriesPage.generateUniqueName('items');
      const items = ['Miso soup', 'Ebi tempura'];

      await categoriesPage.createCategory(categoryName, { items });

      await categoriesPage.verifySuccessNotification("Successfully created");
      await categoriesPage.searchCategory(categoryName);

      const row = await categoriesPage.getCategoryData(categoryName);
      await expect(row.menuColumn).toHaveText('No Menus.');
      await expect(row.itemsColumn).toContainText('Miso soup');
      await expect(row.itemsColumn).toContainText('Ebi tempura');
    });

    test("TC_CAT_005 - Should successfully create a category with both a menu and items assigned", async () => {
      const categoryName = categoriesPage.generateUniqueName('full-data');
      const items = ['Miso soup', 'Ebi tempura'];

      await categoriesPage.createCategory(categoryName, { menu: 'Food Menu', items });

      await categoriesPage.verifySuccessNotification("Successfully created");
      await categoriesPage.searchCategory(categoryName);

      const row = await categoriesPage.getCategoryData(categoryName);
      await expect(row.menuColumn).toHaveText('Food Menu');
      await expect(row.itemsColumn).toContainText('Miso soup');
      await expect(row.itemsColumn).toContainText('Ebi tempura');
    });
  });

  test.describe("Negative Scenarios & Validation", () => {
    test("TC_CAT_006 - Should reject creation with an empty category name", async () => {
      await categoriesPage.openForm();
      await categoriesPage.submitForm();

      await expect(categoriesPage.nameRequiredError).toBeVisible();
      await expect(categoriesPage.categoryNameInput).toHaveAttribute('aria-invalid', 'true');
    });

  /*  test("TC_CAT_007 - Should reject creation with a duplicate category name", async () => {
      const categoryName = categoriesPage.generateUniqueName('duplicate');

      await categoriesPage.createCategory(categoryName);
      await categoriesPage.verifySuccessNotification("Successfully created");

      await categoriesPage.createCategory(categoryName);

      await expect(categoriesPage.getNotification("already exists")).toBeVisible();
      await categoriesPage.searchCategory(categoryName);
      await expect(categoriesPage.tableRows).toHaveCount(1);
    });
*/
    test("TC_CAT_008 - Should close the form without saving when Cancel is clicked", async () => {
      const categoryName = categoriesPage.generateUniqueName('cancel-test');

      await categoriesPage.openForm();
      await categoriesPage.enterCategoryName(categoryName);
      await categoriesPage.cancelForm();

      await expect(categoriesPage.categoryNameInput).not.toBeVisible();

      await categoriesPage.searchCategory(categoryName);
      await expect(categoriesPage.emptyStateMessage)
        .toHaveText(`No Categories for "${categoryName}"`);
    });
  });

  test.describe("Edit & Delete", () => {
    test("TC_CAT_009 - Should successfully edit an existing category's name, menu and items", async () => {
      const oldName = categoriesPage.generateUniqueName('original');
      const newName = categoriesPage.generateUniqueName('updated');

      await categoriesPage.createCategory(oldName, {
        menu: 'Food Menu',
        items: ['Miso soup', 'Ebi tempura'],
      });
      await categoriesPage.verifySuccessNotification("Successfully created");

      await categoriesPage.editCategory(oldName);
      await categoriesPage.enterCategoryName(newName);
      await categoriesPage.removeMenu('Food Menu');
      await categoriesPage.assignMenu('Drink Menu');
      await categoriesPage.removeItem()
      await categoriesPage.assignItems(['7 Up']);
      await categoriesPage.confirmEditButton.click();

      await categoriesPage.verifySuccessNotification("Successfully updated");

      await categoriesPage.searchCategory(newName);
      const row = await categoriesPage.getCategoryData(newName);
      await expect(row.menuColumn).toHaveText('Drink Menu');
      await expect(row.itemsColumn).toContainText('7 Up');

      await categoriesPage.searchCategory(oldName);
      await expect(categoriesPage.emptyStateMessage).toBeVisible();
    });

    test("TC_CAT_010 - Should successfully delete a category", async () => {
      const categoryName = categoriesPage.generateUniqueName('delete-test');

      await categoriesPage.createCategory(categoryName, {
        menu: 'Food Menu',
        items: ['Miso soup', 'Ebi tempura'],
      });
      await categoriesPage.verifySuccessNotification("Successfully created");

      await categoriesPage.deleteCategory(categoryName);

      await categoriesPage.verifySuccessNotification("Successfully deleted");
      await categoriesPage.searchCategory(categoryName);
      await expect(categoriesPage.emptyStateMessage).toBeVisible();
    });
  });

});