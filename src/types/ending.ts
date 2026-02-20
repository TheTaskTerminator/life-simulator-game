/**
 * 结局类型
 */
export type EndingType = 'good' | 'neutral' | 'bad';

/**
 * 结局条件
 */
export interface EndingCondition {
  // 属性条件
  health?: number;
  intelligence?: number;
  charm?: number;
  wealth?: number;
  happiness?: number;
  stress?: number;
  // 年龄条件
  age?: number;
}

/**
 * 结局定义
 */
export interface Ending {
  id: string;
  title: string;
  description: string;
  type: EndingType;
  condition?: EndingCondition;
  scoreThreshold?: number;
}

/**
 * 结局评价结果
 */
export interface EndingResult {
  ending: Ending;
  score: number;
  stats: {
    finalAge: number;
    totalEvents: number;
    totalChoices: number;
    achievements: number;
    finalWealth: number;
    avgHappiness: number;
  };
}

/**
 * 结局评价详情
 */
export interface EndingEvaluation {
  healthScore: number;
  wealthScore: number;
  happinessScore: number;
  totalScore: number;
  grade: 'S' | 'A' | 'B' | 'C' | 'D' | 'F';
}
