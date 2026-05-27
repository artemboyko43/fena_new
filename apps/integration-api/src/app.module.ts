import { Module } from '@nestjs/common';
import { ErpAdapterModule } from '@company/integration-adapter-erp';
import { MagentoAdapterModule } from '@company/integration-adapter-magento';
import { IntegrationModule } from '@company/integration-nestjs';

@Module({
  imports: [
    IntegrationModule,
    MagentoAdapterModule.forRoot({
      baseUrl: process.env['MAGENTO_BASE_URL'] ?? '',
      accessToken: process.env['MAGENTO_ACCESS_TOKEN'] ?? '',
    }),
    ErpAdapterModule.forRoot({
      baseUrl: process.env['ERP_BASE_URL'] ?? '',
      apiKey: process.env['ERP_API_KEY'] ?? '',
    }),
  ],
})
export class AppModule {}
