import type { Page } from '@playwright/test';

/** The values Toolshop's sort `<select>` actually uses. */
export type SortOption =
  | 'name,asc'
  | 'name,desc'
  | 'price,asc'
  | 'price,desc'
  | 'co2_rating,asc'
  | 'co2_rating,desc';

export class ProductsPage {
  constructor(readonly page: Page) {}

  /** Product tiles. Each card's `data-test` is `product-<ulid>`, hence the prefix match. */
  get cards() {
    return this.page.locator('a.card[data-test^="product-"]');
  }

  get names() {
    return this.page.locator('[data-test="product-name"]');
  }

  get priceLabels() {
    return this.page.locator('[data-test="product-price"]');
  }

  get outOfStockBadges() {
    return this.page.locator('[data-test="out-of-stock"]');
  }

  get sortSelect() {
    return this.page.locator('[data-test="sort"]');
  }

  get searchInput() {
    return this.page.locator('[data-test="search-query"]');
  }

  get searchButton() {
    return this.page.locator('[data-test="search-submit"]');
  }

  get searchResetButton() {
    return this.page.locator('[data-test="search-reset"]');
  }

  get nextPageLink() {
    return this.page.locator('[data-test="pagination-next"]');
  }

  /** Header cart link. Its text is the item count, so "0" means empty. */
  get cartBadge() {
    return this.page.locator('[data-test="nav-cart"]');
  }

  async goto() {
    await this.page.goto('/');
  }

  async search(term: string) {
    await this.searchInput.fill(term);
    await this.searchButton.click();
  }

  async sortBy(option: SortOption) {
    await this.sortSelect.selectOption(option);
  }

  /**
   * Prices render as `$14.15`, so they are parsed rather than compared as text.
   * Comparing the strings would make `$9.17` sort above `$14.15`.
   */
  async prices(): Promise<number[]> {
    const labels = await this.priceLabels.allTextContents();
    return labels.map((label) => Number(label.replace(/[^0-9.]/g, '')));
  }

  async openFirstCard() {
    await this.cards.first().click();
  }
}
