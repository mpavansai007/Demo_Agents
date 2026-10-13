import { test as baseTest } from 'playwright-bdd';
import { GreenKartPage } from '../pages/green-kart.page';

type Fixtures = {
  greenKart: GreenKartPage;
};

export const test = baseTest.extend<Fixtures>({
  greenKart: async ({ page }, use) => {
    await use(new GreenKartPage(page));
  },
});
