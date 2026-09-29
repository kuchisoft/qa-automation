import { devices } from '@playwright/test';
import { baseConfig } from '../../playwright.base';
import { BASE_URL } from './config/roles';

/**
 * Folder layout (see ../../README.md):
 *
 *   config/  roles + credentials + auth-state paths
 *   ui/      page objects and the UI fixtures built from them
 *   tests/   setup/ (produces auth state) and ui/ (the specs)
 *
 * Two projects: one captures sessions, one spends them. Nothing signs in
 * through the browser twice.
 */
export default baseConfig({
  testDir: './tests',

  use: {
    baseURL: BASE_URL,
  },

  projects: [
    {
      // Produces .auth/<role>.json for every role. Not a test suite.
      name: 'saucedemo-setup',
      testDir: './tests/setup',
      testMatch: '**/*.setup.ts',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      // Note: no storageState here. Specs opt in per describe block, so the
      // default is signed out and login tests need no special-casing.
      name: 'saucedemo-ui',
      testDir: './tests/ui',
      dependencies: ['saucedemo-setup'],
      use: { ...devices['Desktop Chrome'] },
    },
  ],
});
