import { expect, test } from '../../ui/fixtures/ui.fixtures';
import { STANDARD_USER } from '../../config/roles';

test.describe('login', () => {
  test('signs in with valid credentials', async ({ loginPage, inventoryPage }) => {
    await loginPage.goto();
    await loginPage.loginAs(STANDARD_USER.username, STANDARD_USER.password);

    await expect(inventoryPage.head.products).toBeVisible();
  });

  test('shows an error when credentials are wrong', async ({ loginPage }) => {
    await loginPage.goto();
    await loginPage.loginAs(STANDARD_USER.username, 'wrong_password');

    await expect(loginPage.error.invalidCredentials).toContainText('Epic sadface');
  });
});
