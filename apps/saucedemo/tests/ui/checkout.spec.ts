import { expect, test } from '../../ui/fixtures/ui.fixtures';

test.describe('checkout', () => {
  test.beforeEach(async ({ inventoryPage }) => {
    await inventoryPage.goto();
  });

  test('completes checkout', async ({ inventoryPage, cartPage, checkoutPage }) => {
    await inventoryPage.addBackpackToCart();
    await inventoryPage.goToCart();
    await cartPage.proceedToCheckout();

    await checkoutPage.fillCustomerInfo('Test', 'User', '12345');
    await checkoutPage.continueToOverview();
    await checkoutPage.finishOrder();

    await expect(checkoutPage.head.complete).toHaveText('Thank you for your order!');
    await checkoutPage.backToProducts();
  });
});
