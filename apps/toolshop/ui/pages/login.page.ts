import type { Page } from '@playwright/test';
import { ROLES, type Role } from '../../config/roles';

export class LoginPage {
  constructor(readonly page: Page) {}

  get form() {
    return this.page.locator('[data-test="login-form"]');
  }

  get emailInput() {
    return this.page.locator('[data-test="email"]');
  }

  get passwordInput() {
    return this.page.locator('[data-test="password"]');
  }

  /** Rendered as `<input type="submit">`, not a `<button>`. */
  get submitButton() {
    return this.page.locator('[data-test="login-submit"]');
  }

  get errorMessage() {
    return this.page.locator('[data-test="login-error"]');
  }

  async goto() {
    await this.page.goto('/auth/login');
  }

  async submit(email: string, password: string) {
    await this.emailInput.fill(email);
    await this.passwordInput.fill(password);
    await this.submitButton.click();
  }

  /**
   * Signs in as a seeded role and waits for that role's landing page.
   *
   * `waitForLoadState('networkidle')` is not good enough here, and getting this
   * wrong cost real debugging time: this is an Angular SPA, so the click
   * returns immediately, the app then re-fetches /users/me, and only after that
   * does it redirect to /account or /admin/dashboard. Waiting for the URL is
   * the only reliable proof that the session actually took hold.
   */
  async loginAs(role: Role) {
    const { email, password, landingPage } = ROLES[role];
    await this.submit(email, password);
    await this.page.waitForURL(new RegExp(`${landingPage}$`));
  }
}
