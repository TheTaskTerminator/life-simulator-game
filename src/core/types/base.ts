/**
 * 核心类型定义 - 框架基础类型（话题无关）
 *
 * 这些类型是通用模拟器框架的基础，不包含任何特定话题的语义。
 * 所有话题特定类型都通过这些泛型类型扩展而来。
 */

// ============================================================================
// 属性/数值定义
// ============================================================================

/**
 * 单个属性的定义
 * 用于描述一个可追踪的数值属性
 */
export interface MetricDefinition {
  /** 属性唯一标识符 */
  key: string;
  /** 显示标签 */
  label: string;
  /** 图标（emoji 或图标名称） */
  icon: string;
  /** 主题色（用于进度条、高亮等） */
  color: string;
  /** 数值边界 */
  bounds: {
    min: number;
    max: number;
  };
  /** 低于此值被认为"低"（用于状态判断） */
  isLowWhenBelow?: number;
  /** 达到此值触发游戏结束（如健康为0） */
  isGameOverAt?: number;
  /** 是否为反向指标（值越高越不好，如压力） */
  isInverted?: boolean;
  /** 描述文本 */
  description?: string;
}

/**
 * 属性配置集合
 */
export interface MetricsConfig {
  /** 属性定义映射 */
  definitions: Record<string, MetricDefinition>;
  /** 初始值范围配置 */
  initialValues: Record<string, { min: number; max: number }>;
  /** 单次效果值上限 */
  maxEffectValue: Record<string, number>;
}

// ============================================================================
// 阶段定义
// ============================================================================

/**
 * 阶段定义
 * 用于描述模拟器中的一个生命周期阶段
 */
export interface StageDefinition {
  /** 阶段唯一标识符 */
  key: string;
  /** 显示名称 */
  label: string;
  /** 描述 */
  description?: string;
  /** 年龄/时间范围 */
  ageRange: {
    min: number;
    max: number;
  };
  /** 该阶段特有的事件类型权重 */
  eventWeights?: Record<string, number>;
  /** 阶段图标 */
  icon?: string;
}

/**
 * 阶段配置集合
 */
export interface StagesConfig {
  /** 阶段定义列表（有序） */
  stages: StageDefinition[];
  /** 默认阶段 */
  defaultStage: string;
}

// ============================================================================
// 结局定义
// ============================================================================

/**
 * 结局类型
 */
export type EndingType = 'good' | 'neutral' | 'bad';

/**
 * 结局条件
 */
export interface EndingCondition {
  /** 属性条件 */
  attributes?: Record<string, { min?: number; max?: number }>;
  /** 年龄条件 */
  age?: { min?: number; max?: number };
  /** 其他条件 */
  custom?: string;
}

/**
 * 结局定义
 */
export interface EndingDefinition {
  /** 结局唯一标识符 */
  id: string;
  /** 标题 */
  title: string;
  /** 描述 */
  description: string;
  /** 结局类型 */
  type: EndingType;
  /** 触发条件（硬结局） */
  condition?: EndingCondition;
  /** 分数阈值（软结局） */
  scoreThreshold?: number;
  /** 结局图标 */
  icon?: string;
}

/**
 * 结局配置集合
 */
export interface EndingsConfig {
  /** 硬结局（满足条件立即触发） */
  hard: EndingDefinition[];
  /** 软结局（达到上限时按分数评价） */
  soft: EndingDefinition[];
}

// ============================================================================
// 主题配置
// ============================================================================

/**
 * 颜色主题配置
 */
export interface ColorTheme {
  /** 主背景色 */
  background: string;
  /** 次背景色 */
  backgroundSecondary: string;
  /** 主文字色 */
  text: string;
  /** 次文字色 */
  textSecondary: string;
  /** 强调色/金色 */
  accent: string;
  /** 成功色 */
  success: string;
  /** 警告色 */
  warning: string;
  /** 危险色 */
  danger: string;
  /** 边框色 */
  border: string;
  /** 卡片背景 */
  card: string;
  /** 模态框背景 */
  modal: string;
}

