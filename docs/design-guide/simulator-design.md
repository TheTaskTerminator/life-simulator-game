# 模拟器类游戏抽象内核规范 v0.3

> **v0.3 变更说明**：在 v0.2 基础上，更新"附录：规范概念与代码对照"，映射到 SimuEngine 脚手架新架构（`src/core/`、`src/topics/`）；
> 补充 `PromptsConfig` 接口与 `PromptContext` 注入的具体说明；
> 新增"TopicPackage 与规范实体对照"章节。
>
> v0.2 原文存档：`docs/archive/abstract-v0.2.md`

---

## 0. 适用范围与目标

### 0.1 适用范围

* 回合制/阶段制的文字模拟器
* 轻策略、资源管理、随机事件、多结局
* **内容源可以是静态 JSON 事件库，也可以是 AI 实时生成**
* 可扩展到图文/音视频表现层，但内核不依赖表现

**这套规范不适用于：**

* 线性互动小说（一路点下去，无状态累积）
* Galgame / 视觉小说（叙事优先，无排他决策）
* Roguelike 数值堆叠游戏（无语义结局）
* 即时策略或操作类玩法

它服务的唯一核心：

> **"玩家在有限回合内，反复做高代价选择的游戏"**

满足以下特征即在适用范围内：
* 选择会排他
* 后果会累积
* 很多东西一旦错过就回不来

---

### 0.2 设计目标

| 目标 | 含义 |
|------|------|
| 题材无关 | 引擎层不出现语义词，仅在字段名和文案中体现 |
| 内容可规模化 | Prompt 可组合化（AI 场景）或事件结构化（静态场景），两者不互斥 |
| AI 可控 | AI 生成内容必须经过 Schema 约束，引擎不信任 AI 原始输出 |
| 可解释 | 玩家能复盘，开发者能调试，数据可分析 |
| 可验证 | 配置错误在加载时报错，而不是靠线上玩家发现 |

---

## 1. 核心循环

### 1.1 核心循环（物理定律）

```
State → Selector → Choice → Effect → Turn → Ending
  ↑                                              |
  └──────────────────────────────────────────────┘
```

1. **读取**当前 State
2. **Selector 抽取** Event（静态权重筛选 或 AI Prompt 生成）
3. 玩家**选择** Choice
4. **执行** Effects，更新 State
5. **推进** Turn / Phase
6. **检查** Endings

这是**不可破坏的顺序**。

---

### 1.2 AI 驱动场景下的循环变体

```
State → [AI Prompt + 状态注入] → AI 生成 Event+Choice → Schema 校验 → Effect → Turn → Ending
```

**不变的部分**：Effect 计算、Turn 推进、Ending 检查始终由引擎执行，不外包给 AI。

---

## 2. 关键实体

### 2.1 GameConfig

`GameConfig` 是整部模拟器作品的"世界规则说明书"：静态加载，游戏过程中不修改。

在 SimuEngine 中，GameConfig 对应 `TopicConfigBase.parameters`：

```typescript
parameters: {
  maxTurn: 100,          // 最大回合数
  maxAge: 100,           // 最大年龄/时间
  eventsPerTurn: 1,      // 每回合事件数
}
```

属性边界（`metric_bounds`）对应 `MetricDefinition.bounds`：

```typescript
bounds: { min: 0, max: 100 }
```

### 2.2 State

State 是**唯一会随游戏进行变化的东西**。

在 SimuEngine 中，State 对应 `Player` 对象（`src/types.ts` 或 `src/hooks/useGameState.ts`），包含：

```typescript
{
  age: number,            // 当前年龄/时间（= turn）
  stage: string,          // 当前阶段 key
  attributes: Record<string, number>,  // 各属性当前值
  tags: string[],         // 已获得的标签
  // ...
}
```

历史记录（Tag 冷却）对应 `TurnEngine` 内部维护的 `tagCooldowns`。

