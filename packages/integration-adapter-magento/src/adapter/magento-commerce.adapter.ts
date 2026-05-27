import { Injectable } from '@nestjs/common';
import {
  CommercePort,
  InventoryItem,
  Order,
  Product,
  SyncOrdersCommand,
} from '@company/integration-core';
import { MagentoClient } from '../client/magento.client';
import { MagentoMapper } from '../mapper/magento.mapper';

@Injectable()
export class MagentoCommerceAdapter implements CommercePort {
  constructor(
    private readonly client: MagentoClient,
    private readonly mapper: MagentoMapper,
  ) {}

  async updateProducts(products: Product[]): Promise<void> {
    const dtos = products.map((p) => this.mapper.toMagentoProduct(p));
    await this.client.putProducts(dtos);
  }

  async updateInventory(items: InventoryItem[]): Promise<void> {
    const dtos = items.map((i) => this.mapper.toMagentoInventory(i));
    await this.client.putInventory(dtos);
  }

  async getOrders(command: SyncOrdersCommand): Promise<Order[]> {
    const dtos = await this.client.getOrders(command.from, command.to);
    return dtos.map((dto) => this.mapper.toOrder(dto));
  }
}
