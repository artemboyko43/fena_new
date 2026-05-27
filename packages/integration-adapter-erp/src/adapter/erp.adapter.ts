import { Injectable } from '@nestjs/common';
import {
  ErpPort,
  InventoryItem,
  Order,
  Product,
  SyncInventoryCommand,
  SyncProductsCommand,
} from '@company/integration-core';
import { ErpClient } from '../client/erp.client';
import { ErpMapper } from '../mapper/erp.mapper';

@Injectable()
export class ErpAdapter implements ErpPort {
  constructor(
    private readonly client: ErpClient,
    private readonly mapper: ErpMapper,
  ) {}

  async getProducts(command: SyncProductsCommand): Promise<Product[]> {
    const dtos = await this.client.getProducts(command.updatedSince);
    return dtos.map((dto) => this.mapper.toProduct(dto));
  }

  async getInventory(command: SyncInventoryCommand): Promise<InventoryItem[]> {
    const dtos = await this.client.getInventory(command.warehouseIds);
    return dtos.map((dto) => this.mapper.toInventoryItem(dto));
  }

  async createOrder(order: Order): Promise<{ externalId: string }> {
    const payload = this.mapper.toErpOrderPayload(order);
    const response = await this.client.createOrder(payload);
    return { externalId: response.orderId };
  }
}
