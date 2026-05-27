import { Injectable } from '@nestjs/common';
import { IdempotencyPort } from '@company/integration-core';

/**
 * In-memory idempotency store.
 * Resets on every restart — replace with a persistent adapter (Redis, DB) for production.
 */
@Injectable()
export class InMemoryIdempotencyAdapter implements IdempotencyPort {
  private readonly processed = new Set<string>();

  async isProcessed(key: string): Promise<boolean> {
    return this.processed.has(key);
  }

  async markProcessed(key: string): Promise<void> {
    this.processed.add(key);
  }
}
