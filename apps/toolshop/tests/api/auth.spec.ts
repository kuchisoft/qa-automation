import { ROLES, UNKNOWN_ACCOUNT } from '../../config/roles';
import { expect, test } from '../../api/fixtures/api.fixtures';
import { UsersApi, type LoginResponse, type User } from '../../api/users.api';

/**
 * Authentication is the one place a resource object is built on `anonApi`
 * rather than `api`: asking for a token is the thing you do before you have one.
 * Composing it here is one line, and it keeps UsersApi free of special cases.
 */
test.describe('POST /users/login', () => {
  test('issues a bearer token for a seeded role', async ({ anonApi }) => {
    const users = new UsersApi(anonApi);

    const response = await users.login(ROLES.user.email, ROLES.user.password);
    const body = await anonApi.json<LoginResponse>(response);

    expect(body.token_type).toBe('bearer');
    expect(body.access_token).toBeTruthy();
    expect(body.expires_in).toBeGreaterThan(0);
  });

  /** Safe because the address belongs to no account, so nothing can be locked. */
  test('rejects an account that does not exist', async ({ anonApi }) => {
    const users = new UsersApi(anonApi);

    const response = await users.login(UNKNOWN_ACCOUNT.email, UNKNOWN_ACCOUNT.password);

    expect(response.status()).toBe(401);
  });
});

test.describe('authorisation', () => {
  test('a request with no token is unauthorised', async ({ anonApi }) => {
    expect((await anonApi.get('/users')).status()).toBe(401);
  });

  // `apiRole` defaults to "user", so this is the non-admin case.
  test('a customer token is authenticated but forbidden from /users', async ({ usersApi }) => {
    expect((await usersApi.all()).status()).toBe(403);
  });

  test.describe('as admin', () => {
    test.use({ apiRole: 'admin' });

    test('an admin token may list users', async ({ usersApi }) => {
      const response = await usersApi.all();

      expect(response.status()).toBe(200);
      const body = (await response.json()) as { data: User[]; total: number };
      expect(body.total).toBeGreaterThan(0);
      expect(body.data.length).toBeGreaterThan(0);
    });

    test('the token resolves back to the account it was issued for', async ({ api, apiRole }) => {
      const body = await api.json<User>(await api.get('/users/me'));

      expect(body.email).toBe(ROLES[apiRole].email);
    });
  });
});
