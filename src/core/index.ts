/**
 * Core 模块导出
 */

// 类型
export * from './types';

// 上下文
export {
  TopicProvider,
  useTopic,
  useTopicConfig,
  useTheme,
  useTexts,
  useMetrics,
  useStages,
  useEndings,
  usePrompts,
  useFeatures,
  useMetricDefinition,
  useFeatureEnabled,
  useStageDefinition,
  useThemeVariables,
} from './context/TopicContext';

// 组件
export * from './components';

// 话题管理
export {
  registerTopic,
  getTopic,
  getAvailableTopics,
  hasTopic,
  getDefaultTopic,
} from './topicManager';
