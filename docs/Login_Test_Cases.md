# Login Module – Test Case Documentation

**Project:** Tabski Reporting Platform  
**Module:** Authentication – Login  
**Framework:** Playwright (TypeScript) – Page Object Model  
**Environment:** `https://reporting-qa.tabski.com`  
**Prepared by:** QA Engineer Marijana Nicic 
**Last Updated:** June 2026  

---

## Test Suite Overview

| Attribute | Value |
|---|---|
| Total Test Cases | 23 |
| Automation Coverage | 100% |
| Design Pattern | Page Object Model (POM) |
| Test Types | Functional, Validation, Security, Accessibility, Resilience |

---

## Shared Test Data

| Constant | Value |
|---|---|
| `VALID_EMAIL` | `qa.test@tabski.com` |
| `VALID_PASSWORD` | `Test123!@#` |

---

## Global Preconditions

- Application is accessible at the configured base URL
- A fresh browser context is initialized before each test via `beforeEach`
- The login page is loaded and fully rendered prior to each test execution

---

## 1. Positive Scenarios (Happy Paths)

---

### TC_LOG_001 – Successfully Log In with Valid Credentials

**Priority:** Critical  
**Type:** Positive / Functional  

**Preconditions:**
- User account `qa.test@tabski.com` exists and is active in the system

**Steps:**
1. Enter `VALID_EMAIL` in the Email field
2. Enter `VALID_PASSWORD` in the Password field
3. Click the **Login** button

**Expected Result:**
- User is redirected to the sales dashboard (`/sales/sales-overview`)
- The text "Sushi Bistro" is visible, confirming an active authenticated session

---

### TC_LOG_002 – Successfully Log In Using the Enter Key

**Priority:** High  
**Type:** Positive / Accessibility  

**Preconditions:**
- User account exists and is active

**Steps:**
1. Enter `VALID_EMAIL` in the Email field
2. Enter `VALID_PASSWORD` in the Password field
3. Press the **Enter** key on the keyboard (no mouse interaction)

**Expected Result:**
- Form is submitted via keyboard
- User is redirected to `/sales/sales-overview`
- "Sushi Bistro" is visible on the dashboard

---

## 2. Negative Scenarios & Field Validations

---

### TC_LOG_003 – Display Error Message with Invalid Password

**Priority:** Critical  
**Type:** Negative / Functional  

**Preconditions:**
- User account `qa.test@tabski.com` exists in the system

**Steps:**
1. Enter `VALID_EMAIL` in the Email field
2. Enter `WrongPassword123!` in the Password field
3. Click the **Login** button

**Expected Result:**
- Login is rejected
- Error message is displayed: *"Incorrect email or password."*
- User remains on the login page

---

### TC_LOG_004 – Display Error Message with Non-Existent Email

**Priority:** Critical  
**Type:** Negative / Functional  

**Preconditions:** None

**Steps:**
1. Enter `nonexistent.user@tabski.com` in the Email field
2. Enter `VALID_PASSWORD` in the Password field
3. Click the **Login** button

**Expected Result:**
- Login is rejected
- Error message is displayed: *"Incorrect email or password."*
- The error message is identical to TC_LOG_003, confirming the system does not disclose whether the email exists (prevents user enumeration)

---

### TC_LOG_005 – Reject Blank Form Submission (Empty Fields)

**Priority:** High  
**Type:** Negative / Validation  

**Preconditions:** None

**Steps:**
1. Leave both the Email and Password fields empty
2. Click the **Login** button

**Expected Result:**
- Form submission is blocked
- Email field is marked as invalid (`aria-invalid="true"`)
- Validation messages are displayed: *"Email is required"* and *"Password is required"*
- User remains on the login page (`/`)

---

### TC_LOG_006 – Reject Invalid Email Format

**Priority:** Medium  
**Type:** Negative / Validation  

**Preconditions:** None

**Steps:**
1. Enter `invalid-email-format` (no `@` symbol, no domain) in the Email field
2. Enter `VALID_PASSWORD` in the Password field
3. Click the **Login** button

**Expected Result:**
- Form submission is blocked by client-side validation
- Email field is marked as invalid (`aria-invalid="true"`)
- No network request is made to the authentication API

---

### TC_LOG_007 – Reject Email with Leading or Trailing Spaces

**Priority:** Medium  
**Type:** Negative / Validation  

**Preconditions:** None

**Steps:**
1. Enter ` qa.test@tabski.com` (with a leading space) in the Email field
2. Enter `VALID_PASSWORD` in the Password field
3. Click the **Login** button

