# 类型系统参考

所有类型定义的权威来源：`src/core/types/base.ts`

## 主要类型速查

| 类型名 | 用途 |
|--------|------|
| `TopicPackage` | 话题包根类型（8个字段） |
| `TopicConfigBase` | 话题元配置（id/name/version/features/parameters） |
| `TopicFeatures` | 特性开关（hasCareer/hasEducation 等） |
| `MetricDefinition` | 单个属性定义（key/label/icon/color/bounds 等） |
| `MetricsConfig` | 属性配置集合（definitions/initialValues/maxEffectValue） |
| `StageDefinition` | 单个阶段定义（key/label/ageRange/eventWeights 等） |
| `StagesConfig` | 阶段配置集合（stages[]/defaultStage） |
| `EndingDefinition` | 单个结局定义（id/title/type/condition/scoreThreshold） |
| `EndingCondition` | 结局触发条件（attributes/age） |
| `EndingsConfig` | 结局配置（hard[]/soft[]） |
| `ThemeConfig` | 完整主题（colors/fonts/spacing/shadows/borderRadius/globalStyles） |
| `ColorTheme` | 颜色主题（11个颜色字段） |
| `FontTheme` | 字体主题（heading/body/baseSize） |
| `SpacingTheme` | 间距配置（xs/sm/md/lg/xl） |
| `ShadowTheme` | 阴影配置（sm/md/lg） |
| `TextsConfig` | 完整文案（gameTitle/buttons/events/endings/messages/custom） |
| `PromptsConfig` | Prompt 配置（systemPrompt/eventPromptTemplate/consequencePromptTemplate） |
| `PromptContext` | Prompt 模板上下文（player/stage/eventType/metrics/texts） |
| `TopicComponents` | 自定义组件映射（StartScreen/EventModal 等） |
| `GenericEvent` | 通用事件（id/type/title/description/choices/conditions） |
| `GenericChoice` | 通用选择（id/text/effects/requirements） |
| `GenericEventEffect` | 通用效果（type/metric/value/target） |
| `EventTypeDefinition` | 事件类型定义（key/label/cooldown/weight） |

## 工具类型

```typescript
// 从 MetricsConfig 提取属性键类型
type MetricKey<T extends MetricsConfig> = keyof T['definitions'];

// 从 StagesConfig 提取阶段键类型
type StageKey<T extends StagesConfig> = T['stages'][number]['key'];

// 深度可选
type DeepPartial<T> = { [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P] };

// 合并配置（用于扩展话题）
type MergeConfig<TBase, TExtension> = TBase & DeepPartial<TExtension>;
```

## 完整类型树

```
TopicPackage
├── config: TopicConfigBase
│   ├── id: string
│   ├── name: string
│   ├── version: string
│   ├── description?: string
│   ├── features: TopicFeatures { [key]: boolean }
│   └── parameters: { maxTurn, maxAge, eventsPerTurn }
├── metrics: MetricsConfig
│   ├── definitions: Record<string, MetricDefinition>
│   │   └── MetricDefinition { key, label, icon, color, bounds, isLowWhenBelow?, isGameOverAt?, isInverted? }
│   ├── initialValues: Record<string, { min, max }>
│   └── maxEffectValue: Record<string, number>
├── stages: StagesConfig
│   ├── stages: StageDefinition[]
│   │   └── StageDefinition { key, label, ageRange, eventWeights?, icon? }
│   └── defaultStage: string
├── endings: EndingsConfig
│   ├── hard: EndingDefinition[]
│   └── soft: EndingDefinition[]
│       └── EndingDefinition { id, title, description, type, condition?, scoreThreshold?, icon? }
├── theme: ThemeConfig
│   ├── colors: ColorTheme { background, text, accent, success, warning, danger, border, card, modal, ... }
│   ├── fonts: FontTheme { heading, body, baseSize }
│   ├── spacing: SpacingTheme { xs, sm, md, lg, xl }
│   ├── shadows: ShadowTheme { sm, md, lg }
│   ├── borderRadius: { sm, md, lg }
│   └── globalStyles?: string
├── texts: TextsConfig
│   ├── gameTitle, gameSubtitle?, startButton, restartButton, ...
│   ├── events: { opportunityLabel, challengeLabel, ... }
│   ├── endings: { gameOverTitle, scoreLabel, summaryLabel }
│   ├── messages: { loading, saving, error, confirmQuit, newGame }
│   └── custom?: Record<string, string>
├── prompts: PromptsConfig
│   ├── systemPrompt: string
│   ├── eventPromptTemplate: (context: PromptContext) => string
│   └── consequencePromptTemplate: (context: PromptContext) => string
└── components?: TopicComponents
    └── { StartScreen?, StatsPanel?, EndingScreen?, EventModal?, [key]: ComponentType }
```
