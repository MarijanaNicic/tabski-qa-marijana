import { Page, Locator } from '@playwright/test';

export class LoginPage {

    public readonly emailInput: Locator;
    public readonly passwordInput: Locator;
    public readonly loginButton: Locator;
    public readonly errorMessage: Locator;

   constructor(private readonly page: Page) {
     
        this.emailInput = page.getByTestId('signin-email-input');
        this.passwordInput = page.getByTestId('signin-password-input');
        this.loginButton = page.getByTestId('signin-login-btn');
        
        // Univerzalni lokator za error toast/poruku (prilagodićemo ga ako bude potrebno)
        this.errorMessage = page.locator('[role="alert"], .error-message, .MuiAlert-message');
    }

    /**
     * Navigates directly to the login page
     */
    async navigate(): Promise<void> {
        await this.page.goto('https://reporting-qa.tabski.com');
    }

    /**
     * Encapsulates the complete login workflow (filling fields and clicking login)
     */
    async login(email: string, password: string): Promise<void> {
        await this.emailInput.fill(email);
        await this.passwordInput.fill(password);
        await this.loginButton.click();
    }

    /**
     * Simulates form submission using the Enter key from the password field
     */
    async loginWithEnterKey(email: string, password: string): Promise<void> {
        await this.emailInput.fill(email);
        await this.passwordInput.fill(password);
        await this.passwordInput.press('Enter');
    }

    /**
     * Clears both credential fields
     */
    async clearFields(): Promise<void> {
        await this.emailInput.clear();
        await this.passwordInput.clear();
    }
}