import { expect, mergeTests } from '@playwright/test';
import { test as apiTest } from '../../api/fixtures/api.fixtures';
import { test as uiTest } from '../../ui/fixtures/ui.fixtures';

/**
 * The reason ui/ and api/ live in the same app.
 *
 * Everywhere else, keeping fixtures separate is the tidy choice. Here the spec
 * genuinely needs the browser and the API at once, so merging two fixture sets
 * stops being boilerplate and becomes the seam between the two layers - the API
 * supplies the expected data, the UI has to agree with it.
 */
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
    await expect(productsPage.cards).toHaveCount(data.length);

    const uiNames = (await productsPage.names.allTextContents()).map((name) => name.trim());
    expect(uiNames).toEqual(data.map((product) => product.name));
  });

  test('the prices on screen are the prices the API reports', async ({ productsApi, productsPage }) => {
    const { data } = await productsApi.listJson(1);

    await productsPage.goto();
    await expect(productsPage.priceLabels).toHaveCount(data.length);

    expect(await productsPage.prices()).toEqual(data.map((product) => product.price));
  });

  /**
   * The API as an oracle for the UI: pagination is only correct if the number
   * of pages the UI offers is derivable from the total the API reports.
   */
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
