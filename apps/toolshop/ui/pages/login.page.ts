import type { Page } from '@playwright/test';
import { ROLES, type Role } from '../../config/roles';

export class LoginPage {
  constructor(readonly page: Page) {}

  get form() {
    return this.page.locator('[data-test="login-form"]');
  }

  get input() {
    return {
      email: this.page.locator('[data-test="email"]'),
      password: this.page.locator('[data-test="password"]'),
    };
  }

  get btn() {
    return {
      submit: this.page.locator('[data-test="login-submit"]'),
    };
  }

  get error() {
    return {
      invalidCredentials: this.page.locator('[data-test="login-error"]'),
    };
  }

  async goto() {
    await this.page.goto('/auth/login');
  }

  async submit(email: string, password: string) {
    await this.input.email.fill(email);
    await this.input.password.fill(password);
    await this.btn.submit.click();
  }

  async loginAs(role: Role) {
    const { email, password, landingPage } = ROLES[role];
    await this.submit(email, password);
    await this.page.waitForURL(new RegExp(`${landingPage}$`));
  }
}
