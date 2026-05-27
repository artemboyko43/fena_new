export const SYNC_FLOWS = {
  ERP_PRODUCTS_TO_COMMERCE: 'erp_products_to_commerce',
  ERP_INVENTORY_TO_COMMERCE: 'erp_inventory_to_commerce',
  COMMERCE_ORDERS_TO_ERP: 'commerce_orders_to_erp',
} as const;

export type SyncFlow = (typeof SYNC_FLOWS)[keyof typeof SYNC_FLOWS];
