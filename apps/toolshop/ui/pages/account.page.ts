import { expect, type Page } from '@playwright/test';

/**
 * The signed-in area for a regular customer.
 *
 * Also the place the session fixtures live: the account menu is rendered from
 * the same auth state the specs rely on, so asserting on it is a real check
 * that a captured storageState still works.
 */
export class AccountPage {
  constructor(readonly page: Page) {}

  get pageTitle() {
    return this.page.locator('[data-test="page-title"]');
  }

  /** Account dropdown; only present for an authenticated visitor. */
  get navMenu() {
    return this.page.locator('[data-test="nav-menu"]');
  }

  /** Only present for a signed-out visitor. */
  get signInLink() {
    return this.page.locator('[data-test="nav-sign-in"]');
  }

  get signOutLink() {
    return this.page.locator('[data-test="nav-sign-out"]');
  }

  get profileLink() {
    return this.page.locator('[data-test="nav-my-profile"]');
  }

  get invoicesLink() {
    return this.page.locator('[data-test="nav-my-invoices"]');
  }

  async goto() {
    await this.page.goto('/account');
  }

  /**
   * The signed-in signal that holds on any page - the account menu appears and
   * the "Sign in" link disappears. Checking both directions matters: asserting
   * only that `nav-sign-in` is gone would also pass on a half-rendered page.
   */
  async expectSignedIn() {
    await expect(this.navMenu).toBeVisible();
    await expect(this.signInLink).toHaveCount(0);
  }
}
