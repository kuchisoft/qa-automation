import { expect, test as setup } from '@playwright/test';
import { ROLES, type Role } from '../../config/roles';
import { loginAs } from '../../api/session';

for (const role of Object.keys(ROLES) as Role[]) {
  setup(`capture API token for "${role}"`, async () => {
    const { access_token, expires_in } = await loginAs(role, { force: true });

    expect(access_token).toBeTruthy();
    expect(expires_in).toBeGreaterThan(0);
  });
}
