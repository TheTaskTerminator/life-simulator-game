import { TopicConfigBase } from '../../core/types/base';

/**
 * 学术之路 - 研究生模拟器话题元配置
 */
export const topicConfig: TopicConfigBase = {
  id: 'research-simulator',
  name: '学术之路',
  version: '2.0.0',
  description: '扮演一名研究生，在规定学制内完成课程、发表论文、通过答辩。体验真实的科研生活、导师关系、同门竞争和毕业压力。',
  author: 'Life Simulator Team',

  features: {
    // === 核心系统 ===
    hasWeekSystem: true,        // 周制时间系统
    hasActionPoints: true,      // 行动点系统
    hasSemesterSystem: true,    // 学期制
    hasGraduation: true,        // 毕业条件系统

    // === 关系系统 ===
    hasAdvisor: true,           // 导师系统
    hasPeers: true,             // 同门系统
    hasRelationship: false,     // 通用关系（用导师和同门替代）

    // === 研究系统 ===
    hasResearchCycle: true,     // 研究周期系统
    hasHotspots: true,          // 学术热点系统
    hasPapers: true,            // 论文系统
    hasCourses: true,           // 课程系统

    // === 学术伦理 ===
    hasEthicsEvents: true,      // 学术伦理事件

    // === 遗留系统（禁用） ===
    hasCareer: false,           // 无职业系统（用学术阶段替代）
    hasEducation: false,        // 无教育系统（用课程学分替代）
    hasProperty: false,         // 无房产
    hasInvestment: false,       // 无投资
    hasAchievement: true,       // 学术成就
  },

  parameters: {
    // 硕士3年 = 108周，博士4年 = 144周
    maxTurn: 144,       // 最大周数（博士+延毕）
    maxAge: 180,        // 最大周数（含延毕）
    eventsPerTurn: 1,   // 每周事件数
  },

  // 扩展参数（自定义）
  customParams: {
    // 学历类型
    degreeTypes: ['master_academic', 'master_professional', 'doctor'],
    defaultDegree: 'master_academic',

    // 学制配置
    masterWeeks: 108,   // 硕士3年
    doctorWeeks: 144,   // 博士4年
    maxExtendWeeks: 72, // 最大延毕周数

    // 毕业要求
    graduationRequirements: {
      master_academic: {
        credits: 30,
        papers: 1,
      },
      master_professional: {
        credits: 36,
        papers: 0,
      },
      doctor: {
        credits: 20,
        papers: 2,
      },
    },

    // 行动点配置
    maxActionPoints: 10,

    // 学期配置
    weeksPerSemester: 18,
    semestersPerYear: 2,
  },
} as TopicConfigBase;

export default topicConfig;

/**
 * 学历类型
 */
export type DegreeType = 'master_academic' | 'master_professional' | 'doctor';

/**
 * 学历配置
 */
export const degreeLabels: Record<DegreeType, string> = {
  master_academic: '学术硕士',
  master_professional: '专业硕士',
  doctor: '博士研究生',
};

/**
 * 获取学历默认周数
 */
export function getDefaultWeeks(degree: DegreeType): number {
  const weeks: Record<DegreeType, number> = {
    master_academic: 108,
    master_professional: 72,
    doctor: 144,
  };
  return weeks[degree];
}
