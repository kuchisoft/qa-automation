import { expect, test } from '../../ui/fixtures/ui.fixtures';

test.describe('catalogue', () => {
  test.beforeEach(async ({ productsPage }) => {
    await productsPage.goto();
    await expect(productsPage.link.cards.first()).toBeVisible();
  });

  test('shows a page of products with a name and a price each', async ({ productsPage }) => {
    const names = await productsPage.head.names.allTextContents();
    const prices = await productsPage.prices();

    expect(names.length).toBeGreaterThan(0);
    expect(prices).toHaveLength(names.length);
    expect(prices.every((price) => price > 0)).toBe(true);
  });

  test('sorts by price from low to high', async ({ productsPage }) => {
    await productsPage.sortBy('price,asc');

    await expect
      .poll(async () => {
        const prices = await productsPage.prices();
        return prices.every((price, index) => index === 0 || prices[index - 1] <= price);
      })
      .toBe(true);
  });

  test('searching narrows the results to matching products', async ({ productsPage }) => {
    const before = await productsPage.link.cards.count();

    await productsPage.search('pliers');

    await expect.poll(() => productsPage.link.cards.count()).toBeLessThan(before);
    await expect(productsPage.head.names.first()).toContainText(/pliers/i);
  });

  test('a product can be added to the cart from its detail page', async ({
    productsPage,
    productDetailPage,
  }) => {
    await productsPage.openFirstCard();

    await expect(productDetailPage.btn.addToCart).toBeVisible();
    await productDetailPage.addToCart();

    await expect(productDetailPage.cartBadge).toContainText('1');
  });
});
