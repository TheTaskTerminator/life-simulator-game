# 模拟器类游戏抽象内核规范 v0.2

> **v0.2 变更说明**：在 v0.1 基础上，新增 AI 内容层规范、事件约束层、具体化结局系统；
> 调整"内容可规模化"前提为"Prompt 可组合化"；移除仅适用于人工创作场景的限制性表述。

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

如果你在设计中出现以下想法，几乎可以确定你在把模拟器做回数值游戏或剧情游戏：
* "这个事件不需要选择"
* "我想先给奖励，再让玩家选"
* "这一步直接跳过事件"

---

### 1.2 AI 驱动场景下的循环变体

在 100% AI 生成内容的场景中，循环步骤 2-3 会发生以下变化：

```
State → [AI Prompt + 状态注入] → AI 生成 Event+Choice → Schema 校验 → Effect → Turn → Ending
```

**关键变化**：
* Selector 的"条件筛选"由"把玩家状态注入 Prompt"替代
* AI 输出的 Event/Choice 必须通过 Schema 校验后才能进入 Effect 管道
* 校验失败时启用降级策略（见第 3.4 节）

**不变的部分**：Effect 计算、Turn 推进、Ending 检查始终由引擎执行，不外包给 AI。

---

## 2. 关键实体

### 2.1 GameConfig（最小可行版本）

`GameConfig` 是整部模拟器作品的"世界规则说明书"：静态加载，游戏过程中不修改。

```json
{
  "version": "1.0",
  "parameters": {
    "max_turn": 60,
    "events_per_turn": 1,
    "initial_metrics": {
      "health": 100,
      "wealth": 50,
      "happiness": 60
    },
    "metric_bounds": {
      "health": [0, 100],
      "wealth": [0, 999],
      "happiness": [0, 100]
    }
  },
  "endings": [...],
  "events": [...]
}
```

**`max_turn`**：不是"60年"，而是"这一局一共有60次关键决策机会"——命运长度的抽象。

**`events_per_turn`**：强制限制每回合信息密度，避免事件洪水、玩家疲劳、决策贬值。

**`metric_bounds`**：声明式数值边界。AI 生成的 Effect 必须在此范围内，引擎层负责 clamp，不依赖 AI 自觉。

---

### 2.2 State（运行时状态）

State 是**唯一会随游戏进行变化的东西**。

```json
{
  "turn": 12,
  "phase": "youth",
  "metrics": {
    "health": 78,
    "wealth": 45,
    "happiness": 55
  },
  "tags": ["entrepreneur", "single"],
  "history": {
    "event_ids_seen": ["evt_001", "evt_023"],
    "tag_cooldowns": {
      "CHALLENGE": 0,
      "OPPORTUNITY": 2
    }
  }
}
```

> **世界不记得你看过什么文字，只记得你当前是什么状态。**

如果某件事会影响未来，它必须体现在 metrics 或 tags 中，不能只存在于文案里。

**`history.tag_cooldowns`**：冷却机制基于事件 tag（分类），而非基于事件文字签名。这是 AI 生成场景中防止同类事件连续出现的正确做法——AI 每次生成的文字签名不同，但 tag 分类是引擎控制的。

---

### 2.3 Event（事件）

事件不是剧情，而是**"你必须站队"的时刻**。设计事件时自问：不选会不会更好？（不应该）

```json
{
  "id": "evt_opportunity_001",
  "tag": "OPPORTUNITY",
  "weight": 10,
  "once": false,
  "cooldown": 3,
  "source": "static",
  "title": "创业机会",
  "description": "...",
  "choices": [...]
}
```

**字段说明**：

| 字段 | 说明 |
|------|------|
| `tag` | 事件分类，用于冷却控制和节奏管理（见第 4.2 节） |
| `weight` | 出现频率倾向，不是"重要性"；可被 Selector 动态调整 |
| `once` | 适合命运转折事件，不适合日常事件 |
| `cooldown` | 同 tag 的事件冷却轮数 |
| `source` | `static`（JSON配置）或 `ai`（AI生成，需校验） |

**AI 生成的事件**无 `id` 字段，由引擎在校验通过后临时分配，不持久化到事件库。

---

### 2.4 Choice 与 Effect

