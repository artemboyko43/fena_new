/**
 * Raw Shopify product payload.
 * Fields will be refined once the real API contract is confirmed.
 */
export interface ShopifyProductDto {
  sku: string;
  name?: string;
  enabled?: boolean;
  raw?: unknown;
}
