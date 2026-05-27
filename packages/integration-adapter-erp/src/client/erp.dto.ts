export interface ErpProductDto {
  itemCode: string;
  itemName: string;
  salePrice: number;
  description?: string;
}

export interface ErpInventoryDto {
  itemCode: string;
  quantity: number;
  warehouse?: string;
}

export interface ErpOrderLineDto {
  itemCode: string;
  quantity: number;
  unitPrice: number;
}

export interface ErpOrderPayloadDto {
  customerEmail: string;
  customerName: string;
  lines: ErpOrderLineDto[];
}

export interface ErpCreateOrderResponseDto {
  orderId: string;
}