> 世界不记得你看过什么文字，只记得你当前是什么状态。

### 2.3 Event

事件不是剧情，而是**"你必须站队"的时刻**。

在 SimuEngine 中，AI 生成的事件格式由 `src/schemas/event.schema.ts`（Zod）约束。

### 2.4 Choice 与 Effect

Choice 是**交换条件**：得到 A，失去 B，或承担 C 的风险。

Effect 数值边界由 `MetricsConfig.maxEffectValue` 控制，引擎应用前强制 clamp。

### 2.5 Selector

在 SimuEngine 中，Selector 对应 `src/engine/eventSelector.ts`，结合：
- Tag 冷却状态（`TurnEngine`）
- 玩家属性动态权重调整
- Prompt 状态注入（AI 场景）

### 2.6 Ending

对应 `EndingsConfig`（`src/core/types/base.ts`）：
- 硬结局：`EndingsConfig.hard[]`，条件检查由 `endingEngine.checkHardEnding()` 执行
- 软结局：`EndingsConfig.soft[]`，评价由 `endingEngine.evaluateSoftEnding()` 执行

### 2.7 Log

对应游戏状态中的 `logs: LogEntry[]`，记录每个事件、选择、效果的完整历史。

---

## 3. AI 内容层规范

### 3.1 AI 负责什么 vs 引擎负责什么

| 职责 | 负责方 | SimuEngine 对应位置 |
|------|--------|---------------------|
| 叙事文案 | AI | `aiService.generateEvent()` 返回值 |
| 事件类型（tag）建议 | AI + 引擎验证 | AI 建议，`AIEventSchema` 校验 |
| Effect 数值 | AI 建议 + 引擎 clamp | `updatePlayer()` 中 clamp 到 `maxEffectValue` |
| metric_bounds | 静态配置 | `MetricDefinition.bounds` |
| Ending 触发检查 | 引擎 | `endingEngine.checkHardEnding()` |
| Turn 推进 | 引擎 | `turnEngine.advanceTurn()` |
| cooldown 管理 | 引擎 | `TurnEngine` 内部状态 |

### 3.2 Prompt 工程（SimuEngine v0.3 更新）

在 SimuEngine 中，Prompt 构建通过话题的 `PromptsConfig` 实现：

```typescript
interface PromptsConfig {
  systemPrompt: string;
  eventPromptTemplate: (context: PromptContext) => string;
  consequencePromptTemplate: (context: PromptContext) => string;
}

interface PromptContext {
  player: Record<string, unknown>;   // 玩家状态（含属性值）
  stage: string;                      // 当前阶段
  eventType?: string;                 // 可用的事件 Tag
  metrics: MetricsConfig;             // 属性定义（含 bounds、labels）
  texts: TextsConfig;                 // 话题文案
  [key: string]: unknown;             // 可扩展
}
```

`promptService.ts` 负责调用 `eventPromptTemplate(context)` 生成最终 Prompt，其中 `eventType` 字段已由引擎计算好（排除冷却中的 Tag），作为硬约束传入。

### 3.3 AI 输出 Schema 约束

对应 `src/schemas/event.schema.ts`（Zod 实现）。

### 3.4 降级策略

对应 `src/services/eventService.ts` 中的错误处理逻辑：重试 → 静态事件库 → DAILY 兜底。

---

## 4. 事件约束层

### 4.1 数值边界声明

对应 `MetricDefinition.bounds`（每个属性独立声明），以及 `MetricsConfig.maxEffectValue`（单次 Effect 上限）。

### 4.2 Tag 分类与冷却机制

| Tag | 含义 | 推荐权重 | 冷却回合 |
|-----|------|----------|----------|
| `OPPORTUNITY` | 机遇/正面 | 15 | 2 |
| `CHALLENGE` | 危机/压力 | 15 | 2 |
| `DAILY` | 日常/低影响 | 40 | 0 |
| `SPECIAL` | 特殊/一次性 | 5 | 10 |
| `STAGE` | 阶段转换 | 触发型 | N/A |

