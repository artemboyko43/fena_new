import { Injectable } from '@nestjs/common';
import axios, { AxiosInstance } from 'axios';
import { MagentoInventoryDto, MagentoOrderDto, MagentoProductDto } from './magento.dto';

export interface MagentoClientConfig {
  baseUrl: string;
  accessToken: string;
}

@Injectable()
export class MagentoClient {
  private readonly http: AxiosInstance;

  constructor(config: MagentoClientConfig) {
    this.http = axios.create({
      baseURL: config.baseUrl,
      headers: { Authorization: `Bearer ${config.accessToken}` },
    });
  }

  async putProducts(products: MagentoProductDto[]): Promise<void> {
    // PUT /rest/V1/products/:sku for each product
    for (const product of products) {
      await this.http.put(`/rest/V1/products/${product.sku}`, { product });
    }
  }

  async putInventory(items: MagentoInventoryDto[]): Promise<void> {
    // POST /rest/V1/inventory/source-items
    await this.http.post('/rest/V1/inventory/source-items', { sourceItems: items });
  }

  async getOrders(from?: Date, to?: Date): Promise<MagentoOrderDto[]> {
    // GET /rest/V1/orders with searchCriteria filters
    const params = new URLSearchParams();
    if (from) {
      params.append('searchCriteria[filter_groups][0][filters][0][field]', 'created_at');
      params.append('searchCriteria[filter_groups][0][filters][0][value]', from.toISOString());
      params.append('searchCriteria[filter_groups][0][filters][0][condition_type]', 'gteq');
    }
    if (to) {
      params.append('searchCriteria[filter_groups][1][filters][0][field]', 'created_at');
      params.append('searchCriteria[filter_groups][1][filters][0][value]', to.toISOString());
      params.append('searchCriteria[filter_groups][1][filters][0][condition_type]', 'lteq');
    }

    const response = await this.http.get<{ items: MagentoOrderDto[] }>('/rest/V1/orders', {
      params,
    });
    return response.data.items;
  }
}
