# 核心游戏循环

## 循环图

```
State → Selector → Choice → Effect → Turn → Ending
  ↑                                           |
  └───────────────────────────────────────────┘
```

这个顺序**不可跳过**，是整个框架的核心约束。

## 各步骤详解

### 1. 读取 State

当前玩家状态，包含：
- `player.age` — 当前年龄/时间
- `player.attributes` — 各属性当前值
- `player.stage` — 当前阶段
- `player.tags` — 已获得的标签（职业、婚姻等）

**代码位置**：`src/hooks/useGameState.ts`

### 2. Selector 选择事件类型

`EventSelector` 根据玩家状态智能选择本回合应该触发的事件 Tag：

- 读取 `TurnEngine` 维护的 Tag 冷却状态
- 根据玩家属性动态调整权重（如 health 低时降低 CHALLENGE 权重）
- 返回本回合可用的 Tag

**代码位置**：`src/engine/eventSelector.ts`

### 3. AI 生成事件

`AIService` 将玩家状态和事件 Tag 注入 Prompt 模板，调用 AI 接口生成事件：

- 使用话题的 `promptsConfig.eventPromptTemplate()` 构建 Prompt
- AI 返回 JSON 格式的事件（含 title、description、choices）
- Zod Schema 校验 AI 输出（`src/schemas/`）
- 校验失败 → 触发降级策略

**代码位置**：`src/services/aiService.ts`

### 4. 玩家做选择

`EventModal` 显示事件，玩家选择一个 Choice。

每个 Choice 都有"代价"——没有完全安全的选择，这是核心设计原则。

### 5. 执行 Effect

根据玩家的选择和 AI 生成的后果，更新属性：

```typescript
// Effect 应用逻辑（src/hooks/useGameState.ts updatePlayer()）
const newValue = Math.max(
  bounds.min,
  Math.min(bounds.max, current + delta)
);  // clamp 到 [min, max] 范围
```

`maxEffectValue` 约束：AI 建议的单次变化值如超过上限，会被 clamp 到边界。

### 6. 推进 Turn

```typescript
// src/engine/turnEngine.ts advanceTurn()
player.age += 1;
tagCooldowns.forEach((turns, tag) => {
  if (turns > 0) tagCooldowns.set(tag, turns - 1);
});
```

### 7. 检查 Ending

每次 Effect 应用后，引擎立即检查硬结局条件：

```typescript
// src/engine/endingEngine.ts checkHardEnding()
if (player.attributes.health <= 0) {
  return endings.hard.find(e => e.condition?.attributes?.health?.max === 0);
}
if (player.age >= parameters.maxAge) {
  return endings.hard.find(e => e.condition?.age?.min >= parameters.maxAge);
}
return null; // 未触发任何硬结局
```

达到 `maxTurn` 时，调用 `evaluateSoftEnding()` 评分并匹配软结局。

## AI 失败降级路径

```
AI 生成失败
    ↓
重试（最多1次）
    ↓
静态事件库（如话题配置了 events.config.ts）
    ↓
DAILY 兜底事件（内置通用日常事件）
```

每次降级都记录到游戏 Log。

## 冷却机制（基于 Tag）

```
触发 CHALLENGE 事件后：
  → tagCooldowns.set('CHALLENGE', 2)

下一回合：
  → 'CHALLENGE' 冷却剩余 1 轮，本轮不可用

再下一回合：
  → 'CHALLENGE' 冷却剩余 0 轮，重新可用
```

**重要**：冷却基于 Tag 分类，不是事件的具体文字。AI 每次生成的文字不同，但 Tag 由引擎校验——这样冷却机制才能在 AI 生成场景中正常工作。

## 常见误区

- **不要跳过 Choice**：如果某个效果不需要玩家选择，它应该是一个只有"确认"按钮的事件，而不是直接修改状态
- **不要让 AI 决定是否触发 Ending**：结局判断必须在引擎中确定性执行
- **不要在 Effect 中直接修改游戏流程**：Effect 只能改变数值，不能"跳转到某个特定事件"
