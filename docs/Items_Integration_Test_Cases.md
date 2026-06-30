# Items Integration Module – Test Case Documentation



**Project:** Tabski Reporting Platform  

**Module:** Inventory – Items Filtering by Category (End-to-End Integration)  

**Framework:** Playwright (TypeScript) – Page Object Model  

**Environment:** `https://reporting-qa.tabski.com`  

**Merchant:** Sushi Bistro  

**Prepared by:** QA Engineer Marijana Nicic  

**Last Updated:** June 2026



---



## Test Suite Overview



| Attribute | Value |

|---|---|

| Total Test Cases | 2 (parametrized) |

| Automation Coverage | 100% |

| Design Pattern | Page Object Model (POM) |

| Test Type | Positive / End-to-End Integration |



This suite directly satisfies **Task 2B** of the assignment: after creating a category and assigning exactly 2 items to it, the Items page is filtered by that category and the suite asserts that **exactly 2 items** are displayed — no more, no less.



Each test case runs the full flow independently (login → create category → filter items → assert), so either test case can be executed in isolation without depending on `categories.spec.ts` having run first.



---



## Shared Test Data



| Constant | Value |

|---|---|

| `VALID_EMAIL` | `qa.test@tabski.com` |

| `VALID_PASSWORD` | `Test123!@#` |

| `MERCHANT` | `Sushi Bistro` |

| Category name | Generated dynamically via `generateUniqueName('integration')`, pattern: `test-kategorija-marijana-integration-[timestamp]` |



| Test Variant | Menu | Assigned Items |

|---|---|---|

| Variant 1 | `Food Menu` | `Miso soup`, `Ebi tempura` |

| Variant 2 | `Drink Menu` | `7 Up`, `Mochi Cappuccino` |



---



## Global Preconditions



- Test user `qa.test@tabski.com` exists and is active in the system, with merchant **Sushi Bistro**

- Items used in each variant ("Miso soup", "Ebi tempura", "7 Up", "Mochi Cappuccino") exist in the system and are not already assigned to a conflicting category that would affect the count

- A fresh browser context is initialized for each test (Playwright default isolation — no shared `beforeEach`, since each test performs its own login as part of the flow)



---



## Test Cases



---



### TC_ITM_001 – Should Filter Items for Food Menu Category



**Priority:** Critical  

**Type:** Positive / End-to-End Integration  



**Preconditions:**

- Items "Miso soup" and "Ebi tempura" exist in the system



**Steps:**

1. Navigate to the login page and log in with `VALID_EMAIL` / `VALID_PASSWORD`

2. Navigate to the **Categories** page via the main navigation

3. Generate a unique category name (`test-kategorija-marijana-integration-[timestamp]`)

4. Create the category, assigning **Food Menu** and the items **"Miso soup"** and **"Ebi tempura"**

5. Confirm the **"Successfully created"** notification is displayed

6. Navigate to the **Items** page via the main navigation

7. Apply the category filter using the newly created category and **Food Menu**

8. Read the filtered list of item rows



**Expected Result:**

- Category is created successfully and confirmed via notification

- Exactly **2** item rows are displayed in the filtered Items list (`itemRows` count equals 2)

- The filtered list contains both **"Miso soup"** and **"Ebi tempura"**

- No items outside the assigned set are present in the filtered results



---



### TC_ITM_002 – Should Filter Items for Drink Menu Category



**Priority:** Critical  

**Type:** Positive / End-to-End Integration  



**Preconditions:**

- Items "7 Up" and "Mochi Cappuccino" exist in the system



**Steps:**

1. Navigate to the login page and log in with `VALID_EMAIL` / `VALID_PASSWORD`

2. Navigate to the **Categories** page via the main navigation

3. Generate a unique category name (`test-kategorija-marijana-integration-[timestamp]`)

4. Create the category, assigning **Drink Menu** and the items **"7 Up"** and **"Mochi Cappuccino"**

5. Confirm the **"Successfully created"** notification is displayed

6. Navigate to the **Items** page via the main navigation

7. Apply the category filter using the newly created category and **Drink Menu**

8. Read the filtered list of item rows



**Expected Result:**

- Category is created successfully and confirmed via notification

- Exactly **2** item rows are displayed in the filtered Items list (`itemRows` count equals 2)

- The filtered list contains both **"7 Up"** and **"Mochi Cappuccino"**

- No items outside the assigned set are present in the filtered results



---



## Traceability to Assignment Requirements



| Assignment Step (Task 2B) | Covered By |

|---|---|

| Navigate to Items page after category creation | Step 6 in both TC_ITM_001 and TC_ITM_002 |

| Use filters to filter by the newly created category | Step 7 in both test cases |

| Assert exact item count equals 2 | `expect(itemsPage.itemRows).toHaveCount(2)` in both test cases |

| Assert displayed items match assigned items | `expect(itemsPage.itemRows).toContainText(data.items)` in both test cases |



---



## Notes



- Running this suite twice (once per menu type) provides coverage that a single hardcoded scenario would not: it confirms the filtering and item-count logic is **not coincidentally correct** for one specific menu, but behaves consistently across categories built from different menu types and item sets.

- Because each test independently creates its own uniquely named category, these tests can run in parallel or in any order without interfering with one another or with the shared QA merchant data used by other candidates.

- The category created in each test case is not deleted at the end of the test. Cleanup is intentionally out of scope for this suite, consistent with the assignment's instruction to use uniquely named categories specifically to avoid the need for cleanup or collision handling.



---



*This document reflects the exact test logic implemented in `tests/items_integration.spec.ts`. Any modifications to test case logic must be mirrored here to maintain documentation accuracy.* 

