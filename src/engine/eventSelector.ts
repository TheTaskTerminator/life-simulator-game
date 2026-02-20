import { Player, EventType } from '../types';
import { turnEngine } from './turnEngine';

/**
 * 事件选择器
 * 基于标签冷却机制选择可用事件
 */
export class EventSelector {
  /**
   * 获取可用的事件标签
   */
  getAvailableTags(player: Player): EventType[] {
    return turnEngine.getAvailableTags(player);
  }

  /**
   * 获取冷却中的标签
   */
  getCooldownTags(player: Player): Array<{ tag: EventType; remaining: number }> {
    return turnEngine.getCooldownTags(player);
  }

  /**
   * 选择一个随机可用标签
   * 如果没有可用标签，返回 DAILY（冷却为0）
   */
  selectRandomAvailableTag(player: Player): EventType {
    const availableTags = this.getAvailableTags(player);

    if (availableTags.length === 0) {
      // 所有标签都在冷却，使用 DAILY
      return EventType.DAILY;
    }

    // 随机选择一个
    const randomIndex = Math.floor(Math.random() * availableTags.length);
    return availableTags[randomIndex];
  }

  /**
   * 根据玩家状态智能选择事件类型
   */
  selectSmartEventType(player: Player): EventType {
    const availableTags = this.getAvailableTags(player);

    if (availableTags.length === 0) {
      return EventType.DAILY;
    }

    const { health, happiness, stress, wealth } = player.attributes;

    // 根据玩家状态决定事件类型权重
    const weights: Record<EventType, number> = {
      [EventType.OPPORTUNITY]: 1,
      [EventType.CHALLENGE]: 1,
      [EventType.DAILY]: 2,
      [EventType.SPECIAL]: 0.1,
      [EventType.STAGE]: 0,
    };

    // 健康低时减少挑战事件
    if (health < 30) {
      weights[EventType.CHALLENGE] *= 0.3;
    }

    // 压力高时减少挑战事件
    if (stress > 70) {
      weights[EventType.CHALLENGE] *= 0.5;
      weights[EventType.OPPORTUNITY] *= 1.5;
    }

    // 幸福低时增加机遇事件
    if (happiness < 30) {
      weights[EventType.OPPORTUNITY] *= 1.5;
    }

    // 财富低时增加机遇事件
    if (wealth < 1000) {
      weights[EventType.OPPORTUNITY] *= 1.3;
    }

    // 过滤可用标签并计算总权重
    const availableWeights = availableTags
      .filter((tag) => weights[tag] !== undefined)
      .map((tag) => ({ tag, weight: weights[tag] }));

    if (availableWeights.length === 0) {
      return EventType.DAILY;
    }

    const totalWeight = availableWeights.reduce((sum, item) => sum + item.weight, 0);
    let random = Math.random() * totalWeight;

    for (const item of availableWeights) {
      random -= item.weight;
      if (random <= 0) {
        return item.tag;
      }
    }

    return availableWeights[0].tag;
  }

  /**
   * 记录事件触发（设置冷却）
   */
  recordEventTriggered(player: Player, eventType: EventType): Player {
    return turnEngine.setCooldown(player, eventType);
  }

  /**
   * 检查事件是否可用
   */
  isEventAvailable(player: Player, eventType: EventType): boolean {
    return turnEngine.isTagAvailable(player, eventType);
  }

  /**
   * 获取冷却描述
   */
  getCooldownDescription(player: Player): string {
    const cooldownTags = this.getCooldownTags(player);

    if (cooldownTags.length === 0) {
      return '所有事件类型可用';
    }

    const tagNames: Record<EventType, string> = {
      [EventType.OPPORTUNITY]: '机遇',
      [EventType.CHALLENGE]: '挑战',
      [EventType.DAILY]: '日常',
      [EventType.SPECIAL]: '特殊',
      [EventType.STAGE]: '阶段',
    };

    return cooldownTags
      .map(({ tag, remaining }) => `${tagNames[tag]}(${remaining}回合)`)
      .join('、') + ' 冷却中';
  }
}

// 导出单例
export const eventSelector = new EventSelector();
