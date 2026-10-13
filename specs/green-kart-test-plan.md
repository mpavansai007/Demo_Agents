# GreenKart — Web UI Test Plan

**Application:** GreenKart vegetables and fruits cart  
**In-scope site:** <https://rahulshettyacademy.com/seleniumPractise/#/>  
**Plan status:** Ready for test implementation  
**Test implementation:** Not included in this artifact

## 1. Purpose

Define independent, repeatable browser scenarios for the GreenKart shopping flow and its **Top Deals** view. The plan covers the rendered catalog and interactive controls, search, product quantity, cart, checkout, order confirmation, table interactions, and validation/boundary conditions.

## 2. Scope

### In scope

- Home/catalog rendering and product cards
- Catalog search and clearing/resetting search
- Product quantity decrement/increment and numeric quantity field
- Add-to-cart feedback, cart badge/preview, totals, and remove-item action
- Empty-cart behavior
- Checkout summary and promo-code validation
- Country selector, Terms & Conditions checkbox, and order placement
- Order confirmation and return to the home/catalog
- **Top Deals** table: search, page size, sorting, pagination, and Delivery Date controls
- Basic keyboard/focus and responsive smoke coverage for these same in-scope flows

### Out of scope

- The linked Flight Booking application and QA Career Accelerator site
- Payment processing, user accounts, inventory administration, and APIs not exposed in this UI
- Third-party advertising/analytics behavior
- Implementing Playwright tests or changing the existing test scaffold

## 3. Observed application behavior and test assumptions

The observations below were made against the live demo site during planning; they are context, not a guarantee that demo data or behavior will remain unchanged.

- The catalog rendered **31 products**. Product cards showed a name, price, minus/plus controls, a quantity input initially set to `1`, and an **ADD TO CART** button.
- Searching for `Apple` narrowed the catalog to **Apple - 1 Kg**. The catalog search stays on the home hash route.
- Decrementing a quantity already at `1` left it at `1`; two increments changed it to `3`.
- Adding that product at quantity `3` showed added feedback and a cart badge of `1` (the badge appeared to count distinct lines/SKUs, not units). The cart preview showed 3 units and a line total of ₹216 (₹72 each).
- The preview had a remove (`×`) action and **PROCEED TO CHECKOUT**. Proceeding opened `#/cart`, with product, quantity, price, total, promo code, item count, discount, total after discount, and **Place Order**.
- An empty promo submission displayed `Empty code ..!`; an unknown code displayed `Invalid code ..!`. The observed totals remained unchanged.
- **Place Order** opened `#/country`. The Terms & Conditions checkbox was required: proceeding without it displayed `Please accept Terms & Conditions - Required`. In the observed run, checking the box and proceeding with the country selector still at its default `Select` value placed the order successfully. Do not assume a country is mandatory without confirming a product requirement.
- The confirmation stated “Thank you, your order has been placed successfully” and indicated an automatic redirect to the home page. After returning, the cart was empty.
- **Top Deals** opened `#/offers` (the visible link declares `target="_blank"`). The table initially used page size `5`, displayed five rows, and had four numbered pages. It exposed page sizes `5`, `10`, and `20`, a search field, sortable name/price/discount-price column headers, and Delivery Date controls. A matching search for `tomato` returned one row; a non-matching search displayed `No data`. Changing the page size to `10` displayed ten rows. The initial sort announcement was name descending.
- The country selector exposed 209 options in the observed run.

## 4. Test approach

- Treat each scenario below as a standalone test with its own fresh browser context or a documented reset. No scenario should depend on a prior scenario having passed.
- Use visible UI state and user-facing values as the primary assertions. Verify cart math from the displayed unit price and quantity; avoid hard-coding volatile ordering or dates unless the test is explicitly for the observed fixture.
- For checkout scenarios, use the demo’s in-application order flow only; no real payment method was exposed.
- For Top Deals, use the direct in-scope route `https://rahulshettyacademy.com/seleniumPractise/#/offers` when an independent entry point is needed.
- Keep tests deterministic: use known catalog products (for example, Apple, Brocolli, or Carrot), capture the price shown at runtime, and clear any search/filter before verifying the full view.
- Verify browser console/page errors separately from third-party request failures. During exploration, some unrelated analytics/advertising requests reported `ERR_ABORTED`; this did not prevent the shopping UI from rendering or completing the demo order.

## 5. Priority definitions

