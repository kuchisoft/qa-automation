import fs from 'fs';
import path from 'path';
import { request as playwrightRequest } from '@playwright/test';
import {
  API_URL,
  ROLES,
  TOKEN_EXPIRY_MARGIN_SECONDS,
  tokenFileFor,
  type Role,
} from '../config/roles';

export type TokenCache = {
  access_token: string;
  obtained_at: number;
  expires_in: number;
};

export const isFresh = (cache: TokenCache) =>
  Date.now() < cache.obtained_at + (cache.expires_in - TOKEN_EXPIRY_MARGIN_SECONDS) * 1000;

const readCache = (role: Role): TokenCache | undefined => {
  const file = tokenFileFor(role);
  if (!fs.existsSync(file)) return undefined;

  try {
    return JSON.parse(fs.readFileSync(file, 'utf8')) as TokenCache;
  } catch {
    // A truncated or hand-edited file is not worth failing over - just re-login.
    return undefined;
  }
};

export async function loginAs(role: Role, { force = false } = {}): Promise<TokenCache> {
  if (!force) {
    const cached = readCache(role);
    if (cached && isFresh(cached)) return cached;
  }

  const context = await playwrightRequest.newContext({ baseURL: API_URL });

  try {
    const { email, password } = ROLES[role];
    const response = await context.post('/users/login', { data: { email, password } });

    if (!response.ok()) {
      throw new Error(
        `API login failed for role "${role}" (${response.status()}): ${(await response.text()).slice(0, 300)}`,
      );
    }

    const body = (await response.json()) as { access_token: string; expires_in: number };
    const cache: TokenCache = {
      access_token: body.access_token,
      obtained_at: Date.now(),
      expires_in: body.expires_in,
    };

    const file = tokenFileFor(role);
    fs.mkdirSync(path.dirname(file), { recursive: true });
    fs.writeFileSync(file, JSON.stringify(cache, null, 2));

    return cache;
  } finally {
    await context.dispose();
  }
}
