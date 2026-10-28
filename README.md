<div align="center">

# حبّة ستور · 7aba Store

**An open-source store builder and one-page selling store for Algerian merchants.**

[![CI](https://github.com/ta9in-oss/sellingpage/actions/workflows/ci.yml/badge.svg)](https://github.com/ta9in-oss/sellingpage/actions/workflows/ci.yml)
[![codecov](https://codecov.io/gh/ta9in-oss/sellingpage/graph/badge.svg)](https://codecov.io/gh/ta9in-oss/sellingpage)
[![License: MIT](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![PRs welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](CONTRIBUTING.md)

[![TanStack Start](https://img.shields.io/github/package-json/dependency-version/ta9in-oss/sellingpage/@tanstack/react-start?filename=apps%2Fplatform%2Fpackage.json&label=TanStack%20Start&logo=react)](https://tanstack.com/start)
[![React](https://img.shields.io/github/package-json/dependency-version/ta9in-oss/sellingpage/react?filename=apps%2Fplatform%2Fpackage.json&logo=react)](https://react.dev)
[![Vite](https://img.shields.io/github/package-json/dependency-version/ta9in-oss/sellingpage/vite?filename=apps%2Fplatform%2Fpackage.json&logo=vite)](https://vite.dev)
[![TypeScript](https://img.shields.io/github/package-json/dependency-version/ta9in-oss/sellingpage/dev/typescript?filename=apps%2Fplatform%2Fpackage.json&logo=typescript)](https://www.typescriptlang.org)
[![Node](https://img.shields.io/badge/node-%3E%3D22.12-339933?logo=node.js)](.nvmrc)
[![pnpm](https://img.shields.io/badge/pnpm-workspace-F69220?logo=pnpm)](https://pnpm.io)
[![Linted with Biome](https://img.shields.io/badge/linted_with-Biome-60a5fa?logo=biome)](https://biomejs.dev)

</div>

> [!IMPORTANT]
> **This is the first version of 7aba, now released as open source.** It is built on
> [InstantDB](https://www.instantdb.com), which has been discontinued, so this version is
> no longer sold. A newer, better version of the product is in the works — follow
> [7aba.app](https://7aba.app) and [Ta9in](https://ta9in.com) for the launch.
> The code stays here for anyone to learn from, fork and build on.

<div dir="rtl">

حبّة ستور منصّة لبناء متاجر إلكترونية بصفحة بيع واحدة للتجّار الجزائريين: صمّم متجرك، انشره على
Cloudflare، واستقبل الطلبات مع إشعارات فورية، بالدفع عند الاستلام أو عبر Chargily Pay.
هذه النسخة الأولى من المنتج، نُطلقها اليوم مفتوحةَ المصدر.

</div>

## What's inside

A pnpm monorepo with four workspaces:

| Workspace | What it is |
|---|---|
| [`apps/platform`](apps/platform) | The SaaS at 7aba.app: landing page, merchant dashboard, drag-and-drop store builder, deploy wizard, Chargily subscriptions. |
| [`apps/store`](apps/store) | The store template each merchant gets: a one-page selling page with order form, Algerian wilaya/commune picker, COD or Chargily checkout, and a seller dashboard. |
| [`apps/deploy-daemon`](apps/deploy-daemon) | A self-hosted build-and-deploy worker that turns a merchant's saved config into a live store on their own Cloudflare Pages account. |
| [`packages/store-ui`](packages/store-ui) | Shared, theme-aware React section components (hero, testimonials, FAQ, order form, …) used by the store and the builder preview. |

**Stack:** TanStack Start (React 19, SSR) · Vite · Tailwind CSS 4 · shadcn/ui + Radix · InstantDB · Zustand · Nitro on Cloudflare Pages · Chargily Pay.

## Getting started

Requirements: Node ≥ 22.12 (see [`.nvmrc`](.nvmrc)) and pnpm (the version is pinned in `package.json` via `packageManager`; `corepack enable` picks it up).

```bash
git clone https://github.com/ta9in-oss/sellingpage.git
cd sellingpage
pnpm install

cp apps/platform/.env.example apps/platform/.env   # fill in your own keys
cp apps/store/.env.example apps/store/.env

pnpm dev              # platform on :3001, store on :3000
```

You need your own [InstantDB](https://www.instantdb.com) app IDs and admin tokens, and, for
payments, [Chargily Pay](https://chargily.com) test keys. The `.env.example` files list
every variable and what it's for.

## Scripts

| Command | What it does |
|---|---|
| `pnpm dev` | Run every app in dev mode |
| `pnpm build` | Production build of the platform and store (`CF_PAGES=1` selects the Cloudflare Pages output in `dist/`) |
| `pnpm lint` | Lint with Biome |
| `pnpm typecheck` | `tsc --noEmit` in every workspace |
| `pnpm test` | Run all unit tests with Vitest |
| `pnpm test:coverage` | Tests with V8 coverage (`coverage/`) |
| `pnpm check` | Lint + typecheck + test, what CI runs |

## Deploying

The platform and stores build to Cloudflare Pages through Nitro's `cloudflare-pages` preset:

```bash
cd apps/platform
CF_PAGES=1 pnpm build
npx wrangler pages deploy dist --project-name=<your-pages-project>
```

[`.github/workflows/deploy.yml`](.github/workflows/deploy.yml) does the same on manual
dispatch. For per-merchant store deploys see
[`apps/deploy-daemon`](apps/deploy-daemon/README.md) and the
[store deploy runbook](docs/deploy/store-deploy-runbook.md).

## Contributing

Issues and pull requests are welcome. Read [CONTRIBUTING.md](CONTRIBUTING.md) first, and
please follow the [Code of Conduct](CODE_OF_CONDUCT.md). Found a security issue? See
[SECURITY.md](SECURITY.md) and report it privately.

## Contributors

7aba was built by the team at [Ta9in (تقن)](https://ta9in.com). Thank you to everyone who
wrote code for it:

| | Contributor | |
|---|---|---|
| <img src="https://github.com/mohessaid.png" width="48" alt=""> | **Mohammed Essaid MEZERREG** · [@mohessaid](https://github.com/mohessaid) | Creator and lead maintainer: architecture, platform, builder, deploy pipeline |
| <img src="https://github.com/fatizori.png" width="48" alt=""> | **Fatima** · [@fatizori](https://github.com/fatizori) | Database schema, product ordering, seller dashboard, success page and admin authentication |
| <img src="https://github.com/nourelimanes.png" width="48" alt=""> | **Nour El Imane S.** · [@nourelimanes](https://github.com/nourelimanes) | Designed and built the selling page, real-time order notifications, and the pnpm / Tailwind / shadcn setup |

Full history: [contributor graph](https://github.com/ta9in-oss/sellingpage/graphs/contributors).

## License

[MIT](LICENSE) © 2025–2026 Ta9in (تقن) and the 7aba contributors.
