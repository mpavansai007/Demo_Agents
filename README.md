# GreenKart Playwright BDD Test Suite

Automated browser tests for the public GreenKart demo:
<https://rahulshettyacademy.com/seleniumPractise/#/>.

The test suite combines Playwright Test, `playwright-bdd` (Gherkin), and the
Page Object Model (POM). Each `GK-###` scenario has its own feature file, while
related step definitions and the shared page object are grouped by
responsibility.

## Requirements

- Node.js 20 or newer
- npm

## Installation

```bash
git clone https://github.com/mpavansai007/Demo_Agents.git
cd Demo_Agents
npm ci
npx playwright install chromium
```

## Run scenarios

Run all current BDD scenarios in headless Chromium:

```bash
npm run test:bdd
```

Run them in a visible (headed) Chromium browser:

```bash
npm run test:bdd:headed
```

Run one scenario by its tag (replace `GK-004` with another scenario ID as
needed):

```bash
npm run bddgen
npx playwright test tests/.features-gen --project=chromium --grep GK-004
```

Playwright UI mode is useful for interactively selecting and rerunning
scenarios:

```bash
npm run bddgen
npx playwright test --ui --project=chromium
```

`bddgen` converts the Gherkin files into generated Playwright tests under
`tests/.features-gen/`. This generated directory is ignored by Git. The regular
BDD npm scripts run generation automatically before the test run.

## HTML report

The Playwright HTML report is generated at `playwright-report/index.html`
after a test run. Open it with:

```bash
npm run test:bdd:report
```

Alternatively, open `playwright-report/index.html` directly. Reports and
test-result artifacts are generated locally and are not committed.

## Current scenarios

| ID | Scenario | Feature file |
| --- | --- | --- |
| GK-001 | Initial catalog and navigation controls render | `features/GK-001-catalog-rendering.feature` |
| GK-002 | Search by exact, partial, and case-varied product name | `features/GK-002-product-search.feature` |
| GK-003 | No-match search and clearing search recover cleanly | `features/GK-003-search-no-results.feature` |
| GK-004 | Quantity stepper respects its lower boundary | `features/GK-004-quantity-stepper.feature` |

All four scenarios have been run successfully in Chromium, including headed
runs. The full exploratory plan contains 19 scenarios; the remaining scenarios
are not automated yet.

## Project layout

```text
features/     One Gherkin feature file per scenario
steps/        Shared test fixture and feature step definitions
pages/        GreenKart page object and UI interactions/assertions
specs/        Exploratory test plan
tests/        Playwright test scaffold and generated BDD tests
.github/      Agent definitions and GitHub Actions workflow
```

### Design responsibilities

- **Feature files** describe the scenario in Given/When/Then language and carry
  the `GK-###` tag used to select an individual test.
- **Step definitions** map readable Gherkin steps to page-object methods.
  Catalog, search, and quantity steps live in separate files.
- **`steps/fixtures.ts`** creates the `GreenKartPage` fixture for each test.
- **`pages/green-kart.page.ts`** centralizes locators, browser actions, and
  user-visible assertions so feature steps do not depend on page markup.
- **`playwright.config.ts`** configures BDD generation, HTML reporting, and
  Chromium, Firefox, and WebKit projects. The provided BDD run scripts target
  Chromium.

## Work completed

1. Explored the catalog, product search, quantity controls, cart, checkout,
   order confirmation, and Top Deals; recorded observations and additional
   coverage ideas in `specs/green-kart-test-plan.md`.
2. Created the initial standalone catalog and search tests, then migrated
   those scenarios to Gherkin with `playwright-bdd`.
3. Added GK-003 for a no-match search and recovery after clearing the query.
4. Added GK-004 for the quantity minimum and to verify that stepper actions
   affect only the selected product.
5. Split the four scenarios into their own feature files and grouped BDD steps
   into catalog, search, and quantity modules.
6. Kept UI actions and assertions in a shared Page Object Model and configured
   HTML reporting and GitHub Actions test generation.
7. Ran the four current scenarios in Chromium; the latest full headed run
   passed all four tests.
