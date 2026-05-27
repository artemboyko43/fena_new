export interface IdempotencyPort {
  isProcessed(key: string): Promise<boolean>;
  markProcessed(key: string): Promise<void>;
}
