import { ROLES, type Role } from '../config/roles';
import type { ApiClient } from './api-client';

export type LoginResponse = {
  access_token: string;
  token_type: string;
  expires_in: number;
};

export type User = {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
};

/**
 * Resource object for /users.
 *
 * `login` is deliberately the only member that makes sense anonymously, which
 * is why it takes the caller's ApiClient as-is rather than assuming any token.
 */
export class UsersApi {
  constructor(private readonly client: ApiClient) {}

  /** Raw response, so a spec can assert on 401 / 423 as well as 200. */
  login(email: string, password: string) {
    return this.client.post('/users/login', { email, password });
  }

  async loginJson(role: Role): Promise<LoginResponse> {
    const { email, password } = ROLES[role];
    return this.client.json<LoginResponse>(await this.login(email, password));
  }

  /** The currently authenticated user, derived from the bearer token. */
  me() {
    return this.client.get('/users/me');
  }

  /** Admin-only. A non-admin token gets 403, which is the role assertion. */
  all() {
    return this.client.get('/users');
  }
}