**冷却基于 Tag**，不是事件 ID 或文字签名——这在 AI 生成场景中至关重要。

### 4.3 节奏控制

推荐健康事件序列：

```
DAILY → DAILY → CHALLENGE → DAILY → OPPORTUNITY → DAILY → DAILY → SPECIAL
```

---

## 5. 结局系统

### 5.1 硬结局触发条件

对应 `EndingDefinition.condition`：
- `condition.attributes` — 属性条件（如 health <= 0）
- `condition.age` — 时间/回合条件

**触发时机**：每次 Effect 应用后立即检查（不等到 Turn 结束）。

### 5.2 软结局评价函数

对应 `src/engine/endingEngine.ts` 的 `evaluateSoftEnding()`：

```javascript
function evaluateSoftEnding(player) {
  const { health, wealth, happiness } = player.attributes;
  const total = (health / 100) * 0.4
              + Math.min(wealth / 500, 1) * 0.3
              + (happiness / 100) * 0.3;

  // 按 scoreThreshold 降序匹配
  return soft.find(ending => total >= ending.scoreThreshold);
}
```

---

## 6. 校验与质量门槛

### 静态配置校验（加载时）

- `metric_bounds` 的 min < max
- 每个 Event 至少有 2 个 Choice
- `tag` 字段值在合法枚举范围内

### AI 生成内容校验（运行时，Zod Schema）

- Schema 结构校验
- Effect value 在 `maxEffectValue` 限制内
- choices 数量在 2-4 之间

---

## 7. 常见误区

### 7.1 核心循环误区
* 跳过 Choice，直接触发 Effect → 破坏玩家代理感
* 在 Effect 中直接修改游戏流程 → 破坏 Selector 的调度权

### 7.2 数值设计误区
* 所有 Choice 都增加数值，没有代价 → 失去张力
* 不声明 `metric_bounds` → AI 生成的数值可能破坏平衡

### 7.3 结局设计误区
* 只有好/坏两种结局 → 重开动力不足
* 结局由文案决定而非评价函数 → 难以维护

### 7.4 AI 内容误区
* 让 AI 决定 Effect 的数值而不做 clamp → 单次 AI 错误破坏整局平衡
* 让 AI 决定是否触发 Ending → 确定性逻辑外包给概率模型
* 用事件文字签名做冷却去重 → AI 每次生成的文字不同，冷却失效

---

## 8. 版本化与兼容性

* `TopicConfigBase.version` 字段必须存在
* AI 生成的事件不持久化，无需版本管理
* `TopicPackage` 接口变更需考虑向后兼容性（影响所有现有话题）

---

## 附录：v0.3 规范概念与 SimuEngine 代码对照

| 规范概念 | SimuEngine 对应位置 |
|----------|---------------------|
| GameConfig / metric_bounds | `TopicConfigBase.parameters` + `MetricDefinition.bounds` |
| State | `Player` 对象（`src/hooks/useGameState.ts`） |
| Selector | `src/engine/eventSelector.ts` |
| AI Prompt 构建 | `src/services/promptService.ts` + 话题的 `prompts.config.ts` |
| PromptContext | `src/core/types/base.ts` → `PromptContext` 接口 |
| Schema 校验 | `src/schemas/event.schema.ts`（Zod） |
| Effect 应用 + clamp | `useGameState.ts` 的 `updatePlayer()` + `MetricsConfig.maxEffectValue` |
| Ending 检查 | `src/engine/endingEngine.ts` |
| Tag 冷却管理 | `src/engine/turnEngine.ts` |
| Log | `src/hooks/useGameState.ts` → `logs: LogEntry[]` |
| 降级策略 | `src/services/eventService.ts` |

> 本规范是设计意图文档。如果某个规范原则在代码中找不到对应实现，说明存在设计债务，需要补充实现或更新规范。
