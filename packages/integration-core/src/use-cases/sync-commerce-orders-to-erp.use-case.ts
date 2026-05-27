import { SyncOrdersCommand } from '../commands/sync-orders.command';
import { CommercePort } from '../ports/commerce.port';
import { ErpPort } from '../ports/erp.port';
import { IdempotencyPort } from '../ports/idempotency.port';
import { SyncLogPort } from '../ports/sync-log.port';

export class SyncCommerceOrdersToErpUseCase {
  constructor(
    private readonly commercePort: CommercePort,
    private readonly erpPort: ErpPort,
    private readonly idempotencyPort: IdempotencyPort,
    private readonly syncLogPort: SyncLogPort,
  ) {}

  async execute(command: SyncOrdersCommand): Promise<void> {
    await this.syncLogPort.started(command.syncId, 'commerce_orders_to_erp');

    try {
      const orders = await this.commercePort.getOrders(command);

      for (const order of orders) {
        const alreadyProcessed = await this.idempotencyPort.isProcessed(order.id);
        if (alreadyProcessed) continue;

        await this.erpPort.createOrder(order);
        await this.idempotencyPort.markProcessed(order.id);
      }

      await this.syncLogPort.success(command.syncId);
    } catch (error) {
      await this.syncLogPort.failed(command.syncId, error);
      throw error;
    }
  }
}
