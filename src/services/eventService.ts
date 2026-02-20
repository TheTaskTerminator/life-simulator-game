import { Player, Event, EventType, EventEffect } from '../types';
import { aiService } from './aiService';
import { generateId } from '../utils/gameUtils';
import { eventSelector } from '../engine/eventSelector';

/**
 * 事件服务
 * 支持事件生成，基于标签冷却机制控制事件类型
 */
export class EventService {
  /**
   * 生成事件
   * 使用标签冷却机制而非文字签名去重
   */
  async generateEvent(
    player: Player,
    eventType?: EventType
  ): Promise<Event> {
    // 检查是否有预设事件
    const presetEvent = this.checkPresetEvents(player, eventType);
    if (presetEvent) {
      return presetEvent;
    }

    // 如果指定了事件类型，检查是否可用
    if (eventType && !eventSelector.isEventAvailable(player, eventType)) {
      console.log(`事件类型 ${eventType} 处于冷却中，将选择其他类型`);
      // 选择一个可用的类型
      eventType = eventSelector.selectSmartEventType(player);
    }

    // 如果没有指定类型，智能选择
    if (!eventType) {
      eventType = eventSelector.selectSmartEventType(player);
    }

    // 调用 AI 生成事件
    try {
      const event = await aiService.generateEvent(player, eventType);
      return event;
    } catch (error) {
      console.error('AI 生成事件失败:', error);
      // 返回降级事件
      return this.getFallbackEvent(player, eventType);
    }
  }

  /**
   * 检查预设事件
   */
  private checkPresetEvents(
    _player: Player,
    _eventType?: EventType
  ): Event | null {
    // 这里可以添加预设事件的逻辑
    // 例如：特定年龄、特定阶段的关键事件
    return null;
  }

  /**
   * 获取降级事件
   */
  private getFallbackEvent(
    _player: Player,
    eventType?: EventType
  ): Event {
    const fallbackEvents: Record<string, Event> = {
      [EventType.OPPORTUNITY]: {
        id: generateId('event'),
        type: EventType.OPPORTUNITY,
        title: '意外的机会',
        description: '你遇到了一个不错的机会，虽然不确定结果如何，但值得尝试。',
        choices: [
          {
            id: generateId('choice'),
            text: '抓住这个机会',
            effects: [
              { type: 'attribute', attribute: 'happiness', value: 5 },
              { type: 'attribute', attribute: 'stress', value: 3 },
            ],
          },
          {
            id: generateId('choice'),
            text: '谨慎考虑',
            effects: [
              { type: 'attribute', attribute: 'stress', value: -2 },
            ],
          },
        ],
        aiGenerated: false,
      },
      [EventType.CHALLENGE]: {
        id: generateId('event'),
        type: EventType.CHALLENGE,
        title: '面临的挑战',
        description: '你遇到了一个挑战，需要做出选择来应对。',
        choices: [
          {
            id: generateId('choice'),
            text: '勇敢面对',
            effects: [
              { type: 'attribute', attribute: 'happiness', value: 3 },
              { type: 'attribute', attribute: 'stress', value: 5 },
            ],
          },
          {
            id: generateId('choice'),
            text: '寻求帮助',
            effects: [
              { type: 'attribute', attribute: 'stress', value: -3 },
            ],
          },
        ],
        aiGenerated: false,
      },
      [EventType.DAILY]: {
        id: generateId('event'),
        type: EventType.DAILY,
        title: '日常生活',
        description: '这是普通的一天，你过着平静的生活。',
        choices: [
          {
            id: generateId('choice'),
            text: '享受当下',
            effects: [
              { type: 'attribute', attribute: 'happiness', value: 2 },
            ],
          },
        ],
        aiGenerated: false,
      },
    };

    return (
      fallbackEvents[eventType || EventType.DAILY] ||
      fallbackEvents[EventType.DAILY]
    );
  }

  /**
   * 生成随机属性变化事件
   * 在选择后随机触发，模拟生活中的小事件
   * @param _player 玩家状态（未来可用于根据状态调整随机事件）
   */
  generateRandomAttributeEvent(_player: Player): EventEffect[] | null {
    // 30% 概率触发随机事件
    if (Math.random() > 0.3) {
      return null;
    }

    const effects: EventEffect[] = [];
    const attributeKeys: Array<keyof Player['attributes']> = [
      'health',
      'intelligence',
      'charm',
      'happiness',
      'stress',
    ];

    // 随机选择1-3个属性进行变化
    const numChanges = Math.floor(Math.random() * 3) + 1;
    const selectedAttributes = new Set<keyof Player['attributes']>();

    while (selectedAttributes.size < numChanges) {
      const attr = attributeKeys[Math.floor(Math.random() * attributeKeys.length)];
      selectedAttributes.add(attr);
    }

    // 为每个选中的属性生成随机变化
    selectedAttributes.forEach((attr) => {
      let value: number;

      if (attr === 'stress') {
        // 压力更倾向于增加（生活压力）
        value = Math.random() > 0.3 ? Math.floor(Math.random() * 5) + 1 : -Math.floor(Math.random() * 3) - 1;
      } else if (attr === 'happiness') {
        // 幸福度更倾向于减少（生活琐事）
        value = Math.random() > 0.4 ? -Math.floor(Math.random() * 5) - 1 : Math.floor(Math.random() * 5) + 1;
      } else if (attr === 'health') {
        // 健康度小幅波动
        value = Math.random() > 0.5 ? Math.floor(Math.random() * 3) + 1 : -Math.floor(Math.random() * 3) - 1;
      } else {
        // 其他属性小幅变化
        value = Math.random() > 0.5 ? Math.floor(Math.random() * 3) + 1 : -Math.floor(Math.random() * 3) - 1;
      }

      effects.push({
        type: 'attribute',
        attribute: attr,
        value,
      });
    });

    // 偶尔会有财富变化（10%概率）
    if (Math.random() < 0.1) {
      const wealthChange = Math.random() > 0.5 
        ? Math.floor(Math.random() * 500) + 100  // 获得小笔收入
        : -Math.floor(Math.random() * 300) - 50;  // 小额支出
      effects.push({
        type: 'wealth',
        value: wealthChange,
      });
    }

    return effects.length > 0 ? effects : null;
  }
}

// 导出单例
export const eventService = new EventService();

