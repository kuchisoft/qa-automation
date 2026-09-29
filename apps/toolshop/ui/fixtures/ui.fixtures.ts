import { test as base } from '@playwright/test';
import { AccountPage } from '../pages/account.page';
import { LoginPage } from '../pages/login.page';
import { ProductDetailPage } from '../pages/product-detail.page';
import { ProductsPage } from '../pages/products.page';

type UiFixtures = {
  loginPage: LoginPage;
  accountPage: AccountPage;
  productsPage: ProductsPage;
  productDetailPage: ProductDetailPage;
};

export const test = base.extend<UiFixtures>({
  loginPage: async ({ page }, use) => {
    await use(new LoginPage(page));
  },
  accountPage: async ({ page }, use) => {
    await use(new AccountPage(page));
  },
  productsPage: async ({ page }, use) => {
    await use(new ProductsPage(page));
  },
  productDetailPage: async ({ page }, use) => {
    await use(new ProductDetailPage(page));
  },
});

export { expect } from '@playwright/test';