Choice 不是"选剧情走向"，而是**交换条件**。一个合格的 Choice：
* 得到 A
* 失去 B
* 或承担 C 的风险

```json
{
  "id": "choice_a",
  "label": "接受机会",
  "effects": [
    {
      "type": "modify_metric",
      "target": "wealth",
      "value": 20,
      "probability": 0.7
    },
    {
      "type": "modify_metric",
      "target": "health",
      "value": -10,
      "probability": 1.0
    }
  ]
}
```

**Effect 数值边界约束**：AI 生成的 Effect 中，`value` 的绝对值不得超过对应 metric 范围的 30%（单次决策影响上限）。引擎在应用 Effect 前执行此校验，超出则 clamp 到边界。

**`probability` 的设计意图**：随机性不是为了"刺激"，而是打破最优解、制造"命运不完全可控"的感觉、鼓励重开。只用在高风险选择，不用在日常操作。

---

### 2.5 Selector（事件选择器）

Selector 是"命运调度器"。它回答的问题不是"随机选一个"，而是：

> **"在当前状态下，什么问题最合理地发生？"**

**静态配置场景**：基于 `weight` 加权随机 + `tag_cooldowns` 过滤 + `conditions` 匹配。

**AI 驱动场景**：把玩家状态注入 Prompt，由 AI 决定当前最合理的事件类型，再由引擎根据 tag 做冷却过滤。

```
// AI 场景下 Selector 的工作流
1. 读取 State，提取关键指标和 tags
2. 读取 tag_cooldowns，确定当前可用的事件类型
3. 构建 Prompt（含状态快照 + 可用类型约束）
4. AI 生成 Event JSON
5. Schema 校验
6. 通过 → 进入 Choice 阶段；失败 → 降级策略
```

**动态权重的意义**：压力高 → 危机感增强；资源高 → 诱惑变多。玩家会感觉"世界在回应我的状态"。

---

### 2.6 Ending（结局）

见第 5 节的具体化定义。

---

### 2.7 Log

Log 是玩家复盘工具、设计平衡工具、未来风控与推荐的基础。

```json
{
  "turn": 5,
  "event_id": "evt_001",
  "event_tag": "CHALLENGE",
  "choice_id": "choice_b",
  "effects_applied": [
    {"target": "health", "delta": -15}
  ],
  "state_snapshot": {...}
}
```

Log 的意义被很多人低估：没有完整 Log，你无法知道哪些事件从未被触发、哪些选择从未被选择。

---

## 3. AI 内容层规范

### 3.1 AI 负责什么 vs 引擎负责什么

| 职责 | 负责方 | 理由 |
|------|--------|------|
| 叙事文案（title/description/choice label） | AI | 语言丰富性，AI 有优势 |
| 事件类型（tag）决策 | AI + 引擎验证 | AI 决定，引擎校验合法性 |
| Effect 数值 | AI 建议 + 引擎 clamp | 数值需在边界内，不信任 AI 原始值 |
| metric_bounds 定义 | 静态配置 | 游戏平衡的底线，不可动态化 |
| Ending 触发检查 | 引擎 | 确定性逻辑，不可外包 |
| Turn 推进 | 引擎 | 游戏核心节奏，不可外包 |
| cooldown 管理 | 引擎 | 基于 tag 的状态机，引擎维护 |

**核心原则**：AI 提供内容，引擎提供结构。不要让 AI 决定"发生了什么"——只让 AI 决定"怎么描述正在发生的事"。

---

### 3.2 Prompt 工程作为 Selector 的替代

在 AI 驱动场景中，传统 Selector 的"条件筛选"由 Prompt 中的状态注入替代：

```
你正在为一个人生模拟器生成一个事件。

当前玩家状态：
- 健康：${health}/100（当前偏低）
- 财富：${wealth}/100
- 幸福：${happiness}/100
- 标签：${tags.join(', ')}
- 当前回合：第 ${turn} 回合，阶段：${phase}

约束：
- 本次事件类型必须是以下之一：${available_tags.join('/')}（其他类型处于冷却中）
- 事件必须与玩家当前状态相关
- Effects 的数值变化绝对值不超过 ${max_effect_value}

请生成符合以下 Schema 的 JSON 事件...
```

**关键点**：`available_tags` 由引擎计算（排除冷却中的 tag），作为硬约束传入 Prompt，AI 不能绕过。

