# Comprehensive Test Suite: Login Functionality

**Target URL:** https://reporting-qa.tabski.com
**Framework:** Playwright (TypeScript)
**Approach:** Risk-Based & Boundary Value Analysis (Senior QA Standards)

---

## 1. Functional Testing (Happy Paths)

### TC_LOG_001: Successful Authentication with Valid Credentials
*   **Preconditions:** User account exists and is active.
*   **Steps:**
    1. Navigate to `https://reporting-qa.tabski.com`.
    2. Enter a valid email (`qa.test@tabski.com`).
    3. Enter a valid password (`Test123!@#`).
    4. Click the "Login" button.
*   **Expected Result:** User is successfully authenticated, the session token is generated, and the user is redirected to the Merchant selection page ("Choose Merchant: Sushi Bistro"). URL no longer contains `/login`.

### TC_LOG_002: Successful Authentication via "Enter" Key Press
*   **Steps:**
    1. Enter valid email and password.
    2. Focus on the password field and press the `Enter` key on the keyboard.
*   **Expected Result:** Form submits successfully, triggering the same workflow as clicking the "Login" button.

---

## 2. Negative Testing (Authentication & Error Handling)

### TC_LOG_003: Authentication Failure with Incorrect Password
*   **Steps:**
    1. Enter a valid email (`qa.test@tabski.com`).
    2. Enter an incorrect password (e.g., `WrongPass123!`).
    3. Click "Login".
*   **Expected Result:** Authentication fails. An explicit, user-friendly error message is displayed (e.g., "Invalid credentials"). Fields are not cleared so the user can correct them.

### TC_LOG_004: Authentication Failure with Non-Existent Email
*   **Steps:**
    1. Enter an unregistered email (e.g., `nonexistent.qa@tabski.com`).
    2. Enter a generic valid password format.
    3. Click "Login".
*   **Expected Result:** Access denied with a generic error message to prevent account enumeration vulnerability.

---

## 3. Input Validation & Boundary Value Analysis (BVA)

### TC_LOG_005: Client-Side Validation on Empty Fields (Blank Submission)
*   **Steps:**
    1. Leave both "Email" and "Password" inputs completely empty.
    2. Click the "Login" button.
*   **Expected Result:** No network request is fired to the backend. Inline validation messages appear under both fields (e.g., "Email is required", "Password is required").

### TC_LOG_006: Client-Side Validation on Empty Password
*   **Steps:**
    1. Enter a valid email.
    2. Leave the password field empty.
    3. Click "Login".
*   **Expected Result:** Dynamic warning message appears: "Password is required". Buttons or endpoints are not triggered unnecessarily.

### TC_LOG_007: Invalid Email Format Handling
*   **Steps:**
    1. Test multiple invalid email formats sequentially:
        * `plain-string`
        * `missing-at-domain.com`
        * `username@missing-tld.`
        * `@missing-username.com`
    2. Click "Login" for each input.
*   **Expected Result:** The application catches the invalid format on the client side, displaying an "Invalid email format" error.

---

## 4. Security & Edge Case Testing

### TC_LOG_008: SQL Injection (SQLi) Mitigation on Inputs
*   **Steps:**
    1. Inject basic SQL payloads into the email field: `' OR '1'='1` or `admin' --`.
    2. Enter a dummy password and attempt login.
*   **Expected Result:** The input is properly sanitized. The system treats the payload as a literal string, resulting in a standard "Invalid credentials" failure. No database errors or unauthorized access allowed.

### TC_LOG_009: Cross-Site Scripting (XSS) Vulnerability Check
*   **Steps:**
    1. Inject an XSS payload into the email field: `<script>alert('xss')</script>`.
    2. Attempt to log in.
*   **Expected Result:** The application escapes/encodes the input string. No script execution occurs.

### TC_LOG_010: Password Masking and Visibility Toggle
*   **Steps:**
    1. Type characters into the password field.
    2. Verify characters are masked by default (`type="password"` attribute checked).
    3. Click the "Show Password" eye icon (if present on the UI).
    4. Click it again to hide.
*   **Expected Result:** Characters become explicitly visible upon toggling, and safely re-masked when clicked again.

---

## 5. UI, UX, & Session State Testing

### TC_LOG_011: Field Tab Order and Keyboard Navigation
*   **Steps:**
    1. Focus on the Email field.
    2. Press the `Tab` key.
    3. Press the `Tab` key again.
*   **Expected Result:** Focus moves smoothly from Email field $\rightarrow$ Password field $\rightarrow$ Login button, supporting high accessibility (a11y) standards.

### TC_LOG_012: Extreme Character Limit (Stress Input)
*   **Steps:**
    1. Paste a string of 500+ characters into both the Email and Password fields.
    2. Observe UI behavior and click "Login".
*   **Expected Result:** The UI components do not break or warp visually. The system handles the long string gracefully by either truncating it or rejecting it cleanly via API validation.