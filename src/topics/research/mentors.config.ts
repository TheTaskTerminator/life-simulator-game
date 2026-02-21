/**
 * 学术之路 - 导师关系系统配置
 *
 * 定义导师类型、好感度影响和导师事件
 */

// ============================================================================
// 导师类型定义
// ============================================================================

/**
 * 导师类型
 */
export type MentorType =
  | 'big_shot'     // 大牛型
  | 'young_star'   // 青千型
  | 'hands_off'    // 放养型
  | 'demanding';   // 压榨型

/**
 * 导师性格特质
 */
export interface MentorPersonality {
  /** 指导频率 (0-100) */
  guidanceFrequency: number;
  /** 要求严格程度 (0-100) */
  strictness: number;
  /** 资源丰富程度 (0-100) */
  resources: number;
  /** 时间充裕程度 (0-100) */
  availability: number;
  /** push程度 (0-100) */
  pushiness: number;
}

/**
 * 导师类型配置
 */
export interface MentorTypeConfig {
  type: MentorType;
  name: string;
  description: string;
  icon: string;
  personality: MentorPersonality;
  advantages: string[];
  disadvantages: string[];
  initialFavor: { min: number; max: number };
  specialEvents: string[]; // 特有事件ID
}

/**
 * 导师类型配置映射
 */
export const mentorTypes: Record<MentorType, MentorTypeConfig> = {
  // 大牛型
  big_shot: {
    type: 'big_shot',
    name: '大牛型导师',
    description: '学术界的顶尖人物，资源丰富但时间有限',
    icon: '🌟',
    personality: {
      guidanceFrequency: 30,
      strictness: 70,
      resources: 90,
      availability: 20,
      pushiness: 50,
    },
    advantages: [
      '资源丰富，容易拿项目',
      '推荐信含金量高',
      '学术网络广阔',
      '毕业时名声响亮',
    ],
    disadvantages: [
      '没时间亲自指导',
      '要求高，压力大',
      '可能几年见不到几次',
      '需要很强的自驱力',
    ],
    initialFavor: { min: 30, max: 50 },
    specialEvents: ['big_shot_introduction', 'conference_invitation'],
  },

  // 青千型
  young_star: {
    type: 'young_star',
    name: '青千型导师',
    description: '刚回国的青年才俊，急于出成果',
    icon: '🚀',
    personality: {
      guidanceFrequency: 80,
      strictness: 80,
      resources: 60,
      availability: 70,
      pushiness: 90,
    },
    advantages: [
      '亲自指导，成长快',
      '发论文效率高',
      '对新技术敏感',
      '容易建立亲密关系',
    ],
    disadvantages: [
      '压力大，push狠',
      '要求高，休息少',
      '可能把你当工具人',
      '方向可能太前沿风险大',
    ],
    initialFavor: { min: 50, max: 70 },
    specialEvents: ['young_star_push', 'late_night_meeting'],
  },

  // 放养型
  hands_off: {
    type: 'hands_off',
    name: '放养型导师',
    description: '佛系导师，给学生很大自由度',
    icon: '🌿',
    personality: {
      guidanceFrequency: 20,
      strictness: 30,
      resources: 40,
      availability: 50,
      pushiness: 10,
    },
    advantages: [
      '自由度高，轻松',
      '可以做自己想做的',
      '压力小，生活好',
      '有时间发展其他兴趣',
    ],
    disadvantages: [
      '缺乏指导，走弯路',
      '资源有限',
      '毕业靠自己',
      '推荐信可能不够硬',
    ],
    initialFavor: { min: 40, max: 60 },
    specialEvents: ['hands_off_warning', 'graduation_reminder'],
  },

  // 压榨型
  demanding: {
    type: 'demanding',
    name: '压榨型导师',
    description: '把你当廉价劳动力，横向项目不断',
    icon: '💼',
    personality: {
      guidanceFrequency: 60,
      strictness: 90,
      resources: 50,
      availability: 80,
      pushiness: 95,
    },
    advantages: [
      '项目经验丰富',
      '动手能力强',
      '可能有钱赚',
      '实战能力提升快',
    ],
    disadvantages: [
      '干杂活多，科研少',
      '论文没时间写',
      '毕业困难',
      '身心俱疲',
    ],
    initialFavor: { min: 30, max: 50 },
    specialEvents: ['project_overload', 'overtime_demand'],
  },
};

// ============================================================================
// 好感度系统
// ============================================================================

/**
 * 好感度等级
 */
export type FavorLevel =
  | 'terrible'  // 极差
  | 'poor'      // 较差
  | 'neutral'   // 一般
  | 'good'      // 良好
  | 'excellent'; // 极好

/**
 * 好感度等级配置
 */
