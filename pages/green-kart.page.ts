import { expect, type Locator, type Page } from '@playwright/test';

export class GreenKartPage {
  private readonly homeUrl = 'https://rahulshettyacademy.com/seleniumPractise/#/';
  private rememberedProductPrice = '';

  constructor(private readonly page: Page) {}

  private get header(): Locator {
    return this.page.getByRole('banner');
  }

  private get products(): Locator {
    return this.page.locator('.products .product');
  }

  async open(): Promise<void> {
    await this.page.goto(this.homeUrl);
  }

  async verifyInitialCatalogAndNavigation(): Promise<void> {
    await expect(this.page).toHaveTitle(/GreenKart/i);
    await expect(this.products.first()).toBeVisible();
    await expect(this.products).not.toHaveCount(0);
    await expect(this.header.getByText('GREENKART', { exact: true })).toBeVisible();
    await expect(
      this.header.getByRole('searchbox', { name: 'Search for Vegetables and Fruits' }),
    ).toBeVisible();
    await expect(this.header.locator('button.search-button')).toBeVisible();
    await expect(this.header.getByRole('link', { name: 'Top Deals' })).toBeVisible();
    await expect(this.header.getByRole('link', { name: 'Flight Booking' })).toBeVisible();
    await expect(this.header.getByRole('link', { name: 'Cart' })).toBeVisible();
    await expect(this.page.locator('footer')).toContainText('GreenKart');

    for (const product of await this.products.all()) {
      await expect(product.locator('.product-name')).toBeVisible();
      await expect(product.locator('.product-name')).not.toBeEmpty();
      await expect(product.locator('.product-price')).toContainText(/\d/);
      await expect(product.locator('input.quantity')).toBeEnabled();
      await expect(product.locator('a.decrement')).toBeVisible();
      await expect(product.locator('a.increment')).toBeVisible();
      await expect(product.getByRole('button', { name: 'ADD TO CART' })).toBeEnabled();
    }
  }

  async searchFor(query: string): Promise<void> {
    const search = this.header.getByRole('searchbox', {
      name: 'Search for Vegetables and Fruits',
    });
    await search.fill(query);
    await search.press('Enter');
  }

  async verifyOnlyProductIsShown(productName: string): Promise<void> {
    await expect(this.products).toHaveCount(1);
    await expect(this.products.locator('.product-name')).toHaveText(productName);
  }

  async rememberDisplayedPrice(): Promise<void> {
    this.rememberedProductPrice = await this.products.locator('.product-price').innerText();
    expect(this.rememberedProductPrice).toMatch(/\d/);
  }

  async verifyPriceIsUnchanged(): Promise<void> {
    await expect(this.products.locator('.product-price')).toHaveText(
      this.rememberedProductPrice,
    );
  }

  async verifyHomeRoute(): Promise<void> {
    await expect(this.page).toHaveURL(this.homeUrl);
  }
}
