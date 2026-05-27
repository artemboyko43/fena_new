import { SyncInventoryCommand } from '../commands/sync-inventory.command';
import { SyncProductsCommand } from '../commands/sync-products.command';
import { InventoryItem } from '../models/inventory-item';
import { Order } from '../models/order';
import { Product } from '../models/product';

export interface ErpPort {
  getProducts(command: SyncProductsCommand): Promise<Product[]>;
  getInventory(command: SyncInventoryCommand): Promise<InventoryItem[]>;
  createOrder(order: Order): Promise<{ externalId: string }>;
}
