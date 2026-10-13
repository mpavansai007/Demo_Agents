import { createBdd } from 'playwright-bdd';
import { test } from './fixtures';

const { Given, Then } = createBdd(test);

Given('I open the GreenKart catalog', async ({ greenKart }) => {
  await greenKart.open();
});

Then('the catalog and navigation controls should be rendered', async ({ greenKart }) => {
  await greenKart.verifyInitialCatalogAndNavigation();
});
