import { request as playwrightRequest, test as base } from '@playwright/test';
import { API_URL, type Role } from '../../config/roles';
import { ApiClient } from '../api-client';
import { ProductsApi } from '../products.api';
import { UsersApi } from '../users.api';
import { loginAs } from '../session';

type ApiFixtures = {
  apiRole: Role;
  api: ApiClient;
  anonApi: ApiClient;
  productsApi: ProductsApi;
  usersApi: UsersApi;
};

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
