import { EndingsConfig } from '../../core/types/base';

/**
 * 学术之路 - 结局配置
 *
 * 包含毕业结局、发展结局和特殊结局
 */

// ============================================================================
// 结局类型
// ============================================================================

/**
 * 结局分类
 */
export type EndingCategory =
  | 'graduation'  // 毕业结局
  | 'development' // 发展结局
  | 'special';    // 特殊结局

/**
 * 详细结局定义
 */
export interface DetailedEnding {
  id: string;
  category: EndingCategory;
  title: string;
  description: string;
  epilogue?: string; // 后日谈
  type: 'good' | 'neutral' | 'bad' | 'legendary';
  icon: string;
  condition?: {
    attributes?: Record<string, { min?: number; max?: number }>;
    cumulative?: Record<string, { min?: number }>;
    weeks?: { min?: number; max?: number };
    graduated?: boolean;
    custom?: string;
  };
  scoreThreshold?: number;
  rarity: number; // 稀有度 (1-5)
}

// ============================================================================
// 基础结局配置（框架兼容）
// ============================================================================

export const endingsConfig: EndingsConfig = {
  hard: [
    {
      id: 'ending_health_crisis',
      title: '过劳送医',
      description: '长期的压力和过劳导致你身体崩溃，被送进医院。医生建议休学养病。',
      type: 'bad',
      condition: {
        attributes: {
          health: { max: 0 },
        },
      },
      icon: '🏥',
    },
    {
      id: 'ending_burnout',
      title: '学术倦怠',
      description: '你彻底失去了对科研的热情，每天去实验室都感到痛苦。最终决定休学调整。',
      type: 'bad',
      condition: {
        attributes: {
          academic_passion: { max: 0 },
        },
      },
      icon: '😔',
    },
    {
      id: 'ending_expelled',
      title: '被退学',
      description: '由于学术不端行为被发现，你被学校开除。学位证成为了泡影。',
      type: 'bad',
      condition: {
        custom: 'ethics_violation_severe',
      },
      icon: '🚫',
    },
  ],

  soft: [
    {
      id: 'ending_excellent_graduate',
      title: '优秀毕业生',
      description: '你以优异的成绩毕业，多篇论文发表，获得了国家奖学金和优秀毕业生称号。前途一片光明！',
      type: 'good',
      scoreThreshold: 0.8,
      icon: '🏆',
    },
    {
      id: 'ending_normal_graduate',
      title: '顺利毕业',
      description: '你完成了所有毕业要求，顺利通过了答辩。研究生生涯画上了一个圆满的句号。',
      type: 'good',
      scoreThreshold: 0.5,
      icon: '🎓',
    },
    {
      id: 'ending_delayed_graduate',
      title: '延期毕业',
      description: '虽然比预期晚了一些，但你最终还是完成了学业。这段延期的经历让你更加珍惜机会。',
      type: 'neutral',
      scoreThreshold: 0.3,
      icon: '📅',
    },
    {
      id: 'ending_struggling',
      title: '艰难毕业',
      description: '毕业过程异常艰难，勉强通过了答辩。这段经历让你身心俱疲，但也学会了坚持。',
      type: 'neutral',
      scoreThreshold: 0.15,
      icon: '😓',
    },
    {
      id: 'ending_dropout',
      title: '中途退学',
      description: '由于各种原因，你选择了退学。虽然遗憾，但也许这是另一种人生选择。',
      type: 'bad',
      scoreThreshold: 0,
      icon: '🚪',
    },
  ],
};

// ============================================================================
// 详细结局定义
// ============================================================================

/**
 * 毕业结局
 */
