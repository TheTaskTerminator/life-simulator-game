import { Player, GameSave, LogEntry } from '../types';
import { STORAGE_KEYS, GAME_VERSION } from '../constants';
import { cacheManager, CACHE_KEYS } from './cacheUtils';

/**
 * 保存游戏
 * 同时保存到 localStorage 和缓存系统
 */
export function saveGame(player: Player, logs: LogEntry[] = []): void {
  const save: GameSave = {
    player,
    logs,
    timestamp: Date.now(),
    version: GAME_VERSION,
  };

  try {
    // 保存到 localStorage（兼容旧版本）
    localStorage.setItem(STORAGE_KEYS.SAVE, JSON.stringify(save));
    
    // 同时保存到缓存系统（用于快速恢复）
    cacheManager.set('game-save', save, {
      ttl: 0, // 永不过期
      useLocalStorage: true,
      storageKey: CACHE_KEYS.GAME_STATE,
    });
  } catch (error) {
    console.error('保存游戏失败:', error);
  }
}

/**
 * 加载游戏
 * 优先从缓存系统加载，如果不存在则从 localStorage 加载
 */
export function loadGame(): GameSave | null {
  try {
    // 先尝试从缓存系统加载
    const cached = cacheManager.get<GameSave>(
      'game-save',
      CACHE_KEYS.GAME_STATE
    );
    if (cached) {
      return cached;
    }

    // 从 localStorage 加载（兼容旧版本）
    const data = localStorage.getItem(STORAGE_KEYS.SAVE);
    if (!data) return null;

    const parsed = JSON.parse(data) as GameSave;
    
    // 恢复到缓存系统
    cacheManager.set('game-save', parsed, {
      ttl: 0, // 永不过期
      useLocalStorage: true,
      storageKey: CACHE_KEYS.GAME_STATE,
    });
    
    return parsed;
  } catch (error) {
    console.error('加载游戏失败:', error);
    return null;
  }
}

/**
 * 清除存档
 * 同时清除 localStorage 和缓存
 */
export function clearSave(): void {
  try {
    // 清除 localStorage
    localStorage.removeItem(STORAGE_KEYS.SAVE);

    // 清除缓存
    cacheManager.delete('game-save', CACHE_KEYS.GAME_STATE);
  } catch (error) {
    console.error('清除存档失败:', error);
  }
}

// ============ 话题隔离存档函数 ============

/**
 * 获取话题对应的 localStorage 存储键
 */
function getSaveKey(topicId: string): string {
  return `${topicId}-save`;
}

/**
 * 获取话题对应的缓存键
 */
function getCacheKey(topicId: string): string {
  return `cache-${topicId}-state`;
}

/**
 * 保存游戏（按话题ID隔离）
 */
export function saveGameForTopic(topicId: string, player: Player, logs: LogEntry[] = []): void {
  const save: GameSave = {
    player,
    logs,
    timestamp: Date.now(),
    version: GAME_VERSION,
  };

  try {
    const saveKey = getSaveKey(topicId);
    const cacheKey = getCacheKey(topicId);

    // 保存到 localStorage
    localStorage.setItem(saveKey, JSON.stringify(save));

    // 保存到缓存系统
    cacheManager.set(`game-save-${topicId}`, save, {
      ttl: 0,
      useLocalStorage: true,
      storageKey: cacheKey,
    });
  } catch (error) {
    console.error(`保存游戏失败 (${topicId}):`, error);
  }
}

/**
 * 加载游戏（按话题ID隔离）
 */
export function loadGameForTopic(topicId: string): GameSave | null {
  try {
    const cacheKey = getCacheKey(topicId);
    const saveKey = getSaveKey(topicId);

    // 先尝试从缓存系统加载
    const cached = cacheManager.get<GameSave>(
      `game-save-${topicId}`,
      cacheKey
    );
    if (cached) {
      return cached;
    }

    // 从 localStorage 加载
    const data = localStorage.getItem(saveKey);
    if (!data) return null;

    const parsed = JSON.parse(data) as GameSave;

    // 恢复到缓存系统
    cacheManager.set(`game-save-${topicId}`, parsed, {
      ttl: 0,
      useLocalStorage: true,
      storageKey: cacheKey,
    });

    return parsed;
  } catch (error) {
    console.error(`加载游戏失败 (${topicId}):`, error);
    return null;
  }
}

/**
 * 检测是否有存档（按话题ID隔离）
 */
export function hasGameSave(topicId: string): boolean {
  const cacheKey = getCacheKey(topicId);
  const saveKey = getSaveKey(topicId);

  // 检查缓存
  const cached = cacheManager.get(`game-save-${topicId}`, cacheKey);
  if (cached) return true;

  // 检查 localStorage
  const data = localStorage.getItem(saveKey);
  return !!data;
}

/**
 * 清除存档（按话题ID隔离）
 */
export function clearSaveForTopic(topicId: string): void {
  try {
    const saveKey = getSaveKey(topicId);
    const cacheKey = getCacheKey(topicId);

    // 清除 localStorage
    localStorage.removeItem(saveKey);

    // 清除缓存
    cacheManager.delete(`game-save-${topicId}`, cacheKey);
  } catch (error) {
    console.error(`清除存档失败 (${topicId}):`, error);
  }
}

/**
 * 生成唯一 ID
 */
export function generateId(prefix = 'id'): string {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * 格式化数字
 */
export function formatNumber(num: number): string {
  if (num >= 100000000) {
    return `${(num / 100000000).toFixed(2)}亿`;
  }
  if (num >= 10000) {
    return `${(num / 10000).toFixed(2)}万`;
  }
  return num.toLocaleString('zh-CN');
}

/**
 * 格式化日期
 */
export function formatDate(timestamp: number): string {
  const date = new Date(timestamp);
  return date.toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

