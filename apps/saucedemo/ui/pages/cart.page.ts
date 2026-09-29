import { Page } from '@playwright/test';

export class CartPage {
    readonly page: Page;

    constructor(page: Page) {
        this.page = page;
    }

    get btn() {
        return {
            removeBackpack: this.page.locator('[data-test="remove-sauce-labs-backpack"]'),
            checkout: this.page.locator('[data-test="checkout"]'),
        };
    }

    get cartItems() {
        return this.page.locator('.cart_item');
    }

    async removeBackpack() {
        await this.btn.removeBackpack.click();
    }

    async proceedToCheckout() {
        await this.btn.checkout.click();
    }
}
