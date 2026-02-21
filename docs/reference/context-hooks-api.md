# TopicContext Hooks API

文件位置：`src/core/context/TopicContext.tsx`

## TopicProvider

```typescript
function TopicProvider({ topic, children }: {
  topic: TopicPackage;
  children: ReactNode;
}): JSX.Element
```

**副作用**：自动将 `topic.theme.globalStyles` 注入到页面 `<style>` 标签。

## Hook 完整签名

### `useTopic()`

```typescript
function useTopic(): {
  topic: TopicPackage;
  config: TopicConfigBase;
  theme: ThemeConfig;
  texts: TextsConfig;
  metrics: MetricsConfig;
  stages: StagesConfig;
  endings: EndingsConfig;
  prompts: PromptsConfig;
  features: TopicFeatures;
  topicId: string;
}
```

### `useTheme()` / `useTexts()` / `useMetrics()` / `useStages()` / `useEndings()` / `usePrompts()` / `useFeatures()`

各返回对应子配置对象（`ThemeConfig`、`TextsConfig` 等）。

### `useMetricDefinition(key: string)`

```typescript
function useMetricDefinition(key: string): MetricDefinition | undefined
```

返回指定 key 的属性完整定义，不存在时返回 `undefined`。

### `useFeatureEnabled(feature: string)`

```typescript
function useFeatureEnabled(feature: string): boolean
```

返回指定特性开关的值，未定义时返回 `false`。

### `useStageDefinition(stageKey: string)`

```typescript
function useStageDefinition(stageKey: string): StageDefinition | undefined
```

### `useThemeVariables()`

```typescript
function useThemeVariables(): Record<string, string>
```

将 `ThemeConfig` 转换为 CSS 变量格式的对象，用于 `style` 属性注入：

```typescript
const cssVars = useThemeVariables();
// → {
//   '--color-background': '#0a0a1a',
//   '--color-accent': '#d4af37',
//   '--font-heading': "'Cinzel', serif",
//   '--spacing-md': '16px',
//   ...
// }

<div style={cssVars}>...</div>
```

## 错误行为

在 `TopicProvider` 外部调用任何 Hook 时，抛出：

```
Error: useTopic must be used within a TopicProvider.
Make sure your component is wrapped in <TopicProvider>.
```
