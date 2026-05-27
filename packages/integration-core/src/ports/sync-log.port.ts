export interface SyncLogPort {
  started(syncId: string, flow: string): Promise<void>;
  success(syncId: string): Promise<void>;
  failed(syncId: string, error: unknown): Promise<void>;
}
