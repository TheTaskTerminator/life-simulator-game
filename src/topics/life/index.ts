import { TopicPackage } from '../../core/types/base';
import { topicConfig } from './topic.config';
import { metricsConfig } from './metrics.config';
import { stagesConfig } from './stages.config';
import { endingsConfig } from './endings.config';
import { themeConfig } from './theme.config';
import { textsConfig } from './texts.config';
import { promptsConfig } from './prompts.config';

/**
 * 人生模拟器话题包
 *
 * 这是默认的话题包，包含完整的人生模拟游戏配置。
 * 包含属性、阶段、结局、主题、文案和 AI Prompt 配置。
 */
export const lifeTopicPackage: TopicPackage = {
  config: topicConfig,
  metrics: metricsConfig,
  stages: stagesConfig,
  endings: endingsConfig,
  theme: themeConfig,
  texts: textsConfig,
  prompts: promptsConfig,
};

export default lifeTopicPackage;

// 导出各配置模块
export { topicConfig } from './topic.config';
export { metricsConfig } from './metrics.config';
export type { LifeMetricKey } from './metrics.config';
export { stagesConfig, getStageNames, getStageByAge } from './stages.config';
export type { LifeStageKey } from './stages.config';
export { endingsConfig } from './endings.config';
export { themeConfig } from './theme.config';
export {
  textsConfig,
  maritalStatusTexts,
  educationLevelTexts,
  careerLevelTexts,
  careerCategoryTexts,
  personTypeTexts,
} from './texts.config';
export { promptsConfig } from './prompts.config';

// 类型重导出（保持与现有代码的兼容性）
export { LifeStage, EducationLevel, CareerCategory, CareerLevel } from './types.config';