- **P0 — Critical:** purchase path, totals, or order placement blocked or incorrect.
- **P1 — High:** primary catalog/cart interaction or core Top Deals interaction incorrect.
- **P2 — Medium:** boundary, validation, or secondary control defect with a workaround.
- **P3 — Low:** presentation, accessibility, or non-blocking content issue.

## 6. Independent scenario catalogue

| ID | Priority | Scenario | Main area |
|---|---|---|---|
| GK-001 | P1 | Initial catalog and navigation controls render | Home |
| GK-002 | P1 | Search by exact, partial, and case-varied product name | Home search |
| GK-003 | P2 | No-match search and clearing search recover cleanly | Home search |
| GK-004 | P1 | Quantity stepper respects its lower boundary | Product card |
| GK-005 | P1 | Valid quantity is added and reflected in cart preview | Product/cart |
| GK-006 | P1 | Multiple products and repeated adds produce correct lines and totals | Cart |
| GK-007 | P1 | Remove one line and remove the final line | Cart |
| GK-008 | P2 | Zero, negative, blank, fractional, and very large quantities are handled safely | Quantity boundary |
| GK-009 | P2 | Empty cart preview and checkout action do not create an empty order | Cart |
| GK-010 | P0 | Checkout summary and calculated totals match selected products | Checkout |
| GK-011 | P2 | Empty, invalid, and repeated promo-code submissions are handled | Checkout |
| GK-012 | P0 | Terms acceptance is required before proceeding | Country/order |
| GK-013 | P0 | Country selection and valid order placement reach confirmation | Country/order |
| GK-014 | P0 | Order confirmation is shown and cart is reset after completion | Order completion |
| GK-015 | P1 | Top Deals search filters rows and handles no results | Top Deals |
| GK-016 | P1 | Top Deals page size and pagination boundaries work | Top Deals |
| GK-017 | P2 | Top Deals column sorting toggles direction and data order | Top Deals |
| GK-018 | P2 | Delivery Date controls accept valid input and reject invalid boundaries | Top Deals |
| GK-019 | P2 | Keyboard and small-viewport smoke for in-scope controls | Usability |

### GK-001 — Initial catalog and navigation controls render

**Precondition:** Fresh context; navigate to the in-scope home URL.  
**Steps:**
1. Wait for the catalog to finish rendering.
2. Inspect the header, search field/button, navigation links, product cards, and footer.
3. Confirm each product card exposes its name, price, quantity controls, and add action.

**Expected:** Page title and GreenKart branding are visible; catalog is non-empty; each rendered product has a readable name and price and operable quantity/add controls. Top Deals is available. Do not navigate to out-of-scope linked applications.

### GK-002 — Search by exact, partial, and case-varied product name

**Precondition:** Fresh home page.  
**Steps:** Search for a known product (for example `Apple`), then replace the query with a partial term and a case-varied form.  
**Expected:** Results are limited to matching products; product identity and displayed price remain correct; changing the query updates results without navigating away or duplicating cards.

### GK-003 — No-match search and clearing search recover cleanly

**Precondition:** Fresh home page.  
**Steps:** Enter a query that cannot match any catalog product; then clear the search using the field/button behavior available in the UI.  
**Expected:** No unrelated products are shown; an understandable empty/no-results state is presented (or the product grid is empty without a false match); clearing the query restores the catalog and does not retain stale results.

### GK-004 — Quantity stepper respects its lower boundary

**Precondition:** Fresh home page with an identified product at its default quantity.  
**Steps:** Record the initial quantity; decrement at the initial value; increment once and decrement once.  
**Expected:** Quantity never falls below the product’s supported minimum; a decrement at the minimum does not create a negative/blank value; increment/decrement update only the selected product card.

### GK-005 — Valid quantity is added and reflected in cart preview

**Precondition:** Fresh home page and empty cart.  
**Steps:** Set a known product quantity to `3` using the stepper; add it; open the cart preview.  
**Expected:** Add feedback appears; cart badge reflects the resulting cart contents consistently; preview contains the correct product, 3 units, unit price, and line total (`quantity × displayed unit price`). The product card quantity is not silently confused with the cart’s quantity.

### GK-006 — Multiple products and repeated adds produce correct lines and totals

