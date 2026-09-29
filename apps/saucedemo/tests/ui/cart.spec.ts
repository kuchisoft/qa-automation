import { expect, test } from '../../ui/fixtures/ui.fixtures';
import { storageStateFor } from '../../config/roles';

test.describe('cart', () => {
  test.use({ storageState: storageStateFor('standard') });

  test.beforeEach(async ({ inventoryPage }) => {
    await inventoryPage.goto();
  });

  test('removes a product from the cart', async ({ inventoryPage, cartPage }) => {
    await inventoryPage.addBackpackToCart();
    await inventoryPage.goToCart();

    await expect(cartPage.cartItems).toHaveCount(1);

    await cartPage.removeBackpack();

    await expect(cartPage.cartItems).toHaveCount(0);
  });
});
