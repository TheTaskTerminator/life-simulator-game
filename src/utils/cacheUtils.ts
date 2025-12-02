/**
 * 缓存工具
 * 支持内存缓存和 localStorage 持久化缓存
 * 
 * 特性：
 * - 内存缓存：快速访问
 * - localStorage 持久化：页面刷新后仍然有效
 * - 自动过期：支持 TTL（Time To Live）
 * - 自动清理：定期清理过期缓存
 */

interface CacheItem<T> {
  data: T;
  timestamp: number;
  expiresAt?: number; // 过期时间戳（可选）
}

interface CacheOptions {
  ttl?: number; // 缓存时间（毫秒），0 表示永不过期
  useLocalStorage?: boolean; // 是否使用 localStorage 持久化
  storageKey?: string; // localStorage 键名
}

/**
 * 缓存管理器
 */
class CacheManager {
  private memoryCache = new Map<string, CacheItem<any>>();
  private readonly DEFAULT_TTL = 24 * 60 * 60 * 1000; // 默认 24 小时

  /**
   * 设置缓存
   */
  set<T>(key: string, data: T, options: CacheOptions = {}): void {
    const {
      ttl = this.DEFAULT_TTL,
      useLocalStorage = false,
      storageKey = key,
    } = options;

    const timestamp = Date.now();
    const expiresAt = ttl > 0 ? timestamp + ttl : undefined;

    const cacheItem: CacheItem<T> = {
      data,
      timestamp,
      expiresAt,
    };

    // 内存缓存
    this.memoryCache.set(key, cacheItem);

    // localStorage 缓存
    if (useLocalStorage && typeof window !== 'undefined') {
      try {
        localStorage.setItem(
          storageKey,
          JSON.stringify({
            ...cacheItem,
            _cacheVersion: '1.0',
          })
        );
      } catch (error) {
        console.warn(`缓存到 localStorage 失败 (${storageKey}):`, error);
        // 如果存储空间不足，尝试清理过期缓存后重试
        this.cleanExpired();
        try {
          localStorage.setItem(
            storageKey,
            JSON.stringify({
              ...cacheItem,
              _cacheVersion: '1.0',
            })
          );
        } catch (retryError) {
          console.error(`重试缓存失败 (${storageKey}):`, retryError);
        }
      }
    }
  }

  /**
   * 获取缓存
   */
  get<T>(key: string, storageKey?: string): T | null {
    // 先尝试从内存缓存获取
    const memoryItem = this.memoryCache.get(key);
    if (memoryItem) {
      if (this.isExpired(memoryItem)) {
        this.memoryCache.delete(key);
        return null;
      }
      return memoryItem.data as T;
    }

    // 尝试从 localStorage 获取
    if (typeof window !== 'undefined') {
      try {
        const storageKeyToUse = storageKey || key;
        const stored = localStorage.getItem(storageKeyToUse);
        if (stored) {
          const parsed = JSON.parse(stored);
          const cacheItem: CacheItem<T> = {
            data: parsed.data,
            timestamp: parsed.timestamp,
            expiresAt: parsed.expiresAt,
          };
          
          // 检查是否过期
          if (this.isExpired(cacheItem)) {
            localStorage.removeItem(storageKeyToUse);
            return null;
          }

          // 恢复到内存缓存
          this.memoryCache.set(key, cacheItem);
          return cacheItem.data;
        }
      } catch (error) {
        console.warn(`从 localStorage 读取缓存失败 (${storageKey || key}):`, error);
      }
    }

    return null;
  }

  /**
   * 检查缓存是否存在且未过期
   */
  has(key: string, storageKey?: string): boolean {
    return this.get(key, storageKey) !== null;
  }

  /**
   * 删除缓存
   */
  delete(key: string, storageKey?: string): void {
    // 删除内存缓存
    this.memoryCache.delete(key);

    // 删除 localStorage 缓存
    if (typeof window !== 'undefined') {
      try {
        const storageKeyToUse = storageKey || key;
        localStorage.removeItem(storageKeyToUse);
      } catch (error) {
        console.warn(`删除 localStorage 缓存失败 (${storageKey || key}):`, error);
      }
    }
  }

  /**
   * 清空所有缓存
   */
  clear(): void {
    this.memoryCache.clear();
    
    if (typeof window !== 'undefined') {
      try {
        // 清空所有以 'cache-' 开头的 localStorage 项
        const keys = Object.keys(localStorage);
        keys.forEach((key) => {
          if (key.startsWith('cache-')) {
            localStorage.removeItem(key);
          }
        });
      } catch (error) {
        console.warn('清空 localStorage 缓存失败:', error);
      }
    }
  }

  /**
   * 检查缓存项是否过期
   */
  private isExpired(item: CacheItem<any>): boolean {
    if (!item.expiresAt) {
      return false; // 永不过期
    }
    return Date.now() > item.expiresAt;
  }

  /**
   * 清理过期缓存
   */
  cleanExpired(): void {
    // 清理内存缓存
    const now = Date.now();
    for (const [key, item] of this.memoryCache.entries()) {
      if (item.expiresAt && now > item.expiresAt) {
        this.memoryCache.delete(key);
      }
    }

    // 清理 localStorage 缓存
    if (typeof window !== 'undefined') {
      try {
        const keys = Object.keys(localStorage);
        keys.forEach((key) => {
          if (key.startsWith('cache-')) {
            try {
              const parsed = JSON.parse(localStorage.getItem(key) || '{}');
              const item: CacheItem<any> = {
                data: parsed.data,
                timestamp: parsed.timestamp,
                expiresAt: parsed.expiresAt,
              };
              if (item.expiresAt && Date.now() > item.expiresAt) {
                localStorage.removeItem(key);
              }
            } catch {
              // 忽略解析错误
            }
          }
        });
      } catch (error) {
        console.warn('清理过期缓存失败:', error);
      }
    }
  }

  /**
   * 获取缓存统计信息
   */
  getStats() {
    return {
      memoryCacheSize: this.memoryCache.size,
      localStorageSize: this.getLocalStorageCacheSize(),
    };
  }

  /**
   * 获取 localStorage 缓存大小
   */
  private getLocalStorageCacheSize(): number {
    if (typeof window === 'undefined') return 0;
    
    try {
      return Object.keys(localStorage).filter((key) =>
        key.startsWith('cache-')
      ).length;
    } catch {
      return 0;
    }
  }
}

// 导出单例
export const cacheManager = new CacheManager();

// 定期清理过期缓存（每 10 分钟）
if (typeof window !== 'undefined') {
  setInterval(() => {
    cacheManager.cleanExpired();
  }, 10 * 60 * 1000);
  
  // 页面加载时清理一次
  cacheManager.cleanExpired();
}

/**
 * 缓存键名常量
 */
export const CACHE_KEYS = {
  AI_CONFIG: 'cache-ai-config',
  AI_EVENTS: 'cache-ai-events',
  GAME_STATE: 'cache-game-state',
  SETTINGS: 'cache-settings',
} as const;