**Precondition:** Fresh home page and empty cart.  
**Steps:** Add two different products with different quantities; add one of them again from the catalog; inspect the badge, preview, and checkout summary.  
**Expected:** Each selected SKU is represented consistently; repeated-add behavior is deterministic (quantity consolidated or lines separated according to the application’s design); no item is lost or double-counted; displayed line and grand totals equal the sum of displayed prices multiplied by quantities. Record whether the badge counts units or distinct lines.

### GK-007 — Remove one line and remove the final line

**Precondition:** Cart preview contains at least two different products.  
**Steps:** Remove one line; verify the remaining line and totals; remove the last line.  
**Expected:** Only the requested line is removed; badge and totals are recalculated; the final removal presents the empty-cart state and leaves no stale line data.

### GK-008 — Zero, negative, blank, fractional, and very large quantities are handled safely

**Precondition:** Fresh home page; select a known product.  
**Steps:** Try direct input values `0`, `-1`, blank, a fraction such as `1.5`, and a large value suitable for a boundary test; attempt to add each value.  
**Expected:** Unsupported quantities are rejected, normalized to a documented minimum/maximum, or produce clear validation; invalid values must not create zero/negative/NaN totals, crash the view, or silently add an unintended quantity. Confirm whether native number-field constraints exist before making them a fixed assertion.

### GK-009 — Empty cart preview and checkout action do not create an empty order

**Precondition:** Fresh context with an empty cart.  
**Steps:** Open Cart; inspect the empty state; activate **PROCEED TO CHECKOUT** if enabled.  
**Expected:** The UI clearly communicates that the cart is empty. The application must not place or confirm an order with no products. If checkout is intentionally disabled, verify the disabled state; if it remains enabled in the demo, verify the resulting page does not permit an empty order.

### GK-010 — Checkout summary and calculated totals match selected products

**Precondition:** Fresh context; add at least two known products with quantities.  
**Steps:** Open the cart preview; proceed to `#/cart`; compare each summary row and all totals with the source selections.  
**Expected:** Product names, quantities, unit prices, per-line totals, item count, total amount, discount, and total after discount are internally consistent. Verify whether “No. of Items” means line count or total units and document the intended meaning; do not accept ambiguous/miscalculated values.

### GK-011 — Empty, invalid, and repeated promo-code submissions are handled

**Precondition:** Non-empty cart on `#/cart`.  
**Steps:** Apply a blank code; apply a clearly invalid code; submit the invalid code again; if a valid demo code is documented by the product owner, test that code separately.  
**Expected:** Blank/invalid feedback is understandable and does not alter totals or cart contents. Repeated submissions do not stack discounts or leave an indefinite loading state. A valid-code case is conditional on an authoritative test code being supplied.

### GK-012 — Terms acceptance is required before proceeding

**Precondition:** Non-empty cart; reach `#/country` via Place Order.  
**Steps:** Leave Terms & Conditions unchecked and activate **Proceed**.  
**Expected:** Order placement is blocked and a clear validation message is displayed adjacent to or associated with the checkbox. No success state/order is shown.

### GK-013 — Country selection and valid order placement reach confirmation

**Precondition:** Non-empty cart; `#/country` route.  
**Steps:** Select a valid country from the dropdown; accept Terms & Conditions; activate **Proceed**. Also verify keyboard selection of the country.  
**Expected:** Selected country remains selected; accepted terms permit the flow; the order reaches the confirmation state. Verify whether the default `Select` option should be rejected: exploration showed the demo accepted it when terms were checked, so assert mandatory country selection only if product requirements confirm it.

### GK-014 — Order confirmation is shown and cart is reset after completion

**Precondition:** Complete an order using a known product/quantity in a fresh context.  
**Steps:** Observe the confirmation message; wait for the stated redirect; reopen the cart after return to home.  
**Expected:** A clear success confirmation appears once; redirect returns to the catalog as indicated; cart state is empty after successful order completion. A failed/aborted confirmation must not falsely clear the cart.

### GK-015 — Top Deals search filters rows and handles no results

**Precondition:** Fresh context; open `#/offers`.  
**Steps:** Search for a known table product (for example `tomato`); try partial/case-varied search; then search for an impossible name.  
**Expected:** Matching rows are filtered, including their prices and discount prices; a no-match query shows `No data` or equivalent; clearing search restores the complete filtered-table dataset without stale page state.

### GK-016 — Top Deals page size and pagination boundaries work

