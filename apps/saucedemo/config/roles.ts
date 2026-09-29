import path from 'path';

/**
 * Single source of truth for "who can sign in" and "where their session is cached".
 *
 * `playwright.config.ts`, the setup project and every spec read from this file,
 * so adding a role is a one-line change here and nothing else.
 */

/** SauceDemo is a UI-only target: it publishes no public API. */
export const BASE_URL = 'https://www.saucedemo.com';

/**
 * SauceDemo has no admin role. It ships personas that all share one password;
 * `standard_user` is the happy path and `problem_user` is the one that behaves
 * meaningfully differently, which makes it the useful second role for
 * demonstrating per-role session capture.
 */
export const ROLES = {
  standard: { username: 'standard_user', password: 'secret_sauce' },
  problem: { username: 'problem_user', password: 'secret_sauce' },
} as const;

export type Role = keyof typeof ROLES;

/**
 * Absolute on purpose. Playwright resolves a relative `storageState` in the
 * config differently from one passed to `test.use()`, so building the path from
 * the app root removes that ambiguity entirely.
 */
const AUTH_DIR = path.resolve(__dirname, '..', '.auth');

export const storageStateFor = (role: Role) => path.join(AUTH_DIR, `${role}.json`);
