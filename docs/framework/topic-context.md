# TopicContext & Hooks

`src/core/context/TopicContext.tsx` 提供了 React Context 和一系列便捷 Hook，让组件可以访问当前话题的配置。

## TopicProvider

```typescript
import { TopicProvider } from '../core/context/TopicContext';

// 必须在需要访问话题数据的组件树外层包裹
<TopicProvider topic={topicPackage}>
  <YourComponent />
</TopicProvider>
```

**作用**：
- 向下传递 `TopicPackage` 中的所有配置
- 自动将 `theme.globalStyles` 注入到页面 `<style>` 标签

## Hook 速查表

| Hook | 返回类型 | 使用场景 |
|------|---------|---------|
| `useTopic()` | `TopicContextValue` | 获取完整上下文（包含 topicId 等） |
| `useTheme()` | `ThemeConfig` | 颜色、字体、间距等样式配置 |
| `useTexts()` | `TextsConfig` | 所有 UI 文案 |
| `useMetrics()` | `MetricsConfig` | 属性定义和边界配置 |
| `useStages()` | `StagesConfig` | 阶段定义列表 |
| `useEndings()` | `EndingsConfig` | 结局配置（硬结局+软结局） |
| `usePrompts()` | `PromptsConfig` | AI Prompt 模板 |
| `useFeatures()` | `TopicFeatures` | 特性开关集合 |
| `useMetricDefinition(key)` | `MetricDefinition \| undefined` | 单个属性的完整定义 |
| `useFeatureEnabled(key)` | `boolean` | 某个特性是否启用 |
| `useStageDefinition(key)` | `StageDefinition \| undefined` | 单个阶段的完整定义 |
| `useThemeVariables()` | `Record<string, string>` | 主题转换为 CSS 变量对象 |

## 使用示例

### 获取主题颜色

```typescript
import { useTheme } from '../core/context/TopicContext';

function MyCard() {
  const theme = useTheme();
  return (
    <div style={{
      background: theme.colors.card,
      color: theme.colors.text,
      border: `1px solid ${theme.colors.border}`,
    }}>
      内容
    </div>
  );
}
```

### 获取 UI 文案

```typescript
import { useTexts } from '../core/context/TopicContext';

function StartButton({ onClick }) {
  const texts = useTexts();
  return <button onClick={onClick}>{texts.startButton}</button>;
}
```

### 条件渲染特性

```typescript
import { useFeatureEnabled } from '../core/context/TopicContext';

function GameToolbar() {
  const hasCareer = useFeatureEnabled('hasCareer');
  const hasAchievement = useFeatureEnabled('hasAchievement');

  return (
    <div>
      {hasCareer && <CareerButton />}
      {hasAchievement && <AchievementButton />}
    </div>
  );
}
```

### 动态属性面板

```typescript
import { useMetrics } from '../core/context/TopicContext';

function StatsPanel({ playerAttributes }) {
  const metrics = useMetrics();
  const definitions = Object.values(metrics.definitions);

  return (
    <div>
      {definitions.map(def => (
        <div key={def.key}>
          <span>{def.icon} {def.label}</span>
          <ProgressBar
            value={playerAttributes[def.key] ?? 0}
            max={def.bounds.max}
            color={def.color}
            isInverted={def.isInverted}
          />
        </div>
      ))}
    </div>
  );
}
```

## 错误处理

在 `TopicProvider` 外部调用任何 Hook 会抛出明确的错误：

```
Error: useTopic must be used within a TopicProvider
```

确保所有使用话题 Hook 的组件都在 `TopicProvider` 的子树内。
