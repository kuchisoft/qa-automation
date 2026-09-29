import { expect, test } from '../../api/fixtures/api.fixtures';

test.describe('GET /products', () => {
  test('lists the first page of the catalogue with pagination metadata', async ({ productsApi }) => {
    const page = await productsApi.listJson(1);

    expect(page.current_page).toBe(1);
    expect(page.data.length).toBeGreaterThan(0);
    expect(page.data.length).toBeLessThanOrEqual(page.per_page);
    expect(page.total).toBeGreaterThanOrEqual(page.data.length);
  });

  test('every listed product has the fields the UI renders', async ({ productsApi }) => {
    const { data } = await productsApi.listJson(1);

    for (const product of data) {
      const context = JSON.stringify(product).slice(0, 200);

      expect(product.id, context).toBeTruthy();
      expect(product.name, context).toBeTruthy();
      expect(typeof product.price, context).toBe('number');
      expect(typeof product.in_stock, context).toBe('boolean');
    }
  });

  test('returns the same product when fetched by id', async ({ productsApi }) => {
    const first = await productsApi.first();

    const fetched = await productsApi.byIdJson(first.id);

    expect(fetched.id).toBe(first.id);
    expect(fetched.name).toBe(first.name);
    expect(fetched.price).toBe(first.price);
  });

  test('an id that does not exist is a 404, not a server error', async ({ productsApi }) => {
    const response = await productsApi.byId('01ZZZZZZZZZZZZZZZZZZZZZZZZ');

    expect(response.status()).toBe(404);
  });

  test('search returns only products that mention the term', async ({ productsApi }) => {
    const { data } = await productsApi.searchJson('pliers');

    expect(data.length).toBeGreaterThan(0);

    for (const product of data) {
      expect(`${product.name} ${product.description}`.toLowerCase()).toContain('pliers');
    }
  });
});
