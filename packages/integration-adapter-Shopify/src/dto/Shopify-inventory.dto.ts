/**
 * Raw Shopify inventory level payload.
 * Fields will be refined once the real API contract is confirmed.
 */
export interface ShopifyInventoryDto {
  sku: string;
  available?: number;
  locationId?: string;
  raw?: unknown;
}
