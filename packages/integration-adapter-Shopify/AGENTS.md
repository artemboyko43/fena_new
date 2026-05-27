# Agent Instructions — integration-adapter-Shopify

## Package Role

This package is the Shopify adapter. It implements `CommercePort` from `@company/integration-core`.

## Allowed

- Shopify API client (`ShopifyClient`)
- Shopify-specific DTOs in `src/dto/`
- Shopify-to-core mapping (`ShopifyMapper`)
- `ShopifyCommerceAdapter` implementing `CommercePort`
- `ShopifyAdapterModule` for NestJS provider registration

## Forbidden

- Generic use cases
- ERP-specific logic
- Direct changes to `integration-core`
- Direct changes to `integration-nestjs`
- `any` — use `unknown` for raw external payloads

## Dependencies

```
@company/integration-core    — import canonical models and ports
@company/integration-nestjs  — import COMMERCE_PORT token for NestJS module wiring only
```

## Exports

All public API must be exported through `src/index.ts`.

## Tests

Tests live in `tests/`. Mock `ShopifyClient`; do not call the real Shopify API.
