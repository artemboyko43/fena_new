import { Injectable } from '@nestjs/common';
import { InventoryItem, Order, Product } from '@company/integration-core';
import { MagentoInventoryDto, MagentoOrderDto, MagentoProductDto } from '../client/magento.dto';

@Injectable()
export class MagentoMapper {
  toMagentoProduct(product: Product): MagentoProductDto {
    return {
      sku: product.sku,
      name: product.name,
      price: product.price,
    };
  }

  toMagentoInventory(item: InventoryItem): MagentoInventoryDto {
    return {
      sku: item.sku,
      qty: item.qty,
      source_code: item.warehouseId ?? 'default',
    };
  }

  toOrder(dto: MagentoOrderDto): Order {
    return {
      id: dto.increment_id,
      items: dto.items.map((item) => ({
        sku: item.sku,
        qty: item.qty_ordered,
        price: item.price,
      })),
      customer: {
        email: dto.customer_email,
        name: `${dto.customer_firstname} ${dto.customer_lastname}`.trim(),
      },
      createdAt: new Date(dto.created_at),
    };
  }
}
