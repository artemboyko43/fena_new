import { InventoryItem, Product } from '@company/integration-core';
import { ShopifyMapper } from '../src/mapper/Shopify.mapper';

describe('ShopifyMapper', () => {
  let mapper: ShopifyMapper;

  beforeEach(() => {
    mapper = new ShopifyMapper();
  });

  describe('toShopifyProduct', () => {
    it('maps a canonical Product to a Shopify payload', () => {
      const product: Product = { sku: 'SKU-001', name: 'Widget', price: 29.99 };

      const result = mapper.toShopifyProduct(product);

      expect(result).toBeDefined();
      expect(result.sku).toBe('SKU-001');
      expect(result.name).toBe('Widget');
    });

    it('preserves sku from the canonical model', () => {
      const product: Product = { sku: 'UNIQUE-SKU', name: 'Thing', price: 1 };

      const result = mapper.toShopifyProduct(product);

      expect(result.sku).toBe('UNIQUE-SKU');
    });
  });

  describe('toShopifyInventoryItem', () => {
    it('maps a canonical InventoryItem to a Shopify payload', () => {
      const item: InventoryItem = { sku: 'SKU-001', qty: 42 };

      const result = mapper.toShopifyInventoryItem(item);

      expect(result).toBeDefined();
      expect(result.sku).toBe('SKU-001');
      expect(result.available).toBe(42);
    });

    it('passes through the optional warehouseId as locationId', () => {
      const item: InventoryItem = { sku: 'SKU-002', qty: 10, warehouseId: 'WH-A' };

      const result = mapper.toShopifyInventoryItem(item);

      expect(result.locationId).toBe('WH-A');
    });
  });
});
