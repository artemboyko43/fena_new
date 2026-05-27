import { DynamicModule, Module } from '@nestjs/common';
import { COMMERCE_PORT } from '@company/integration-nestjs';
import { MagentoCommerceAdapter } from './adapter/magento-commerce.adapter';
import { MagentoClient, MagentoClientConfig } from './client/magento.client';
import { MagentoMapper } from './mapper/magento.mapper';

const MAGENTO_CONFIG = Symbol('MAGENTO_CONFIG');

@Module({})
export class MagentoAdapterModule {
  static forRoot(config: MagentoClientConfig): DynamicModule {
    return {
      module: MagentoAdapterModule,
      providers: [
        { provide: MAGENTO_CONFIG, useValue: config },
        {
          provide: MagentoClient,
          useFactory: (cfg: MagentoClientConfig) => new MagentoClient(cfg),
          inject: [MAGENTO_CONFIG],
        },
        MagentoMapper,
        { provide: COMMERCE_PORT, useClass: MagentoCommerceAdapter },
      ],
      exports: [COMMERCE_PORT],
    };
  }
}
