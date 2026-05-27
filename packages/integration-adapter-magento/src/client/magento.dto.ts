export interface MagentoProductDto {
  sku: string;
  name: string;
  price: number;
  custom_attributes?: Array<{ attribute_code: string; value: string }>;
}

export interface MagentoInventoryDto {
  sku: string;
  qty: number;
  source_code?: string;
}

export interface MagentoOrderItemDto {
  sku: string;
  qty_ordered: number;
  price: number;
}

export interface MagentoOrderDto {
  increment_id: string;
  items: MagentoOrderItemDto[];
  customer_email: string;
  customer_firstname: string;
  customer_lastname: string;
  created_at: string;
}
