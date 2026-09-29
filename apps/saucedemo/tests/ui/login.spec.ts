import { expect, test } from '../../ui/fixtures/ui.fixtures';
import { ROLES } from '../../config/roles';

/**
 * No storageState is applied here on purpose - the UI project is signed out by
 * default, which is what a login spec wants.
 */
test.describe('login', () => {
  test('signs in with valid credentials', async ({ loginPage, inventoryPage }) => {
    await loginPage.goto();
    await loginPage.loginAs(ROLES.standard.username, ROLES.standard.password);

    await expect(inventoryPage.productsHeader).toBeVisible();
  });

  test('shows an error when credentials are wrong', async ({ loginPage }) => {
    await loginPage.goto();
    await loginPage.loginAs(ROLES.standard.username, 'wrong_password');

    await expect(loginPage.errorMessage).toContainText('Epic sadface');
  });
});