/**
 * 字体配置
 */
export interface FontTheme {
  /** 标题字体 */
  heading: string;
  /** 正文字体 */
  body: string;
  /** 基础字号 */
  baseSize: number;
}

/**
 * 间距配置
 */
export interface SpacingTheme {
  xs: number;
  sm: number;
  md: number;
  lg: number;
  xl: number;
}

/**
 * 阴影配置
 */
export interface ShadowTheme {
  sm: string;
  md: string;
  lg: string;
}

/**
 * 完整主题配置
 */
export interface ThemeConfig {
  /** 主题名称 */
  name: string;
  /** 颜色 */
  colors: ColorTheme;
  /** 字体 */
  fonts: FontTheme;
  /** 间距 */
  spacing: SpacingTheme;
  /** 阴影 */
  shadows: ShadowTheme;
  /** 圆角 */
  borderRadius: {
    sm: number;
    md: number;
    lg: number;
  };
  /** 全局 CSS 样式（注入到页面） */
  globalStyles?: string;
}

// ============================================================================
// 文案配置
// ============================================================================

/**
 * 文案配置接口
 * 包含所有 UI 显示的文本
 */
export interface TextsConfig {
  /** 游戏标题 */
  gameTitle: string;
  /** 游戏副标题 */
  gameSubtitle?: string;
  /** 开始按钮文字 */
  startButton: string;
  /** 继续按钮文字 */
  continueButton?: string;
  /** 重新开始按钮文字 */
  restartButton: string;
  /** 确认按钮文字 */
  confirmButton: string;
  /** 取消按钮文字 */
  cancelButton: string;

  /** 属性面板标题 */
  statsPanelTitle: string;
  /** 日志面板标题 */
  logPanelTitle: string;

  /** 年龄标签 */
  ageLabel: string;
  /** 阶段标签 */
  stageLabel: string;
  /** 回合标签 */
  turnLabel: string;

  /** 事件相关文案 */
  events: {
    opportunityLabel: string;
    challengeLabel: string;
    dailyLabel: string;
    specialLabel: string;
    stageLabel: string;
    choicePrefix: string;
    effectPrefix: string;
  };

  /** 结局相关文案 */
  endings: {
    gameOverTitle: string;
    scoreLabel: string;
    summaryLabel: string;
  };

  /** 提示信息 */
  messages: {
    loading: string;
    saving: string;
    error: string;
    confirmQuit: string;
    newGame: string;
  };

  /** 其他自定义文案 */
  custom?: Record<string, string>;
}

// ============================================================================
// AI Prompt 配置
// ============================================================================

/**
 * Prompt 上下文
 * 传递给 Prompt 模板的上下文数据
 */
export interface PromptContext {
  /** 玩家状态 */
  player: Record<string, unknown>;
  /** 当前阶段 */
  stage: string;
  /** 事件类型 */
  eventType?: string;
  /** 属性配置 */
  metrics: MetricsConfig;
  /** 文案配置 */
  texts: TextsConfig;
  /** 其他上下文 */
  [key: string]: unknown;
}

/**
 * Prompt 配置
 */
export interface PromptsConfig {
  /** 系统提示词 */
  systemPrompt: string;
  /** 事件生成 Prompt 模板 */
  eventPromptTemplate: (context: PromptContext) => string;
  /** 后果生成 Prompt 模板 */
  consequencePromptTemplate: (context: PromptContext) => string;
  /** 其他自定义 Prompt */
  custom?: Record<string, (context: PromptContext) => string>;
}

// ============================================================================
// 话题配置包
// ============================================================================

/**
 * 话题特性开关
 */
export interface TopicFeatures {
  /** 是否有职业系统 */
  hasCareer?: boolean;
  /** 是否有教育系统 */
  hasEducation?: boolean;
  /** 是否有房产系统 */
  hasProperty?: boolean;
  /** 是否有关系系统 */
  hasRelationship?: boolean;
  /** 是否有投资系统 */
  hasInvestment?: boolean;
  /** 是否有成就系统 */
  hasAchievement?: boolean;
  /** 自定义特性 */
  [key: string]: boolean | undefined;
}

