import { test, expect } from "@playwright/test";
import { LoginPage } from "../pages/LoginPage";

test.describe("Login Page - Maximum Coverage Test Suite", () => {
  let loginPage: LoginPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    await loginPage.navigate();
  });

  const VALID_EMAIL = "qa.test@tabski.com";
  const VALID_PASSWORD = "Test123!@#";

  test.describe("Positive Scenarios (Happy Paths)", () => {
    test("TC_LOG_001 - Should successfully log in with valid credentials", async ({
      page,
    }) => {
      await loginPage.login(VALID_EMAIL, VALID_PASSWORD);

      await expect(page).toHaveURL(/.*\/sales\/sales-overview/);
      await expect(page.getByText("Sushi Bistro")).toBeVisible();
    });

    test("TC_LOG_002 - Should successfully log in using Enter key", async ({
      page,
    }) => {
      await loginPage.loginWithEnterKey(VALID_EMAIL, VALID_PASSWORD);
      await expect(page).toHaveURL(/.*\/sales\/sales-overview/);
      await expect(page.getByText("Sushi Bistro")).toBeVisible();
    });
  });

  test.describe("Negative Scenarios & Field Validations", () => {
    test("TC_LOG_003 - Should display error message with invalid password", async () => {
      await loginPage.login("qa.test@tabski.com", "WrongPassword123!");
      const errorText = await loginPage.getErrorMessageText();
      expect(errorText).toContain("Incorrect email or password.");
    });

    test("TC_LOG_004 - Should display error message with non-existent email", async () => {
      await loginPage.login("nonexistent.user@tabski.com", "Test123!@#");
      const errorText = await loginPage.getErrorMessageText();
      expect(errorText).toContain("Incorrect email or password.");
    });

    test("TC_LOG_005 - Should trigger validation and reject blank submission (Empty Fields)", async ({
      page,
    }) => {
      await loginPage.loginButton.click();
      await expect(loginPage.emailInput).toHaveAttribute(
        "aria-invalid",
        "true",
      );
      await expect(page.getByText("Email is required")).toBeVisible();
      await expect(page.getByText("Password is required")).toBeVisible();
      await expect(page).toHaveURL("/");
    });

    test("TC_LOG_006 - Should handle invalid email format gracefully", async () => {
      await loginPage.login("invalid-email-format", "Test123!@#");
      await expect(loginPage.emailInput).toHaveAttribute(
        "aria-invalid",
        "true",
      );
    });

    test("TC_LOG_007 - Should display error if email contains leading/trailing spaces", async ({
      page,
    }) => {
      await loginPage.login(" qa.test@tabski.com", VALID_PASSWORD);
      await expect(
        page.getByText("White spaces are not allowed"),
      ).toBeVisible();
    });

    test("TC_LOG_008 - Should reject login when password has incorrect case sensitivity", async () => {
      const WRONG_CASE_PASSWORD = "TEST123!@#";
      await loginPage.login(VALID_EMAIL, WRONG_CASE_PASSWORD);
      await expect(loginPage.errorMessage).toBeVisible();
    });
  });

  test.describe("Page Integrity & Link Validation", () => {
    test("TC_LOG_009 - Should verify Forgot Password link navigation", async () => {
      await loginPage.forgotPasswordLink.click();
      await expect(loginPage.forgotPasswordConfirmButton).toBeVisible();
    });

    test("TC_LOG_010 - Should verify Sign Up link navigation", async ({
      page,
    }) => {
      await loginPage.signUpLink.click();
      await expect(page).toHaveURL(/.*\/sign-up.*/);
    });

    test("TC_LOG_011 - Should verify Footer Links opening in new tabs (Terms, Privacy Policy and Learn More)", async ({
      page,
    }) => {
     
      const [termsPage] = await Promise.all([
        page.waitForEvent("popup"),
        loginPage.termsLink.click(),
      ]);

      await termsPage.waitForLoadState("load");
      await expect(termsPage).toHaveURL("https://tabski.com/terms-of-service/");
      await termsPage.close();

      const [privacyPage] = await Promise.all([
        page.waitForEvent("popup"),
        loginPage.privacyLink.click(),
      ]);
      await privacyPage.waitForLoadState("load");
      await expect(privacyPage).toHaveURL("https://tabski.com/privacy-policy/");
      await privacyPage.close();

      const [learnMorePage] = await Promise.all([
        page.waitForEvent("popup"),
        loginPage.learnMoreLink.click(),
      ]);
      await learnMorePage.waitForLoadState("load");
      await expect(learnMorePage).toHaveURL(/.*tabski.com.*/);
      await learnMorePage.close();
    });
  });

  test.describe("Security & Edge Cases", () => {
    test("TC_LOG_012 - Should sanitize and mitigate basic SQL Injection attempts", async ({
      page,
    }) => {
      const sqliPayload = "admin'/**/OR/**/'1'='1";
      await loginPage.login(sqliPayload, "anyPassword");

      await expect(loginPage.emailHelpMessage).toBeVisible();
      await expect(loginPage.emailHelpMessage).toHaveText(
        "Invalid email format",
      );

      await expect(page).toHaveURL("/");
      await expect(loginPage.emailInput).toHaveAttribute(
        "aria-invalid",
        "true",
      );
    });

    test("TC_LOG_013 - Should mitigate Cross-Site Scripting (XSS) attempts", async ({
      page,
    }) => {
      const xssPayload = "<script>alert('xss')</script>";
      await loginPage.login(xssPayload, "Test123!@#");
      await expect(page).toHaveURL("/");
    });

    test("TC_LOG_014 - Should verify password masking by default", async () => {
      await loginPage.passwordInput.fill("TajniPassword123");
      await expect(loginPage.passwordInput).toHaveAttribute("type", "password");
    });

    test("TC_LOG_015 - Should support keyboard accessibility and proper Tab navigation", async ({
      page,
    }) => {
      await loginPage.emailInput.fill(VALID_EMAIL);
      await loginPage.passwordInput.fill(VALID_PASSWORD);

      await loginPage.emailInput.focus();
      await expect(loginPage.emailInput).toBeFocused();

      await page.keyboard.press("Tab");
      await expect(loginPage.passwordInput).toBeFocused();

      await page.keyboard.press("Tab");
      const activeElementText = await page.evaluate(
        () => document.activeElement?.textContent,
      );
      expect(activeElementText).toContain("Forgot password?");

      await page.keyboard.press("Tab");
      await expect(loginPage.loginButton).toBeFocused();
    });

    test("TC_LOG_016 - Should handle extreme character limits gracefully without breaking UI", async ({
      page,
    }) => {
      const longString = "A".repeat(500);
      await loginPage.login(longString, longString);
      await expect(page).toHaveURL("/");
      await expect(loginPage.loginButton).toBeVisible();
      await loginPage.clearFields();
    });

    test("TC_LOG_017 - Should toggle password visibility when clicking the show/hide icon", async ({
      page,
    }) => {
      await loginPage.passwordInput.fill("TajniPassword123");
      await expect(loginPage.passwordInput).toHaveAttribute("type", "password");

      await loginPage.passwordToggleVisibilityButton.click();

      await expect(loginPage.passwordInput).toHaveAttribute("type", "text");

      await loginPage.passwordToggleVisibilityButton.click();

      await expect(loginPage.passwordInput).toHaveAttribute("type", "password");
    });

    test("TC_LOG_018 - Should ensure error message is accessible to screen readers (ARIA compliance)", async ({
      page,
    }) => {
      await loginPage.login("qa.test@tabski.com", "PogresnaLozinka123");

      const accessibleError = page.getByRole("alert");

      await expect(accessibleError).toBeVisible();
      await expect(accessibleError).toContainText(
        "Incorrect email or password.",
      );
    });

    test("TC_LOG_019 - Should maintain user session and persist authentication after page reload", async ({
      page,
    }) => {
      await loginPage.login(VALID_EMAIL, VALID_PASSWORD);

      await expect(page).toHaveURL(/.*\/sales\/sales-overview/);
      await expect(page.getByText("Sushi Bistro")).toBeVisible();
      await page.reload({ waitUntil: "networkidle" });

      await expect(page).toHaveURL(/.*\/sales\/sales-overview/);
      await expect(page.getByText("Sushi Bistro")).toBeVisible();
    });
    test("TC_LOG_020 - Should prevent access to protected routes after logging out", async ({
      page,
    }) => {
      await loginPage.login(VALID_EMAIL, VALID_PASSWORD);
      await expect(page).toHaveURL(/.*\/sales\/sales-overview/);

      await page.getByText("Sushi Bistro").click({ force: true });
      await page.getByText("Sign Out").click();
      await expect(page).toHaveURL("/");

      await page.goto("/sales/sales-overview");
      await expect(page).toHaveURL("/");
      await expect(loginPage.emailInput).toBeVisible();
    });
    test("TC_LOG_021 - Should display and handle login successfully on mobile viewport", async ({
      page,
    }) => {
      await page.setViewportSize({ width: 390, height: 844 });

      await loginPage.navigate();

      await expect(loginPage.emailInput).toBeVisible();
      await expect(loginPage.passwordInput).toBeVisible();
      await expect(loginPage.loginButton).toBeVisible();

      await loginPage.login(VALID_EMAIL, VALID_PASSWORD);

      await expect(page).toHaveURL(/.*\/sales\/sales-overview/);
    });

    test("TC_LOG_022 - Should handle login successfully under slow network conditions (Slow 3G throttling)", async ({
      page,
      context,
    }) => {
      const client = await context.newCDPSession(page);

      await client.send("Network.emulateNetworkConditions", {
        offline: false,
        downloadThroughput: (350 * 1024) / 8, // ~350 kbps
        uploadThroughput: (200 * 1024) / 8, // ~200 kbps
        latency: 300, // 300ms 
      });

      await loginPage.navigate();
      await loginPage.login(VALID_EMAIL, VALID_PASSWORD);

      await expect(page).toHaveURL(/.*\/sales\/sales-overview/, {
        timeout: 25000,
      });
    });

    test("TC_LOG_023 - Should handle concurrent login from multiple tabs smoothly", async ({
      page,
      context,
    }) => {
      const loginPage1 = loginPage;
      await loginPage1.navigate();

      const page2 = await context.newPage();
      const loginPage2 = new LoginPage(page2);
      await loginPage2.navigate();

      await loginPage2.login(VALID_EMAIL, VALID_PASSWORD);
      await expect(page2).toHaveURL(/.*\/sales\/sales-overview/);

      await page.bringToFront();

      const reloadButton = page.getByRole("button", { name: "Reload" });
      await reloadButton.waitFor({ state: "visible" });
      await reloadButton.click();

      await expect(page).toHaveURL(/.*\/sales\/sales-overview/);
      await expect(page.getByText("Sushi Bistro")).toBeVisible();

      await page2.close();
    });
  });
});
