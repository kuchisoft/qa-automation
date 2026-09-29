import { expect, test as setup } from '../../ui/fixtures/ui.fixtures';
import { STANDARD_USER, storageState } from '../../config/roles';

setup('capture storage state', async ({ page, loginPage }) => {
  await loginPage.goto();
  await loginPage.loginAs(STANDARD_USER.username, STANDARD_USER.password);

  await expect(page).toHaveURL(/inventory\.html/);
  await page.context().storageState({ path: storageState });
});
