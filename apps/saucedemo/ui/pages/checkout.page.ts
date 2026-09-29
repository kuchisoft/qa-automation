import { Page } from '@playwright/test';

export class CheckoutPage {
    readonly page: Page;

    constructor(page: Page) {
        this.page = page;
    }

    get btn() {
        return {
            continue: this.page.locator('[data-test="continue"]'),
            finish: this.page.locator('[data-test="finish"]'),
            backToProducts: this.page.locator('[data-test="back-to-products"]'),
        };
    }

    get input() {
        return {
            firstName: this.page.locator('[data-test="firstName"]'),
            lastName: this.page.locator('[data-test="lastName"]'),
            postalCode: this.page.locator('[data-test="postalCode"]'),
        };
    }

    get head() {
        return {
            complete: this.page.locator('[data-test="complete-header"]'),
        };
    }

    async fillCustomerInfo(firstName: string, lastName: string, postalCode: string) {
        await this.input.firstName.fill(firstName);
        await this.input.lastName.fill(lastName);
        await this.input.postalCode.fill(postalCode);
    }

    async continueToOverview() {
        await this.btn.continue.click();
    }

    async finishOrder() {
        await this.btn.finish.click();
    }

    async backToProducts() {
        await this.btn.backToProducts.click();
    }
}