export const graduationEndings: DetailedEnding[] = [
  {
    id: 'graduation_excellent',
    category: 'graduation',
    title: '优秀毕业生',
    description: '你以优异的成绩毕业，多篇高水平论文发表，获得优秀毕业生称号。',
    epilogue: '多家知名企业和高校向你伸出橄榄枝，你的学术道路才刚刚开始。',
    type: 'good',
    icon: '🏆',
    condition: {
      graduated: true,
      cumulative: {
        papers_published: { min: 3 },
      },
      attributes: {
        advisor_favor: { min: 70 },
      },
    },
    rarity: 4,
  },
  {
    id: 'graduation_normal',
    category: 'graduation',
    title: '顺利毕业',
    description: '你完成了所有毕业要求，顺利通过了答辩。',
    epilogue: '研究生生涯告一段落，新的人生篇章即将开启。',
    type: 'good',
    icon: '🎓',
    condition: {
      graduated: true,
    },
    rarity: 2,
  },
  {
    id: 'graduation_delayed',
    category: 'graduation',
    title: '延期毕业',
    description: '比预期多花了时间，但最终还是拿到了学位。',
    epilogue: '虽然路途曲折，但终点还是到了。这段经历让你更加坚韧。',
    type: 'neutral',
    icon: '📅',
    condition: {
      graduated: true,
      custom: 'delayed',
    },
    rarity: 2,
  },
  {
    id: 'graduation_dropout',
    category: 'graduation',
    title: '中途退学',
    description: '由于各种原因，你选择了退学。',
    epilogue: '也许这不是终点，而是另一条路的起点。',
    type: 'bad',
    icon: '🚪',
    condition: {
      graduated: false,
      custom: 'dropout',
    },
    rarity: 2,
  },
  {
    id: 'graduation_no_degree',
    category: 'graduation',
    title: '肄业',
    description: '未能完成毕业要求，只能拿结业证书离开。',
    epilogue: '没有学位证，这三年的努力似乎白费了。但人生还要继续。',
    type: 'bad',
    icon: '📄',
    condition: {
      graduated: false,
      custom: 'max_weeks_exceeded',
    },
    rarity: 3,
  },
];

/**
 * 发展结局（毕业后去向）
 */
export const developmentEndings: DetailedEnding[] = [
  {
    id: 'career_academic_star',
    category: 'development',
    title: '学术新星',
    description: '你成功申请到了顶尖高校的博士/博后职位，学术之路继续。',
    epilogue: '你的研究引起了学界的关注，未来的某一天，你也许会成为领域内的大牛。',
    type: 'good',
    icon: '🌟',
    condition: {
      graduated: true,
      cumulative: {
        papers_published: { min: 2 },
      },
      attributes: {
        advisor_favor: { min: 80 },
      },
    },
    rarity: 4,
  },
  {
    id: 'career_big_tech',
    category: 'development',
    title: '大厂工程师',
    description: '你进入了知名互联网公司，成为了一名高薪工程师。',
    epilogue: '虽然离开了学术界，但你的技术能力在企业中得到了充分发挥。',
    type: 'good',
    icon: '💻',
    condition: {
      graduated: true,
      attributes: {
        research_ability: { min: 50 },
      },
    },
    rarity: 3,
  },
  {
    id: 'career_civil_servant',
    category: 'development',
    title: '公务员',
    description: '你考上了公务员，进入了体制内工作。',
    epilogue: '稳定的工作，规律的作息，这是另一种人生选择。',
    type: 'neutral',
    icon: '🏛️',
    condition: {
      graduated: true,
    },
    rarity: 2,
  },
  {
    id: 'career_startup',
    category: 'development',
    title: '创业之路',
    description: '你选择创业，将自己的研究成果转化为产品。',
    epilogue: '创业之路充满艰辛，但你相信自己选择的方向。',
    type: 'neutral',
    icon: '🚀',
    condition: {
      graduated: true,
      attributes: {
        academic_passion: { min: 60 },
      },
    },
    rarity: 3,
  },
  {
    id: 'career_unemployed',
    category: 'development',
    title: '待业在家',
    description: '毕业后你没有找到理想的工作，选择暂时在家。',
    epilogue: '也许需要一些时间来思考下一步该怎么走。',
    type: 'bad',
    icon: '🏠',
    condition: {
      graduated: true,
      attributes: {
        research_ability: { max: 40 },
      },
    },
    rarity: 2,
  },
];

/**
 * 特殊结局
 */