export const favorLevels: Record<FavorLevel, {
  threshold: number;
  name: string;
  description: string;
  effects: {
    signWillingness: number;      // 签字意愿 (0-100)
    recommendationQuality: number; // 推荐信质量 (0-100)
    resourceAllocation: number;   // 资源分配 (0-100)
    graduationSupport: number;    // 毕业支持 (0-100)
  };
}> = {
  terrible: {
    threshold: 0,
    name: '极差',
    description: '导师对你非常不满，可能找茬',
    effects: {
      signWillingness: 10,
      recommendationQuality: 10,
      resourceAllocation: 0,
      graduationSupport: 20,
    },
  },
  poor: {
    threshold: 20,
    name: '较差',
    description: '导师对你印象一般，不太愿意帮忙',
    effects: {
      signWillingness: 30,
      recommendationQuality: 30,
      resourceAllocation: 20,
      graduationSupport: 40,
    },
  },
  neutral: {
    threshold: 40,
    name: '一般',
    description: '导师对你持中立态度',
    effects: {
      signWillingness: 50,
      recommendationQuality: 50,
      resourceAllocation: 40,
      graduationSupport: 60,
    },
  },
  good: {
    threshold: 60,
    name: '良好',
    description: '导师对你比较认可，愿意帮忙',
    effects: {
      signWillingness: 75,
      recommendationQuality: 75,
      resourceAllocation: 70,
      graduationSupport: 85,
    },
  },
  excellent: {
    threshold: 80,
    name: '极好',
    description: '导师非常欣赏你，全力支持',
    effects: {
      signWillingness: 95,
      recommendationQuality: 95,
      resourceAllocation: 90,
      graduationSupport: 95,
    },
  },
};

/**
 * 获取好感度等级
 */
export function getFavorLevel(favor: number): FavorLevel {
  if (favor >= 80) return 'excellent';
  if (favor >= 60) return 'good';
  if (favor >= 40) return 'neutral';
  if (favor >= 20) return 'poor';
  return 'terrible';
}

/**
 * 获取好感度效果
 */
export function getFavorEffects(favor: number): typeof favorLevels[FavorLevel]['effects'] {
  const level = getFavorLevel(favor);
  return favorLevels[level].effects;
}

// ============================================================================
// 好感度影响因素
// ============================================================================

/**
 * 好感度影响因素
 */
export const favorModifiers = {
  // 正面因素
  positive: {
    paper_published: {
      name: '发表论文',
      favorChange: 10,
      description: '每发表一篇论文',
    },
    project_completed: {
      name: '完成项目',
      favorChange: 5,
      description: '完成导师安排的项目',
    },
    good_presentation: {
      name: '组会表现好',
      favorChange: 3,
      description: '组会汇报得到认可',
    },
    help_others: {
      name: '帮助同门',
      favorChange: 2,
      description: '帮助师兄师姐或师弟师妹',
    },
    overtime_work: {
      name: '加班干活',
      favorChange: 2,
      description: '主动加班赶进度',
    },
    gift_treat: {
      name: '请客送礼',
      favorChange: 3,
      description: '请导师吃饭或送礼（节日）',
    },
  },

  // 负面因素
  negative: {
    paper_rejected: {
      name: '论文被拒',
      favorChange: -5,
      description: '论文被期刊拒绝',
    },
    miss_deadline: {
      name: '错过截止日期',
      favorChange: -10,
      description: '没有按时完成任务',
    },
    caught_slacking: {
      name: '摸鱼被抓',
      favorChange: -15,
      description: '被发现偷懒或不务正业',
    },
    poor_presentation: {
      name: '组会表现差',
      favorChange: -5,
      description: '组会汇报被批评',
    },
    argue_with_advisor: {
      name: '与导师争执',
      favorChange: -20,
      description: '公开与导师发生冲突',
    },
    academic_misconduct: {
      name: '学术不端',
      favorChange: -50,
      description: '涉及学术不端行为',
    },
  },
};

// ============================================================================
// 导师事件
// ============================================================================

/**
 * 导师事件
 */
export interface MentorEvent {
  id: string;
  title: string;
  description: string;
  mentorTypes?: MentorType[]; // 特定导师类型触发
  triggerConditions?: {
    minFavor?: number;
    maxFavor?: number;
    minWeek?: number;
    maxWeek?: number;
  };
  choices: {
    id: string;
    text: string;
    effects: {
      favor?: number;
      [key: string]: number | undefined;
    };
    requirements?: {
      minFavor?: number;
    };
  }[];
}

/**
 * 通用导师事件
 */
