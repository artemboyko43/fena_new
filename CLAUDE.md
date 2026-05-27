# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

A modular TypeScript ERP ↔ Commerce integration platform using a ports-and-adapters architecture. The core is intentionally framework-agnostic; NestJS, Magento, and ERP specifics live exclusively in their own packages.

## Monorepo Layout

```text
packages/
  integration-core/          # Pure TypeScript app core — models, ports, use cases
  integration-nestjs/        # NestJS DI wiring only
  integration-adapter-magento/  # Magento API client, mapper, CommercePort impl
  integration-adapter-erp/      # ERP API client, mapper, ErpPort impl
apps/
  integration-api/           # Runtime composition root
```

Package manager: `pnpm` with `pnpm-workspace.yaml`.

## Build & Test Commands

```bash
pnpm install                  # install all workspace dependencies
pnpm --filter <package> build # build a single package
pnpm --filter <package> test  # test a single package
pnpm build                    # build all packages
pnpm test                     # test all packages
```

## Architecture Constraints

### Dependency direction — must point inward to core

```
integration-nestjs          → integration-core
integration-adapter-magento → integration-core
integration-adapter-erp     → integration-core
apps/integration-api        → integration-core, integration-nestjs, integration-adapter-*
```

### Forbidden dependencies

| Package | Must NOT import |
|---|---|
| `integration-core` | `@nestjs/*`, any adapter, DB/queue/HTTP clients |
| `integration-nestjs` | any adapter package |
| adapters | each other |

### `integration-core` — allowed contents only

- Plain TypeScript classes, interfaces, types, enums
- Canonical models, commands, ports, use cases, application services, errors, tokens
- No NestJS decorators, no external clients, no provider-specific code

### Use case naming — generic, not provider-specific

```
✅  SyncErpProductsToCommerceUseCase
✅  SyncErpInventoryToCommerceUseCase
✅  SyncCommerceOrdersToErpUseCase

❌  SyncMagentoInventoryUseCase
❌  SyncSapProductsToMagentoUseCase
❌  SyncEverythingUseCase
```

Use cases depend **only** on ports and must call `syncLogPort.started/success/failed` for observability.

### Adapter responsibilities

- Implement ports from `integration-core`
- Own all provider-specific DTOs and mappers
- Use `unknown` for raw external payloads before mapping; never use `any`
- May expose an optional NestJS module (which can depend on `integration-nestjs`)

### `apps/integration-api` — composition root only

Imports modules, provides configuration, starts the server. No provider-specific sync logic here.

## Coding Rules

- TypeScript strict mode throughout.
- Export public APIs **only** through `index.ts` of each package.
- No circular dependencies.
- No `any`; prefer `unknown` for unmapped external data.
- Configuration flows via ports, options objects, or runtime modules — never `process.env` inside core.
- Do not add framework decorators to core classes.

## Testing Rules

- `integration-core` tests: mock all ports; no NestJS test utilities required.
- Adapter tests: mock external API clients; no real Magento/ERP calls.
- NestJS module tests: may use `@nestjs/testing`.

## Before Adding Any File — Layer Decision Checklist

```
Generic model / command / port / use case  →  integration-core
NestJS DI wiring                           →  integration-nestjs
Magento API / DTO / mapper / adapter       →  integration-adapter-magento
ERP API / DTO / mapper / adapter           →  integration-adapter-erp
Runtime composition                        →  apps/integration-api
```

## Final Check Before Completing a Task

- `integration-core` has no `@nestjs/*` imports.
- `integration-core` has no adapter imports.
- `integration-nestjs` has no adapter imports.
- Adapter packages implement ports defined in `integration-core`.
- All public exports pass through `index.ts`.
- Package boundaries match the architecture above.
