import { Injectable } from '@nestjs/common';
import axios, { AxiosInstance } from 'axios';
import {
  ErpCreateOrderResponseDto,
  ErpInventoryDto,
  ErpOrderPayloadDto,
  ErpProductDto,
} from './erp.dto';

export interface ErpClientConfig {
  baseUrl: string;
  apiKey: string;
}

@Injectable()
export class ErpClient {
  private readonly http: AxiosInstance;

  constructor(config: ErpClientConfig) {
    this.http = axios.create({
      baseURL: config.baseUrl,
      headers: { 'X-Api-Key': config.apiKey },
    });
  }

  async getProducts(updatedSince?: Date): Promise<ErpProductDto[]> {
    const params = updatedSince ? { updatedSince: updatedSince.toISOString() } : {};
    const response = await this.http.get<ErpProductDto[]>('/items', { params });
    return response.data;
  }

  async getInventory(warehouseIds?: string[]): Promise<ErpInventoryDto[]> {
    const params = warehouseIds?.length ? { warehouses: warehouseIds.join(',') } : {};
    const response = await this.http.get<ErpInventoryDto[]>('/inventory', { params });
    return response.data;
  }

  async createOrder(payload: ErpOrderPayloadDto): Promise<ErpCreateOrderResponseDto> {
    const response = await this.http.post<ErpCreateOrderResponseDto>('/orders', payload);
    return response.data;
  }
}
