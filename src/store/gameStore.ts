import { create } from 'zustand';
import { Player, Event, LogEntry, GameSettings, EventType } from '../types';
import { LifeStage, MaritalStatus, EducationLevel, CareerLevel } from '../types';
import { generateRandomAttributes } from '../utils/attributeUtils';
import { getCurrentStage } from '../utils/stageUtils';
import { DEFAULT_SETTINGS } from '../constants';
import type { Ending } from '../types/ending';

/**
 * 游戏阶段
 */
export type GamePhase = 'start' | 'playing' | 'ended';

/**
 * 游戏状态接口
 */
interface GameState {
  // 玩家状态
  player: Player | null;

  // 当前事件
  currentEvent: Event | null;

  // 日志
  logs: LogEntry[];

  // 游戏设置
  settings: GameSettings;

  // 游戏阶段
  gamePhase: GamePhase;

  // 结局信息
  ending: Ending | null;

  // 加载状态
  isLoading: boolean;

  // Actions
  createGame: (name: string, attributes?: Player['attributes']) => void;
  updatePlayer: (updates: Partial<Player> | ((prev: Player) => Player)) => void;
  setCurrentEvent: (event: Event | null) => void;
  addLog: (type: LogEntry['type'], message: string, data?: unknown) => void;
  setSettings: (settings: GameSettings) => void;
  endGame: (ending: Ending) => void;
  resetGame: () => void;
  setLoading: (loading: boolean) => void;

  // 年龄增长
  ageUp: () => void;

  // 初始化标签冷却
  initTagCooldowns: () => Record<EventType, number>;
}

// 初始标签冷却
const initialTagCooldowns = (): Record<EventType, number> => ({
  [EventType.OPPORTUNITY]: 0,
  [EventType.CHALLENGE]: 0,
  [EventType.DAILY]: 0,
  [EventType.SPECIAL]: 0,
  [EventType.STAGE]: 0,
});

/**
 * 游戏状态 Store
 */
export const useGameStore = create<GameState>((set, get) => ({
  // 初始状态
  player: null,
  currentEvent: null,
  logs: [],
  settings: DEFAULT_SETTINGS,
  gamePhase: 'start',
  ending: null,
  isLoading: false,

  // 创建新游戏
  createGame: (name: string, attributes?: Player['attributes']) => {
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

    set({
      player: newPlayer,
      gamePhase: 'playing',
      logs: [{
        id: `log-${Date.now()}`,
        timestamp: Date.now(),
        type: 'system',
        message: `欢迎来到人生模拟器，${name}！`,
      }],
      ending: null,
    });
  },

  // 更新玩家
  updatePlayer: (updates) => {
    set((state) => {
      if (!state.player) return state;

      let updatedPlayer: Player;
      if (typeof updates === 'function') {
        updatedPlayer = updates(state.player);
      } else {
        updatedPlayer = { ...state.player, ...updates };
      }

      updatedPlayer.lastSaveDate = Date.now();

      return { player: updatedPlayer };
    });
  },

  // 设置当前事件
  setCurrentEvent: (event) => {
    set({ currentEvent: event });
  },

  // 添加日志
  addLog: (type, message, data) => {
    set((state) => ({
      logs: [
        ...state.logs,
        {
          id: `log-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          timestamp: Date.now(),
          type,
          message,
          data,
        },
      ],
    }));
  },

  // 设置游戏设置
  setSettings: (settings) => {
    set({ settings });
  },

  // 结束游戏
  endGame: (ending) => {
    set({
      gamePhase: 'ended',
      ending,
      currentEvent: null,
    });
  },

  // 重置游戏
  resetGame: () => {
    set({
      player: null,
      currentEvent: null,
      logs: [],
      gamePhase: 'start',
      ending: null,
      isLoading: false,
    });
  },

  // 设置加载状态
  setLoading: (loading) => {
    set({ isLoading: loading });
  },

  // 年龄增长
  ageUp: () => {
    const { player, updatePlayer, addLog } = get();
    if (!player) return;

    const newAge = player.age + 1;
    const newStage = getCurrentStage(newAge);

    updatePlayer({
      age: newAge,
      stage: newStage,
    });

    addLog('system', `你迎来了 ${newAge} 岁生日！`);
  },

  // 初始化标签冷却
  initTagCooldowns: initialTagCooldowns,
}));

export default useGameStore;
