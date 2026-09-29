import { devices } from '@playwright/test';
import { baseConfig } from '../../playwright.base';
import { BASE_URL, storageState } from './config/roles';

/**
 * Folder layout (see ../../README.md):
 *
 *   config/  credentials + the session path
 *   ui/      page objects and the UI fixtures built from them
 *   tests/   setup/  captures the one session
 *            login/ signed-out specs, need no session
 *            ui/     signed-in specs, consume the session
 *
 * Three projects, split by session state rather than repeated per spec: the
 * signed-out login tests live in their own project, so nothing has to opt out,
 * and `storageState` is declared once here instead of a `test.use()` line in
 * every signed-in spec. One captured session, zero repetition.
 */
export default baseConfig({
  testDir: './tests',

  use: {
    baseURL: BASE_URL,
  },

  projects: [
    {
      name: 'saucedemo-setup',
      testDir: './tests/setup',
      testMatch: '**/*.setup.ts',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'saucedemo-login',
      testDir: './tests/login',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'saucedemo-ui',
      testDir: './tests/ui',
      dependencies: ['saucedemo-setup'],
      use: { ...devices['Desktop Chrome'], storageState },
    },
  ],
});
