import { Injectable, Logger } from '@nestjs/common';
import { SyncLogPort } from '@company/integration-core';

@Injectable()
export class ConsoleSyncLogAdapter implements SyncLogPort {
  private readonly logger = new Logger('SyncLog');

  async started(syncId: string, flow: string): Promise<void> {
    this.logger.log(`started  flow=${flow} syncId=${syncId}`);
  }

  async success(syncId: string): Promise<void> {
    this.logger.log(`success  syncId=${syncId}`);
  }

  async failed(syncId: string, error: unknown): Promise<void> {
    const message = error instanceof Error ? error.message : String(error);
    this.logger.error(`failed   syncId=${syncId} error=${message}`);
  }
}
