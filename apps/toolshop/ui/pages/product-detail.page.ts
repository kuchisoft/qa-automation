import type { Page } from '@playwright/test';

export class ProductDetailPage {
  constructor(readonly page: Page) {}

  get head() {
    return {
      name: this.page.locator('[data-test="product-name"]'),
    };
  }

  get unitPrice() {
    return this.page.locator('[data-test="unit-price"]');
  }

  get description() {
    return this.page.locator('[data-test="product-description"]');
  }

  get input() {
    return {
      quantity: this.page.locator('[data-test="quantity"]'),
    };
  }

  get btn() {
    return {
      increaseQuantity: this.page.locator('[data-test="increase-quantity"]'),
      addToCart: this.page.locator('[data-test="add-to-cart"]'),
      addToFavorites: this.page.locator('[data-test="add-to-favorites"]'),
    };
  }

  get cartBadge() {
    return this.page.locator('[data-test="nav-cart"]');
  }

  async goto(productId: string) {
    await this.page.goto(`/product/${productId}`);
  }

  async addToCart() {
    await this.btn.addToCart.click();
  }

  async unitPriceValue(): Promise<number> {
    const text = await this.unitPrice.innerText();
    return Number(text.replace(/[^0-9.]/g, ''));
  }
}
