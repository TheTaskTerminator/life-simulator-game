import { TopicPackage } from '../../core/types/base';
import { topicConfig } from './topic.config';
import { metricsConfig } from './metrics.config';
import { stagesConfig } from './stages.config';
import { endingsConfig } from './endings.config';
import { themeConfig } from './theme.config';
import { textsConfig } from './texts.config';
import { promptsConfig } from './prompts.config';

/**
 * 科研模拟器话题包
 *
 * 这是扩展话题包示例，展示如何创建新的模拟器话题。
 * 包含学术生涯的属性、阶段、结局、主题、文案和 AI Prompt 配置。
 */
export const researchTopicPackage: TopicPackage = {
  config: topicConfig,
  metrics: metricsConfig,
  stages: stagesConfig,
  endings: endingsConfig,
  theme: themeConfig,
  texts: textsConfig,
  prompts: promptsConfig,
};

export default researchTopicPackage;

// 导出各配置模块
export { topicConfig } from './topic.config';
export { metricsConfig } from './metrics.config';
export type { ResearchMetricKey } from './metrics.config';
export { stagesConfig, getStageNames, getStageByAge } from './stages.config';
export type { ResearchStageKey } from './stages.config';
export { endingsConfig } from './endings.config';
export { themeConfig } from './theme.config';
export {
  textsConfig,
  academicPositionTexts,
  researchFieldTexts,
} from './texts.config';
export { promptsConfig } from './prompts.config';
