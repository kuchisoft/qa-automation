import type { Page } from '@playwright/test';

export class ProductDetailPage {
  constructor(readonly page: Page) {}

  get name() {
    return this.page.locator('[data-test="product-name"]');
  }

  get unitPrice() {
    return this.page.locator('[data-test="unit-price"]');
  }

  get description() {
    return this.page.locator('[data-test="product-description"]');
  }

  get quantityInput() {
    return this.page.locator('[data-test="quantity"]');
  }

  get increaseQuantityButton() {
    return this.page.locator('[data-test="increase-quantity"]');
  }

  get addToCartButton() {
    return this.page.locator('[data-test="add-to-cart"]');
  }

  get addToFavoritesButton() {
    return this.page.locator('[data-test="add-to-favorites"]');
  }

  /** Same header badge as on the listing page. */
  get cartBadge() {
    return this.page.locator('[data-test="nav-cart"]');
  }

  async goto(productId: string) {
    await this.page.goto(`/product/${productId}`);
  }

  async addToCart() {
    await this.addToCartButton.click();
  }

  async unitPriceValue(): Promise<number> {
    const text = await this.unitPrice.innerText();
    return Number(text.replace(/[^0-9.]/g, ''));
  }
}
