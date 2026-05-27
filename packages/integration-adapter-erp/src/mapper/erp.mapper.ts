import { Injectable } from '@nestjs/common';
import { InventoryItem, Order, Product } from '@company/integration-core';
import { ErpInventoryDto, ErpOrderPayloadDto, ErpProductDto } from '../client/erp.dto';

@Injectable()
export class ErpMapper {
  toProduct(dto: ErpProductDto): Product {
    return {
      sku: dto.itemCode,
      name: dto.itemName,
      price: dto.salePrice,
      description: dto.description,
    };
  }

  toInventoryItem(dto: ErpInventoryDto): InventoryItem {
    return {
      sku: dto.itemCode,
      qty: dto.quantity,
      warehouseId: dto.warehouse,
    };
  }

  toErpOrderPayload(order: Order): ErpOrderPayloadDto {
    return {
      customerEmail: order.customer.email,
      customerName: order.customer.name,
      lines: order.items.map((item) => ({
        itemCode: item.sku,
        quantity: item.qty,
        unitPrice: item.price,
      })),
    };
  }
}
