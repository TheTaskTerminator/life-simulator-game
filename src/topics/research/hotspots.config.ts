/**
 * 学术之路 - 学术热点系统配置
 *
 * 定义学术热点机制、热点方向和追热点的影响
 */

// ============================================================================
// 热点类型定义
// ============================================================================

/**
 * 热点状态
 */
export type HotspotStatus =
  | 'rising'    // 上升期
  | 'peak'      // 巅峰期
  | 'declining' // 衰退期
  | 'stable';   // 稳定期

/**
 * 热点领域
 */
export type ResearchField =
  | 'ai'           // 人工智能
  | 'big_data'     // 大数据
  | 'biotech'      // 生物技术
  | 'new_material' // 新材料
  | 'new_energy'   // 新能源
  | 'quantum'      // 量子计算
  | 'traditional'  // 传统方向
  | 'interdisciplinary'; // 交叉学科

/**
 * 热点配置
 */
export interface HotspotConfig {
  id: string;
  field: ResearchField;
  name: string;
  description: string;
  icon: string;
  status: HotspotStatus;
  characteristics: {
    publishSpeed: number;    // 发表速度 (1-10)
    competitionLevel: number; // 竞争程度 (1-10)
    acceptanceRate: number;  // 中稿率 (1-10)
    fundingAvailability: number; // 经费获取 (1-10)
    duration: number;        // 热度持续学期数
  };
  risks: string[];
  benefits: string[];
}

/**
 * 热点状态效果
 */
export const hotspotStatusEffects: Record<HotspotStatus, {
  name: string;
  publishModifier: number;  // 发表难度修正
  competitionModifier: number; // 竞争修正
  rewardModifier: number;   // 收益修正
}> = {
  rising: {
    name: '上升期',
    publishModifier: 0.8,  // 较易发表
    competitionModifier: 0.6, // 竞争较少
    rewardModifier: 1.5,   // 收益高
  },
  peak: {
    name: '巅峰期',
    publishModifier: 1.0,  // 正常
    competitionModifier: 1.5, // 竞争激烈
    rewardModifier: 1.2,   // 收益较高
  },
  declining: {
    name: '衰退期',
    publishModifier: 1.2,  // 较难发表
    competitionModifier: 0.8, // 竞争减少
    rewardModifier: 0.8,   // 收益降低
  },
  stable: {
    name: '稳定期',
    publishModifier: 1.0,  // 正常
    competitionModifier: 1.0, // 正常
    rewardModifier: 1.0,   // 正常
  },
};

// ============================================================================
// 预定义热点
// ============================================================================

/**
 * 预定义热点配置
 */
