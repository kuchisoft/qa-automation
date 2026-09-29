import { defineConfig, type PlaywrightTestConfig } from '@playwright/test';

/**
 * Shared settings for every app in the monorepo.
 *
 * Each app config spreads this and then supplies what is specific to that app:
 * `testDir`, `baseURL` and its list of `projects`. Keeping reporters, retries
 * and tracing here means a new app never drifts from the others.
 */
export function baseConfig(app: PlaywrightTestConfig): PlaywrightTestConfig {
  const defaults: PlaywrightTestConfig = {
    fullyParallel: true,
    forbidOnly: !!process.env.CI,
    retries: process.env.CI ? 2 : 0,
    workers: process.env.CI ? 1 : undefined,
    reporter: [['list'], ['html', { open: 'never' }]],
    use: {
      trace: 'on-first-retry',
      colorScheme: 'dark',
    },
  };

  return defineConfig({
    ...defaults,
    ...app,
    // `use` is merged rather than replaced so an app cannot accidentally drop
    // tracing just by setting `baseURL`.
    use: { ...defaults.use, ...app.use },
  });
}
