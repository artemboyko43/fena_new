import { SyncInventoryCommand } from '../commands/sync-inventory.command';
import { CommercePort } from '../ports/commerce.port';
import { ErpPort } from '../ports/erp.port';
import { SyncLogPort } from '../ports/sync-log.port';

export class SyncErpInventoryToCommerceUseCase {
  constructor(
    private readonly erpPort: ErpPort,
    private readonly commercePort: CommercePort,
    private readonly syncLogPort: SyncLogPort,
  ) {}

  async execute(command: SyncInventoryCommand): Promise<void> {
    await this.syncLogPort.started(command.syncId, 'erp_inventory_to_commerce');

    try {
      const inventory = await this.erpPort.getInventory(command);
      await this.commercePort.updateInventory(inventory);
      await this.syncLogPort.success(command.syncId);
    } catch (error) {
      await this.syncLogPort.failed(command.syncId, error);
      throw error;
    }
  }
}
