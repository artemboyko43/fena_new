import { SyncOrdersCommand } from '../commands/sync-orders.command';
import { InventoryItem } from '../models/inventory-item';
import { Order } from '../models/order';
import { Product } from '../models/product';

export interface CommercePort {
  updateProducts(products: Product[]): Promise<void>;
  updateInventory(items: InventoryItem[]): Promise<void>;
  getOrders(command: SyncOrdersCommand): Promise<Order[]>;
}
