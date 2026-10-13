import { createBdd, test as baseTest } from 'playwright-bdd';
import { GreenKartPage } from '../pages/green-kart.page';

type Fixtures = {
  greenKart: GreenKartPage;
};

export const test = baseTest.extend<Fixtures>({
  greenKart: async ({ page }, use) => {
    await use(new GreenKartPage(page));
  },
});

const { Given, When, Then } = createBdd(test);

Given('I open the GreenKart catalog', async ({ greenKart }) => {
  await greenKart.open();
});

When('I search for {string}', async ({ greenKart }, query: string) => {
  await greenKart.searchFor(query);
});

Then('the catalog and navigation controls should be rendered', async ({ greenKart }) => {
  await greenKart.verifyInitialCatalogAndNavigation();
});

Then(
  'only {string} should be shown and its price should be saved',
  async ({ greenKart }, productName: string) => {
    await greenKart.verifyOnlyProductIsShown(productName);
    await greenKart.rememberDisplayedPrice();
  },
);

Then(
  'only {string} should be shown with the saved price',
  async ({ greenKart }, productName: string) => {
    await greenKart.verifyOnlyProductIsShown(productName);
    await greenKart.verifyPriceIsUnchanged();
  },
);

Then('I should remain on the catalog page', async ({ greenKart }) => {
  await greenKart.verifyHomeRoute();
});
