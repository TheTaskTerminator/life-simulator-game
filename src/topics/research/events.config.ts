/**
 * 学术之路 - 预定义事件库
 *
 * 包含研究生生活中典型的各种事件
 */

// ============================================================================
// 事件类型定义
// ============================================================================

/**
 * 研究生事件类型
 */
export type ResearchEventType =
  | 'daily'        // 日常事件
  | 'semester'     // 学期事件
  | 'random'       // 随机事件
  | 'hotspot'      // 学术热点
  | 'ethics'       // 学术伦理
  | 'relationship' // 人际关系
  | 'milestone'    // 里程碑事件
  | 'pressure';    // 压力事件

/**
 * 预定义事件
 */
export interface PredefinedEvent {
  id: string;
  type: ResearchEventType;
  title: string;
  description: string;
  triggerConditions?: {
    minWeek?: number;
    maxWeek?: number;
    stage?: string;
    minAttribute?: Record<string, number>;
    maxAttribute?: Record<string, number>;
  };
  choices: EventChoice[];
  weight: number; // 触发权重
  cooldown: number; // 冷却周数
}

/**
 * 事件选择
 */
export interface EventChoice {
  id: string;
  text: string;
  effects: {
    attributes?: Record<string, number>;
    credits?: number;
    paper_progress?: number;
    cumulative?: Record<string, number>;
  };
  requirements?: {
    minAttribute?: Record<string, number>;
    minActionPoints?: number;
  };
  outcomes?: {
    success_rate?: number;
    success_effects?: Record<string, number>;
    fail_effects?: Record<string, number>;
  };
  followUp?: string; // 后续事件ID
}

// ============================================================================
// 日常事件
// ============================================================================

/**
 * 日常事件库
 */
export const dailyEvents: PredefinedEvent[] = [
  // === 组会相关 ===
  {
    id: 'weekly_meeting',
    type: 'daily',
    title: '组会汇报',
    description: '又到了每周组会时间，导师让你汇报这周进展。实际上你这周摸鱼了，没有什么实质进展。',
    triggerConditions: {
      minWeek: 4,
    },
    choices: [
      {
        id: 'honest',
        text: '实话实说，承认这周进度慢',
        effects: {
          attributes: { advisor_favor: -5, pressure: 5 },
        },
      },
      {
        id: 'fake',
        text: '编造进展，说"在调研文献"',
        effects: {
          attributes: { pressure: 3 },
        },
        outcomes: {
          success_rate: 60,
          success_effects: {},
          fail_effects: { advisor_favor: -15, pressure: 10 },
        },
      },
      {
        id: 'borrow',
        text: '找师兄帮忙，借点数据汇报',
        effects: {
          attributes: { peer_relation: -5 },
        },
        requirements: {
          minAttribute: { peer_relation: 30 },
        },
      },
    ],
    weight: 10,
    cooldown: 2,
  },

  // === 课程相关 ===
  {
    id: 'course_exam',
    type: 'daily',
    title: '课程考试',
    description: '这周有门课要考试，内容很多，你准备得怎么样了？',
    triggerConditions: {
      minWeek: 1,
      maxWeek: 72,
    },
    choices: [
      {
        id: 'study_hard',
        text: '认真复习，熬夜准备',
        effects: {
          attributes: { health: -10, pressure: 5 },
          credits: 3,
        },
        requirements: {
          minActionPoints: 3,
        },
      },
      {
        id: 'normal_study',
        text: '正常复习，保持节奏',
        effects: {
          attributes: { pressure: 3 },
          credits: 2,
        },
        outcomes: {
          success_rate: 70,
          success_effects: { credits: 1 },
          fail_effects: { credits: 0, pressure: 5 },
        },
      },
      {
        id: 'give_up',
        text: '随便看看，及格就行',
        effects: {
          attributes: { academic_passion: -5 },
        },
        outcomes: {
          success_rate: 40,
          success_effects: { credits: 1 },
          fail_effects: { credits: 0, advisor_favor: -5 },
        },
      },
    ],
    weight: 8,
    cooldown: 6,
  },

  // === 实验相关 ===
  {
    id: 'experiment_fail',
    type: 'daily',
    title: '实验失败',
    description: '你辛辛苦苦准备了一周的实验，结果完全失败了，数据用不了。',
    triggerConditions: {
      minWeek: 20,
    },
    choices: [
      {
        id: 'retry',
        text: '分析原因，重新做实验',
        effects: {
          attributes: { pressure: 10, research_ability: 3 },
        },
        requirements: {
          minActionPoints: 3,
        },
      },
      {
        id: 'ask_help',
        text: '请教师兄师姐',
        effects: {
          attributes: { peer_relation: 3 },
        },
        requirements: {
          minAttribute: { peer_relation: 40 },
        },
      },
      {
        id: 'skip',
        text: '换个方向，重新设计',
        effects: {
          attributes: { academic_passion: -5, advisor_favor: -3 },
        },
      },
    ],
    weight: 6,
    cooldown: 4,
  },
];