---

### 3.3 AI 输出 Schema 约束

AI 生成的 Event 必须通过以下结构校验才能进入 Effect 管道：

```json
{
  "$schema": "EventSchema_v1",
  "required": ["tag", "title", "description", "choices"],
  "properties": {
    "tag": {"enum": ["OPPORTUNITY", "CHALLENGE", "DAILY", "SPECIAL", "STAGE"]},
    "title": {"type": "string", "maxLength": 50},
    "description": {"type": "string", "maxLength": 500},
    "choices": {
      "type": "array",
      "minItems": 2,
      "maxItems": 4,
      "items": {
        "required": ["label", "effects"],
        "properties": {
          "effects": {
            "items": {
              "properties": {
                "value": {"type": "number", "minimum": -30, "maximum": 30}
              }
            }
          }
        }
      }
    }
  }
}
```

校验层由引擎实现，不依赖 AI 自我约束。

---

### 3.4 降级（Fallback）策略

当 AI 输出校验失败时，引擎按以下优先级降级：

1. **重试**：最多重试 1 次（避免过多 API 调用）
2. **静态事件库**：从预置的 fallback 事件中按 tag 随机选取
3. **DAILY 兜底事件**：使用通用日常事件（低影响、无特殊条件）

每次降级必须记录在 Log 中，便于后续分析 AI 生成质量。

---

## 4. 事件约束层

### 4.1 数值边界声明

在 `GameConfig.parameters.metric_bounds` 中声明每个 metric 的合法范围：

```json
"metric_bounds": {
  "health":    [0, 100],
  "wealth":    [0, 999],
  "happiness": [0, 100]
}
```

引擎在应用 Effect 后执行 clamp：
```
new_value = clamp(current + delta, bounds.min, bounds.max)
```

**为什么需要声明式约束而非依赖 AI**：AI 可能生成 `"value": 200` 的 Effect，引擎必须在应用前拦截，否则游戏平衡会被单次 AI 输出破坏。

---

### 4.2 Tag 分类与冷却机制

| Tag | 含义 | 推荐权重 | 冷却轮数 |
|-----|------|----------|----------|
| `OPPORTUNITY` | 机遇/正面选择 | 15 | 2 |
| `CHALLENGE` | 危机/负面压力 | 15 | 2 |
| `DAILY` | 日常/低影响 | 40 | 0 |
| `SPECIAL` | 特殊/一次性 | 5 | 10 |
| `STAGE` | 阶段转换 | 触发型 | N/A |

**冷却机制基于 Tag**，而非事件 ID 或文字签名。这在 AI 生成场景中至关重要：AI 每次生成的 `title` 不同，但 `tag` 由引擎验证——基于 tag 的冷却才能跨 AI 生成边界生效。

---

### 4.3 节奏控制（类型轮换策略）

推荐的健康事件序列模式：

```
DAILY → DAILY → CHALLENGE → DAILY → OPPORTUNITY → DAILY → DAILY → SPECIAL
```

**实现方式**：引擎维护一个 `last_non_daily_tag` 记录，当连续出现超过 N 个 CHALLENGE 或 OPPORTUNITY 时，强制下一轮选择 DAILY。

**避免的反模式**：
* ❌ 连续 3 轮 CHALLENGE → 玩家感觉被针对
* ❌ 连续 3 轮 OPPORTUNITY → 游戏失去张力
* ❌ 全程 DAILY → 玩家昏昏欲睡

---

## 5. 结局系统

### 5.1 硬结局触发条件（具体示例）

硬结局不是惩罚，而是"状态已经无法再产生有意义选择"。

```json
{
  "id": "ending_health_death",
  "type": "hard",
  "trigger": {
    "condition": "metric_lte",
    "target": "health",
    "value": 0
  },
  "title": "生命终结",
  "description": "..."
}
```

```json
{
  "id": "ending_age_limit",
  "type": "hard",
  "trigger": {
    "condition": "turn_gte",
    "target": "turn",
    "value": 60
  },
  "title": "时光终止",
  "description": "..."
}
```

**硬结局触发检查时机**：每次 Effect 应用后立即检查，不等到 Turn 结束。

---

### 5.2 软结局评价函数示意

