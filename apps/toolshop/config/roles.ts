import path from 'path';
import { required } from './env';

export const BASE_URL = required('TOOLSHOP_BASE_URL');
export const API_URL = required('TOOLSHOP_API_URL');

const SEEDED_PASSWORD = required('TOOLSHOP_PASSWORD');

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
    email: required('TOOLSHOP_ADMIN_EMAIL'),
    password: SEEDED_PASSWORD,
    landingPage: '/admin/dashboard',
  },
  user: {
    email: required('TOOLSHOP_USER_EMAIL'),
    password: SEEDED_PASSWORD,
    landingPage: '/account',
  },
} as const;

export type Role = keyof typeof ROLES;

export const UNKNOWN_ACCOUNT = {
  email: 'qa.unknown.account@example.com',
  password: 'definitely-not-the-password',
};

const AUTH_DIR = path.resolve(__dirname, '..', '.auth');

export const storageStateFor = (role: Role) => path.join(AUTH_DIR, `${role}.json`);
export const tokenFileFor = (role: Role) => path.join(AUTH_DIR, `${role}.token.json`);

export const TOKEN_EXPIRY_MARGIN_SECONDS = 30;
