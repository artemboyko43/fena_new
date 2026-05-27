# @company/integration-adapter-Shopify

Shopify Commerce adapter for the integration platform.

Implements `CommercePort` from `@company/integration-core` for Shopify as the target commerce system.

## Status

Bootstrap skeleton — real Shopify API calls are not yet implemented.
Planned future slices: products sync, inventory sync, orders sync, authentication, error handling, contract tests.

## Responsibilities

- Shopify-specific API communication (`ShopifyClient`)
- Shopify-specific DTOs
- Shopify-to-core and core-to-Shopify mapping (`ShopifyMapper`)
- `CommercePort` implementation (`ShopifyCommerceAdapter`)
- Optional NestJS module (`ShopifyAdapterModule`)

## Dependencies

```
@company/integration-core  — canonical models, ports, commands
@company/integration-nestjs — COMMERCE_PORT DI token
```

## Usage

```ts
import { ShopifyAdapterModule } from '@company/integration-adapter-Shopify';

@Module({
  imports: [
    IntegrationModule,
    ShopifyAdapterModule.forRoot({ shopDomain: '...', accessToken: '...' }),
  ],
})
export class AppModule {}
```