**Expected Result:**
- Form submission is blocked
- Validation message is displayed: *"White spaces are not allowed"*
- User remains on the login page

---

### TC_LOG_008 – Reject Password with Incorrect Letter Case

**Priority:** High  
**Type:** Negative / Functional  

**Preconditions:**
- User account exists with password `Test123!@#`

**Steps:**
1. Enter `VALID_EMAIL` in the Email field
2. Enter `TEST123!@#` (all uppercase — wrong case) in the Password field
3. Click the **Login** button

**Expected Result:**
- Login is rejected, confirming authentication is case-sensitive
- An error message is displayed
- User remains on the login page

---

## 3. Page Integrity & Link Validation

---

### TC_LOG_009 – Forgot Password Link Navigation

**Priority:** High  
**Type:** Functional / Navigation  

**Preconditions:** None

**Steps:**
1. Click the **Forgot password?** link on the login page

**Expected Result:**
- The password recovery view is displayed
- The confirm/submit button for the forgotten password flow is visible

---

### TC_LOG_010 – Sign Up Link Navigation

**Priority:** Medium  
**Type:** Functional / Navigation  

**Preconditions:** None

**Steps:**
1. Click the **Sign Up** link on the login page

**Expected Result:**
- User is navigated to the registration page
- URL matches the pattern `/sign-up`

---

### TC_LOG_011 – Footer Links Open in New Tabs

**Priority:** Medium  
**Type:** Functional / Navigation  

**Preconditions:** None

**Steps:**
1. Click the **Terms of Service** link in the footer
2. Close the new tab and return to the login page
3. Click the **Privacy Policy** link in the footer
4. Close the new tab and return to the login page
5. Click the **Learn More** link in the footer
6. Close the new tab

**Expected Result:**
- Each link opens in a separate new browser tab without closing the login page
- Terms of Service tab loads: `https://tabski.com/terms-of-service/`
- Privacy Policy tab loads: `https://tabski.com/privacy-policy/`
- Learn More tab loads a page within the `tabski.com` domain

---

## 4. Security & Edge Cases

---

### TC_LOG_012 – SQL Injection Attempt is Sanitized

**Priority:** Critical  
**Type:** Security  

**Preconditions:** None

**Steps:**
1. Enter the SQL injection payload `admin'/**/OR/**/'1'='1` in the Email field
2. Enter any value in the Password field
3. Click the **Login** button

**Expected Result:**
- The payload is treated as plain text input, not executed
- Client-side validation flags the email field as invalid (`aria-invalid="true"`)
- Validation message is displayed: *"Invalid email format"*
- User remains on the login page (`/`)
- No authentication bypass occurs

---

### TC_LOG_013 – Cross-Site Scripting (XSS) Attempt is Mitigated

**Priority:** Critical  
**Type:** Security  

**Preconditions:** None

**Steps:**
1. Enter `<script>alert('xss')</script>` in the Email field
2. Enter `VALID_PASSWORD` in the Password field
3. Click the **Login** button

**Expected Result:**
- The script tag is not executed in the browser
- No alert dialog appears
- User remains on the login page (`/`)

---

### TC_LOG_014 – Password Field is Masked by Default

**Priority:** High  
**Type:** Security / Functional  

**Preconditions:** None

**Steps:**
1. Click on the Password field
2. Type any characters (e.g. `TajniPassword123`)

**Expected Result:**
- Entered characters are masked (displayed as dots/asterisks)
- The input element maintains `type="password"` attribute at all times

---

### TC_LOG_015 – Keyboard Tab Navigation Follows Correct Focus Order

**Priority:** High  
**Type:** Accessibility  

**Preconditions:** None

**Steps:**
1. Click on the Email field to set focus
2. Press **Tab** once
3. Press **Tab** again
4. Press **Tab** once more

**Expected Result:**
- Focus moves in the following order: **Email field → Password field → Forgot password? link → Login button**
- Each element receives visible focus in the correct sequence, confirming logical tab order compliance

---

### TC_LOG_016 – UI Handles Extreme Input Length Without Breaking

**Priority:** Medium  
**Type:** Edge Case / Resilience  

**Preconditions:** None

**Steps:**
1. Enter a 500-character string (`"A"` repeated 500 times) in the Email field
2. Enter the same 500-character string in the Password field
3. Click the **Login** button
4. Clear both fields after submission

**Expected Result:**
- The application does not crash or produce unhandled errors
- The UI layout remains intact and fully rendered
- The **Login** button remains visible and interactive
- User remains on the login page (`/`)

