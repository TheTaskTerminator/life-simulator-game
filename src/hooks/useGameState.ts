import { useState, useEffect, useCallback } from 'react';
import { Player, LogEntry, GameSettings } from '../types';
import { LifeStage, MaritalStatus, EducationLevel, CareerLevel } from '../types';
import { loadGame, saveGame, generateId } from '../utils/gameUtils';
import { generateRandomAttributes } from '../utils/attributeUtils';
import { getCurrentStage } from '../utils/stageUtils';
import { DEFAULT_SETTINGS, STORAGE_KEYS } from '../constants';
import { cacheManager, CACHE_KEYS } from '../utils/cacheUtils';

/**
 * 游戏状态管理 Hook
 */
export function useGameState() {
  const [player, setPlayer] = useState<Player | null>(null);
  const [gameStarted, setGameStarted] = useState(false);
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [settings, setSettings] = useState<GameSettings>(DEFAULT_SETTINGS);

  // 加载存档和设置
  useEffect(() => {
    // 加载游戏存档
    const saved = loadGame();
    if (saved) {
      setPlayer(saved.player);
      setLogs(saved.logs || []);
      setGameStarted(true);
    }

    // 加载设置（从缓存）
    const cachedSettings = cacheManager.get<GameSettings>(
      'game-settings',
      CACHE_KEYS.SETTINGS
    );
    if (cachedSettings) {
      setSettings(cachedSettings);
    } else {
      // 尝试从 localStorage 加载旧格式的设置
      try {
        const oldSettings = localStorage.getItem(STORAGE_KEYS.SETTINGS);
        if (oldSettings) {
          const parsed = JSON.parse(oldSettings);
          setSettings(parsed);
          // 迁移到新的缓存系统
          cacheManager.set('game-settings', parsed, {
            ttl: 0, // 永不过期
            useLocalStorage: true,
            storageKey: CACHE_KEYS.SETTINGS,
          });
        }
      } catch (error) {
        console.warn('加载设置失败:', error);
      }
    }
  }, []);

  // 自动保存游戏状态
  useEffect(() => {
    if (player && gameStarted && settings.autoSave) {
      saveGame(player, logs);
      
      // 同时缓存到缓存系统（用于快速恢复）
      cacheManager.set('game-state', { player, logs }, {
        ttl: 0, // 永不过期
        useLocalStorage: true,
        storageKey: CACHE_KEYS.GAME_STATE,
      });
    }
  }, [player, logs, gameStarted, settings.autoSave]);

  // 自动保存设置
  useEffect(() => {
    if (settings) {
      cacheManager.set('game-settings', settings, {
        ttl: 0, // 永不过期
        useLocalStorage: true,
        storageKey: CACHE_KEYS.SETTINGS,
      });
    }
  }, [settings]);

  /**
   * 创建新游戏
   */
  const createNewGame = useCallback(
    (name: string, attributes?: Player['attributes']) => {
      const newPlayer: Player = {
        name,
        age: 0,
        stage: LifeStage.CHILDHOOD,
        attributes: attributes || generateRandomAttributes(),
        education: EducationLevel.PRIMARY,
        career: null,
        careerLevel: CareerLevel.ENTRY,
        maritalStatus: MaritalStatus.SINGLE,
        partner: null,
        children: [],
        parents: [],
        friends: [],
        properties: [],
        vehicles: [],
        investments: [],
        achievements: [],
        currentEvent: null,
        eventHistory: [],
        choices: [],
        startDate: Date.now(),
        lastSaveDate: Date.now(),
      };

      setPlayer(newPlayer);
      setGameStarted(true);
      setLogs([]);
      addLog('system', `欢迎来到人生模拟器，${name}！`);
    },
    []
  );

  /**
   * 添加日志
   */
  const addLog = useCallback(
    (type: LogEntry['type'], message: string, data?: unknown) => {
      const log: LogEntry = {
        id: generateId('log'),
        timestamp: Date.now(),
        type,
        message,
        data,
      };
      setLogs((prev) => [...prev, log]);
    },
    []
  );

  /**
   * 更新玩家
   * 支持两种形式：
   * 1. 直接传入 Partial<Player>
   * 2. 传入函数 (prev: Player) => Player
   */
  const updatePlayer = useCallback((
    updates: Partial<Player> | ((prev: Player | null) => Player | null)
  ) => {
    setPlayer((prev) => {
      if (!prev) return null;
      
      // 如果是函数，直接调用
      if (typeof updates === 'function') {
        const result = updates(prev);
        if (result) {
          result.lastSaveDate = Date.now();
        }
        return result;
      }
      
      // 否则合并更新
      const updated = { ...prev, ...updates };
      updated.lastSaveDate = Date.now();
      return updated;
    });
  }, []);

  /**
   * 年龄增长
   */
  const ageUp = useCallback(() => {
    if (!player) return;

    const newAge = player.age + 1;
    const newStage = getCurrentStage(newAge);

    updatePlayer({
      age: newAge,
      stage: newStage,
    });

    addLog('system', `你迎来了 ${newAge} 岁生日！`);
  }, [player, updatePlayer, addLog]);

  /**
   * 重置游戏
   */
  const resetGame = useCallback(() => {
    setPlayer(null);
    setGameStarted(false);
    setLogs([]);
  }, []);

  return {
    player,
    setPlayer: updatePlayer,
    gameStarted,
    setGameStarted,
    logs,
    addLog,
    settings,
    setSettings,
    createNewGame,
    ageUp,
    resetGame,
  };
}

