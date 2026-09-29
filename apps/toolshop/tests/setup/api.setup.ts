import { expect, test as setup } from '@playwright/test';
import { ROLES, type Role } from '../../config/roles';
import { loginAs } from '../../api/session';

/**
 * The API twin of auth.setup.ts: same shape, same per-role loop, but the shared
 * state it leaves behind is a bearer token rather than a browser session.
 *
 * `force: true` because its job is to prove the credentials work right now, not
 * to reuse whatever was cached by the last run.
 *
 * This is also the earliest useful failure point for the biggest risk on this
 * app: Toolshop is a shared database, and any seeded account can be locked by
 * somebody else's failed logins, in which case every API spec would otherwise
 * fail with an identical, unexplained 401.
 */
for (const role of Object.keys(ROLES) as Role[]) {
  setup(`capture API token for "${role}"`, async () => {
    const { access_token, expires_in } = await loginAs(role, { force: true });

    expect(access_token).toBeTruthy();
    expect(expires_in).toBeGreaterThan(0);
  });
}
