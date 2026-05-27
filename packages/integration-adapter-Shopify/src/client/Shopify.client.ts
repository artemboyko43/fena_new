import { Injectable } from '@nestjs/common';

export interface ShopifyClientConfig {
  shopDomain: string;
  accessToken: string;
}

@Injectable()
export class ShopifyClient {
  async getProducts(params: unknown): Promise<unknown[]> {
    // TODO: implement Shopify REST / GraphQL API call
    void params;
    return [];
  }

  async updateProducts(payload: unknown[]): Promise<void> {
    // TODO: implement Shopify REST / GraphQL API call
    void payload;
  }

  async updateInventory(payload: unknown[]): Promise<void> {
    // TODO: implement Shopify inventory level update
    void payload;
  }

  async getOrders(params: unknown): Promise<unknown[]> {
    // TODO: implement Shopify orders API call
    void params;
    return [];
  }
}
