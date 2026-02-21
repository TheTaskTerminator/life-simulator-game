# 核心概念速览

## 话题包（TopicPackage）

话题包是 SimuEngine 的核心概念，它是一个**自包含的模拟器配置对象**，包含运行一个完整模拟器所需的全部规则和外观配置。

```typescript
interface TopicPackage {
  config: TopicConfigBase;   // 元配置（ID、名称、特性开关、参数）
  metrics: MetricsConfig;    // 属性系统（玩家的数值维度）
  stages: StagesConfig;      // 阶段系统（游戏时间轴分段）
  endings: EndingsConfig;    // 结局系统（硬结局 + 软结局）
  theme: ThemeConfig;        // 视觉主题（颜色、字体、间距）
  texts: TextsConfig;        // UI 文案（按钮、标签、提示语）
  prompts: PromptsConfig;    // AI 提示词模板
  components?: TopicComponents; // 可选：自定义 UI 组件
}
```

类型定义位置：`src/core/types/base.ts`

---

## 核心游戏循环

每个回合按照固定顺序执行：

```
State → Selector → Choice → Effect → Turn → Ending
  ↑                                           |
  └───────────────────────────────────────────┘
```

1. **读取 State** — 当前玩家状态（属性、年龄、阶段、日志）
2. **Selector 选择事件类型** — 根据玩家状态和冷却机制智能选择（`src/engine/eventSelector.ts`）
3. **AI 生成事件** — 将玩家状态注入 Prompt，生成事件文案（`src/services/aiService.ts`）
4. **玩家做选择** — 在 EventModal 中选择一个 Choice
5. **执行 Effect** — 更新属性值（clamp 到 bounds 范围内）
6. **推进 Turn** — 年龄/时间 +1，更新冷却
7. **检查 Ending** — 检查是否触发硬结局；达到上限时评价软结局

这个顺序**不可跳过**。引擎层始终负责 Effect 计算和 Ending 判断，不外包给 AI。

---

## AI 与引擎的职责边界

| 职责 | 负责方 |
|------|--------|
| 叙事文案（事件标题、描述、选项文字） | AI 生成 |
| 事件类型（tag）建议 | AI 建议，引擎校验 |
| 数值 Effect（属性变化值） | AI 建议，引擎 clamp 到边界 |
| 属性边界（metric_bounds） | 静态配置，不可动态化 |
| 结局触发检查 | 引擎，确定性逻辑 |
| 冷却管理（Tag 冷却） | 引擎，基于 Tag 而非文字 |

**核心原则**：AI 提供内容，引擎提供结构。AI 每次生成的文字不同，但引擎的规则永远不变。

---

## 事件 Tag 与冷却机制

事件按 Tag 分类，引擎维护每个 Tag 的冷却轮数：

| Tag | 含义 | 冷却 |
|-----|------|------|
| `DAILY` | 日常/低影响 | 0（无冷却） |
| `OPPORTUNITY` | 机遇/正面 | 2 回合 |
| `CHALLENGE` | 危机/压力 | 2 回合 |
| `SPECIAL` | 特殊/转折 | 10 回合 |
| `STAGE` | 阶段切换 | 触发型 |

冷却基于 **Tag 分类**，而非事件的具体文字。这在 AI 生成场景中至关重要——AI 每次生成的文字不同，但 Tag 由引擎验证，冷却机制仍然有效。

---

## 话题隔离机制

每个话题的游戏存档在 localStorage 中独立保存：

```
localStorage key: game-save-{topicId}
```

切换话题不会影响其他话题的存档。`GameStateProvider` 通过 `topicId` 自动处理隔离，无需开发者手动管理。

---

## 硬结局 vs 软结局

**硬结局**：满足特定条件时立即触发
- 属性达到 `isGameOverAt` 值（如健康归零）
- 回合数达到 `maxTurn`（时间耗尽）

**软结局**：达到 `maxTurn` 时按最终状态评分
- 评价函数对各属性加权求和
- 按 `scoreThreshold` 匹配对应结局
- 建议 4 个等级：好（>=0.8）/ 良（>=0.6）/ 中（>=0.4）/ 差（<0.4）

---

## 下一步

- 动手创建话题：[quickstart.md](quickstart.md)
- 了解每个配置文件：[话题开发指南](../topic-development/overview.md)
- 深入理解引擎：[框架原理 → 核心循环](../framework/core-loop.md)
