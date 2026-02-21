import { EventType } from '../types';

/**
 * 游戏核心配置
 * 集中管理所有游戏参数，确保数值平衡和一致性
 */
export const GAME_CONFIG = {
  version: '1.0.0',

  parameters: {
    // 最大回合数
    max_turn: 100,
    // 年龄上限
    max_age: 100,
    // 每回合事件数
    events_per_turn: 1,
    // 每年手动触发事件上限
    max_manual_triggers_per_year: 3,

    // 属性边界
    metric_bounds: {
      health: { min: 0, max: 100 },
      intelligence: { min: 0, max: 100 },
      charm: { min: 0, max: 100 },
      wealth: { min: 0, max: Infinity },
      happiness: { min: 0, max: 100 },
      stress: { min: 0, max: 100 },
    } as const,

    // 单次效果值上限
    max_effect_value: {
      attribute: 30,   // 单次属性变化上限
      wealth: 5000,    // 单次财富变化上限
    },
  },

  // 标签冷却配置（回合数）
  tag_cooldowns: {
    [EventType.OPPORTUNITY]: 2,
    [EventType.CHALLENGE]: 2,
    [EventType.DAILY]: 0,
    [EventType.SPECIAL]: 10,
    [EventType.STAGE]: 0,
  } as const,

  // 结局配置
  endings: {
    // 硬结局：满足条件立即触发
    hard: {
      health_death: {
        id: 'ending_health_death',
        title: '生命终结',
        description: '你的健康值降到了0，生命就此终结。',
        condition: { health: 0 },
        type: 'bad' as const,
      },
      age_limit: {
        id: 'ending_age_limit',
        title: '百年人生',
        description: '你已经活到了100岁，人生旅途到此结束。',
        condition: { age: 100 },
        type: 'neutral' as const,
      },
    },
    // 软结局：达到最大回合数时评价
    soft: {
      flourishing: {
        id: 'ending_flourishing',
        title: '人生巅峰',
        description: '你的人生精彩纷呈，健康、财富、幸福皆备，是人人羡慕的人生赢家！',
        scoreThreshold: 0.8,
        type: 'good' as const,
      },
      balanced: {
        id: 'ending_balanced',
        title: '平稳人生',
        description: '你的人生虽然平凡，但健康、财富、幸福都有所兼顾，也算得上圆满。',
        scoreThreshold: 0.6,
        type: 'good' as const,
      },
      mediocre: {
        id: 'ending_mediocre',
        title: '平凡一生',
        description: '你的人生平淡无奇，虽然没有大起大落，但也缺乏亮点。',
        scoreThreshold: 0.4,
        type: 'neutral' as const,
      },
      regret: {
        id: 'ending_regret',
        title: '充满遗憾',
        description: '回首往事，你的人生充满了遗憾和无奈，很多事情没能如愿。',
        scoreThreshold: 0,
        type: 'bad' as const,
      },
    },
  },
} as const;

// 类型导出
export type MetricBounds = typeof GAME_CONFIG.parameters.metric_bounds;
export type TagCooldowns = typeof GAME_CONFIG.tag_cooldowns;
