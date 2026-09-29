import path from 'path';

/**
 * Single source of truth for Toolshop: who can sign in, where each role lands,
 * and where the two kinds of captured auth state live.
 */

export const BASE_URL = 'https://practicesoftwaretesting.com';
export const API_URL = 'https://api.practicesoftwaretesting.com';

const SEEDED_PASSWORD = 'welcome01';

/**
 * Toolshop is a shared, mutable, publicly writable database. Two of its
 * properties shape everything below - both are easy to get wrong:
 *
 *   1. Accounts get locked. `POST /users/login` answers 423 with "Account
 *      locked, too many failed attempts" after enough wrong passwords, and
 *      `customer@practicesoftwaretesting.com` is locked right now, almost
 *      certainly by other people running negative login tests against it.
 *      So the customer role uses `customer2@` instead.
 *
 *   2. Never point a negative login test at a real account. Repeated wrong
 *      passwords are exactly what causes the lockout above. Use
 *      UNKNOWN_ACCOUNT, which belongs to nobody.
 */
export const ROLES = {
  admin: {
    email: 'admin@practicesoftwaretesting.com',
    password: SEEDED_PASSWORD,
    /** Where Toolshop redirects this role immediately after signing in. */
    landingPage: '/admin/dashboard',
  },
  user: {
    email: 'customer2@practicesoftwaretesting.com',
    password: SEEDED_PASSWORD,
    landingPage: '/account',
  },
} as const;

export type Role = keyof typeof ROLES;

/** Belongs to nobody, so failed logins against it cannot lock a real account. */
export const UNKNOWN_ACCOUNT = {
  email: 'qa.unknown.account@example.com',
  password: 'definitely-not-the-password',
};

/**
 * Both kinds of auth state live in `.auth/` and both are gitignored, because
 * both are secrets with a short life:
 *
 *   .auth/<role>.json         UI   - browser storageState (cookie + localStorage)
 *   .auth/<role>.token.json   API  - bearer token plus the time it was issued
 */
const AUTH_DIR = path.resolve(__dirname, '..', '.auth');

export const storageStateFor = (role: Role) => path.join(AUTH_DIR, `${role}.json`);
export const tokenFileFor = (role: Role) => path.join(AUTH_DIR, `${role}.token.json`);

/**
 * Toolshop issues JWTs that live for 300 seconds, which is short enough that a
 * single suite run can outlive one. Anything inside this margin of expiry is
 * treated as already dead and refreshed rather than sent and rejected.
 */
export const TOKEN_EXPIRY_MARGIN_SECONDS = 30;
