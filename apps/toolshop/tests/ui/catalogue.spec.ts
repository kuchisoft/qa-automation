import { expect, test } from '../../ui/fixtures/ui.fixtures';

/**
 * Browsing the catalogue needs no session, so no storageState is applied here.
 * That is the default for this project - specs opt in to a role when they need
 * one, which keeps signed-out coverage genuinely signed out.
 */
test.describe('catalogue', () => {
  test.beforeEach(async ({ productsPage }) => {
    await productsPage.goto();
    await expect(productsPage.cards.first()).toBeVisible();
  });

  test('shows a page of products with a name and a price each', async ({ productsPage }) => {
    const names = await productsPage.names.allTextContents();
    const prices = await productsPage.prices();

    expect(names.length).toBeGreaterThan(0);
    expect(prices).toHaveLength(names.length);
    expect(prices.every((price) => price > 0)).toBe(true);
  });

  test('sorts by price from low to high', async ({ productsPage }) => {
    await productsPage.sortBy('price,asc');

    // Changing the sort triggers a re-fetch, so the grid updates a moment after
    // the select changes. Poll instead of reading once and hoping.
    await expect
      .poll(async () => {
        const prices = await productsPage.prices();
        return prices.every((price, index) => index === 0 || prices[index - 1] <= price);
      })
      .toBe(true);
  });

  test('searching narrows the results to matching products', async ({ productsPage }) => {
    const before = await productsPage.cards.count();

    await productsPage.search('pliers');

    await expect.poll(() => productsPage.cards.count()).toBeLessThan(before);
    await expect(productsPage.names.first()).toContainText(/pliers/i);
  });

  test('a product can be added to the cart from its detail page', async ({
    productsPage,
    productDetailPage,
  }) => {
    await productsPage.openFirstCard();

    await expect(productDetailPage.addToCartButton).toBeVisible();
    await productDetailPage.addToCart();

    // The header count is the app's own confirmation that the cart changed.
    await expect(productDetailPage.cartBadge).toContainText('1');
  });
});
