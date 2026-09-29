# qa-automation

Playwright automation for several target applications, arranged so that adding
the next application is copy-and-paste rather than a rewrite.

```
qa-automation/
├─ package.json            npm workspaces root; every script fans out to apps/
├─ playwright.base.ts      shared reporters, retries, tracing
├─ tsconfig.json
└─ apps/
   ├─ saucedemo/           UI only  - no public API exists to test
   └─ toolshop/            UI + API  - the comprehensive reference app
```

## Layout of one app

```
apps/<app>/
├─ playwright.config.ts    which projects exist and what runs first
├─ config/roles.ts         single source of truth: credentials, URLs, auth-state paths
├─ ui/
│  ├─ pages/*.page.ts      page objects           (browser context)
│  └─ fixtures/ui.fixtures.ts
├─ api/                    (only when the target has an API)
│  ├─ api-client.ts        request wrapper        (request context)
│  ├─ *.api.ts             resource objects, one per endpoint group
│  ├─ session.ts           login + token cache
│  └─ fixtures/api.fixtures.ts
└─ tests/
   ├─ setup/               produces shared auth state; not a real suite
   ├─ ui/                  browser specs
   ├─ api/                 request specs
   └─ integration/         browser + request in the same test
```

`ui/` and `api/` are siblings on purpose: the app is split by *layer*, and each
layer owns its own page objects / clients and its own fixtures.

## Order of logic

Two different orders are easy to confuse. Dependency order is what you write;
execution order is what Playwright runs.

| | Order |
|---|---|
| **Dependency (imports)** | `ui/pages` + `api/*` → `fixtures` → `tests` → `setup` |
| **Execution** | `setup` → `ui` / `api` / `integration` |

A setup file is **not** a layer above the pages. It is a spec that imports
fixtures, exactly like any other spec; it just happens to run first because the
other projects list it in `dependencies`. Nothing imports a setup file, and
adding a role to `config/roles.ts` never requires touching a page object.

## Sharing login state

One login per role, two artifacts, one directory:

```
config/roles.ts                     who can sign in and where each role lands
        │
        ├─ UI  path:  tests/setup/auth.setup.ts  →  browser  →  .auth/<role>.json
        └─ API path:  tests/setup/api.setup.ts   →  request  →  .auth/<role>.token.json
                                │
        ui fixtures read storageState          api fixtures read the bearer token
```

`.auth/` is gitignored: both artifacts are secrets with a short life.

Roles are opt-in per spec, not baked into the Playwright project:

```ts
test.use({ storageState: storageStateFor('standard') });  // UI
test.use({ apiRole: 'admin' });                           // API
```

That ordering matters. Setting `storageState` on the *project* signs every test
in, so signed-out specs have to opt out and multi-role tests are impossible.
Leaving the project clean and opting in means login tests are signed out by
default, and one spec can hold two roles at once.

## Running

### Run from the repo root

npm workspaces only resolve from the root, so every command below assumes you
are in `qa-automation/`.

```bash
npm test              # every app, everything        -> 36 tests (11 + 25)
npm run test:toolshop # one app, everything
npm run test:ui       # UI specs in every app
npm run test:api      # API specs (only toolshop defines them; saucedemo is skipped)
npm run typecheck     # tsc --noEmit
```

`test:api` and `test:ui` fan out with `--workspaces --if-present`, so an app that
does not define a script is skipped rather than failing. That is why saucedemo,
which has no `api/` layer, is simply not part of `npm run test:api`.

### Scoping a run

There are two independent axes, and confusing them is the usual mistake: pick an
**app** with `--workspace`, or pick a **layer** with `--project`.

| You want | Use | Example |
|---|---|---|
| one app | `--workspace @qa/<app>` | `npm run test --workspace @qa/saucedemo` |
| one layer | `--project=<name>` | `--project=toolshop-api` |

Project names: `saucedemo-setup`, `saucedemo-ui`, `toolshop-setup-ui`,
`toolshop-setup-api`, `toolshop-ui`, `toolshop-api`, `toolshop-integration`.

### Passing flags through npm

Flags after `--` go to `playwright test`, not to npm:

