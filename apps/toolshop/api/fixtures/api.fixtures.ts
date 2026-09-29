import { request as playwrightRequest, test as base } from '@playwright/test';
import { API_URL, type Role } from '../../config/roles';
import { ApiClient } from '../api-client';
import { ProductsApi } from '../products.api';
import { UsersApi } from '../users.api';
import { loginAs } from '../session';

type ApiFixtures = {
  /** Which role `api` signs in as. Override with `test.use({ apiRole: 'admin' })`. */
  apiRole: Role;
  /** Signed in as `apiRole`, with a bearer token already attached. */
  api: ApiClient;
  /** No Authorization header at all - for 401 tests. */
  anonApi: ApiClient;
  productsApi: ProductsApi;
  usersApi: UsersApi;
};

/**
 * Same shape as the UI fixtures, on purpose.
 *
 * In the UI the shared state is a storageState file; here it is a bearer token.
 * Either way the fixture is what owns acquiring it and cleaning up after it, so
 * a spec never thinks about authentication at all.
 *
 * Note that the built-in `request` fixture cannot be reused across roles - it
 * carries one header set for the whole test - so these fixtures build their own
 * contexts with `request.newContext()` and dispose of them on teardown.
 */
export const test = base.extend<ApiFixtures>({
  apiRole: ['user', { option: true }],

  anonApi: async ({}, use) => {
    const context = await playwrightRequest.newContext({ baseURL: API_URL });
    await use(new ApiClient(context));
    await context.dispose();
  },

  api: async ({ apiRole }, use) => {
    const { access_token } = await loginAs(apiRole);

    const context = await playwrightRequest.newContext({
      baseURL: API_URL,
      extraHTTPHeaders: { Authorization: `Bearer ${access_token}` },
    });

    await use(new ApiClient(context));
    await context.dispose();
  },

  productsApi: async ({ api }, use) => {
    await use(new ProductsApi(api));
  },

  usersApi: async ({ api }, use) => {
    await use(new UsersApi(api));
  },
});

export { expect } from '@playwright/test';
