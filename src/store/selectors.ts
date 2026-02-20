import { useGameStore } from './gameStore';
import { EventType } from '../types';

/**
 * 选择器：获取玩家属性
 */
export const usePlayerAttributes = () => {
  return useGameStore((state) => state.player?.attributes ?? null);
};

/**
 * 选择器：获取玩家年龄
 */
export const usePlayerAge = () => {
  return useGameStore((state) => state.player?.age ?? 0);
};

/**
 * 选择器：获取玩家人生阶段
 */
export const usePlayerStage = () => {
  return useGameStore((state) => state.player?.stage ?? null);
};

/**
 * 选择器：获取当前事件
 */
export const useCurrentEvent = () => {
  return useGameStore((state) => state.currentEvent);
};

/**
 * 选择器：获取游戏阶段
 */
export const useGamePhase = () => {
  return useGameStore((state) => state.gamePhase);
};

/**
 * 选择器：获取结局信息
 */
export const useEnding = () => {
  return useGameStore((state) => state.ending);
};

/**
 * 选择器：获取日志
 */
export const useLogs = () => {
  return useGameStore((state) => state.logs);
};

/**
 * 选择器：获取加载状态
 */
export const useIsLoading = () => {
  return useGameStore((state) => state.isLoading);
};

/**
 * 选择器：获取可用的标签类型（冷却为0的）
 */
export const useAvailableTags = () => {
  return useGameStore((state) => {
    const player = state.player;
    if (!player) return [];

    // 这里需要检查 tagCooldowns（如果 Player 类型已扩展）
    // 目前返回所有标签
    return Object.values(EventType);
  });
};

/**
 * 选择器：检查游戏是否结束
 */
export const useIsGameEnded = () => {
  return useGameStore((state) => state.gamePhase === 'ended');
};

/**
 * 选择器：获取玩家财富格式化
 */
export const useFormattedWealth = () => {
  return useGameStore((state) => {
    const wealth = state.player?.attributes.wealth ?? 0;
    if (wealth >= 10000) {
      return `${(wealth / 10000).toFixed(1)}万`;
    }
    return `${wealth}`;
  });
};

/**
 * 选择器：获取属性状态（健康/危险等）
 */
export const useAttributeStatus = () => {
  return useGameStore((state) => {
    const attrs = state.player?.attributes;
    if (!attrs) return {};

    return {
      health: attrs.health < 30 ? 'danger' : attrs.health > 80 ? 'excellent' : 'normal',
      intelligence: attrs.intelligence < 30 ? 'low' : attrs.intelligence > 80 ? 'high' : 'normal',
      charm: attrs.charm < 30 ? 'low' : attrs.charm > 80 ? 'high' : 'normal',
      happiness: attrs.happiness < 30 ? 'low' : attrs.happiness > 80 ? 'high' : 'normal',
      stress: attrs.stress > 70 ? 'danger' : attrs.stress < 20 ? 'relaxed' : 'normal',
    };
  });
};
