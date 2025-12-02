import { Player, Event, EventType, EventEffect } from '../types';
import { aiService } from './aiService';
import { generateId } from '../utils/gameUtils';

/**
 * 事件服务
 * 支持事件生成，每次生成不同的事件，并与年龄、属性关联
 */
export class EventService {
  // 记录已触发的事件ID，避免短时间内重复
  private recentEventIds = new Set<string>();
  private readonly MAX_RECENT_EVENTS = 10;


  /**
   * 生成事件（每次生成不同的事件）
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

    // 生成唯一的事件（不缓存，确保每次都是新的）
    // 调用 AI 生成事件，每次都生成新的事件
    try {
      const event = await aiService.generateEvent(player, eventType);
      
      // 检查是否与最近的事件重复（基于标题和描述）
      const eventSignature = `${event.title}-${event.description.substring(0, 50)}`;
      if (this.recentEventIds.has(eventSignature)) {
        // 如果重复，重新生成（最多重试3次）
        console.log('检测到重复事件，重新生成...');
        for (let i = 0; i < 3; i++) {
          const newEvent = await aiService.generateEvent(player, eventType);
          const newSignature = `${newEvent.title}-${newEvent.description.substring(0, 50)}`;
          if (!this.recentEventIds.has(newSignature)) {
            this.addToRecentEvents(newSignature);
            return newEvent;
          }
        }
      }
      
      // 记录到最近事件列表
      this.addToRecentEvents(eventSignature);
      
      return event;
    } catch (error) {
      console.error('AI 生成事件失败:', error);
      // 返回降级事件
      return this.getFallbackEvent(player, eventType);
    }
  }

  /**
   * 添加到最近事件列表
   */
  private addToRecentEvents(eventSignature: string): void {
    this.recentEventIds.add(eventSignature);
    
    // 限制最近事件数量
    if (this.recentEventIds.size > this.MAX_RECENT_EVENTS) {
      const firstEvent = Array.from(this.recentEventIds)[0];
      this.recentEventIds.delete(firstEvent);
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

