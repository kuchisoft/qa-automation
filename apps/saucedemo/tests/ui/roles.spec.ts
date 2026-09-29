import { expect, test } from '../../ui/fixtures/ui.fixtures';
import { ROLES, storageStateFor, type Role } from '../../config/roles';

/**
 * Replaces the old `admin.spec.ts`.
 *
 * SauceDemo publishes no admin role, so `performance_glitch_user` was never an
 * admin and its deliberate latency only slowed the suite down. What is worth
 * keeping is the mechanism: one captured session per role, chosen per describe
 * block, rather than a storageState hard-wired into the Playwright project.
 */
for (const role of Object.keys(ROLES) as Role[]) {
  test.describe(`session: ${role}`, () => {
    test.use({ storageState: storageStateFor(role) });

    test(`${role} is already signed in and sees the inventory`, async ({ inventoryPage }) => {
      await inventoryPage.goto();

      await expect(inventoryPage.productsHeader).toBeVisible();
      await expect(inventoryPage.inventoryItems).toHaveCount(6);
    });
  });
}
