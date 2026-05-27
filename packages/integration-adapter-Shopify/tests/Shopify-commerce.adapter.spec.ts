import { InventoryItem, Product, SyncOrdersCommand } from '@company/integration-core';
import { ShopifyCommerceAdapter } from '../src/adapter/Shopify-commerce.adapter';
import { ShopifyClient } from '../src/client/Shopify.client';
import { ShopifyMapper } from '../src/mapper/Shopify.mapper';

describe('ShopifyCommerceAdapter', () => {
  let adapter: ShopifyCommerceAdapter;
  let client: jest.Mocked<ShopifyClient>;
  let mapper: ShopifyMapper;

  const mockProducts: Product[] = [
    { sku: 'SKU-001', name: 'Widget', price: 29.99 },
    { sku: 'SKU-002', name: 'Gadget', price: 9.99 },
  ];

  const mockItems: InventoryItem[] = [
    { sku: 'SKU-001', qty: 50 },
    { sku: 'SKU-002', qty: 0, warehouseId: 'WH-A' },
  ];

  beforeEach(() => {
    client = {
      getProducts: jest.fn().mockResolvedValue([]),
      updateProducts: jest.fn().mockResolvedValue(undefined),
      updateInventory: jest.fn().mockResolvedValue(undefined),
      getOrders: jest.fn().mockResolvedValue([]),
    } as jest.Mocked<ShopifyClient>;

    mapper = new ShopifyMapper();
    adapter = new ShopifyCommerceAdapter(client, mapper);
  });

  it('implements all methods required by CommercePort', () => {
    expect(typeof adapter.updateProducts).toBe('function');
    expect(typeof adapter.updateInventory).toBe('function');
    expect(typeof adapter.getOrders).toBe('function');
  });

  describe('updateProducts', () => {
    it('calls ShopifyClient.updateProducts', async () => {
      await adapter.updateProducts(mockProducts);

      expect(client.updateProducts).toHaveBeenCalledTimes(1);
    });

    it('passes a payload array of the same length as the input', async () => {
      await adapter.updateProducts(mockProducts);

      const [payload] = client.updateProducts.mock.calls[0] as [unknown[]];
      expect(payload).toHaveLength(mockProducts.length);
    });
  });

  describe('updateInventory', () => {
    it('calls ShopifyClient.updateInventory', async () => {
      await adapter.updateInventory(mockItems);

      expect(client.updateInventory).toHaveBeenCalledTimes(1);
    });

    it('passes a payload array of the same length as the input', async () => {
      await adapter.updateInventory(mockItems);

      const [payload] = client.updateInventory.mock.calls[0] as [unknown[]];
      expect(payload).toHaveLength(mockItems.length);
    });
  });

  describe('getOrders', () => {
    it('returns an empty array', async () => {
      const command: SyncOrdersCommand = { syncId: 'sync-1' };

      const result = await adapter.getOrders(command);

      expect(result).toEqual([]);
    });

    it('does not call ShopifyClient.getOrders (not yet implemented)', async () => {
      const command: SyncOrdersCommand = { syncId: 'sync-1' };

      await adapter.getOrders(command);

      expect(client.getOrders).not.toHaveBeenCalled();
    });
  });
});
