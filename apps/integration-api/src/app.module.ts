import { Inject, Logger, Module, OnApplicationBootstrap } from '@nestjs/common';
import { ErpAdapterModule } from '@company/integration-adapter-erp';
import { MagentoAdapterModule } from '@company/integration-adapter-magento';
import { CommercePort, ErpPort, IdempotencyPort, SyncLogPort } from '@company/integration-core';
import {
  COMMERCE_PORT,
  ERP_PORT,
  IDEMPOTENCY_PORT,
  SYNC_LOG_PORT,
  USE_CASE_PROVIDERS,
} from '@company/integration-nestjs';
import { ConsoleSyncLogAdapter } from './adapters/console-sync-log.adapter';
import { InMemoryIdempotencyAdapter } from './adapters/in-memory-idempotency.adapter';

/**
 * AppModule is the composition root.
 *
 * USE_CASE_PROVIDERS is spread here (not inside IntegrationModule) so that the
 * factory inject tokens — ERP_PORT, COMMERCE_PORT, SYNC_LOG_PORT, IDEMPOTENCY_PORT —
 * are all resolvable within the same module scope.
 */
@Module({
  imports: [
    MagentoAdapterModule.forRoot({
      baseUrl: process.env['MAGENTO_BASE_URL'] ?? '',
      accessToken: process.env['MAGENTO_ACCESS_TOKEN'] ?? '',
    }),
    ErpAdapterModule.forRoot({
      baseUrl: process.env['ERP_BASE_URL'] ?? '',
      apiKey: process.env['ERP_API_KEY'] ?? '',
    }),
  ],
  providers: [
    { provide: SYNC_LOG_PORT, useClass: ConsoleSyncLogAdapter },
    { provide: IDEMPOTENCY_PORT, useClass: InMemoryIdempotencyAdapter },
    ...USE_CASE_PROVIDERS,
  ],
})
export class AppModule implements OnApplicationBootstrap {
  private readonly logger = new Logger('Adapters');

  constructor(
    @Inject(COMMERCE_PORT) private readonly commercePort: CommercePort,
    @Inject(ERP_PORT) private readonly erpPort: ErpPort,
    @Inject(SYNC_LOG_PORT) private readonly syncLogPort: SyncLogPort,
    @Inject(IDEMPOTENCY_PORT) private readonly idempotencyPort: IdempotencyPort,
  ) {}

  onApplicationBootstrap(): void {
    this.logger.log(`Commerce     → ${this.commercePort.constructor.name}`);
    this.logger.log(`ERP          → ${this.erpPort.constructor.name}`);
    this.logger.log(`SyncLog      → ${this.syncLogPort.constructor.name}`);
    this.logger.log(`Idempotency  → ${this.idempotencyPort.constructor.name}`);
  }
}