export const predefinedHotspots: HotspotConfig[] = [
  // === 人工智能领域 ===
  {
    id: 'large_language_model',
    field: 'ai',
    name: '大语言模型',
    description: 'ChatGPT引领的AI革命，研究大语言模型、提示工程、AI应用',
    icon: '🤖',
    status: 'peak',
    characteristics: {
      publishSpeed: 8,
      competitionLevel: 10,
      acceptanceRate: 4,
      fundingAvailability: 9,
      duration: 6,
    },
    risks: [
      '投稿量巨大，审稿周期长',
      '创新点容易重复',
      '资源门槛高（需要算力）',
      '热点可能迅速消退',
    ],
    benefits: [
      '容易吸引眼球',
      '经费充足',
      '就业前景好',
      '容易与企业合作',
    ],
  },
  {
    id: 'multimodal_ai',
    field: 'ai',
    name: '多模态AI',
    description: '结合文本、图像、音频的多模态人工智能研究',
    icon: '🎨',
    status: 'rising',
    characteristics: {
      publishSpeed: 7,
      competitionLevel: 7,
      acceptanceRate: 5,
      fundingAvailability: 8,
      duration: 5,
    },
    risks: [
      '技术门槛高',
      '数据集难以获取',
    ],
    benefits: [
      '发表机会多',
      '应用场景广',
    ],
  },

  // === 生物技术领域 ===
  {
    id: 'ai_drug_discovery',
    field: 'biotech',
    name: 'AI制药',
    description: '利用人工智能技术加速新药研发',
    icon: '💊',
    status: 'rising',
    characteristics: {
      publishSpeed: 5,
      competitionLevel: 6,
      acceptanceRate: 6,
      fundingAvailability: 10,
      duration: 8,
    },
    risks: [
      '需要跨学科知识',
      '实验周期长',
      '失败率高',
    ],
    benefits: [
      '经费非常充足',
      '产业价值高',
      '影响力大',
    ],
  },

  // === 新能源领域 ===
  {
    id: 'carbon_neutral',
    field: 'new_energy',
    name: '碳中和',
    description: '碳捕获、碳存储、绿色能源等减碳技术研究',
    icon: '🌱',
    status: 'stable',
    characteristics: {
      publishSpeed: 5,
      competitionLevel: 5,
      acceptanceRate: 6,
      fundingAvailability: 9,
      duration: 10,
    },
    risks: [
      '研究方向成熟，创新难',
      '政策依赖性强',
    ],
    benefits: [
      '政策利好持续',
      '国家重点项目多',
      '经费稳定',
    ],
  },

  // === 量子计算领域 ===
  {
    id: 'quantum_computing',
    field: 'quantum',
    name: '量子计算',
    description: '量子算法、量子硬件、量子纠错等前沿研究',
    icon: '⚛️',
    status: 'stable',
    characteristics: {
      publishSpeed: 3,
      competitionLevel: 4,
      acceptanceRate: 5,
      fundingAvailability: 8,
      duration: 15,
    },
    risks: [
      '技术门槛极高',
      '研究周期长',
      '离实用远',
    ],
    benefits: [
      '竞争者少',
      '学术地位高',
      '长期价值大',
    ],
  },

  // === 传统方向 ===
  {
    id: 'traditional_optimization',
    field: 'traditional',
    name: '优化算法',
    description: '传统的数学优化、运筹优化研究',
    icon: '📊',
    status: 'stable',
    characteristics: {
      publishSpeed: 4,
      competitionLevel: 3,
      acceptanceRate: 7,
      fundingAvailability: 4,
      duration: 20,
    },
    risks: [
      '创新空间有限',
      '经费较少',
      '关注度低',
    ],
    benefits: [
      '稳定可靠',
      '竞争小',
      '容易中稿',
    ],
  },
];

// ============================================================================
// 热点生成机制
// ============================================================================

/**
 * 热点生成配置
 */
export const hotspotGenerationConfig = {
  /** 每学期新热点生成概率 */
  newHotspotProbability: 0.3,
  /** 热点状态转换概率 */
  statusTransitionProbability: {
    rising_to_peak: 0.4,      // 上升→巅峰
    peak_to_declining: 0.3,   // 巅峰→衰退
    declining_to_stable: 0.5, // 衰退→稳定
    stable_to_rising: 0.1,    // 稳定→上升（二次爆火）
  },
  /** 同时存在的最大热点数 */
  maxActiveHotspots: 5,
  /** 热点生命周期（学期） */
  lifecycleRange: {
    min: 4,
    max: 12,
  },
};

/**
 * 当前热点状态
 */
export interface HotspotState {
  hotspotId: string;
  currentStatus: HotspotStatus;
  weeksActive: number;
  weeksRemaining: number;
  saturation: number; // 饱和度 (0-100)
}

/**
 * 玩家研究方向
 */
export interface PlayerResearchFocus {
  primaryField: ResearchField;
  currentHotspot?: string; // 追踪的热点
  hotspotEntryWeek?: number; // 进入热点的时间
  papersOnHotspot: number; // 在热点上发的论文数
}

// ============================================================================
// 策略选择影响
// ============================================================================

/**
 * 策略类型
 */
export type StrategyType =
  | 'chase_hotspot'   // 追热点
  | 'steady_research' // 稳健研究
  | 'niche_field';    // 深耕冷门

/**
 * 策略配置
 */
export const strategyConfigs: Record<StrategyType, {
  name: string;
  description: string;
  effects: {
    publishSpeedModifier: number;
    paperQualityModifier: number;
    riskLevel: number;    // 风险等级 (1-10)
    stabilityModifier: number;
  };
}> = {
  chase_hotspot: {
    name: '追热点',
    description: '紧跟学术热点，快速发论文',
    effects: {
      publishSpeedModifier: 1.5,
      paperQualityModifier: 0.7,
      riskLevel: 7,
      stabilityModifier: 0.5,
    },
  },
  steady_research: {
    name: '稳健研究',
    description: '平衡热点和本行，稳扎稳打',
    effects: {
      publishSpeedModifier: 1.0,
      paperQualityModifier: 1.0,
      riskLevel: 3,
      stabilityModifier: 1.0,
    },
  },
  niche_field: {
    name: '深耕冷门',
    description: '专注冷门方向，长期积累',
    effects: {
      publishSpeedModifier: 0.6,
      paperQualityModifier: 1.5,
      riskLevel: 5,
      stabilityModifier: 1.2,
    },
  },
};

