import { expect, mergeTests } from '@playwright/test';
import { test as apiTest } from '../../api/fixtures/api.fixtures';
import { test as uiTest } from '../../ui/fixtures/ui.fixtures';

const test = mergeTests(uiTest, apiTest);

test.describe('the catalogue the UI renders is the catalogue the API serves', () => {
  test('the grid shows exactly the products from the first API page', async ({
    productsApi,
    productsPage,
  }) => {
    const { data } = await productsApi.listJson(1);

    await productsPage.goto();

    // Wait on the count first: toHaveCount retries, allTextContents() does not,
    // and this app renders the grid after the API call resolves.
    await expect(productsPage.link.cards).toHaveCount(data.length);

    const uiNames = (await productsPage.head.names.allTextContents()).map((name) => name.trim());
    expect(uiNames).toEqual(data.map((product) => product.name));
  });

  test('the prices on screen are the prices the API reports', async ({ productsApi, productsPage }) => {
    const { data } = await productsApi.listJson(1);

    await productsPage.goto();
    await expect(productsPage.text.prices).toHaveCount(data.length);

    expect(await productsPage.prices()).toEqual(data.map((product) => product.price));
  });

  test('the API total explains how many pages the UI paginates into', async ({
    productsApi,
    productsPage,
  }) => {
    const { total, per_page, last_page } = await productsApi.listJson(1);

    await productsPage.goto();

    expect(total).toBeGreaterThan(per_page);
    expect(last_page).toBe(Math.ceil(total / per_page));
  });
});