// ============================================================================
// 学术伦理事件
// ============================================================================

/**
 * 学术伦理事件库
 */
export const ethicsEvents: PredefinedEvent[] = [
  {
    id: 'data_anomaly',
    type: 'ethics',
    title: '数据异常',
    description: '你正在整理实验数据，发现有一组数据明显不符合预期。删掉这组数据，结论就完美了。保留的话，结论就不成立了。',
    triggerConditions: {
      minWeek: 30,
    },
    choices: [
      {
        id: 'keep_data',
        text: '保留数据，如实报告',
        effects: {
          attributes: { research_ability: 5, academic_passion: 5 },
        },
        followUp: 'paper_harder',
      },
      {
        id: 'remove_data',
        text: '删除数据，"优化"结论',
        effects: {
          attributes: { pressure: -5 },
        },
        outcomes: {
          success_rate: 85,
          success_effects: { paper_progress: 10 },
          fail_effects: { advisor_favor: -30, academic_passion: -20 },
        },
        followUp: 'ethics_risk',
      },
      {
        id: 'redo_experiment',
        text: '重做实验，验证结果',
        effects: {
          attributes: { research_ability: 8, pressure: 15 },
        },
        requirements: {
          minActionPoints: 4,
        },
      },
    ],
    weight: 3,
    cooldown: 20,
  },

  {
    id: 'plagiarism_discovery',
    type: 'ethics',
    title: '发现抄袭',
    description: '你发现同门师兄的论文存在大量抄袭。如果揭发，他的学术生涯将毁于一旦。',
    triggerConditions: {
      minWeek: 20,
    },
    choices: [
      {
        id: 'report',
        text: '严肃处理，上报学校',
        effects: {
          attributes: { peer_relation: -20, academic_passion: 10 },
        },
        followUp: 'reported_consequence',
      },
      {
        id: 'private_talk',
        text: '私下教育，让他重写',
        effects: {
          attributes: { peer_relation: 5, pressure: 5 },
        },
        followUp: 'plagiarism_repeat',
      },
      {
        id: 'ignore',
        text: '装作没看见',
        effects: {
          attributes: { academic_passion: -5, pressure: -3 },
        },
      },
    ],
    weight: 2,
    cooldown: 30,
  },

  {
    id: 'authorship_dispute',
    type: 'ethics',
    title: '作者署名争议',
    description: '你完成了一篇论文，导师却说要挂一作，你只能是二作。你的毕业需要一作论文。',
    triggerConditions: {
      minWeek: 40,
    },
    choices: [
      {
        id: 'accept',
        text: '接受，导师一作自己二作',
        effects: {
          attributes: { advisor_favor: 10, academic_passion: -10 },
        },
        followUp: 'graduation_trouble',
      },
      {
        id: 'negotiate',
        text: '与导师协商，争取共同一作',
        effects: {
          attributes: { advisor_favor: -5, pressure: 10 },
        },
        outcomes: {
          success_rate: 50,
          success_effects: { advisor_favor: 5 },
          fail_effects: { advisor_favor: -15 },
        },
      },
      {
        id: 'refuse',
        text: '坚持要一作，否则不投稿',
        effects: {
          attributes: { advisor_favor: -20, pressure: 20 },
        },
        followUp: 'advisor_conflict',
      },
    ],
    weight: 4,
    cooldown: 25,
  },
];

// ============================================================================
// 人际关系事件
// ============================================================================

/**
 * 人际关系事件库
 */
