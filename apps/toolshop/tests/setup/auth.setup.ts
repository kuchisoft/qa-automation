import fs from 'fs';
import path from 'path';
import { expect, test as setup } from '@playwright/test';
import { ROLES, storageStateFor, type Role } from '../../config/roles';
import { AccountPage } from '../../ui/pages/account.page';
import { LoginPage } from '../../ui/pages/login.page';

/**
 * Runs once per role before any UI spec (see `dependencies` in the config).
 *
 * It signs in through the browser exactly once, then leaves the session in
 * `.auth/<role>.json`. Every UI spec that needs to be signed in reads that file
 * instead of driving the login form again.
 */
for (const role of Object.keys(ROLES) as Role[]) {
  setup(`capture UI session for "${role}"`, async ({ page }) => {
    const loginPage = new LoginPage(page);
    const accountPage = new AccountPage(page);

    await loginPage.goto();
    await loginPage.loginAs(role);

    // Prove the session is genuinely usable before writing it out. Saving an
    // unauthenticated context would not fail here, it would fail in every UI
    // spec later, which is a much worse place to find out.
    await accountPage.expectSignedIn();

    const file = storageStateFor(role);
    fs.mkdirSync(path.dirname(file), { recursive: true });
    await page.context().storageState({ path: file });

    expect(fs.existsSync(file)).toBe(true);
  });
}
