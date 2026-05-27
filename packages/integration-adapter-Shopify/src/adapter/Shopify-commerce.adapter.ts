import { Injectable } from '@nestjs/common';
import {
  CommercePort,
  InventoryItem,
  Order,
  Product,
  SyncOrdersCommand,
} from '@company/integration-core';
import { ShopifyClient } from '../client/Shopify.client';
import { ShopifyMapper } from '../mapper/Shopify.mapper';

@Injectable()
export class ShopifyCommerceAdapter implements CommercePort {
  constructor(
    private readonly client: ShopifyClient,
    private readonly mapper: ShopifyMapper,
  ) {}

  async updateProducts(products: Product[]): Promise<void> {
    const payload = products.map((p) => this.mapper.toShopifyProduct(p));
    await this.client.updateProducts(payload);
  }

  async updateInventory(items: InventoryItem[]): Promise<void> {
    const payload = items.map((i) => this.mapper.toShopifyInventoryItem(i));
    await this.client.updateInventory(payload);
  }

  async getOrders(_command: SyncOrdersCommand): Promise<Order[]> {
    // TODO: implement in orders-sync slice
    return [];
  }
}
