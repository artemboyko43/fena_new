# Agent Instructions

## Project Context

This repository contains a modular TypeScript ERP ↔ Commerce integration platform.

The architecture is based on a pragmatic ports-and-adapters approach.

The main packages are:

```text
packages/
  integration-core/
  integration-nestjs/
  integration-adapter-magento/
  integration-adapter-erp/

apps/
  integration-api/
```

## Main Rule

Keep `integration-core` framework-independent.

`integration-core` must not import:

- `@nestjs/*`
- adapter packages
- database implementations
- queue implementations
- HTTP clients for external systems
- Magento-specific code
- ERP-specific code

## Package Rules

### `packages/integration-core`

This package is the pure TypeScript application core.

Contains:

- canonical models
- commands
- ports
- generic use cases
- application services
- shared errors
- framework-agnostic tokens

Allowed:

- plain TypeScript classes
- interfaces
- types
- enums
- symbols or string constants for tokens
- provider-independent orchestration logic

Forbidden:

- NestJS decorators
- NestJS modules
- controllers
- external API clients
- database implementations
- queue implementations
- Magento-specific code
- ERP-specific code

Use cases must be generic.

Good:

```text
SyncErpProductsToCommerceUseCase
SyncErpInventoryToCommerceUseCase
SyncCommerceOrdersToErpUseCase
```

Bad:

```text
SyncMagentoInventoryUseCase
SyncSapProductsToMagentoUseCase
SyncEverythingUseCase
```

Use cases must depend only on ports.

Example:

```ts
export class SyncErpInventoryToCommerceUseCase {
  constructor(
    private readonly erpPort: ErpPort,
    private readonly commercePort: CommercePort,
    private readonly syncLogPort: SyncLogPort,
  ) {}

  async execute(command: SyncInventoryCommand): Promise<void> {
    await this.syncLogPort.started(command.syncId, 'erp_inventory_to_commerce');

    try {
      const inventory = await this.erpPort.getInventory(command);
      await this.commercePort.updateInventory(inventory);
      await this.syncLogPort.success(command.syncId);
    } catch (error) {
      await this.syncLogPort.failed(command.syncId, error);
      throw error;
    }
  }
}
```

---

### `packages/integration-nestjs`

This package contains NestJS DI wiring only.

Allowed:

- `@Module`
- `DynamicModule`
- provider factories
- DI tokens
- module options
- NestJS-specific registration helpers

Forbidden:

- Magento API calls
- ERP API calls
- provider-specific mapping
- sync business logic
- external system clients

This package may depend on:

- `@company/integration-core`
- `@nestjs/common`

This package must not depend on:

- `@company/integration-adapter-magento`
- `@company/integration-adapter-erp`

---

### `packages/integration-adapter-magento`

This package contains Magento-specific implementation.

Allowed:

- Magento client
- Magento DTOs
- Magento mapper
- Magento adapter implementing `CommercePort`
- optional `MagentoAdapterModule`

Forbidden:

- generic use cases
- ERP-specific logic
- core orchestration logic
- direct modifications of `integration-core`

This package may depend on:

- `@company/integration-core`
- `@company/integration-nestjs` only if it exposes a NestJS module
- `@nestjs/common` only if it exposes a NestJS module

---

### `packages/integration-adapter-erp`

This package contains ERP-specific implementation.

Allowed:

- ERP client
- ERP DTOs
- ERP mapper
- ERP adapter implementing `ErpPort`
- optional `ErpAdapterModule`

Forbidden:

- generic use cases
- Magento-specific logic
- core orchestration logic
- direct modifications of `integration-core`

This package may depend on:

- `@company/integration-core`
- `@company/integration-nestjs` only if it exposes a NestJS module
- `@nestjs/common` only if it exposes a NestJS module

---

### `apps/integration-api`

This app is the runtime composition root.

Allowed:

- import `IntegrationModule`
- import selected adapter modules
- provide runtime configuration
- start HTTP server or worker process
- connect queues and schedulers if needed

Forbidden:

- provider-specific sync logic
- generic use case logic
- duplicating adapter logic

## Dependency Rules

Allowed:

```text
integration-nestjs -> integration-core

integration-adapter-magento -> integration-core
integration-adapter-erp -> integration-core

integration-adapter-magento -> integration-nestjs only for NestJS module wiring
integration-adapter-erp -> integration-nestjs only for NestJS module wiring

runtime app -> integration-core
runtime app -> integration-nestjs
runtime app -> integration-adapter-*
```

Forbidden:

```text
integration-core -> @nestjs/*
integration-core -> integration-nestjs
integration-core -> integration-adapter-*
integration-core -> database implementations
integration-core -> queue implementations
integration-core -> external API clients

integration-nestjs -> integration-adapter-*
```

## Coding Rules

- Use TypeScript strict mode.
- Export public APIs through `index.ts`.
- Do not create circular dependencies.
- Keep methods typed.
- Do not use `any` unless there is no reasonable alternative.
- Prefer `unknown` for external raw payloads before mapping.
- Keep external DTOs inside adapter packages.
- Keep canonical models inside `integration-core`.
- Keep provider-specific mappers inside adapter packages.
- Keep use cases small and focused on orchestration.
- Do not put provider-specific conditionals inside core use cases.
- Do not create one `SyncEverythingUseCase`.
- Do not add framework-specific decorators to core classes.
- Do not make core classes depend on runtime environment variables directly.
- Configuration should be passed through ports, options, or runtime modules.

## Naming Rules

Use package names:

```text
@company/integration-core
@company/integration-nestjs
@company/integration-adapter-magento
@company/integration-adapter-erp
```

Use generic use case names:

```text
SyncErpProductsToCommerceUseCase
SyncErpInventoryToCommerceUseCase
SyncCommerceOrdersToErpUseCase
```

Use adapter names:

```text
MagentoCommerceAdapter
ErpAdapter
MagentoAdapterModule
ErpAdapterModule
```

## Testing Rules

- Test `integration-core` with mocked ports.
- Test adapters with mocked external clients.
- Do not require real Magento or ERP API calls in unit tests.
- Core unit tests must not require NestJS testing utilities.
- NestJS module tests may use NestJS testing utilities.

## Before Adding Code

Before adding a new file, decide which layer owns it:

```text
Generic model / command / port / use case -> integration-core
NestJS DI wiring -> integration-nestjs
Magento API / DTO / mapper / adapter -> integration-adapter-magento
ERP API / DTO / mapper / adapter -> integration-adapter-erp
Runtime composition -> apps/integration-api
```

## Final Check Before Completing a Task

Before completing any task, verify:

- `integration-core` has no `@nestjs/*` imports.
- `integration-core` has no adapter imports.
- `integration-nestjs` has no adapter imports.
- adapter packages implement ports from `integration-core`.
- public exports are available through `index.ts`.
- package boundaries match the README architecture.
