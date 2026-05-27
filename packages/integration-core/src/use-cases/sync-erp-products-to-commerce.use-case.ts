import { SyncProductsCommand } from '../commands/sync-products.command';
import { CommercePort } from '../ports/commerce.port';
import { ErpPort } from '../ports/erp.port';
import { SyncLogPort } from '../ports/sync-log.port';

export class SyncErpProductsToCommerceUseCase {
  constructor(
    private readonly erpPort: ErpPort,
    private readonly commercePort: CommercePort,
    private readonly syncLogPort: SyncLogPort,
  ) {}

  async execute(command: SyncProductsCommand): Promise<void> {
    await this.syncLogPort.started(command.syncId, 'erp_products_to_commerce');

    try {
      const products = await this.erpPort.getProducts(command);
      await this.commercePort.updateProducts(products);
      await this.syncLogPort.success(command.syncId);
    } catch (error) {
      await this.syncLogPort.failed(command.syncId, error);
      throw error;
    }
  }
}
