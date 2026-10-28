# Contributing to 7aba Store

Thanks for helping. This guide covers everything you need to send a good pull request.

## Setup

1. Install Node ≥ 22.12 (`nvm use` reads [`.nvmrc`](.nvmrc)) and run `corepack enable` for pnpm.
2. `pnpm install`
3. Copy `apps/platform/.env.example` and `apps/store/.env.example` to `.env` in the same folder and fill in your own keys. Never commit `.env` files.
4. `pnpm dev`, platform on http://localhost:3001 and store on http://localhost:3000.

## Before you open a PR

Run the same checks CI runs:

```bash
pnpm check     # biome lint + tsc --noEmit + vitest
pnpm build     # make sure both apps still build
```

- **Tests:** add or update Vitest tests next to the code (`foo.ts` → `foo.test.ts`). New logic in `apps/platform/src/lib` or `src/server` should come with tests.
- **Types:** the code must type-check with zero errors. Avoid `any`; Biome warns on it.
- **UI:** use the shadcn/ui components in `components/ui` instead of hand-rolled controls. The UI is Arabic-first and RTL: check your change in Arabic as well as French/English.
- **Generated files:** never edit `routeTree.gen.ts` by hand; the TanStack Router plugin regenerates it.
- **Secrets:** CI runs gitleaks on every push. Don't put tokens, keys or real customer data in code, tests or fixtures.

## Commits and pull requests

- Use [Conventional Commits](https://www.conventionalcommits.org): `feat(platform): …`, `fix(store): …`, `docs: …`, `chore(deps): …`.
- Keep a PR focused on one change, and describe what changed and how you tested it.
- Link the issue it closes, if any.

## Project layout

See the [README](README.md#whats-inside) for the workspace overview and [`AGENTS.md`](AGENTS.md) for architecture notes, conventions and known gotchas.

## License

By contributing, you agree that your contributions are licensed under the [MIT License](LICENSE).
