import { expect, type Locator, type Page } from '@playwright/test';

export class GreenKartPage {
  private readonly homeUrl = 'https://rahulshettyacademy.com/seleniumPractise/#/';
  private rememberedProductPrice = '';
  private initialProductCount = 0;
  private firstProductInitialQuantity = 0;
  private neighboringProductInitialQuantity = 0;

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
    const search = this.searchField;
    await search.fill(query);
    await search.press('Enter');
  }

  private get searchField(): Locator {
    return this.header.getByRole('searchbox', {
      name: 'Search for Vegetables and Fruits',
    });
  }

  async rememberCatalogProductCount(): Promise<void> {
    await expect(this.products.first()).toBeVisible();
    this.initialProductCount = await this.products.count();
    expect(this.initialProductCount).toBeGreaterThan(0);
  }

  async verifyNoProductsAreShown(): Promise<void> {
    await expect(this.products).toHaveCount(0);
  }

  async clearProductSearch(): Promise<void> {
    await this.searchField.fill('');
    await this.searchField.press('Enter');
  }

  async verifyCatalogIsRestored(): Promise<void> {
    await expect(this.products).toHaveCount(this.initialProductCount);
    await expect(this.products.first()).toBeVisible();
  }

  async rememberFirstProductQuantities(): Promise<void> {
    const firstProduct = this.products.nth(0);
    const neighboringProduct = this.products.nth(1);
    await expect(neighboringProduct).toBeVisible();
    this.firstProductInitialQuantity = Number(
      await firstProduct.locator('input.quantity').inputValue(),
    );
    this.neighboringProductInitialQuantity = Number(
      await neighboringProduct.locator('input.quantity').inputValue(),
    );
    expect(this.firstProductInitialQuantity).toBe(1);
    expect(this.neighboringProductInitialQuantity).toBeGreaterThan(0);
  }

  async decrementFirstProductQuantity(): Promise<void> {
    await this.products.nth(0).locator('a.decrement').click();
  }

  async verifyFirstProductQuantityAtMinimum(): Promise<void> {
    await expect(this.products.nth(0).locator('input.quantity')).toHaveValue(
      String(this.firstProductInitialQuantity),
    );
  }

  async incrementThenDecrementFirstProductQuantity(): Promise<void> {
    const quantity = this.products.nth(0).locator('input.quantity');
    await this.products.nth(0).locator('a.increment').click();
    await expect(quantity).toHaveValue(String(this.firstProductInitialQuantity + 1));
    await this.products.nth(0).locator('a.decrement').click();
  }

  async verifyNeighboringProductQuantityUnchanged(): Promise<void> {
    await expect(this.products.nth(1).locator('input.quantity')).toHaveValue(
      String(this.neighboringProductInitialQuantity),
    );
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
