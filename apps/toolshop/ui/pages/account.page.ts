import { expect, type Page } from '@playwright/test';

export class AccountPage {
  constructor(readonly page: Page) {}

  get head() {
    return {
      title: this.page.locator('[data-test="page-title"]'),
    };
  }

  get btn() {
    return {
      navMenu: this.page.locator('[data-test="nav-menu"]'),
    };
  }

  get link() {
    return {
      signIn: this.page.locator('[data-test="nav-sign-in"]'),
      signOut: this.page.locator('[data-test="nav-sign-out"]'),
      profile: this.page.locator('[data-test="nav-my-profile"]'),
      invoices: this.page.locator('[data-test="nav-my-invoices"]'),
    };
  }

  async goto() {
    await this.page.goto('/account');
  }

  async expectSignedIn() {
    await expect(this.btn.navMenu).toBeVisible();
    await expect(this.link.signIn).toHaveCount(0);
  }
}
