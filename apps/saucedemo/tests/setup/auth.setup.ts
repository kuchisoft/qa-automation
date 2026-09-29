import { expect, test as setup } from '@playwright/test';
import { ROLES, storageStateFor, type Role } from '../../config/roles';
import { LoginPage } from '../../ui/pages/login.page';

/**
 * Runs once per role, before any UI spec (see `dependencies` in the config).
 *
 * It is a spec file, not a separate layer: it sits on top of `ui/pages` and
 * `config/roles` exactly like a normal test does. Its only job is to leave a
 * reusable session on disk so no UI test has to sign in through the browser.
 */
for (const role of Object.keys(ROLES) as Role[]) {
  setup(`capture storage state for "${role}"`, async ({ page }) => {
    const loginPage = new LoginPage(page);

    await loginPage.goto();
    await loginPage.loginAs(ROLES[role].username, ROLES[role].password);

    await expect(page).toHaveURL(/inventory\.html/);
    await page.context().storageState({ path: storageStateFor(role) });
  });
}
