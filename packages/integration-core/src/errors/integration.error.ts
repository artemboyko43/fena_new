export class IntegrationError extends Error {
  constructor(
    message: string,
    public readonly cause?: unknown,
  ) {
    super(message);
    this.name = 'IntegrationError';
  }
}

export class SyncFailedError extends IntegrationError {
  constructor(
    public readonly syncId: string,
    public readonly flow: string,
    cause?: unknown,
  ) {
    super(`Sync failed: ${flow} (syncId=${syncId})`, cause);
    this.name = 'SyncFailedError';
  }
}
