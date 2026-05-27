import { DynamicModule, Module } from '@nestjs/common';
import { COMMERCE_PORT } from '@company/integration-nestjs';
import { ShopifyCommerceAdapter } from './adapter/Shopify-commerce.adapter';
import { ShopifyClient, ShopifyClientConfig } from './client/Shopify.client';
import { ShopifyMapper } from './mapper/Shopify.mapper';

// Config token kept for future use once ShopifyClient requires real credentials.
const SHOPIFY_CONFIG = Symbol('SHOPIFY_CONFIG');

@Module({})
export class ShopifyAdapterModule {
  static forRoot(config: ShopifyClientConfig): DynamicModule {
    return {
      module: ShopifyAdapterModule,
      providers: [
        { provide: SHOPIFY_CONFIG, useValue: config },
        // TODO: pass SHOPIFY_CONFIG to ShopifyClient once HTTP implementation is added
        ShopifyClient,
        ShopifyMapper,
        { provide: COMMERCE_PORT, useClass: ShopifyCommerceAdapter },
      ],
      exports: [COMMERCE_PORT],
    };
  }
}
