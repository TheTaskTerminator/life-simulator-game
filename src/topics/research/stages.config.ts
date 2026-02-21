import { StagesConfig, StageDefinition } from '../../core/types/base';

/**
 * 学术之路 - 阶段配置
 *
 * 按研究生年级划分，而非学术职级
 * ageRange 在此处表示"第几周到第几周"
 */

/**
 * 硕士阶段配置
 */
export const masterStages: StagesConfig = {
  stages: [
    {
      key: 'master_year1',
      label: '研一',
      description: '课程学习阶段，适应研究生生活',
      ageRange: { min: 0, max: 35 }, // 第0-35周
      icon: '📚',
      eventWeights: {
        daily: 3,
        challenge: 1,
        opportunity: 1,
      },
    },
    {
      key: 'master_year2',
      label: '研二',
      description: '开题、开展研究、发表论文',
      ageRange: { min: 36, max: 71 }, // 第36-71周
      icon: '🔬',
      eventWeights: {
        daily: 2,
        challenge: 2,
        opportunity: 2,
        special: 1,
      },
    },
    {
      key: 'master_year3',
      label: '研三',
      description: '毕业论文写作、找工作、答辩',
      ageRange: { min: 72, max: 126 }, // 第72-126周（含延毕）
      icon: '🎓',
      eventWeights: {
        special: 2,
        challenge: 2,
        daily: 1,
        opportunity: 1,
      },
    },
  ],
  defaultStage: 'master_year1',
};

/**
 * 博士阶段配置
 */
export const doctorStages: StagesConfig = {
  stages: [
    {
      key: 'doctor_year1',
      label: '博一',
      description: '课程学习、资格考试、确定研究方向',
      ageRange: { min: 0, max: 35 },
      icon: '📚',
      eventWeights: {
        daily: 3,
        challenge: 2,
        opportunity: 1,
      },
    },
    {
      key: 'doctor_year2',
      label: '博二',
      description: '开题、深入研究、发表论文',
      ageRange: { min: 36, max: 71 },
      icon: '🔬',
      eventWeights: {
        daily: 2,
        challenge: 2,
        opportunity: 2,
        special: 1,
      },
    },
    {
      key: 'doctor_year3',
      label: '博三',
      description: '中期考核、积累成果、扩大影响力',
      ageRange: { min: 72, max: 107 },
      icon: '📝',
      eventWeights: {
        opportunity: 2,
        challenge: 2,
        daily: 2,
        special: 1,
      },
    },
    {
      key: 'doctor_year4',
      label: '博四',
      description: '毕业论文、盲审、答辩',
      ageRange: { min: 108, max: 216 }, // 含延毕
      icon: '🎓',
      eventWeights: {
        special: 3,
        challenge: 2,
        daily: 1,
        opportunity: 1,
      },
    },
  ],
  defaultStage: 'doctor_year1',
};

/**
 * 默认阶段配置（硕士）
 */
export const stagesConfig = masterStages;

export default stagesConfig;

export type ResearchStageKey = typeof masterStages.stages[number]['key'] | typeof doctorStages.stages[number]['key'];

/**
 * 获取阶段名称映射
 */
export function getStageNames(): Record<string, string> {
  const masterNames = Object.fromEntries(
    masterStages.stages.map(s => [s.key, s.label])
  );
  const doctorNames = Object.fromEntries(
    doctorStages.stages.map(s => [s.key, s.label])
  );
  return { ...masterNames, ...doctorNames };
}

/**
 * 根据周数获取当前阶段（硕士）
 */
export function getStageByWeek(week: number, isDoctor: boolean = false): string {
  const stages = isDoctor ? doctorStages.stages : masterStages.stages;
  for (const stage of stages) {
    if (week >= stage.ageRange.min && week <= stage.ageRange.max) {
      return stage.key;
    }
  }
  return isDoctor ? doctorStages.defaultStage : masterStages.defaultStage;
}

/**
 * 获取阶段详细信息
 */
export function getStageInfo(stageKey: string): StageDefinition | null {
  const allStages = [...masterStages.stages, ...doctorStages.stages];
  return allStages.find(s => s.key === stageKey) ?? null;
}

/**
 * 计算年级
 */
export function getYearInSchool(week: number): number {
  return Math.floor(week / 36) + 1;
}

/**
 * 格式化年级显示
 */
export function formatYearInSchool(week: number, isDoctor: boolean = false): string {
  const year = getYearInSchool(week);
  const prefix = isDoctor ? '博' : '研';
  return `${prefix}${year}`;
}
