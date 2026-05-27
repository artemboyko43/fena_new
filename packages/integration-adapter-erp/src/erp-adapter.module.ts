import { DynamicModule, Module } from '@nestjs/common';
import { ERP_PORT } from '@company/integration-nestjs';
import { ErpAdapter } from './adapter/erp.adapter';
import { ErpClient, ErpClientConfig } from './client/erp.client';
import { ErpMapper } from './mapper/erp.mapper';

const ERP_CONFIG = Symbol('ERP_CONFIG');

@Module({})
export class ErpAdapterModule {
  static forRoot(config: ErpClientConfig): DynamicModule {
    return {
      module: ErpAdapterModule,
      providers: [
        { provide: ERP_CONFIG, useValue: config },
        {
          provide: ErpClient,
          useFactory: (cfg: ErpClientConfig) => new ErpClient(cfg),
          inject: [ERP_CONFIG],
        },
        ErpMapper,
        { provide: ERP_PORT, useClass: ErpAdapter },
      ],
      exports: [ERP_PORT],
    };
  }
}
