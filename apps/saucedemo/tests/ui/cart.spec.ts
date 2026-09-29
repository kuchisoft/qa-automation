import { expect, test } from '../../ui/fixtures/ui.fixtures';

test.describe('cart', () => {
  test.beforeEach(async ({ inventoryPage }) => {
    await inventoryPage.goto();
  });

  test('removes a product from the cart', async ({ inventoryPage, cartPage }) => {
    await inventoryPage.addBackpackToCart();
    await inventoryPage.goToCart();

    await expect(cartPage.list.items).toHaveCount(1);

    await cartPage.removeBackpack();

    await expect(cartPage.list.items).toHaveCount(0);
  });
});
