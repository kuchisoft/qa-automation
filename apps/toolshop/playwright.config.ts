import { devices } from '@playwright/test';
import { baseConfig } from '../../playwright.base';
import { BASE_URL } from './config/roles';

/**
 * "Project" here means a Playwright project - a run configuration, not a folder.
 * The folders are ui/ and api/; the projects decide which one runs, in which
 * context, and what has to happen first.
 *
 *   config/   roles, URLs and auth-state paths
 *   ui/       page objects (browser context) + the fixtures built from them
 *   api/      the request client + resource objects + their fixtures
 *   tests/    setup/, ui/, api/ and integration/
 *
 * Two setup projects rather than one, so the API suite does not pay for a
 * browser login it will never use, and vice versa.
 */
export default baseConfig({
  testDir: './tests',

  // Toolshop is a public demo over a shared database, so it is slow and
  // occasionally spiky. Generous but bounded timeouts keep failures meaningful.
  timeout: 60_000,
  expect: { timeout: 15_000 },

  use: {
    baseURL: BASE_URL,
    actionTimeout: 15_000,
    navigationTimeout: 30_000,
  },

  projects: [
    {
      // Captures a browser session per role into .auth/<role>.json.
      name: 'toolshop-setup-ui',
      testDir: './tests/setup',
      testMatch: 'auth.setup.ts',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      // Captures an API bearer token per role into .auth/<role>.token.json.
      name: 'toolshop-setup-api',
      testDir: './tests/setup',
      testMatch: 'api.setup.ts',
      // No device here on purpose: this project never opens a browser.
    },

    {
      name: 'toolshop-ui',
      testDir: './tests/ui',
      dependencies: ['toolshop-setup-ui'],
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'toolshop-api',
      testDir: './tests/api',
      dependencies: ['toolshop-setup-api'],
    },
    {
      // Drives the browser and the API in the same test. This is the whole
      // point of keeping ui/ and api/ inside one app rather than two repos.
      name: 'toolshop-integration',
      testDir: './tests/integration',
      dependencies: ['toolshop-setup-ui', 'toolshop-setup-api'],
      use: { ...devices['Desktop Chrome'] },
    },
  ],
});
