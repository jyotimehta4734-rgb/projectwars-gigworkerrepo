/**
 * Fast LRU In-Memory Cache for query routing and repeated evaluations
 */

export class SimpleCache<T> {
  private store: Map<string, { value: T; expiresAt: number }> = new Map();
  private maxItems: number;
  private defaultTtlMs: number;

  constructor(maxItems = 500, defaultTtlMs = 1000 * 60 * 30) {
    this.maxItems = maxItems;
    this.defaultTtlMs = defaultTtlMs;
  }

  public get(key: string): T | null {
    const item = this.store.get(key);
    if (!item) return null;

    if (Date.now() > item.expiresAt) {
      this.store.delete(key);
      return null;
    }

    // Refresh LRU order
    this.store.delete(key);
    this.store.set(key, item);
    return item.value;
  }

  public set(key: string, value: T, ttlMs?: number): void {
    if (this.store.size >= this.maxItems) {
      const oldestKey = this.store.keys().next().value;
      if (oldestKey) this.store.delete(oldestKey);
    }

    this.store.set(key, {
      value,
      expiresAt: Date.now() + (ttlMs || this.defaultTtlMs),
    });
  }

  public clear(): void {
    this.store.clear();
  }
}

export const routeCache = new SimpleCache<any>(500);
export const companionCache = new SimpleCache<any>(500);
