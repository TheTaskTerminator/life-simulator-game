import { Player, EventType } from '../types';
import { GAME_CONFIG } from '../config/gameConfig';
import { endingEngine } from './endingEngine';

/**
 * 回合引擎
 * 负责管理游戏回合和冷却逻辑
 */
export class TurnEngine {
  /**
   * 检查是否可以触发新事件
   */
  canTriggerEvent(player: Player): boolean {
    // 获取当前回合的事件数量
    const currentTurn = this.getCurrentTurn(player);
    const eventsThisTurn = player.eventHistory.filter(
      (e) => (e as any).turn === currentTurn
    ).length;

    return eventsThisTurn < GAME_CONFIG.parameters.events_per_turn;
  }

  /**
   * 获取当前回合数
   */
  getCurrentTurn(player: Player): number {
    return (player as any).turn ?? 0;
  }

  /**
   * 推进回合
   * 返回更新后的玩家状态，如果达到最大回合则触发软结局
   */
  advanceTurn(player: Player): {
    player: Player;
    ended: boolean;
    ending?: ReturnType<typeof endingEngine.evaluateSoftEnding>;
  } {
    const currentTurn = this.getCurrentTurn(player);
    const newTurn = currentTurn + 1;

    // 检查是否达到最大回合
    if (newTurn > GAME_CONFIG.parameters.max_turn) {
      const ending = endingEngine.evaluateSoftEnding(player);
      return {
        player: { ...player, turn: newTurn } as Player,
        ended: true,
        ending,
      };
    }

    // 减少冷却
    const decrementedCooldowns = this.decrementCooldowns(
      this.getTagCooldowns(player)
    );

    return {
      player: {
        ...player,
        turn: newTurn,
        tagCooldowns: decrementedCooldowns,
      } as Player,
      ended: false,
    };
  }

  /**
   * 获取标签冷却状态
   */
  getTagCooldowns(player: Player): Record<EventType, number> {
    return (player as any).tagCooldowns ?? this.initTagCooldowns();
  }

  /**
   * 初始化标签冷却
   */
  initTagCooldowns(): Record<EventType, number> {
    return {
      [EventType.OPPORTUNITY]: 0,
      [EventType.CHALLENGE]: 0,
      [EventType.DAILY]: 0,
      [EventType.SPECIAL]: 0,
      [EventType.STAGE]: 0,
    };
  }

  /**
   * 减少所有冷却
   */
  decrementCooldowns(cooldowns: Record<EventType, number>): Record<EventType, number> {
    const result: Record<EventType, number> = { ...cooldowns };

    (Object.keys(result) as EventType[]).forEach((tag) => {
      if (result[tag] > 0) {
        result[tag] = result[tag] - 1;
      }
    });

    return result;
  }

  /**
   * 设置标签冷却
   */
  setCooldown(player: Player, tag: EventType): Player {
    const cooldowns = this.getTagCooldowns(player);
    const cooldownValue = GAME_CONFIG.tag_cooldowns[tag] ?? 0;

    return {
      ...player,
      tagCooldowns: {
        ...cooldowns,
        [tag]: cooldownValue,
      },
    } as Player;
  }

  /**
   * 检查标签是否可用（冷却为0）
   */
  isTagAvailable(player: Player, tag: EventType): boolean {
    const cooldowns = this.getTagCooldowns(player);
    return (cooldowns[tag] ?? 0) === 0;
  }

  /**
   * 获取所有可用的标签
   */
  getAvailableTags(player: Player): EventType[] {
    const cooldowns = this.getTagCooldowns(player);

    return (Object.entries(cooldowns) as [EventType, number][])
      .filter(([_, cooldown]) => cooldown === 0)
      .map(([tag]) => tag);
  }

  /**
   * 获取冷却中的标签
   */
  getCooldownTags(player: Player): Array<{ tag: EventType; remaining: number }> {
    const cooldowns = this.getTagCooldowns(player);

    return (Object.entries(cooldowns) as [EventType, number][])
      .filter(([_, cooldown]) => cooldown > 0)
      .map(([tag, remaining]) => ({ tag, remaining }));
  }
}

// 导出单例
export const turnEngine = new TurnEngine();