---

### TC_LOG_017 – Password Visibility Toggle Works Correctly

**Priority:** Medium  
**Type:** Functional / UX  

**Preconditions:** None

**Steps:**
1. Enter any text in the Password field (e.g. `TajniPassword123`)
2. Click the **show password** icon
3. Click the **hide password** icon

**Expected Result:**
- Initially, the password is masked (`type="password"`)
- After the first click, the password becomes visible as plain text (`type="text"`)
- After the second click, the password is masked again (`type="password"`)

---

### TC_LOG_018 – Error Message is Accessible to Screen Readers (ARIA)

**Priority:** High  
**Type:** Accessibility  

**Preconditions:** None

**Steps:**
1. Enter `VALID_EMAIL` in the Email field
2. Enter an incorrect password in the Password field
3. Click the **Login** button

**Expected Result:**
- An error element with `role="alert"` is present in the DOM and visible
- The alert reads: *"Incorrect email or password."*
- The error is surfaced correctly for assistive technologies such as screen readers

---

### TC_LOG_019 – Authenticated Session Persists After Page Reload

**Priority:** High  
**Type:** Functional / Session Management  

**Preconditions:**
- User can successfully log in

**Steps:**
1. Log in with `VALID_EMAIL` and `VALID_PASSWORD`
2. Confirm the dashboard is loaded
3. Reload the page (waiting for network activity to complete)

**Expected Result:**
- The user remains authenticated after the reload
- The application does not redirect to the login page
- The dashboard (`/sales/sales-overview`) and "Sushi Bistro" text remain visible

---

### TC_LOG_020 – Protected Routes Are Inaccessible After Logout

**Priority:** Critical  
**Type:** Security / Session Management  

**Preconditions:**
- User can successfully log in

**Steps:**
1. Log in with `VALID_EMAIL` and `VALID_PASSWORD`
2. Open the account menu and click **Sign Out**
3. Confirm redirection to the login page
4. Attempt to navigate directly to `/sales/sales-overview` via the browser address bar

**Expected Result:**
- Logout clears the session token
- User is redirected to the login page after logging out
- Direct navigation to the protected route is intercepted by the routing guard
- User is redirected back to the login page (`/`) without accessing any protected content

---

### TC_LOG_021 – Login Form is Fully Functional on Mobile Viewport

**Priority:** High  
**Type:** Functional / Responsive Design  

**Preconditions:** None

**Steps:**
1. Set the browser viewport to 390×844px (iPhone 14 profile)
2. Navigate to the login page
3. Confirm all form elements are visible
4. Log in with `VALID_EMAIL` and `VALID_PASSWORD`

**Expected Result:**
- Email field, Password field, and Login button are all fully visible and interactive on the mobile viewport
- Login completes successfully
- User is redirected to `/sales/sales-overview`

---

### TC_LOG_022 – Login Completes Successfully Under Slow Network Conditions

**Priority:** Medium  
**Type:** Resilience / Performance  

**Preconditions:** None

**Steps:**
1. Emulate Slow 3G network conditions via Chrome DevTools Protocol:
   - Download: ~350 kbps
   - Upload: ~200 kbps
   - Latency: 300ms
2. Navigate to the login page
3. Log in with `VALID_EMAIL` and `VALID_PASSWORD`

**Expected Result:**
- The application handles high latency without throwing errors or timing out prematurely
- Login completes successfully within the extended 25-second timeout
- User is redirected to `/sales/sales-overview`

---

### TC_LOG_023 – Concurrent Login from Two Tabs is Handled Correctly

**Priority:** High  
**Type:** Functional / Session Management  

**Preconditions:**
- User can successfully log in

**Steps:**
1. Open Tab 1 and navigate to the login page (do not log in)
2. Open Tab 2 in the same browser context and navigate to the login page
3. Log in with `VALID_EMAIL` and `VALID_PASSWORD` in **Tab 2**
4. Switch focus back to **Tab 1**
5. Wait for the session conflict modal to appear
6. Click the **Reload** button in the conflict modal

**Expected Result:**
- Tab 2 authenticates successfully and loads the dashboard
- Tab 1 detects the concurrent session activity and displays a conflict warning modal
- Clicking **Reload** in the modal refreshes Tab 1 and redirects it to the dashboard without requiring re-authentication
- Both tabs display the dashboard correctly after resolution

---

*This document reflects the exact test logic implemented in the automated Playwright test suite. Any modifications to test case logic must be mirrored here to maintain documentation accuracy.*
