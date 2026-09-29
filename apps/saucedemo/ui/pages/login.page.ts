import { Page } from '@playwright/test';

export class LoginPage {
    readonly page: Page;

    constructor(page: Page) {
        this.page = page;
    }

    get btn() {
        return {
            login: this.page.locator('[data-test="login-button"]'),
        };
    }

    get label() {
        return {
            username: this.page.locator('[data-test="username"]'),
            password: this.page.locator('[data-test="password"]'),
        };
    }

    get errorMessage() {
        return this.page.locator('[data-test="error"]');
    }

    async goto() {
        await this.page.goto('/');
    }

    async loginAs(username: string, password: string) {
        await this.label.username.fill(username);
        await this.label.password.fill(password);
        await this.btn.login.click();
    }
}
