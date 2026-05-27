import { Injectable } from '@nestjs/common';
import { InventoryItem, Order, Product } from '@company/integration-core';
import { ShopifyInventoryDto } from '../dto/Shopify-inventory.dto';
import { ShopifyProductDto } from '../dto/Shopify-product.dto';

@Injectable()
export class ShopifyMapper {
  toShopifyProduct(product: Product): ShopifyProductDto {
    // placeholder — extend when real Shopify schema is known
    return {
      sku: product.sku,
      name: product.name,
      enabled: true,
    };
  }

  toShopifyInventoryItem(item: InventoryItem): ShopifyInventoryDto {
    // placeholder — location mapping will be added in a future slice
    return {
      sku: item.sku,
      available: item.qty,
      locationId: item.warehouseId,
    };
  }

  toCoreProduct(raw: unknown): Product {
    // placeholder — real validation/parsing in a future slice
    const data = raw as Record<string, unknown>;
    return {
      sku: String(data['sku'] ?? ''),
      name: String(data['name'] ?? ''),
      price: Number(data['price'] ?? 0),
    };
  }

  toCoreOrder(raw: unknown): Order {
    // placeholder — real parsing in a future slice
    const data = raw as Record<string, unknown>;
    return {
      id: String(data['id'] ?? ''),
      items: [],
      customer: {
        email: String(data['email'] ?? ''),
        name: String(data['name'] ?? ''),
      },
      createdAt: new Date(),
    };
  }
}
