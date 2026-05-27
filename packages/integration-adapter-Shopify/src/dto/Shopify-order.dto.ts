/**
 * Raw Shopify order payload.
 * Fields will be refined once the real API contract is confirmed.
 */
export interface ShopifyOrderDto {
  id?: string;
  name?: string;
  email?: string;
  raw?: unknown;
}
