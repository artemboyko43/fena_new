import { Module } from '@nestjs/common';
import {
  SyncCommerceOrdersToErpUseCase,
  SyncErpInventoryToCommerceUseCase,
  SyncErpProductsToCommerceUseCase,
} from '@company/integration-core';
import { USE_CASE_PROVIDERS } from './use-case.providers';

@Module({
  providers: USE_CASE_PROVIDERS,
  exports: [
    SyncErpProductsToCommerceUseCase,
    SyncErpInventoryToCommerceUseCase,
    SyncCommerceOrdersToErpUseCase,
  ],
})
export class IntegrationModule {}