软结局在 `max_turn` 到达时触发，根据最终状态计算评价分：

```javascript
function evaluateSoftEnding(finalState) {
  const { health, wealth, happiness } = finalState.metrics;

  // 各维度归一化（到 0-1）
  const scores = {
    health:    health    / 100,
    wealth:    Math.min(wealth / 500, 1),
    happiness: happiness / 100
  };

  // 加权综合分（权重可由 GameConfig 配置）
  const total = scores.health * 0.4
              + scores.wealth  * 0.3
              + scores.happiness * 0.3;

  if (total >= 0.8) return "ending_flourishing";
  if (total >= 0.6) return "ending_balanced";
  if (total >= 0.4) return "ending_mediocre";
  return "ending_regret";
}
```

**设计要点**：
* 评价函数的权重放在 `GameConfig` 中，便于调整游戏价值取向
* 结局数量建议 4-8 个，太少导致体验趋同，太多导致设计失焦
* 好的结局系统应让玩家想说："我想试试另一种活法"

---

## 6. 校验与质量门槛

### 静态配置校验（加载时）

* `metric_bounds` 的 min < max
* 每个 Event 至少有 2 个 Choice
* 每个 Choice 至少有 1 个 Effect
* `tag` 字段值在合法枚举范围内
* Ending trigger 引用的 metric 存在于 `initial_metrics`

### AI 生成内容校验（运行时）

* Schema 结构校验（见第 3.3 节）
* Effect value 在单次影响上限内
* tag 不在当前冷却列表中
* choices 数量在 2-4 之间

校验不是工程洁癖，而是：**你不可能人工审核 AI 实时生成的每一条内容**——规则越早被机器兜住，系统越稳定。

---

## 7. 常见误区

### 7.1 核心循环误区

* ❌ 跳过 Choice，直接触发 Effect → 破坏玩家代理感
* ❌ 在 Effect 中直接修改游戏流程（跳转到指定事件）→ 破坏 Selector 的调度权

### 7.2 数值设计误区

* ❌ 所有 Choice 都增加数值，没有代价 → 失去张力
* ❌ 概率用在所有 Effect，包括日常操作 → 感觉游戏在整玩家
* ❌ 不声明 metric_bounds → AI 生成的数值可能破坏平衡

### 7.3 结局设计误区

* ❌ 只有好/坏两种结局 → 重开动力不足
* ❌ 结局由文案决定而非评价函数 → 难以维护，AI 生成内容无法适配

### 7.4 AI 内容误区

* ❌ 让 AI 决定 Effect 的数值而不做 clamp → 单次 AI 错误破坏整局平衡
* ❌ 让 AI 决定是否触发 Ending → 确定性逻辑外包给概率模型
* ❌ 用事件文字签名做冷却去重 → AI 每次生成的文字不同，冷却失效
* ❌ AI 失败时直接报错而无降级 → 单次 API 失败导致游戏无法继续

### 7.5 Selector 误区

* ❌ 条件太宽 → 所有玩家体验趋同
* ❌ 条件太窄 → 内容浪费、事件永不出现
* 健康目标：大多数事件在 30-70% 的局中出现，出现时机不同

---

## 8. 版本化与兼容性

* 一旦有人基于你的平台创作，你就背负了向后兼容责任
* `GameConfig.version` 字段必须存在，引擎根据版本号选择解析逻辑
* AI 生成的事件不持久化到用户可见的事件库，无需版本管理
* Schema 版本与引擎版本解耦，允许 Schema 独立升级

---

## 附录：与项目代码的对照

本规范中的概念在 `life-simulator-game` 项目中的对应实现位置：

| 规范概念 | 项目对应位置（参考） |
|----------|---------------------|
| GameConfig | `src/config/` 或 AI 配置缓存层 |
| State 管理 | 游戏状态管理模块 |
| AI Selector | AI 调用 + Prompt 构建逻辑 |
| Schema 校验 | AI 输出解析层 |
| Effect 应用 | 状态更新函数（含 clamp） |
| Ending 检查 | 回合结束钩子 |
| Log | 历史记录/事件日志模块 |

> 本规范是设计意图文档，不是代码注释。如果某个规范原则在代码中找不到对应实现，说明存在设计债务，需要补充实现或更新规范。