```bash
npm run test --workspace @qa/toolshop -- --headed
npm run test --workspace @qa/toolshop -- --project=toolshop-ui --headed
npm run test --workspace @qa/toolshop -- tests/api/products.spec.ts   # one file
npm run test --workspace @qa/toolshop -- -g "search returns only"     # by title
npm run test --workspace @qa/toolshop -- --ui                         # watch mode
```

`--project` accepts `*` wildcards, which is how the per-app scripts are built:
`npm run test:ui --workspace @qa/toolshop` is just
`playwright test --project=toolshop-ui`.

### Or work from inside an app

Because each app owns its own config, Playwright itself works from the app
directory. Same thing, one less layer of npm:

```bash
cd apps/toolshop
npx playwright test --project=toolshop-api
npx playwright test tests/ui/login.spec.ts
npx playwright test --debug        # step through with the Inspector
```

The root scripts exist mainly for CI and for running both apps in one go.

### Setup projects run themselves

You never invoke a setup project by hand. Each UI and API project lists the
matching setup project in `dependencies`, so Playwright runs
`toolshop-setup-ui` before `toolshop-ui`, and so on, on every run.

On a fresh clone the first run signs in and creates `apps/<app>/.auth/`; after
that the captured state is reused, with API tokens refreshed shortly before they
expire.

Dependencies are pulled into the run even when you scope to one project, so
counts include them. `--project=toolshop-api` reports 13 tests, not 11: the
extra two are `toolshop-setup-api`. Positional file filters apply to the selected
project only, so `--project=toolshop-api tests/api/products.spec.ts` still runs
both setup tests plus the 5 filtered ones. To see or run a project's own tests
with nothing else attached (only valid once `.auth/` is populated):

```bash
npx playwright test --no-deps --project=toolshop-api tests/api/products.spec.ts
# Total: 5 tests in 1 file
```

A failing setup project is usually the informative failure. `toolshop-setup-api`
answering `423` means a seeded account was locked on the shared database - see
the three Toolshop rules at the end of this file before suspecting test code.

### Reports

```bash
npm run report:toolshop
npm run report:saucedemo
```

Reports are per app in `apps/<app>/playwright-report/`, and in CI each app uploads
its own `playwright-report-<app>` artifact, so a red saucedemo job never hides
toolshop's report.

## Adding a new app

1. `mkdir -p apps/<name>/{config,ui/pages,ui/fixtures,tests/{setup,ui}}`
2. Copy `apps/toolshop/config/roles.ts` and replace the credentials and URLs.
3. Copy the config, rename every project prefix, and keep the two setup
   projects separate so the API suite does not pay for a browser login.
4. Add the app name to the CI matrix in `.github/workflows/playwright.yml`.

## Target apps

### saucedemo — UI only

`saucedemo.com` publishes no API and has no admin role, so its roles are
personas: `standard_user` and `problem_user`. It is kept as the reference for a
target that only needs a browser layer. `performance_glitch_user` is gone: it
was labelled "admin" without being one, and its deliberate latency only made the
suite slower.

### toolshop — UI + API

`practicesoftwaretesting.com` with its documented REST API at
`api.practicesoftwaretesting.com/api/documentation`. This is the app that can
actually show what a `ui/` + `api/` split buys you: real `admin` and `user`
roles, and a UI that is itself a client of the API.

**It is a shared, publicly writable database.** Three rules follow, and ignoring
them produces failures that look like bugs in the test code:

1. **Never point a negative login test at a real account.** Repeated wrong
   passwords lock the account for everyone. `POST /users/login` then answers
   `423 Account locked`. This is why `customer@practicesoftwaretesting.com` is
   unusable today, and why negative login tests use `UNKNOWN_ACCOUNT`.
2. **Never hard-code a record id.** Product ids are ULIDs created at runtime;
   fetch one via the API instead (`productsApi.first()`).
3. **Never create records that outlive the run.** There is no cleanup API.

Tokens last 300 seconds, so a cached token carries the time it was issued and is
refreshed when it is close to expiry rather than being sent and rejected
mid-run. The `admin@` and `customer2@` accounts are the ones that currently work.
