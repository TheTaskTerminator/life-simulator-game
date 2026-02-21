import { MetricsConfig } from '../../core/types/base';

/**
 * 学术之路 - 属性配置
 *
 * 核心属性反映研究生生活的关键指标
 */

/**
 * 核心属性定义
 */
export const metricsConfig: MetricsConfig = {
  definitions: {
    // === 核心六维属性 ===
    research_ability: {
      key: 'research_ability',
      label: '科研能力',
      icon: '🔬',
      color: '#4CAF50',
      bounds: { min: 0, max: 100 },
      isLowWhenBelow: 30,
      description: '做研究的综合能力，影响论文质量和实验效率',
    },
    academic_passion: {
      key: 'academic_passion',
      label: '学术热情',
      icon: '🔥',
      color: '#FF9800',
      bounds: { min: 0, max: 100 },
      isLowWhenBelow: 30,
      isGameOverAt: 0, // 热情归零触发"学术倦怠"结局
      description: '对科研的热爱程度，影响创造力和抗压能力',
    },
    advisor_favor: {
      key: 'advisor_favor',
      label: '导师好感',
      icon: '👨‍🏫',
      color: '#2196F3',
      bounds: { min: 0, max: 100 },
      isLowWhenBelow: 30,
      description: '导师对你的评价，影响资源分配、推荐信和签字',
    },
    peer_relation: {
      key: 'peer_relation',
      label: '同门关系',
      icon: '🤝',
      color: '#9C27B0',
      bounds: { min: 0, max: 100 },
      isLowWhenBelow: 20,
      description: '与师兄弟姐妹的关系，影响合作机会和信息共享',
    },
    health: {
      key: 'health',
      label: '身心健康',
      icon: '❤️',
      color: '#E91E63',
      bounds: { min: 0, max: 100 },
      isLowWhenBelow: 30,
      isGameOverAt: 0, // 健康归零触发"过劳"结局
      description: '身体和心理状态，过低会触发负面事件',
    },
    finance: {
      key: 'finance',
      label: '经济状况',
      icon: '💰',
      color: '#FFD700',
      bounds: { min: 0, max: 100 },
      isLowWhenBelow: 20,
      description: '生活费充裕程度，影响生活质量和科研投入',
    },

    // === 压力属性（反向） ===
    pressure: {
      key: 'pressure',
      label: '压力值',
      icon: '😰',
      color: '#F44336',
      bounds: { min: 0, max: 100 },
      isLowWhenBelow: 0,
      isInverted: true, // 反向指标：值越高越不好
      description: '来自毕业、发表、导师等多方面的压力',
    },
  },

  initialValues: {
    research_ability: { min: 30, max: 60 },
    academic_passion: { min: 60, max: 90 },
    advisor_favor: { min: 40, max: 70 },
    peer_relation: { min: 50, max: 80 },
    health: { min: 60, max: 90 },
    finance: { min: 40, max: 70 },
    pressure: { min: 20, max: 40 },
  },

  maxEffectValue: {
    research_ability: 15,
    academic_passion: 20,
    advisor_favor: 15,
    peer_relation: 15,
    health: 20,
    finance: 15,
    pressure: 25,
  },
};

export default metricsConfig;

export type ResearchMetricKey = keyof typeof metricsConfig.definitions;

// ============================================================================
// 累积指标（跨回合持久）
// ============================================================================

/**
 * 累积指标定义
 */
export interface CumulativeMetrics {
  /** 已修学分 */
  credits: number;
  /** 论文在投数 */
  papers_submitted: number;
  /** 论文已发数 */
  papers_published: number;
  /** H-index */
  h_index: number;
  /** 总引用数 */
  total_citations: number;
  /** 总周数 */
  total_weeks: number;
}

/**
 * 累积指标初始值
 */
export const initialCumulativeMetrics: CumulativeMetrics = {
  credits: 0,
  papers_submitted: 0,
  papers_published: 0,
  h_index: 0,
  total_citations: 0,
  total_weeks: 0,
};

// ============================================================================
// 压力系统
// ============================================================================

/**
 * 压力来源类型
 */
export type PressureSourceType =
  | 'time'      // 时间压力（离毕业期限）
  | 'paper'     // 发表压力
  | 'advisor'   // 导师压力
  | 'peer'      // 同辈压力
  | 'finance';  // 经济压力

/**
 * 压力来源配置
 */
export interface PressureSourceConfig {
  type: PressureSourceType;
  name: string;
  description: string;
  baseValue: number;      // 基础压力值
  growthRate: number;     // 随时间增长率
  triggerCondition?: string;
}

/**
 * 压力来源配置
 */
export const pressureSources: Record<PressureSourceType, PressureSourceConfig> = {
  time: {
    type: 'time',
    name: '时间压力',
    description: '离毕业期限越近，压力越大',
    baseValue: 10,
    growthRate: 0.5, // 每周增长
  },
  paper: {
    type: 'paper',
    name: '发表压力',
    description: '论文数量离要求差距越大，压力越大',
    baseValue: 20,
    growthRate: 0,
  },
  advisor: {
    type: 'advisor',
    name: '导师压力',
    description: '导师的期望和催促',
    baseValue: 15,
    growthRate: 0,
  },
  peer: {
    type: 'peer',
    name: '同辈压力',
    description: '看着同学都发了论文',
    baseValue: 10,
    growthRate: 0,
  },
  finance: {
    type: 'finance',
    name: '经济压力',
    description: '补助不够用',
    baseValue: 5,
    growthRate: 0,
  },
};

/**
 * 压力影响配置
 */
export const pressureEffects = {
  /** 压力过低（懒散） */
  low: {
    threshold: 20,
    effects: {
      research_ability_modifier: 0.8, // 效率降低
      event_probability_modifier: 0.7, // 事件概率降低
    },
  },
  /** 压力适中（动力） */
  medium: {
    threshold: 50,
    effects: {
      research_ability_modifier: 1.2, // 效率提升
      event_probability_modifier: 1.0,
    },
  },
  /** 压力过高（崩溃） */
  high: {
    threshold: 80,
    effects: {
      research_ability_modifier: 0.6, // 效率大幅降低
      health_decay: 2, // 健康下降
      event_probability_modifier: 1.5, // 负面事件概率增加
    },
  },
};

// ============================================================================
// 辅助函数
// ============================================================================

/**
 * 计算总压力值
 */
export function calculateTotalPressure(
  sources: Partial<Record<PressureSourceType, number>>
): number {
  let total = 0;
  for (const [type, value] of Object.entries(sources)) {
    const config = pressureSources[type as PressureSourceType];
    if (config && value !== undefined) {
      total += config.baseValue * (value / 100);
    }
  }
  return Math.min(100, Math.round(total));
}

/**
 * 获取压力影响等级
 */
export function getPressureLevel(pressure: number): 'low' | 'medium' | 'high' {
  if (pressure < pressureEffects.low.threshold) return 'low';
  if (pressure < pressureEffects.high.threshold) return 'medium';
  return 'high';
}

/**
 * 获取压力影响效果
 */
export function getPressureEffects(pressure: number): typeof pressureEffects.low.effects {
  const level = getPressureLevel(pressure);
  return pressureEffects[level].effects;
}
