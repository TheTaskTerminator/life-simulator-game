# endings.config.ts 结局系统

定义游戏的结束条件和结局内容。分为立即触发的硬结局和游戏结束时评价的软结局。

类型：`EndingsConfig`（`src/core/types/base.ts`）

## 完整接口

```typescript
interface EndingsConfig {
  hard: EndingDefinition[];
  soft: EndingDefinition[];
}

interface EndingDefinition {
  id: string;
  title: string;
  description: string;
  type: 'good' | 'neutral' | 'bad';
  condition?: EndingCondition;     // 硬结局触发条件
  scoreThreshold?: number;          // 软结局分数阈值 [0, 1]
  icon?: string;
}

interface EndingCondition {
  attributes?: Record<string, { min?: number; max?: number }>;
  age?: { min?: number; max?: number };
  custom?: string;
}
```

## 硬结局（`hard` 数组）

满足条件时**立即触发**，无需等到 maxTurn。每次 Effect 应用后引擎立即检查。

### 触发条件类型

**属性条件**（`condition.attributes`）：

```typescript
{
  id: 'ending_health_death',
  title: '生命终结',
  description: '健康归零，游戏结束。',
  type: 'bad',
  condition: {
    attributes: {
      health: { max: 0 }  // health <= 0 时触发
    }
  }
}
```

**年龄/回合条件**（`condition.age`）：

```typescript
{
  id: 'ending_age_limit',
  title: '百年人生',
  description: '您已经走完了完整的人生历程。',
  type: 'neutral',
  condition: {
    age: { min: 100 }  // age >= 100 时触发
  }
}
```

### 设计原则

硬结局不是"惩罚"，而是"这个状态下已无法产生有意义的选择"。必须在话题的 `metrics.config.ts` 中设置了 `isGameOverAt` 的属性，才会触发对应的硬结局检查。

## 软结局（`soft` 数组）

当玩家达到 `maxTurn` 时，引擎调用评价函数计算综合分数（0-1），按 `scoreThreshold` **降序**匹配第一个满足条件的结局。

```typescript
// 分数匹配逻辑（src/engine/endingEngine.ts）
soft.sort((a, b) => b.scoreThreshold - a.scoreThreshold);
const ending = soft.find(e => score >= e.scoreThreshold);
```

### 典型的 4 级软结局结构

```typescript
soft: [
  {
    id: 'ending_excellent',
    title: '精彩人生',
    type: 'good',
    scoreThreshold: 0.8,  // 综合得分 >= 0.8
    // ...
  },
  {
    id: 'ending_good',
    title: '圆满人生',
    type: 'good',
    scoreThreshold: 0.6,  // 0.6 <= 分数 < 0.8
    // ...
  },
  {
    id: 'ending_normal',
    title: '平凡一生',
    type: 'neutral',
    scoreThreshold: 0.4,  // 0.4 <= 分数 < 0.6
    // ...
  },
  {
    id: 'ending_regret',
    title: '充满遗憾',
    type: 'bad',
    scoreThreshold: 0,    // 分数 < 0.4
    // ...
  },
]
```

**注意**：最低档必须有 `scoreThreshold: 0`，确保所有情况都有对应结局。

## 评价函数

软结局的评分由 `src/engine/endingEngine.ts` 中的 `evaluateSoftEnding()` 函数计算。

默认实现：对各属性归一化（除以 bounds.max），再加权平均。

如需自定义评价逻辑（如 research 话题需要考虑论文数量、学分等），需修改该函数并添加话题特有逻辑。

## 设计建议

- **硬结局**：至少 1 个属性归零结局 + 1 个时间结局
- **软结局**：推荐 4 个（好/良/中/差），结局数量建议 4-8 个
- **结局差异化**：不同结局的描述要让玩家感觉"值得重开试试另一条路"

## 参考实现

- `src/topics/life/endings.config.ts` — 2个硬结局 + 4个软结局（经典结构）
- `src/topics/research/endings.config.ts` — 丰富结局系统（含毕业/延毕/退学/特殊结局）
