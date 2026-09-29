import { expect, test } from '../../ui/fixtures/ui.fixtures';

test.describe('inventory', () => {
  test.beforeEach(async ({ inventoryPage }) => {
    await inventoryPage.goto();
  });

  test('shows the product inventory', async ({ inventoryPage }) => {
    await expect(inventoryPage.head.products).toBeVisible();
    await expect(inventoryPage.list.items).toHaveCount(6);
  });

  test('sorts products from low to high price', async ({ inventoryPage }) => {
    await inventoryPage.sortPriceLowToHigh();

    const prices = await inventoryPage.getItemPrices();

    expect(prices).toEqual([...prices].sort((a, b) => a - b));
  });

  test('adds a product and updates the cart badge', async ({ inventoryPage }) => {
    await inventoryPage.addBackpackToCart();

    await expect(inventoryPage.cartBadge).toHaveText('1');
  });
});
