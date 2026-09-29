import { Page } from '@playwright/test';

export class InventoryPage {
    readonly page: Page;

    constructor(page: Page) {
        this.page = page;
    }

    get btn() {
        return {
            addToCartBackpack: this.page.locator('[data-test="add-to-cart-sauce-labs-backpack"]'),
        };
    }

    get link() {
        return {
            cart: this.page.locator('[data-test="shopping-cart-link"]'),
        };
    }

    get select() {
        return {
            priceSort: this.page.locator('[data-test="product-sort-container"]'),
        };
    }

    get head() {
        return {
            products: this.page.getByText('Products'),
        };
    }

    get list() {
        return {
            items: this.page.locator('.inventory_item'),
        };
    }

    get itemPrices() {
        return this.page.locator('.inventory_item_price');
    }

    get cartBadge() {
        return this.page.locator('[data-test="shopping-cart-badge"]');
    }

    async goto() {
        await this.page.goto('/inventory.html');
    }

    async sortPriceLowToHigh() {
        await this.select.priceSort.selectOption('lohi');
    }

    async getItemPrices(): Promise<number[]> {
        const prices = await this.itemPrices.allTextContents();
        return prices.map((price) => Number(price.replace('$', '')));
    }

    async addBackpackToCart() {
        await this.btn.addToCartBackpack.click();
    }

    async goToCart() {
        await this.link.cart.click();
    }
}
