import { Provider } from '@nestjs/common';
import {
  CommercePort,
  ErpPort,
  IdempotencyPort,
  SyncCommerceOrdersToErpUseCase,
  SyncErpInventoryToCommerceUseCase,
  SyncErpProductsToCommerceUseCase,
  SyncLogPort,
} from '@company/integration-core';
import { COMMERCE_PORT, ERP_PORT, IDEMPOTENCY_PORT, SYNC_LOG_PORT } from './port-tokens';

export const USE_CASE_PROVIDERS: Provider[] = [
  {
    provide: SyncErpProductsToCommerceUseCase,
    useFactory: (erp: ErpPort, commerce: CommercePort, log: SyncLogPort) =>
      new SyncErpProductsToCommerceUseCase(erp, commerce, log),
    inject: [ERP_PORT, COMMERCE_PORT, SYNC_LOG_PORT],
  },
  {
    provide: SyncErpInventoryToCommerceUseCase,
    useFactory: (erp: ErpPort, commerce: CommercePort, log: SyncLogPort) =>
      new SyncErpInventoryToCommerceUseCase(erp, commerce, log),
    inject: [ERP_PORT, COMMERCE_PORT, SYNC_LOG_PORT],
  },
  {
    provide: SyncCommerceOrdersToErpUseCase,
    useFactory: (
      commerce: CommercePort,
      erp: ErpPort,
      idempotency: IdempotencyPort,
      log: SyncLogPort,
    ) => new SyncCommerceOrdersToErpUseCase(commerce, erp, idempotency, log),
    inject: [COMMERCE_PORT, ERP_PORT, IDEMPOTENCY_PORT, SYNC_LOG_PORT],
  },
];
