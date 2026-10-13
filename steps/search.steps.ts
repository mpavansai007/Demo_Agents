import { createBdd } from 'playwright-bdd';
import { test } from './fixtures';

const { Given, When, Then } = createBdd(test);

Given('I record the number of catalog products', async ({ greenKart }) => {
  await greenKart.rememberCatalogProductCount();
});

When('I search for {string}', async ({ greenKart }, query: string) => {
  await greenKart.searchFor(query);
});

When('I clear the product search', async ({ greenKart }) => {
  await greenKart.clearProductSearch();
});

Then('no products should be shown', async ({ greenKart }) => {
  await greenKart.verifyNoProductsAreShown();
});

Then('the full catalog should be restored', async ({ greenKart }) => {
  await greenKart.verifyCatalogIsRestored();
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
