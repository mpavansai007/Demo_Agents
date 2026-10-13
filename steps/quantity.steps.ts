import { createBdd } from 'playwright-bdd';
import { test } from './fixtures';

const { Given, When, Then } = createBdd(test);

Given(
  'I record the first product quantity and a neighboring product quantity',
  async ({ greenKart }) => {
    await greenKart.rememberFirstProductQuantities();
  },
);

When('I decrement the first product at its minimum', async ({ greenKart }) => {
  await greenKart.decrementFirstProductQuantity();
});

When('I increment and then decrement the first product quantity', async ({ greenKart }) => {
  await greenKart.incrementThenDecrementFirstProductQuantity();
});

Then('the first product quantity should remain at its minimum', async ({ greenKart }) => {
  await greenKart.verifyFirstProductQuantityAtMinimum();
});

Then('the first product quantity should return to its minimum', async ({ greenKart }) => {
  await greenKart.verifyFirstProductQuantityAtMinimum();
});

Then('the neighboring product quantity should remain unchanged', async ({ greenKart }) => {
  await greenKart.verifyNeighboringProductQuantityUnchanged();
});
