import React, { createContext, useContext, useMemo, ReactNode } from 'react';
import {
  TopicPackage,
  ThemeConfig,
  TextsConfig,
  MetricsConfig,
  StagesConfig,
  EndingsConfig,
  PromptsConfig,
  TopicConfigBase,
  TopicFeatures,
} from '../types/base';

// ============================================================================
// 上下文类型定义
// ============================================================================

/**
 * 话题上下文值
 */
interface TopicContextValue {
  /** 完整话题包 */
  topic: TopicPackage;
  /** 话题元配置 */
  config: TopicConfigBase;
  /** 主题配置 */
  theme: ThemeConfig;
  /** 文案配置 */
  texts: TextsConfig;
  /** 属性配置 */
  metrics: MetricsConfig;
  /** 阶段配置 */
  stages: StagesConfig;
  /** 结局配置 */
  endings: EndingsConfig;
  /** Prompt 配置 */
  prompts: PromptsConfig;
  /** 特性开关 */
  features: TopicFeatures;
  /** 话题 ID */
  topicId: string;
}

// ============================================================================
// React Context
// ============================================================================

const TopicContext = createContext<TopicContextValue | null>(null);

// ============================================================================
// Provider 组件
// ============================================================================

interface TopicProviderProps {
  /** 话题配置包 */
  topic: TopicPackage;
  /** 子组件 */
  children: ReactNode;
}

/**
 * 话题 Provider
 * 提供话题配置给整个应用
 */
export function TopicProvider({ topic, children }: TopicProviderProps): React.ReactElement {
  const value = useMemo<TopicContextValue>(() => ({
    topic,
    config: topic.config,
    theme: topic.theme,
    texts: topic.texts,
    metrics: topic.metrics,
    stages: topic.stages,
    endings: topic.endings,
    prompts: topic.prompts,
    features: topic.config.features,
    topicId: topic.config.id,
  }), [topic]);

  return (
    <TopicContext.Provider value={value}>
      {/* 注入全局样式 */}
      {topic.theme.globalStyles && (
        <style dangerouslySetInnerHTML={{ __html: topic.theme.globalStyles }} />
      )}
      {children}
    </TopicContext.Provider>
  );
}

// ============================================================================
// 便捷 Hooks
// ============================================================================

/**
 * 获取完整话题上下文
 * @throws 如果不在 TopicProvider 内使用则抛出错误
 */
export function useTopic(): TopicContextValue {
  const context = useContext(TopicContext);
  if (!context) {
    throw new Error('useTopic must be used within a TopicProvider');
  }
  return context;
}

/**
 * 获取话题元配置
 */
export function useTopicConfig(): TopicConfigBase {
  return useTopic().config;
}

/**
 * 获取主题配置
 */
export function useTheme(): ThemeConfig {
  return useTopic().theme;
}

/**
 * 获取文案配置
 */
export function useTexts(): TextsConfig {
  return useTopic().texts;
}

/**
 * 获取属性配置
 */
export function useMetrics(): MetricsConfig {
  return useTopic().metrics;
}

/**
 * 获取阶段配置
 */
export function useStages(): StagesConfig {
  return useTopic().stages;
}

/**
 * 获取结局配置
 */
export function useEndings(): EndingsConfig {
  return useTopic().endings;
}

/**
 * 获取 Prompt 配置
 */
export function usePrompts(): PromptsConfig {
  return useTopic().prompts;
}

/**
 * 获取特性开关
 */
export function useFeatures(): TopicFeatures {
  return useTopic().features;
}

/**
 * 获取指定属性的配置
 * @param key 属性键
 */
export function useMetricDefinition(key: string) {
  const metrics = useMetrics();
  return metrics.definitions[key];
}

/**
 * 检查特性是否启用
 * @param feature 特性名称
 */
export function useFeatureEnabled(feature: keyof TopicFeatures): boolean {
  const features = useFeatures();
  return features[feature] === true;
}

/**
 * 获取当前阶段配置
 * @param stageKey 阶段键
 */
export function useStageDefinition(stageKey: string) {
  const stages = useStages();
  return stages.stages.find(s => s.key === stageKey);
}

// ============================================================================
// 样式工具
// ============================================================================

/**
 * 获取 CSS 变量样式对象
 * 用于将主题转换为 CSS 变量
 */
export function useThemeVariables(): Record<string, string> {
  const theme = useTheme();

  return useMemo(() => ({
    // 颜色
    '--color-background': theme.colors.background,
    '--color-background-secondary': theme.colors.backgroundSecondary,
    '--color-text': theme.colors.text,
    '--color-text-secondary': theme.colors.textSecondary,
    '--color-accent': theme.colors.accent,
    '--color-success': theme.colors.success,
    '--color-warning': theme.colors.warning,
    '--color-danger': theme.colors.danger,
    '--color-border': theme.colors.border,
    '--color-card': theme.colors.card,
    '--color-modal': theme.colors.modal,

    // 字体
    '--font-heading': theme.fonts.heading,
    '--font-body': theme.fonts.body,
    '--font-size-base': `${theme.fonts.baseSize}px`,

    // 间距
    '--spacing-xs': `${theme.spacing.xs}px`,
    '--spacing-sm': `${theme.spacing.sm}px`,
    '--spacing-md': `${theme.spacing.md}px`,
    '--spacing-lg': `${theme.spacing.lg}px`,
    '--spacing-xl': `${theme.spacing.xl}px`,

    // 阴影
    '--shadow-sm': theme.shadows.sm,
    '--shadow-md': theme.shadows.md,
    '--shadow-lg': theme.shadows.lg,

    // 圆角
    '--radius-sm': `${theme.borderRadius.sm}px`,
    '--radius-md': `${theme.borderRadius.md}px`,
    '--radius-lg': `${theme.borderRadius.lg}px`,
  } as unknown as Record<string, string>), [theme]);
}

// ============================================================================
// 默认导出
// ============================================================================

export default TopicContext;
