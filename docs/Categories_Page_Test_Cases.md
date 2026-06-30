# Categories Module – Test Case Documentation

**Project:** Tabski Reporting Platform  
**Module:** Inventory – Categories  
**Framework:** Playwright (TypeScript) – Page Object Model  
**Environment:** `https://reporting-qa.tabski.com`  
**Merchant:** Sushi Bistro  
**Prepared by:** QA Engineer Marijana Nicic 
**Last Updated:** June 2026  

---

## Test Suite Overview

| Attribute | Value |
|---|---|
| Total Test Cases | 10 |
| Automation Coverage | 100% |
| Design Pattern | Page Object Model (POM) |
| Test Types | Functional, Validation, CRUD (Create, Edit, Delete) |

---

## Shared Test Data

| Constant | Value |
|---|---|
| `VALID_EMAIL` | `qa.test@tabski.com` |
| `VALID_PASSWORD` | `Test123!@#` |
| `MERCHANT` | `Sushi Bistro` |
| Category names | Generated dynamically via `generateUniqueName()`, pattern: `test-kategorija-marijana-[suffix]-[timestamp]` |

---

## Global Preconditions

- User is logged in as `qa.test@tabski.com` with merchant **Sushi Bistro** selected
- A fresh browser context is initialized before each test via `beforeEach`
- User has navigated to the **Categories** page via the main navigation menu prior to each test

---

## 1. Positive Scenarios (Creation)

---

### TC_CAT_001 – Successfully Create a Category with Minimum Required Fields

**Priority:** Critical  
**Type:** Positive / Functional  

**Preconditions:**
- User is on the Categories page

**Steps:**
1. Click **New Category**
2. Enter a unique category name
3. Click **Create Category**

**Expected Result:**
- A success notification is displayed: *"Successfully created"*
- The new category appears in the categories list when searched by name

---

### TC_CAT_002 – Successfully Create a Category with a Food Menu Assigned

**Priority:** High  
**Type:** Positive / Functional  

**Preconditions:**
- User is on the Categories page

**Steps:**
1. Click **New Category**
2. Enter a unique category name
3. Assign **Food Menu** in the "Assign menus" field
4. Click **Create Category**

**Expected Result:**
- A success notification is displayed: *"Successfully created"*
- The category's Menu column displays **"Food Menu"**
- The category's Items column displays **"No items."**

---

### TC_CAT_003 – Successfully Create a Category with a Drink Menu Assigned

**Priority:** High  
**Type:** Positive / Functional  

**Preconditions:**
- User is on the Categories page

**Steps:**
1. Click **New Category**
2. Enter a unique category name
3. Assign **Drink Menu** in the "Assign menus" field
4. Click **Create Category**

**Expected Result:**
- A success notification is displayed: *"Successfully created"*
- The category's Menu column displays **"Drink Menu"**
- The category's Items column displays **"No items."**

---

### TC_CAT_004 – Successfully Create a Category with Exactly 2 Items Assigned

**Priority:** Critical  
**Type:** Positive / Functional  

**Preconditions:**
- User is on the Categories page
- Items "Miso soup" and "Ebi tempura" exist in the system

**Steps:**
1. Click **New Category**
2. Enter a unique category name
3. Assign **Miso soup** and **Ebi tempura** in the "Assign items to category" field
4. Click **Create Category**

**Expected Result:**
- A success notification is displayed: *"Successfully created"*
- The category's Menu column displays **"No Menus."**
- The category's Items column contains both **"Miso soup"** and **"Ebi tempura"**

---

### TC_CAT_005 – Successfully Create a Category with Both a Menu and Items Assigned

**Priority:** Critical  
**Type:** Positive / End-to-End  

**Preconditions:**
- User is on the Categories page
- Items "Miso soup" and "Ebi tempura" exist in the system

**Steps:**
1. Click **New Category**
2. Enter a unique category name
3. Assign **Food Menu** in the "Assign menus" field
4. Assign **Miso soup** and **Ebi tempura** in the "Assign items to category" field
5. Click **Create Category**

**Expected Result:**
- A success notification is displayed: *"Successfully created"*
- The category's Menu column displays **"Food Menu"**
- The category's Items column contains both **"Miso soup"** and **"Ebi tempura"**
- This scenario mirrors the full real-world flow required by Task A of the assignment

---

## 2. Negative Scenarios & Validation

---

### TC_CAT_006 – Reject Creation with an Empty Category Name

**Priority:** High  
**Type:** Negative / Validation  

**Preconditions:**
- User is on the Categories page

**Steps:**
1. Click **New Category**
2. Leave the category name field empty
3. Click **Create Category**

**Expected Result:**
- Form submission is blocked
- Validation message is displayed: *"Category name is required"*
- The category name field is marked as invalid (`aria-invalid="true"`)

---

### TC_CAT_007 – Reject Creation with a Duplicate Category Name

**Priority:** High  
**Type:** Negative / Validation  

**Preconditions:**
- User is on the Categories page

**Steps:**
1. Create a category with a unique name and confirm success
2. Click **New Category** again
3. Enter the exact same category name used in step 1
4. Click **Create Category**

**Expected Result:**
- Creation is blocked
- An error notification is displayed indicating the name already exists
- Searching for the category name returns exactly **1** row, confirming no duplicate was created

---

### TC_CAT_008 – Close the Form Without Saving When Cancel is Clicked

**Priority:** Medium  
**Type:** Functional / UX  

**Preconditions:**
- User is on the Categories page

**Steps:**
1. Click **New Category**
2. Enter a unique category name
3. Click **Cancel**

**Expected Result:**
- The form closes without saving
- The category name field is no longer visible
- Searching for the entered name returns an empty state: *"No Categories for '[name]'"*

---

## 3. Edit & Delete

---

### TC_CAT_009 – Successfully Edit an Existing Category's Name, Menu and Items

**Priority:** Critical  
**Type:** Positive / Functional  

**Preconditions:**
- User is on the Categories page
- A category exists with a Food Menu and two assigned items ("Miso soup", "Ebi tempura")

**Steps:**
1. Open the existing category for editing
2. Change the category name to a new unique value
3. Remove the assigned **Food Menu**
4. Assign **Drink Menu** instead
5. Remove the previously assigned items
6. Assign a new item, **"7 Up"**
7. Click **Confirm** to save changes

**Expected Result:**
- A success notification is displayed: *"Successfully updated"*
- Searching by the new name shows the category with Menu column **"Drink Menu"** and Items column containing **"7 Up"**
- Searching by the old name returns an empty state, confirming the rename was applied and the old entry no longer exists

---

### TC_CAT_010 – Successfully Delete a Category

**Priority:** High  
**Type:** Positive / Functional  

**Preconditions:**
- User is on the Categories page
- A category exists with a Food Menu and two assigned items ("Miso soup", "Ebi tempura")

**Steps:**
1. Open the category options menu for the existing category
2. Click **Delete**
3. Confirm the deletion

**Expected Result:**
- A success notification is displayed: *"Successfully deleted"*
- Searching for the deleted category name returns an empty state, confirming the category no longer exists in the list

---

*This document reflects the exact test logic implemented in the automated Playwright test suite (`categories.spec.ts`). Any modifications to test case logic must be mirrored here to maintain documentation accuracy.*