export const specialEndings: DetailedEnding[] = [
  {
    id: 'special_ethics_scandal',
    category: 'special',
    title: '学术丑闻',
    description: '你的学术造假行为被曝光，引发了学界的轩然大波。',
    epilogue: '学位被撤销，名誉扫地。这将成为你一生的污点。',
    type: 'bad',
    icon: '⚖️',
    condition: {
      custom: 'ethics_violation_caught',
    },
    rarity: 5,
  },
  {
    id: 'special_love_success',
    category: 'special',
    title: '收获爱情',
    description: '虽然学术成就一般，但你在研究生期间遇到了真爱。',
    epilogue: '毕业后你们结婚了，这也许比一篇论文更有意义。',
    type: 'neutral',
    icon: '❤️',
    condition: {
      graduated: true,
      custom: 'relationship_success',
    },
    rarity: 4,
  },
  {
    id: 'special_mental_breakdown',
    category: 'special',
    title: '精神崩溃',
    description: '长期的压力导致你出现了严重的心理问题。',
    epilogue: '你不得不休学接受治疗。健康比学位更重要。',
    type: 'bad',
    icon: '🧠',
    condition: {
      attributes: {
        health: { max: 10 },
        pressure: { min: 90 },
      },
    },
    rarity: 3,
  },
  {
    id: 'special_rich_family',
    category: 'special',
    title: '回家继承家业',
    description: '家里给你安排了另一条路——回家继承家族企业。',
    epilogue: '也许你本就不适合学术圈，商界才是你的舞台。',
    type: 'neutral',
    icon: '👔',
    condition: {
      graduated: false,
      custom: 'dropout_rich',
    },
    rarity: 5,
  },
  {
    id: 'special_viral_scholar',
    category: 'special',
    title: '学术网红',
    description: '你的科普视频在网络上爆火，成为了学术圈的网红。',
    epilogue: '虽然论文发得不多，但你的影响力已经超出了学术界。',
    type: 'good',
    icon: '📱',
    condition: {
      graduated: true,
      custom: 'social_media_fame',
    },
    rarity: 5,
  },
];

/**
 * 所有详细结局
 */
export const allDetailedEndings: DetailedEnding[] = [
  ...graduationEndings,
  ...developmentEndings,
  ...specialEndings,
];

// ============================================================================
// 结局评估
// ============================================================================

/**
 * 结局评分因素
 */
export const endingScoreFactors = {
  papers_published: {
    weight: 0.25,
    max: 5, // 超过5篇不再加分
  },
  credits_completed: {
    weight: 0.15,
    max: 1, // 完成即可
  },
  advisor_favor: {
    weight: 0.15,
    max: 100,
  },
  research_ability: {
    weight: 0.15,
    max: 100,
  },
  academic_passion: {
    weight: 0.1,
    max: 100,
  },
  health: {
    weight: 0.1,
    max: 100,
  },
  peer_relation: {
    weight: 0.05,
    max: 100,
  },
  on_time_graduation: {
    weight: 0.05,
    max: 1, // 按时毕业加成
  },
};

/**
 * 计算结局评分
 */
export function calculateEndingScore(
  attributes: Record<string, number>,
  cumulative: Record<string, number>,
  onTimeGraduation: boolean
): number {
  let score = 0;

  // 论文分数
  const papers = cumulative.papers_published ?? 0;
  score += Math.min(papers, endingScoreFactors.papers_published.max) /
    endingScoreFactors.papers_published.max * endingScoreFactors.papers_published.weight;

  // 学分分数
  const credits = cumulative.credits ?? 0;
  score += (credits >= 30 ? 1 : credits / 30) * endingScoreFactors.credits_completed.weight;

  // 属性分数
  const attributeFactors = ['advisor_favor', 'research_ability', 'academic_passion', 'health', 'peer_relation'] as const;
  for (const attr of attributeFactors) {
    const value = attributes[attr] ?? 0;
    const factor = endingScoreFactors[attr];
    score += (value / factor.max) * factor.weight;
  }

  // 按时毕业加成
  if (onTimeGraduation) {
    score += endingScoreFactors.on_time_graduation.weight;
  }

  return Math.min(1, score);
}

/**
 * 根据评分获取结局
 */
export function getEndingByScore(score: number, graduated: boolean): DetailedEnding {
  if (!graduated) {
    return graduationEndings.find(e => e.id === 'graduation_dropout')!;
  }

  if (score >= 0.8) {
    return graduationEndings.find(e => e.id === 'graduation_excellent')!;
  }
  if (score >= 0.5) {
    return graduationEndings.find(e => e.id === 'graduation_normal')!;
  }
  return graduationEndings.find(e => e.id === 'graduation_delayed')!;
}

export default {
  endingsConfig,
  graduationEndings,
  developmentEndings,
  specialEndings,
  allDetailedEndings,
  endingScoreFactors,
  calculateEndingScore,
  getEndingByScore,
};