**Precondition:** Fresh context; open `#/offers` with no search filter.  
**Steps:** Verify page sizes `5`, `10`, and `20`; traverse Next, Previous, First, Last, and numbered pages; inspect first and final pages at each feasible size.  
**Expected:** The displayed row count honors the selected page size (except a shorter final page); navigation updates the active page and rows; First/Previous are disabled at the beginning and Next/Last at the end; no duplicate, skipped, or stale rows occur. Search results and page-size changes reset or retain the page index safely.

### GK-017 — Top Deals column sorting toggles direction and data order

**Precondition:** Fresh context; open `#/offers` with multiple rows.  
**Steps:** Activate each sortable column header (name, price, discount price) twice; verify both directions and the sort announcement.  
**Expected:** Rows are ordered by the selected column in the announced direction; a second activation reverses direction; sort state and visible rows agree. Equal values remain valid without dropping rows.

### GK-018 — Delivery Date controls accept valid input and reject invalid boundaries

**Precondition:** Fresh context; open `#/offers`.  
**Steps:** Inspect the date input/calendar control; enter a valid date using keyboard and the picker; attempt invalid, incomplete, and boundary dates, including a leap-day case where supported.  
**Expected:** Valid dates are represented consistently in the control; invalid dates cannot be committed silently; the picker opens/closes accessibly and does not obstruct table search/sort/pagination. Confirm the date field’s intended business effect before asserting filtering or submission, as exploration exposed the control but not a date-result workflow.

### GK-019 — Keyboard and small-viewport smoke for in-scope controls

**Precondition:** Fresh context; run once on home and once on `#/offers`.  
**Steps:** At desktop and a narrow/mobile viewport, navigate key controls by keyboard; search, operate quantity/cart controls, table controls, date inputs, and checkout validation without relying solely on pointer input.  
**Expected:** Controls are reachable in a sensible order, have understandable accessible names/focus indicators, remain usable without horizontal clipping where applicable, and do not overlap or hide validation/results. Log genuine accessibility defects separately from browser-specific native date-picker differences.

## 7. Test data and reset guidance

- Use current displayed catalog prices rather than assuming prices never change.
- Suggested catalog fixtures from exploration: **Apple - 1 Kg** (₹72), **Brocolli - 1 Kg** (₹120), and **Carrot - 1 Kg** (₹56). Reconfirm the live values before asserting arithmetic.
- Use `Apple` for catalog search; use `tomato` for the Top Deals table filter; use an intentionally nonexistent term for negative search cases.
- Promo-code happy-path data is not known. Do not invent a “valid” promo code; request a test fixture from the site owner if needed.
- Prefer a new browser context per scenario. If context reuse is unavoidable, finish by removing all cart lines, clearing search, resetting page size to `5`, returning to page 1, and reloading.
- Order placement changes transient demo state. Use a fresh context per order scenario and avoid parallelizing scenarios if the live demo shares cart/order state across contexts.

## 8. Execution and reporting guidance

- The project scaffold contains Playwright with Chromium, Firefox, and WebKit desktop projects, but no configured `baseURL` or test scripts. This plan does not change or assume the scaffold needs to be modified.
- Start with the critical shopping path in Chromium; then run the same stable smoke flows in Firefox and WebKit. Treat native date-input rendering differences as browser-specific unless the user-facing behavior is broken.
- Report scenario ID, browser/viewport, starting route, data values/prices, actual result, and screenshot/trace for failures. Separate application failures from unrelated blocked analytics/advertising requests.
- Recheck live selectors/content before implementation; this artifact intentionally specifies behavior and outcomes rather than locators or code.

## 9. Exploration limitations

- The planning environment did not expose the requested `planner_setup_page` or `planner_save_plan` operations. The site was explored with the available integrated browser controls, and this Markdown artifact was saved directly in the project’s `specs` directory instead.
- The demo is externally hosted and may change catalog contents, prices, promo behavior, and transient order state.
- Third-party analytics/advertising requests emitted `ERR_ABORTED` during exploration. No functional impact to the tested UI was observed, but those services were not validated.
- Top Deals was inspected at `#/offers`; the link itself declares a new-tab target, while the integrated browser did not open that new tab through the link click. Its route was therefore opened directly within the same page for inspection.
- Date-picker behavior beyond the visible date input and its controls was not validated. Quantity direct-entry edge cases, empty-cart order prevention, and alternate promo-code success cases remain planned assertions rather than confirmed application behavior.
