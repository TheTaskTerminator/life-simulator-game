import { StagesConfig } from '../../core/types/base';

/**
 * 人生模拟器 - 阶段配置
 */
export const stagesConfig: StagesConfig = {
  stages: [
    {
      key: 'childhood',
      label: '童年期',
      description: '无忧无虑的童年时光',
      ageRange: { min: 0, max: 6 },
      icon: '🍼',
      eventWeights: {
        daily: 3,
        special: 2,
      },
    },
    {
      key: 'student',
      label: '学生期',
      description: '求学阶段，为未来打基础',
      ageRange: { min: 7, max: 18 },
      icon: '📚',
      eventWeights: {
        daily: 2,
        opportunity: 2,
        challenge: 1,
      },
    },
    {
      key: 'young_adult',
      label: '青年期',
      description: '人生起步，充满可能性',
      ageRange: { min: 19, max: 25 },
      icon: '🌟',
      eventWeights: {
        opportunity: 3,
        challenge: 2,
        daily: 1,
      },
    },
    {
      key: 'adult',
      label: '成年期',
      description: '事业发展的黄金时期',
      ageRange: { min: 26, max: 40 },
      icon: '💼',
      eventWeights: {
        opportunity: 2,
        challenge: 2,
        daily: 1,
        special: 1,
      },
    },
    {
      key: 'middle_age',
      label: '中年期',
      description: '人生的中场，责任与机遇并存',
      ageRange: { min: 41, max: 60 },
      icon: '🏠',
      eventWeights: {
        challenge: 2,
        opportunity: 1,
        daily: 2,
        special: 1,
      },
    },
    {
      key: 'elderly',
      label: '老年期',
      description: '享受晚年，回顾人生',
      ageRange: { min: 61, max: 120 },
      icon: '🌅',
      eventWeights: {
        daily: 3,
        special: 2,
        challenge: 1,
      },
    },
  ],

  defaultStage: 'childhood',
};

export default stagesConfig;

/**
 * 阶段键类型
 */
export type LifeStageKey = typeof stagesConfig.stages[number]['key'];

/**
 * 获取阶段名称映射
 */
export function getStageNames(): Record<string, string> {
  return Object.fromEntries(
    stagesConfig.stages.map(s => [s.key, s.label])
  );
}

/**
 * 根据年龄获取阶段
 */
export function getStageByAge(age: number): string {
  for (const stage of stagesConfig.stages) {
    if (age >= stage.ageRange.min && age <= stage.ageRange.max) {
      return stage.key;
    }
  }
  return stagesConfig.defaultStage;
}