/**
 * 话题元配置
 */
export interface TopicConfigBase {
  /** 话题唯一标识符 */
  id: string;
  /** 话题名称 */
  name: string;
  /** 版本号 */
  version: string;
  /** 描述 */
  description?: string;
  /** 作者 */
  author?: string;
  /** 特性开关 */
  features: TopicFeatures;
  /** 游戏参数 */
  parameters: {
    maxTurn: number;
    maxAge: number;
    eventsPerTurn: number;
  };
}

/**
 * 话题组件映射
 * 用于覆盖默认组件
 */
export interface TopicComponents {
  /** 自定义开始界面 */
  StartScreen?: React.ComponentType<unknown>;
  /** 自定义属性面板 */
  StatsPanel?: React.ComponentType<unknown>;
  /** 自定义结束界面 */
  EndingScreen?: React.ComponentType<unknown>;
  /** 自定义事件模态框 */
  EventModal?: React.ComponentType<unknown>;
  /** 其他自定义组件 */
  [key: string]: React.ComponentType<unknown> | undefined;
}

/**
 * 完整话题配置包
 */
export interface TopicPackage {
  /** 元配置 */
  config: TopicConfigBase;
  /** 属性配置 */
  metrics: MetricsConfig;
  /** 阶段配置 */
  stages: StagesConfig;
  /** 结局配置 */
  endings: EndingsConfig;
  /** 主题配置 */
  theme: ThemeConfig;
  /** 文案配置 */
  texts: TextsConfig;
  /** Prompt 配置 */
  prompts: PromptsConfig;
  /** 自定义组件 */
  components?: TopicComponents;
  /** 话题特定类型（泛型扩展） */
  types?: Record<string, unknown>;
}

// ============================================================================
// 事件系统泛型类型
// ============================================================================

/**
 * 事件类型定义
 */
export interface EventTypeDefinition {
  /** 类型标识 */
  key: string;
  /** 显示标签 */
  label: string;
  /** 图标 */
  icon: string;
  /** 冷却回合数 */
  cooldown: number;
  /** 权重 */
  weight: number;
}

/**
 * 效果类型
 */
export type EffectType = 'attribute' | 'wealth' | 'event' | 'relationship' | 'custom';

/**
 * 通用事件效果
 */
export interface GenericEventEffect<TMetricKey extends string = string> {
  type: EffectType;
  metric?: TMetricKey;
  value: number;
  target?: string;
  description?: string;
}

/**
 * 通用选择
 */
export interface GenericChoice<TMetricKey extends string = string> {
  id: string;
  text: string;
  effects: GenericEventEffect<TMetricKey>[];
  requirements?: {
    metric?: TMetricKey;
    minValue?: number;
    maxValue?: number;
  }[];
}

/**
 * 通用事件
 */
export interface GenericEvent<TStageKey extends string = string, TMetricKey extends string = string> {
  id: string;
  type: string;
  title: string;
  description: string;
  choices: GenericChoice<TMetricKey>[];
  conditions?: {
    age?: { min?: number; max?: number };
    stage?: TStageKey[];
    metric?: { key: TMetricKey; min?: number; max?: number };
  }[];
  effects?: GenericEventEffect<TMetricKey>[];
  aiGenerated: boolean;
}

// ============================================================================
// 工具类型
// ============================================================================

/**
 * 从 MetricsConfig 提取属性键类型
 */
export type MetricKey<T extends MetricsConfig> = keyof T['definitions'];

/**
 * 从 StagesConfig 提取阶段键类型
 */
export type StageKey<T extends StagesConfig> = T['stages'][number]['key'];

/**
 * 深度部分类型
 */
export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};

/**
 * 合并两个配置（用于扩展话题）
 */
export type MergeConfig<TBase, TExtension> = TBase & DeepPartial<TExtension>;
