import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';

test.describe('Login Page - Comprehensive Test Suite', () => {
    let loginPage: LoginPage;

   
    test.beforeEach(async ({ page }) => {
        loginPage = new LoginPage(page);
        await loginPage.navigate();
    });

    test.describe('Positive Scenarios (Happy Paths)', () => {
        test('TC_LOG_001 - Should successfully log in with valid credentials', async ({ page }) => {
  
            await loginPage.login('qa.test@tabski.com', 'Test123!@#');

            await expect(page).toHaveURL(/.*\/sales\/sales-overview/);
            await expect(page).not.toHaveURL(/.*login.*/);
            await expect(page.getByText('Sushi Bistro')).toBeVisible();
        });

        test('TC_LOG_002 - Should successfully log in using Enter key', async ({ page }) => {
            await loginPage.loginWithEnterKey('qa.test@tabski.com', 'Test123!@#');
            
            await expect(page).toHaveURL(/.*\/sales\/sales-overview/);
            await expect(page).not.toHaveURL(/.*login.*/);
            await expect(page.getByText('Sushi Bistro')).toBeVisible();
        });
});
});