export const relationshipEvents: PredefinedEvent[] = [
  {
    id: 'love_interest',
    type: 'relationship',
    title: '心动时刻',
    description: '你在实验室认识了一个师兄/师姐，两人聊得很投机。但是导师说过"组内不许谈恋爱"。',
    triggerConditions: {
      minWeek: 10,
    },
    choices: [
      {
        id: 'secret_date',
        text: '暗中交往，不让人知道',
        effects: {
          attributes: { health: 5, academic_passion: 5, pressure: 5 },
        },
        followUp: 'love_exposed',
      },
      {
        id: 'open_date',
        text: '公开关系，接受后果',
        effects: {
          attributes: { advisor_favor: -10, peer_relation: 10 },
        },
      },
      {
        id: 'give_up_love',
        text: '放弃这段感情，专注科研',
        effects: {
          attributes: { academic_passion: -5, pressure: 5 },
        },
      },
    ],
    weight: 3,
    cooldown: 50,
  },

  {
    id: 'advisor_criticism',
    type: 'relationship',
    title: '导师批评',
    description: '导师在组会上当着所有人的面批评了你，说你最近不思进取，论文毫无进展。',
    triggerConditions: {
      minWeek: 15,
    },
    choices: [
      {
        id: 'accept',
        text: '虚心接受，承诺改进',
        effects: {
          attributes: { advisor_favor: 5, pressure: 15, academic_passion: -5 },
        },
      },
      {
        id: 'explain',
        text: '解释困难，说明情况',
        effects: {
          attributes: { pressure: 10 },
        },
        outcomes: {
          success_rate: 40,
          success_effects: { advisor_favor: 10 },
          fail_effects: { advisor_favor: -10 },
        },
      },
      {
        id: 'argue',
        text: '据理力争，表达不满',
        effects: {
          attributes: { advisor_favor: -20, peer_relation: 5 },
        },
        followUp: 'advisor_cold_war',
      },
    ],
    weight: 5,
    cooldown: 15,
  },

  {
    id: 'peer_competition',
    type: 'relationship',
    title: '同门竞争',
    description: '同门师兄跟你抢同一个研究方向，而且他比你进展更快。',
    triggerConditions: {
      minWeek: 25,
    },
    choices: [
      {
        id: 'collaborate',
        text: '主动合作，共同发论文',
        effects: {
          attributes: { peer_relation: 15, research_ability: 5 },
        },
        requirements: {
          minAttribute: { peer_relation: 50 },
        },
      },
      {
        id: 'change_direction',
        text: '换个方向，避免冲突',
        effects: {
          attributes: { pressure: 10 },
        },
      },
      {
        id: 'compete',
        text: '加快进度，抢先发表',
        effects: {
          attributes: { pressure: 20, peer_relation: -10, health: -5 },
        },
        requirements: {
          minActionPoints: 5,
        },
      },
    ],
    weight: 4,
    cooldown: 20,
  },
];

// ============================================================================
// 压力事件
// ============================================================================

/**
 * 压力事件库
 */
export const pressureEvents: PredefinedEvent[] = [
  {
    id: 'paper_rejection',
    type: 'pressure',
    title: '论文被拒',
    description: '你投了3个月的论文被拒了。审稿人的意见很尖锐，说你的工作缺乏创新性。',
    triggerConditions: {
      minWeek: 30,
    },
    choices: [
      {
        id: 'revise',
        text: '认真修改，投同档次期刊',
        effects: {
          attributes: { pressure: 15, research_ability: 5 },
        },
        requirements: {
          minActionPoints: 3,
        },
      },
      {
        id: 'lower_tier',
        text: '降低档次，投更容易的期刊',
        effects: {
          attributes: { academic_passion: -5, pressure: -5 },
        },
      },
      {
        id: 'give_up_paper',
        text: '放弃这篇，开新课题',
        effects: {
          attributes: { academic_passion: -10, pressure: 5 },
        },
      },
    ],
    weight: 5,
    cooldown: 15,
  },

  {
    id: 'graduation_anxiety',
    type: 'pressure',
    title: '毕业焦虑',
    description: '看着同学一个个发了论文，你开始怀疑自己能否按时毕业。',
    triggerConditions: {
      minWeek: 50,
      maxAttribute: { academic_passion: 60 },
    },
    choices: [
      {
        id: 'work_harder',
        text: '更加努力，加班加点',
        effects: {
          attributes: { health: -15, pressure: 20, research_ability: 5 },
        },
      },
      {
        id: 'seek_help',
        text: '找导师或心理咨询',
        effects: {
          attributes: { pressure: -10, health: 5 },
        },
      },
      {
        id: 'accept',
        text: '接受现实，延毕就延毕',
        effects: {
          attributes: { pressure: -15, academic_passion: -10 },
        },
      },
    ],
    weight: 4,
    cooldown: 20,
  },

  {
    id: 'financial_pressure',
    type: 'pressure',
    title: '经济压力',
    description: '家里给的钱不够用，补助又少，这个月又要吃土了。',
    triggerConditions: {
      maxAttribute: { finance: 30 },
    },
    choices: [
      {
        id: 'part_time',
        text: '找份兼职，赚点外快',
        effects: {
          attributes: { finance: 20, pressure: 10, research_ability: -3 },
        },
        requirements: {
          minActionPoints: 2,
        },
      },
      {
        id: 'ask_family',
        text: '向家里要钱',
        effects: {
          attributes: { finance: 30, pressure: 5 },
        },
      },
      {
        id: 'save_money',
        text: '节衣缩食，省钱度日',
        effects: {
          attributes: { finance: 10, health: -5 },
        },
      },
    ],
    weight: 3,
    cooldown: 10,
  },
];