export const commonMentorEvents: MentorEvent[] = [
  {
    id: 'weekly_meeting',
    title: '周会时间',
    description: '又到了每周一次的单独 meeting，导师询问你最近的进展。',
    choices: [
      {
        id: 'well_prepared',
        text: '准备充分，汇报顺利',
        effects: { favor: 3 },
      },
      {
        id: 'average',
        text: '正常汇报，没有亮点',
        effects: { favor: 0 },
      },
      {
        id: 'unprepared',
        text: '准备不足，被批评',
        effects: { favor: -5 },
      },
    ],
  },
  {
    id: 'ask_for_help',
    title: '寻求帮助',
    description: '你遇到了研究难题，想请教导师。',
    triggerConditions: {
      minFavor: 30,
    },
    choices: [
      {
        id: 'helpful',
        text: '导师耐心指导',
        effects: { favor: 2 },
        requirements: { minFavor: 50 },
      },
      {
        id: 'busy',
        text: '导师太忙，约下次',
        effects: { favor: 0 },
      },
      {
        id: 'impatient',
        text: '导师不耐烦',
        effects: { favor: -3 },
      },
    ],
  },
  {
    id: 'festival_dinner',
    title: '节日聚餐',
    description: '中秋节到了，师门要聚餐。',
    choices: [
      {
        id: 'attend_gift',
        text: '参加并带礼物',
        effects: { favor: 5, finance: -10 },
      },
      {
        id: 'attend',
        text: '参加聚餐',
        effects: { favor: 2 },
      },
      {
        id: 'skip',
        text: '有事不去',
        effects: { favor: -3 },
      },
    ],
  },
];

/**
 * 大牛型导师特有事件
 */
export const bigShotMentorEvents: MentorEvent[] = [
  {
    id: 'big_shot_introduction',
    title: '介绍认识大牛',
    description: '导师在会议上把你介绍给了业界大牛。',
    mentorTypes: ['big_shot'],
    triggerConditions: {
      minFavor: 60,
    },
    choices: [
      {
        id: 'impress',
        text: '表现出色，留下好印象',
        effects: { favor: 5, reputation: 10 },
      },
      {
        id: 'nervous',
        text: '有点紧张，表现一般',
        effects: { favor: 0 },
      },
    ],
  },
];

/**
 * 青千型导师特有事件
 */
export const youngStarMentorEvents: MentorEvent[] = [
  {
    id: 'young_star_push',
    title: '深夜push',
    description: '晚上11点，导师发消息催促论文进度。',
    mentorTypes: ['young_star'],
    choices: [
      {
        id: 'respond_work',
        text: '立即回复，继续工作',
        effects: { favor: 3, health: -5 },
      },
      {
        id: 'respond_tomorrow',
        text: '明天再回复',
        effects: { favor: -2 },
      },
      {
        id: 'ignore',
        text: '假装没看到',
        effects: { favor: -5 },
      },
    ],
  },
];

/**
 * 放养型导师特有事件
 */
export const handsOffMentorEvents: MentorEvent[] = [
  {
    id: 'hands_off_warning',
    title: '毕业提醒',
    description: '导师突然提醒你注意毕业进度，让你有点慌。',
    mentorTypes: ['hands_off'],
    triggerConditions: {
      minWeek: 50,
      maxFavor: 50,
    },
    choices: [
      {
        id: 'seek_guidance',
        text: '主动寻求指导',
        effects: { favor: 5, pressure: 10 },
      },
      {
        id: 'self_study',
        text: '继续自己摸索',
        effects: { favor: -2, pressure: 5 },
      },
    ],
  },
];

/**
 * 压榨型导师特有事件
 */
export const demandingMentorEvents: MentorEvent[] = [
  {
    id: 'project_overload',
    title: '项目压身',
    description: '导师又给你安排了一个横向项目，你已经忙不过来了。',
    mentorTypes: ['demanding'],
    choices: [
      {
        id: 'accept',
        text: '默默接受',
        effects: { favor: 2, pressure: 20, health: -10 },
      },
      {
        id: 'negotiate',
        text: '协商减少工作量',
        effects: { favor: -5, pressure: 5 },
        requirements: { minFavor: 40 },
      },
      {
        id: 'refuse',
        text: '明确拒绝',
        effects: { favor: -20, pressure: -5 },
      },
    ],
  },
];

/**
 * 所有导师事件
 */
export const allMentorEvents: MentorEvent[] = [
  ...commonMentorEvents,
  ...bigShotMentorEvents,
  ...youngStarMentorEvents,
  ...handsOffMentorEvents,
  ...demandingMentorEvents,
];

export default {
  mentorTypes,
  favorLevels,
  favorModifiers,
  commonMentorEvents,
  bigShotMentorEvents,
  youngStarMentorEvents,
  handsOffMentorEvents,
  demandingMentorEvents,
  allMentorEvents,
  getFavorLevel,
  getFavorEffects,
};
