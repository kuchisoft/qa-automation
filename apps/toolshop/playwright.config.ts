import { devices } from '@playwright/test';
import { baseConfig } from '../../playwright.base';
import { BASE_URL } from './config/roles';

export default baseConfig({
  testDir: './tests',

  timeout: 60_000,
  expect: { timeout: 15_000 },

  use: {
    baseURL: BASE_URL,
    actionTimeout: 15_000,
    navigationTimeout: 30_000,
  },

  projects: [
    {
      name: 'toolshop-setup-ui',
      testDir: './tests/setup',
      testMatch: 'auth.setup.ts',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'toolshop-setup-api',
      testDir: './tests/setup',
      testMatch: 'api.setup.ts',
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
      name: 'toolshop-integration',
      testDir: './tests/integration',
      dependencies: ['toolshop-setup-ui', 'toolshop-setup-api'],
      use: { ...devices['Desktop Chrome'] },
    },
  ],
});
