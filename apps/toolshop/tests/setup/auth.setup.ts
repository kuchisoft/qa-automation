import fs from 'fs';
import path from 'path';
import { expect, test as setup } from '@playwright/test';
import { ROLES, storageStateFor, type Role } from '../../config/roles';
import { AccountPage } from '../../ui/pages/account.page';
import { LoginPage } from '../../ui/pages/login.page';

for (const role of Object.keys(ROLES) as Role[]) {
  setup(`capture UI session for "${role}"`, async ({ page }) => {
    const loginPage = new LoginPage(page);
    const accountPage = new AccountPage(page);

    await loginPage.goto();
    await loginPage.loginAs(role);

    await accountPage.expectSignedIn();

    const file = storageStateFor(role);
    fs.mkdirSync(path.dirname(file), { recursive: true });
    await page.context().storageState({ path: file });

    expect(fs.existsSync(file)).toBe(true);
  });
}