// ============================================================================
// 里程碑事件
// ============================================================================

/**
 * 里程碑事件库
 */
export const milestoneEvents: PredefinedEvent[] = [
  {
    id: 'first_paper',
    type: 'milestone',
    title: '首篇论文',
    description: '你的第一篇学术论文被接收了！虽然只是个普通期刊，但这是你科研生涯的重要一步。',
    triggerConditions: {
      minWeek: 20,
    },
    choices: [
      {
        id: 'celebrate',
        text: '庆祝一下，请师门吃饭',
        effects: {
          attributes: { peer_relation: 10, finance: -10, academic_passion: 15 },
          cumulative: { papers_published: 1 },
        },
      },
      {
        id: 'keep_working',
        text: '继续努力，投更好的期刊',
        effects: {
          attributes: { academic_passion: 10, research_ability: 5 },
          cumulative: { papers_published: 1 },
        },
      },
    ],
    weight: 2,
    cooldown: 100,
  },

  {
    id: 'proposal_defense',
    type: 'milestone',
    title: '开题答辩',
    description: '今天是你开题答辩的日子，五位评委坐在下面，等待你的汇报。',
    triggerConditions: {
      minWeek: 30,
      maxWeek: 60,
    },
    choices: [
      {
        id: 'well_prepared',
        text: '准备充分，从容应对',
        effects: {
          attributes: { advisor_favor: 10, research_ability: 5, pressure: -10 },
        },
        requirements: {
          minAttribute: { research_ability: 50 },
        },
      },
      {
        id: 'nervous',
        text: '有点紧张，但尽力而为',
        effects: {
          attributes: { pressure: 5 },
        },
        outcomes: {
          success_rate: 70,
          success_effects: { advisor_favor: 5 },
          fail_effects: { advisor_favor: -10, pressure: 15 },
        },
      },
    ],
    weight: 1,
    cooldown: 200,
  },
];

// ============================================================================
// 事件库汇总
// ============================================================================

/**
 * 所有预定义事件
 */
export const allEvents: PredefinedEvent[] = [
  ...dailyEvents,
  ...ethicsEvents,
  ...relationshipEvents,
  ...pressureEvents,
  ...milestoneEvents,
];

/**
 * 按类型获取事件
 */
export function getEventsByType(type: ResearchEventType): PredefinedEvent[] {
  return allEvents.filter(e => e.type === type);
}

/**
 * 根据条件筛选可用事件
 */
export function getAvailableEvents(
  currentWeek: number,
  stage: string,
  attributes: Record<string, number>,
  cooldowns: Record<string, number>
): PredefinedEvent[] {
  return allEvents.filter(event => {
    // 检查冷却
    if (cooldowns[event.id] && cooldowns[event.id] > 0) {
      return false;
    }

    // 检查周数条件
    if (event.triggerConditions) {
      const { minWeek, maxWeek, stage: reqStage, minAttribute, maxAttribute } = event.triggerConditions;

      if (minWeek !== undefined && currentWeek < minWeek) return false;
      if (maxWeek !== undefined && currentWeek > maxWeek) return false;
      if (reqStage !== undefined && stage !== reqStage) return false;

      if (minAttribute) {
        for (const [key, value] of Object.entries(minAttribute)) {
          if ((attributes[key] ?? 0) < value) return false;
        }
      }

      if (maxAttribute) {
        for (const [key, value] of Object.entries(maxAttribute)) {
          if ((attributes[key] ?? 0) > value) return false;
        }
      }
    }

    return true;
  });
}

/**
 * 随机选择一个事件（基于权重）
 */
export function selectRandomEvent(events: PredefinedEvent[]): PredefinedEvent | null {
  if (events.length === 0) return null;

  const totalWeight = events.reduce((sum, e) => sum + e.weight, 0);
  let random = Math.random() * totalWeight;

  for (const event of events) {
    random -= event.weight;
    if (random <= 0) return event;
  }

  return events[0];
}

export default {
  dailyEvents,
  ethicsEvents,
  relationshipEvents,
  pressureEvents,
  milestoneEvents,
  allEvents,
  getEventsByType,
  getAvailableEvents,
  selectRandomEvent,
};
