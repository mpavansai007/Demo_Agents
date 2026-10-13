# GreenKart Playwright BDD Tests

Playwright end-to-end tests for the GreenKart demo application:
<https://rahulshettyacademy.com/seleniumPractise/#/>.

The project uses [Playwright Test](https://playwright.dev/) with
[playwright-bdd](https://github.com/vitalets/playwright-bdd). BDD scenarios are
written in Gherkin, and browser interactions and assertions are organized in a
Page Object Model (POM).

## Prerequisites

- Node.js 20 or newer
- npm

## Set up

Clone the repository and install dependencies:

```bash
git clone https://github.com/mpavansai007/Demo_Agents.git
cd Demo_Agents
npm ci
npx playwright install chromium
```

## Run the tests

Run the BDD scenarios in headless Chromium:

```bash
npm run test:bdd
```

Run them in headed Chromium:

```bash
npm run test:bdd:headed
```

The `bddgen` script generates Playwright test files from the feature files.
Generated files are written to `tests/.features-gen/` and are ignored by Git.
The test command runs BDD generation before executing the generated tests.

## View the HTML report

Playwright writes its HTML report to `playwright-report/` after a test run.
Open it in the browser with:

```bash
npm run test:bdd:report
```

Alternatively, open `playwright-report/index.html` directly. The report and
test results are generated output and are ignored by Git.

## Project structure

| Path | Purpose |
| --- | --- |
| `features/green-kart.feature` | Gherkin scenarios for GreenKart |
| `steps/green-kart.steps.ts` | BDD step definitions and fixtures |
| `pages/green-kart.page.ts` | GreenKart Page Object Model and UI assertions |
| `specs/green-kart-test-plan.md` | Exploratory test plan with 19 scenarios |
| `playwright.config.ts` | BDD generation, Playwright reporter, and browser projects |
| `.github/workflows/playwright.yml` | GitHub Actions workflow for generating and running tests |

## Work completed so far

1. Explored the GreenKart catalog, search, cart, checkout, order confirmation,
   and Top Deals page; documented observations and follow-up cases in the test
   plan.
2. Initially added standalone Playwright tests for:
   - **GK-001:** Initial catalog and navigation controls render.
   - **GK-002:** Search by exact, partial, and case-varied product name.
3. Ran those tests in Chromium and converted the two scenarios to Gherkin
   feature scenarios using `playwright-bdd`.
4. Moved page interactions and UI checks into `GreenKartPage`, with step
   definitions connecting the Gherkin scenarios to the page object.
5. Configured HTML reporting and updated GitHub Actions to run BDD generation
   before the Playwright test run.
6. Verified the converted BDD tests in Chromium: **2 passed**.

The full test plan contains 19 scenarios, but only GK-001 and GK-002 have been
automated so far. The project is configured with Chromium, Firefox, and WebKit
projects; the BDD npm scripts currently run the scenarios in Chromium.
