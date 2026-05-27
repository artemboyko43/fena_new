# Task 001: Bootstrap Shopify Adapter Package

## Goal

Create the initial structure for the Shopify Commerce adapter package.

This task should prepare the package skeleton only. Do not implement real Shopify API logic yet.

The adapter package must be ready for future slices such as:

- products sync;
- inventory sync;
- orders sync;
- contract tests;
- error handling;
- authentication;
- real Shopify API client implementation.

---

## Context Files to Read First

Before making changes, read:

- `README.md`
- `AGENTS.md`
- `packages/integration-core/src/ports/commerce.port.ts`
- `packages/integration-core/src/models/product.ts`
- `packages/integration-core/src/models/inventory.ts`
- `packages/integration-core/src/models/order.ts`
- `packages/integration-core/src/commands/sync-products.command.ts`
- `packages/integration-core/src/commands/sync-inventory.command.ts`
- `packages/integration-core/src/commands/sync-orders.command.ts`

If any of these files do not exist yet, create only the Shopify adapter structure and document missing dependencies in the final report.

---

## Allowed Edit Scope

You may edit only:

```text
packages/integration-adapter-Shopify/**
```

Do not edit:

```text
packages/integration-core/**
packages/integration-nestjs/**
packages/integration-adapter-erp/**
apps/**
README.md
AGENTS.md
```

If a change is needed outside the allowed scope, stop and report it instead of editing the file.

---

## Required Package Structure

Create or update:

```text
packages/integration-adapter-Shopify/
  package.json
  tsconfig.json
  README.md
  AGENTS.md

  src/
    client/
      Shopify.client.ts

    dto/
      Shopify-product.dto.ts
      Shopify-inventory.dto.ts
      Shopify-order.dto.ts

    mapper/
      Shopify.mapper.ts

    adapter/
      Shopify-commerce.adapter.ts

    Shopify-adapter.module.ts
    index.ts

  tests/
    Shopify.mapper.spec.ts
    Shopify-commerce.adapter.spec.ts
```

---

## Package Responsibilities

The Shopify adapter package is responsible for:

- Shopify-specific API communication;
- Shopify-specific DTOs;
- Shopify-specific mapping;
- implementing `CommercePort` from `@company/integration-core`;
- optionally exposing `ShopifyAdapterModule` for NestJS provider registration.

The package must not contain:

- generic use cases;
- ERP-specific logic;
- core orchestration logic;
- changes to `integration-core`.

---

## Implementation Requirements

### 1. `ShopifyClient`

Create a minimal client class:

```ts
export class ShopifyClient {
  async getProducts(params: unknown): Promise<unknown[]> {
    return [];
  }

  async updateProducts(payload: unknown[]): Promise<void> {
    return;
  }

  async updateInventory(payload: unknown[]): Promise<void> {
    return;
  }

  async getOrders(params: unknown): Promise<unknown[]> {
    return [];
  }
}
```

Real HTTP implementation is not required in this task.

---

### 2. DTO Files

Create placeholder DTO types for Shopify payloads.

Use `unknown` for raw external data if the structure is not known yet.

Do not use `any`.

Example:

```ts
export interface ShopifyProductDto {
  sku: string;
  name?: string;
  enabled?: boolean;
  raw?: unknown;
}
```

---

### 3. `ShopifyMapper`

Create a mapper class with minimal typed methods:

```ts
export class ShopifyMapper {
  toShopifyProduct(product: Product): unknown {
    // placeholder mapping
  }

  toShopifyInventoryItem(item: InventoryItem): unknown {
    // placeholder mapping
  }

  toCoreProduct(raw: unknown): Product {
    // placeholder mapping
  }

  toCoreOrder(raw: unknown): Order {
    // placeholder mapping
  }
}
```

The mapper must import canonical models from `@company/integration-core`.

---

### 4. `ShopifyCommerceAdapter`

Create:

```ts
export class ShopifyCommerceAdapter implements CommercePort
```

Required methods:

```ts
updateProducts(products: Product[]): Promise<void>;
updateInventory(items: InventoryItem[]): Promise<void>;
getOrders(command: SyncOrdersCommand): Promise<Order[]>;
```

Behavior for this task:

- `updateProducts` maps products to Shopify payloads and calls `ShopifyClient.updateProducts`;
- `updateInventory` maps inventory items to Shopify payloads and calls `ShopifyClient.updateInventory`;
- `getOrders` may return an empty array for now, but must be implemented and typed.

---

### 5. `ShopifyAdapterModule`

Create a minimal NestJS module only if `integration-nestjs` exposes the required DI token for `CommercePort`.

If the token is not available yet, create the module with a TODO comment and document it in the final report.

The module should eventually register:

```ts
{
  provide: COMMERCE_PORT,
  useClass: ShopifyCommerceAdapter,
}
```

Do not add NestJS code to `integration-core`.

---

### 6. Public Exports

Export public API from:

```text
packages/integration-adapter-Shopify/src/index.ts
```

Required exports:

- `ShopifyClient`
- `ShopifyMapper`
- `ShopifyCommerceAdapter`
- `ShopifyAdapterModule`
- public DTOs

---

## Testing Requirements

Create minimal tests:

```text
tests/Shopify.mapper.spec.ts
tests/Shopify-commerce.adapter.spec.ts
```

Tests should verify:

- mapper can map a canonical `Product` to a Shopify payload;
- mapper can map a canonical `InventoryItem` to a Shopify payload;
- adapter calls `ShopifyClient.updateProducts` when `updateProducts` is executed;
- adapter calls `ShopifyClient.updateInventory` when `updateInventory` is executed;
- adapter implements all methods required by `CommercePort`.

Use mocked `ShopifyClient`.

Do not call real Shopify API.

---

## Guardrails

- Do not edit files outside `packages/integration-adapter-Shopify/**`.
- Do not modify `integration-core`.
- Do not modify `integration-nestjs`.
- Do not add Shopify-specific code to `integration-core`.
- Do not add generic use cases to this adapter package.
- Do not use `any`; use `unknown` for raw external payloads.
- Do not introduce circular dependencies.
- Export public API only through `src/index.ts`.
- Keep adapter-specific DTOs inside this package.

---

## Validation

Run:

```bash
pnpm --filter @company/integration-adapter-Shopify build
pnpm --filter @company/integration-adapter-Shopify test
pnpm check:boundaries
```

If available, also run:

```bash
pnpm check:changed-files -- packages/integration-adapter-Shopify
```

If a validation command is not available yet, mention it in the final report.

---

## Acceptance Criteria

The task is complete only when:

- package structure exists;
- package builds;
- tests pass;
- `ShopifyCommerceAdapter` implements `CommercePort`;
- no files outside `packages/integration-adapter-Shopify/**` were changed;
- no `any` is used;
- public exports are available through `src/index.ts`;
- no real Shopify API calls are performed in tests;
- package boundaries follow `README.md` and `AGENTS.md`.

---

## Final Report Format

After finishing, report:

```md
## Summary

Briefly describe what was implemented.

## Files Changed

List changed files.

## Validation

List commands executed and their results.

## Notes

Mention missing dependencies, TODOs, or validation commands that could not be executed.
```
