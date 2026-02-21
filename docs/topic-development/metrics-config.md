# metrics.config.ts 属性系统

定义玩家的数值维度——游戏中所有可追踪的属性。

类型：`MetricsConfig`（`src/core/types/base.ts`）

## 完整接口

```typescript
interface MetricsConfig {
  definitions: Record<string, MetricDefinition>;
  initialValues: Record<string, { min: number; max: number }>;
  maxEffectValue: Record<string, number>;
}

interface MetricDefinition {
  key: string;
  label: string;
  icon: string;
  color: string;
  bounds: { min: number; max: number };
  isLowWhenBelow?: number;
  isGameOverAt?: number;
  isInverted?: boolean;
  description?: string;
}
```

## MetricDefinition 字段详解

### `key`

属性唯一标识符，在 Effect、Prompt 注入等场景中使用。

- **命名规范**：snake_case，如 `research_ability`、`advisor_favor`
- **用途**：AI 生成的 Effect 中的 `metric` 字段必须匹配此 key

### `label` / `icon` / `color`

- `label`：属性的显示名称（如"体力"、"科研能力"）
- `icon`：emoji 或图标标识（如"💪"、"🔬"），显示在属性面板
- `color`：CSS 颜色值，用于进度条颜色

### `bounds`

属性的合法数值范围。引擎会在每次 Effect 应用后自动 clamp：

```
new_value = clamp(current + delta, bounds.min, bounds.max)
```

- **标准属性**：`{ min: 0, max: 100 }`
- **无上限资源**：`{ min: 0, max: Infinity }` — 适用于财富、收入等
- **注意**：不要依赖 AI 自觉控制数值，边界声明是强制的

### `isLowWhenBelow`（可选）

低于此值时，UI 会显示警告状态（进度条变红）。建议设为 `bounds.max * 0.3`。

### `isGameOverAt`（可选）

属性达到此值时立即触发硬结局（游戏结束）。

```typescript
isGameOverAt: 0  // 归零时游戏结束
```

**注意**：`isGameOverAt` 的检查在 `src/engine/endingEngine.ts` 中的 `checkHardEnding()` 执行。话题必须在 `endings.hard` 中定义对应的结局说明，否则结局界面会显示默认文本。

### `isInverted`（可选）

反向属性，值越高越不好（如"压力"、"疲惫"）。

影响：
- 进度条颜色逻辑反转（值高时显示红色）
- `DynamicStatsPanel` 中的图标方向

### `description`（可选）

属性的详细说明，显示在属性详情弹窗中。

## MetricsConfig 其他字段

### `initialValues`

各属性的初始值随机范围。游戏开始时在 `[min, max]` 区间内随机生成，制造差异化的游戏起点。

```typescript
initialValues: {
  health: { min: 70, max: 100 },
  wealth: { min: 0, max: 50 },
}
```

### `maxEffectValue`

单次 AI 生成 Effect 允许的最大数值变化（绝对值）。引擎在应用 AI Effect 前进行校验，超出则 clamp。

```typescript
maxEffectValue: {
  health: 20,     // 单次最多变化 ±20
  wealth: 100,
  happiness: 25,
}
```

**设计原则**：设为 `bounds.max * 0.2 ~ 0.3` 之间，防止单次 AI 错误破坏游戏平衡。

## 设计建议

- **属性数量**：4-8 个（太多玩家难以关注全部）
- **必须有一个** `isGameOverAt` 属性（制造危机感，否则玩家无紧迫感）
- **必须有一个** `isInverted` 属性（制造持续的压力来源）
- **至少一个**资源类属性（财富、积分等，让玩家有积累感）

## 参考实现

| 话题 | 属性数 | 特色 |
|------|--------|------|
| `src/topics/life/metrics.config.ts` | 6个 | 标准实现，health 归零游戏结束，stress 为反向属性 |
| `src/topics/research/metrics.config.ts` | 7个 | academic_passion 归零触发"学术倦怠"结局，pressure 为反向属性 |
