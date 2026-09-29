import type { Page } from '@playwright/test';

export type SortOption =
  | 'name,asc'
  | 'name,desc'
  | 'price,asc'
  | 'price,desc'
  | 'co2_rating,asc'
  | 'co2_rating,desc';

export class ProductsPage {
  constructor(readonly page: Page) {}

  get link() {
    return {
      cards: this.page.locator('a.card[data-test^="product-"]'),
      nextPage: this.page.locator('[data-test="pagination-next"]'),
    };
  }

  get head() {
    return {
      names: this.page.locator('[data-test="product-name"]'),
    };
  }

  get text() {
    return {
      prices: this.page.locator('[data-test="product-price"]'),
      outOfStock: this.page.locator('[data-test="out-of-stock"]'),
    };
  }

  get select() {
    return {
      sort: this.page.locator('[data-test="sort"]'),
    };
  }

  get input() {
    return {
      search: this.page.locator('[data-test="search-query"]'),
    };
  }

  get btn() {
    return {
      search: this.page.locator('[data-test="search-submit"]'),
      searchReset: this.page.locator('[data-test="search-reset"]'),
    };
  }

  get cartBadge() {
    return this.page.locator('[data-test="nav-cart"]');
  }

  async goto() {
    await this.page.goto('/');
  }

  async search(term: string) {
    await this.input.search.fill(term);
    await this.btn.search.click();
  }

  async sortBy(option: SortOption) {
    await this.select.sort.selectOption(option);
  }

  async prices(): Promise<number[]> {
    const labels = await this.text.prices.allTextContents();
    return labels.map((label) => Number(label.replace(/[^0-9.]/g, '')));
  }

  async openFirstCard() {
    await this.link.cards.first().click();
  }
}
