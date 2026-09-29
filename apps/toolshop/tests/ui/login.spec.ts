import { UNKNOWN_ACCOUNT } from '../../config/roles';
import { expect, test } from '../../ui/fixtures/ui.fixtures';

test.describe('login', () => {
  test('an admin is sent to the admin dashboard', async ({ page, loginPage, accountPage }) => {
    await loginPage.goto();
    await loginPage.loginAs('admin');

    await expect(page).toHaveURL(/\/admin\/dashboard$/);
    await accountPage.expectSignedIn();
  });

  test('a customer is sent to their account page', async ({ page, loginPage, accountPage }) => {
    await loginPage.goto();
    await loginPage.loginAs('user');

    await expect(page).toHaveURL(/\/account$/);
    await accountPage.expectSignedIn();
  });

  /**
   * Uses an account that belongs to nobody, on purpose.
   *
   * A wrong password against a real seeded account still counts as a failed
   * attempt, and enough of them lock that account for everyone. That is exactly
   * how `customer@practicesoftwaretesting.com` ended up returning 423 today,
   * so no negative login test here touches a real account.
   */
  test('an account that does not exist is rejected', async ({ page, loginPage }) => {
    await loginPage.goto();
    await loginPage.submit(UNKNOWN_ACCOUNT.email, UNKNOWN_ACCOUNT.password);

    await expect(loginPage.errorMessage).toBeVisible();
    await expect(loginPage.errorMessage).toContainText('Invalid email or password');
    await expect(page).toHaveURL(/\/auth\/login$/);
  });
});
