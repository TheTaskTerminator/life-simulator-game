import { StagesConfig } from '../../core/types/base';

/**
 * 科研模拟器 - 阶段配置
 */
export const stagesConfig: StagesConfig = {
  stages: [
    {
      key: 'phd',
      label: '博士阶段',
      description: '攻读博士学位，发表第一篇论文',
      ageRange: { min: 0, max: 5 },
      icon: '📚',
      eventWeights: {
        daily: 2,
        challenge: 2,
        opportunity: 1,
      },
    },
    {
      key: 'postdoc',
      label: '博后阶段',
      description: '博士后研究，积累论文和项目经验',
      ageRange: { min: 6, max: 10 },
      icon: '🎓',
      eventWeights: {
        opportunity: 2,
        challenge: 2,
        daily: 1,
      },
    },
    {
      key: 'assistant_prof',
      label: '助理教授',
      description: '入职高校，组建研究小组',
      ageRange: { min: 11, max: 20 },
      icon: '👨‍🏫',
      eventWeights: {
        opportunity: 2,
        challenge: 1,
        daily: 2,
        special: 1,
      },
    },
    {
      key: 'associate_prof',
      label: '副教授',
      description: '晋升副教授，获得更多资源',
      ageRange: { min: 21, max: 30 },
      icon: '👩‍🏫',
      eventWeights: {
        opportunity: 2,
        challenge: 1,
        daily: 1,
        special: 1,
      },
    },
    {
      key: 'full_prof',
      label: '正教授',
      description: '成为正教授，引领学术方向',
      ageRange: { min: 31, max: 40 },
      icon: '🎯',
      eventWeights: {
        special: 2,
        opportunity: 2,
        daily: 1,
      },
    },
  ],

  defaultStage: 'phd',
};

export default stagesConfig;

export type ResearchStageKey = typeof stagesConfig.stages[number]['key'];

export function getStageNames(): Record<string, string> {
  return Object.fromEntries(
    stagesConfig.stages.map(s => [s.key, s.label])
  );
}

export function getStageByAge(age: number): string {
  for (const stage of stagesConfig.stages) {
    if (age >= stage.ageRange.min && age <= stage.ageRange.max) {
      return stage.key;
    }
  }
  return stagesConfig.defaultStage;
}
