import { useState, useEffect, useCallback } from 'react';
import { Player, LogEntry, GameSettings } from '../types';
import { LifeStage, MaritalStatus, EducationLevel, CareerLevel } from '../types';
import { generateId, hasGameSave, loadGameForTopic, saveGameForTopic, clearSaveForTopic } from '../utils/gameUtils';
import { generateRandomAttributes } from '../utils/attributeUtils';
import { getCurrentStage } from '../utils/stageUtils';
import { DEFAULT_SETTINGS, STORAGE_KEYS } from '../constants';
import { cacheManager, CACHE_KEYS } from '../utils/cacheUtils';
import { endingEngine } from '../engine/endingEngine';
import { turnEngine } from '../engine/turnEngine';
import { educationService, AutoEducationResult } from '../services/educationService';
import type { Ending, EndingResult, EndingEvaluation } from '../types/ending';

/**
 * 游戏阶段
 */
export type GamePhase = 'start' | 'playing' | 'ended';

/**
 * 游戏状态管理 Hook
 * @param topicId 话题ID，用于存档隔离
 */
export function useGameState(topicId?: string) {
  const [player, setPlayer] = useState<Player | null>(null);
  const [gameStarted, setGameStarted] = useState(false);
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [settings, setSettings] = useState<GameSettings>(DEFAULT_SETTINGS);
  const [currentTopicId, setCurrentTopicId] = useState<string | null>(topicId || null);

  // 结局相关状态
  const [gamePhase, setGamePhase] = useState<GamePhase>('start');
  const [ending, setEnding] = useState<Ending | null>(null);
  const [endingResult, setEndingResult] = useState<EndingResult | null>(null);
  const [endingEvaluation, setEndingEvaluation] = useState<EndingEvaluation | null>(null);

  // 更新话题ID
  useEffect(() => {
    if (topicId && topicId !== currentTopicId) {
      setCurrentTopicId(topicId);
    }
  }, [topicId, currentTopicId]);

  // 加载设置
  useEffect(() => {
    const cachedSettings = cacheManager.get<GameSettings>(
      'game-settings',
      CACHE_KEYS.SETTINGS
    );
    if (cachedSettings) {
      setSettings(cachedSettings);
    } else {
      try {
        const oldSettings = localStorage.getItem(STORAGE_KEYS.SETTINGS);
        if (oldSettings) {
          const parsed = JSON.parse(oldSettings);
          setSettings(parsed);
          cacheManager.set('game-settings', parsed, {
            ttl: 0,
            useLocalStorage: true,
            storageKey: CACHE_KEYS.SETTINGS,
          });
        }
      } catch (error) {
        console.warn('加载设置失败:', error);
      }
    }
  }, []);

  // 自动保存游戏状态（按话题ID隔离）
  useEffect(() => {
    if (player && gameStarted && settings.autoSave && currentTopicId) {
      saveGameForTopic(currentTopicId, player, logs);
    }
  }, [player, logs, gameStarted, settings.autoSave, currentTopicId]);

  // 自动保存设置
  useEffect(() => {
    if (settings) {
      cacheManager.set('game-settings', settings, {
        ttl: 0,
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
      const tagCooldowns = turnEngine.initTagCooldowns();

      const newPlayer: Player = {
        name,
        age: 0,
        stage: LifeStage.CHILDHOOD,
        attributes: attributes || generateRandomAttributes(),
        education: EducationLevel.NONE,
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
        turn: 0,
        tagCooldowns,
        manualEventTriggersThisYear: 0,
        startDate: Date.now(),
        lastSaveDate: Date.now(),
      };

      setPlayer(newPlayer);
      setGameStarted(true);
      setGamePhase('playing');
      setLogs([]);
      setEnding(null);
      setEndingResult(null);
      setEndingEvaluation(null);
      // 欢迎消息由调用方添加，以便使用正确的话题名称
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
   */
  const updatePlayer = useCallback((
    updates: Partial<Player> | ((prev: Player | null) => Player | null)
  ) => {
    setPlayer((prev) => {
      if (!prev) return null;

      if (typeof updates === 'function') {
        const result = updates(prev);
        if (result) {
          result.lastSaveDate = Date.now();
        }
        return result;
      }

      const updated = { ...prev, ...updates };
      updated.lastSaveDate = Date.now();
      return updated;
    });
  }, []);

  /**
   * 年龄增长
   */
  const ageUp = useCallback((): AutoEducationResult | null => {
    if (!player) return null;

    const newAge = player.age + 1;
    const newStage = getCurrentStage(newAge);

    const tempPlayer = { ...player, age: newAge, stage: newStage };
    const educationResult = educationService.checkAutoEducationUpgrade(tempPlayer);

    const updates: Partial<Player> = {
      age: newAge,
      stage: newStage,
      manualEventTriggersThisYear: 0,
    };

    if (educationResult?.upgraded && educationResult.newLevel) {
      updates.education = educationResult.newLevel;
    }

    updatePlayer(updates);
    addLog('system', `你迎来了 ${newAge} 岁生日！`);

    if (educationResult?.upgraded && educationResult.message) {
      addLog('system', educationResult.message);
    }

    checkAndHandleEnding();

    return educationResult;
  }, [player, updatePlayer, addLog]);

  /**
   * 检查并处理结局
   */
  const checkAndHandleEnding = useCallback(() => {
    if (!player || gamePhase === 'ended') return;

    const hardEnding = endingEngine.checkHardEnding(player);
    if (hardEnding) {
      endGame(hardEnding);
      return;
    }

    const currentTurn = player.turn ?? 0;
    if (currentTurn >= 100) {
      const softEnding = endingEngine.evaluateSoftEnding(player);
      endGame(softEnding);
    }
  }, [player, gamePhase]);

  /**
   * 结束游戏
   */
  const endGame = useCallback((gameEnding: Ending) => {
    if (!player) return;

    const result = endingEngine.generateEndingResult(player, gameEnding);
    const evaluation = endingEngine.evaluatePlayer(player);

    setEnding(gameEnding);
    setEndingResult(result);
    setEndingEvaluation(evaluation);
    setGamePhase('ended');

    addLog('system', `🎮 游戏结束：${gameEnding.title}`);
  }, [player, addLog]);

  /**
   * 重置游戏（清除当前话题的存档）
   */
  const resetGame = useCallback(() => {
    // 清除 React 状态
    setPlayer(null);
    setGameStarted(false);
    setLogs([]);
    setGamePhase('start');
    setEnding(null);
    setEndingResult(null);
    setEndingEvaluation(null);

    // 清除当前话题的存档
    if (currentTopicId) {
      clearSaveForTopic(currentTopicId);
    }
  }, [currentTopicId]);

  /**
   * 检测是否有保存的游戏（按话题ID）
   */
  const checkHasSavedGame = useCallback((tid: string): boolean => {
    return hasGameSave(tid);
  }, []);

  /**
   * 加载保存的游戏（按话题ID）
   */
  const loadSavedGameForTopic = useCallback((tid: string): boolean => {
    const saved = loadGameForTopic(tid);
    if (saved) {
      setPlayer(saved.player);
      setLogs(saved.logs || []);
      setGameStarted(true);
      setGamePhase('playing');
      setCurrentTopicId(tid);
      return true;
    }
    return false;
  }, []);

  /**
   * 增加手动触发事件次数
   */
  const incrementManualTrigger = useCallback(() => {
    if (!player) return;
    const currentCount = player.manualEventTriggersThisYear ?? 0;
    updatePlayer({
      manualEventTriggersThisYear: currentCount + 1,
    });
  }, [player, updatePlayer]);

  /**
   * 更新玩家并检查结局
   */
  const updatePlayerAndCheckEnding = useCallback((
    updates: Partial<Player> | ((prev: Player) => Player)
  ) => {
    setPlayer((prev) => {
      if (!prev) return null;

      let updated: Player;
      if (typeof updates === 'function') {
        updated = updates(prev);
      } else {
        updated = { ...prev, ...updates };
      }
      updated.lastSaveDate = Date.now();

      const hardEnding = endingEngine.checkHardEnding(updated);
      if (hardEnding) {
        setTimeout(() => {
          const result = endingEngine.generateEndingResult(updated, hardEnding);
          const evaluation = endingEngine.evaluatePlayer(updated);
          setEnding(hardEnding);
          setEndingResult(result);
          setEndingEvaluation(evaluation);
          setGamePhase('ended');
        }, 0);
      }

      return updated;
    });
  }, []);

  return {
    player,
    setPlayer: updatePlayer,
    setPlayerAndCheckEnding: updatePlayerAndCheckEnding,
    gameStarted,
    setGameStarted,
    logs,
    addLog,
    settings,
    setSettings,
    createNewGame,
    ageUp,
    resetGame,
    incrementManualTrigger,
    // 存档相关（按话题ID）
    hasSavedGame: checkHasSavedGame,
    loadSavedGame: loadSavedGameForTopic,
    currentTopicId,
    // 结局相关
    gamePhase,
    ending,
    endingResult,
    endingEvaluation,
    checkAndHandleEnding,
  };
}
