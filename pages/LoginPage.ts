import { Page, Locator } from '@playwright/test';

export class LoginPage {

    public readonly emailInput: Locator;
    public readonly passwordInput: Locator;
    public readonly loginButton: Locator;
    public readonly errorMessage: Locator;
    public readonly emailHelpMessage: Locator;
    passwordToggleVisibilityButton: Locator;
    public readonly forgotPasswordLink: Locator;
    public readonly forgotPasswordConfirmButton: Locator;
    public readonly signUpLink: Locator;
    public readonly termsLink: Locator;
    public readonly privacyLink: Locator;
    public readonly learnMoreLink: Locator;

   constructor(public readonly page: Page) {
     
        this.emailInput = page.getByTestId('signin-email-input');
        this.passwordInput = page.getByTestId('signin-password-input');
        this.loginButton = page.getByTestId('signin-login-btn');
        this.passwordToggleVisibilityButton = page.getByRole('img', { name: 'eye-invisible' });
        this.errorMessage = page.locator('[role="alert"], .MuiAlert-message').first();
        this.emailHelpMessage = page.locator('#email_help');
        this.passwordToggleVisibilityButton = page.locator('.ant-input-password-icon');
        this.forgotPasswordLink = page.locator('text=Forgot password?');
        this.forgotPasswordConfirmButton = page.getByTestId('forgotten-password-confirm-btn');
        this.signUpLink = page.locator('text=Sign Up');
        this.termsLink = page.locator('text=Terms Of Service');
        this.privacyLink = page.locator('text=Privacy Policy');
        this.learnMoreLink = page.locator('text=Learn More');
        
      
    }

    async navigate(): Promise<void> {
        await this.page.goto('/');
        await this.page.waitForLoadState('networkidle');
    }

    
    async login(email: string, password: string): Promise<void> {
        await this.emailInput.fill(email);
        await this.passwordInput.fill(password);
        await this.loginButton.click();
    }

    
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
async getErrorMessageText(): Promise<string> {
        await this.errorMessage.waitFor({ state: 'visible', timeout: 5000 });
        return await this.errorMessage.innerText();
    }}