// ============================================================================
// 热点事件
// ============================================================================

/**
 * 热点相关事件
 */
export interface HotspotEvent {
  id: string;
  title: string;
  description: string;
  triggerConditions?: {
    hotspotStatus?: HotspotStatus;
    playerStrategy?: StrategyType;
    minWeeksInHotspot?: number;
  };
  choices: {
    id: string;
    text: string;
    effects: Record<string, number>;
  }[];
}

/**
 * 热点事件库
 */
export const hotspotEvents: HotspotEvent[] = [
  {
    id: 'hotspot_boom',
    title: '热点爆发',
    description: '你关注的研究方向突然火了，大量论文涌现，你有机会趁势而上。',
    triggerConditions: {
      hotspotStatus: 'rising',
    },
    choices: [
      {
        id: 'join_early',
        text: '快速加入，抢占先机',
        effects: { research_ability: 5, pressure: 10, paper_progress: 20 },
      },
      {
        id: 'wait_observe',
        text: '观望一下，再做决定',
        effects: { pressure: -5 },
      },
    ],
  },
  {
    id: 'hotspot_saturation',
    title: '热点饱和',
    description: '这个方向的论文太多了，期刊开始拒收同类论文。',
    triggerConditions: {
      hotspotStatus: 'peak',
    },
    choices: [
      {
        id: 'push_harder',
        text: '加快进度，赶在衰退前发表',
        effects: { pressure: 15, health: -5, paper_progress: 10 },
      },
      {
        id: 'pivot',
        text: '考虑转型，换方向',
        effects: { research_ability: -3, pressure: 5 },
      },
    ],
  },
  {
    id: 'hotspot_fade',
    title: '热点退潮',
    description: '你追的热点开始降温，审稿人开始质疑你的研究价值。',
    triggerConditions: {
      hotspotStatus: 'declining',
      playerStrategy: 'chase_hotspot',
    },
    choices: [
      {
        id: 'finish_quickly',
        text: '快速收尾，投低档次期刊',
        effects: { academic_passion: -5, paper_progress: 15 },
      },
      {
        id: 'deepen_research',
        text: '深化研究，增加创新点',
        effects: { research_ability: 10, pressure: 10 },
      },
    ],
  },
];

// ============================================================================
// 工具函数
// ============================================================================

/**
 * 获取热点当前效果
 */
export function getHotspotEffects(hotspot: HotspotConfig): {
  publishDifficulty: number;
  competition: number;
  reward: number;
} {
  const statusEffect = hotspotStatusEffects[hotspot.status];
  const chars = hotspot.characteristics;

  return {
    publishDifficulty: 10 - (chars.publishSpeed * statusEffect.publishModifier),
    competition: chars.competitionLevel * statusEffect.competitionModifier,
    reward: 10 * statusEffect.rewardModifier,
  };
}

/**
 * 计算追热点的成功概率
 */
export function calculateHotspotSuccessRate(
  hotspot: HotspotConfig,
  playerResearchAbility: number,
  weeksInHotspot: number
): number {
  const effects = getHotspotEffects(hotspot);
  const abilityBonus = playerResearchAbility / 100;
  const experienceBonus = Math.min(0.3, weeksInHotspot / 100);
  const competitionPenalty = effects.competition / 20;

  const baseRate = 0.5;
  return Math.max(0.1, Math.min(0.9,
    baseRate + abilityBonus + experienceBonus - competitionPenalty
  ));
}

/**
 * 更新热点状态
 */
export function updateHotspotStatus(
  hotspot: HotspotConfig,
  weeksActive: number
): HotspotStatus {
  const lifecycle = hotspot.characteristics.duration * 18; // 转换为周数
  const progress = weeksActive / lifecycle;

  if (progress < 0.2) return 'rising';
  if (progress < 0.5) return 'peak';
  if (progress < 0.8) return 'declining';
  return 'stable';
}

export default {
  hotspotStatusEffects,
  predefinedHotspots,
  hotspotGenerationConfig,
  strategyConfigs,
  hotspotEvents,
  getHotspotEffects,
  calculateHotspotSuccessRate,
  updateHotspotStatus,
};
