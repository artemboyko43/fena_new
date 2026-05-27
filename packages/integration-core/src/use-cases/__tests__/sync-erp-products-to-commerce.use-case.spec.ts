import { CommercePort } from '../../ports/commerce.port';
import { ErpPort } from '../../ports/erp.port';
import { SyncLogPort } from '../../ports/sync-log.port';
import { Product } from '../../models/product';
import { SyncErpProductsToCommerceUseCase } from '../sync-erp-products-to-commerce.use-case';

describe('SyncErpProductsToCommerceUseCase', () => {
  let useCase: SyncErpProductsToCommerceUseCase;
  let erpPort: jest.Mocked<ErpPort>;
  let commercePort: jest.Mocked<CommercePort>;
  let syncLogPort: jest.Mocked<SyncLogPort>;

  const mockProducts: Product[] = [
    { sku: 'SKU-001', name: 'Test Product', price: 99.99 },
  ];

  beforeEach(() => {
    erpPort = {
      getProducts: jest.fn().mockResolvedValue(mockProducts),
      getInventory: jest.fn(),
      createOrder: jest.fn(),
    };

    commercePort = {
      updateProducts: jest.fn().mockResolvedValue(undefined),
      updateInventory: jest.fn(),
      getOrders: jest.fn(),
    };

    syncLogPort = {
      started: jest.fn().mockResolvedValue(undefined),
      success: jest.fn().mockResolvedValue(undefined),
      failed: jest.fn().mockResolvedValue(undefined),
    };

    useCase = new SyncErpProductsToCommerceUseCase(erpPort, commercePort, syncLogPort);
  });

  it('fetches products from ERP and pushes them to Commerce', async () => {
    await useCase.execute({ syncId: 'sync-1' });

    expect(erpPort.getProducts).toHaveBeenCalledWith({ syncId: 'sync-1' });
    expect(commercePort.updateProducts).toHaveBeenCalledWith(mockProducts);
    expect(syncLogPort.success).toHaveBeenCalledWith('sync-1');
  });

  it('logs failure and re-throws when ERP call fails', async () => {
    const error = new Error('ERP unavailable');
    erpPort.getProducts.mockRejectedValue(error);

    await expect(useCase.execute({ syncId: 'sync-1' })).rejects.toThrow('ERP unavailable');

    expect(syncLogPort.failed).toHaveBeenCalledWith('sync-1', error);
    expect(syncLogPort.success).not.toHaveBeenCalled();
  });
});
