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

export class UsersApi {
  constructor(private readonly client: ApiClient) {}

  login(email: string, password: string) {
    return this.client.post('/users/login', { email, password });
  }

  async loginJson(role: Role): Promise<LoginResponse> {
    const { email, password } = ROLES[role];
    return this.client.json<LoginResponse>(await this.login(email, password));
  }

  me() {
    return this.client.get('/users/me');
  }

  all() {
    return this.client.get('/users');
  }
}
