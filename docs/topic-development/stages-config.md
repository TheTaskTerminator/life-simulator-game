# stages.config.ts 阶段系统

定义游戏的时间轴分段，将玩家的整个游戏历程划分为若干阶段。

类型：`StagesConfig`（`src/core/types/base.ts`）

## 完整接口

```typescript
interface StagesConfig {
  stages: StageDefinition[];
  defaultStage: string;
}

interface StageDefinition {
  key: string;
  label: string;
  description?: string;
  ageRange: { min: number; max: number };
  eventWeights?: Record<string, number>;
  icon?: string;
}
```

## 字段详解

### `stages`（有序列表）

阶段定义列表，按时间顺序排列。

#### `key`

阶段唯一标识符（snake_case）。用于：
- `eventWeights` 等配置中引用阶段
- `GenericEvent.conditions.stage[]` 中指定事件触发阶段
- 引擎中 `getStageByAge()` 的返回值

#### `ageRange`

该阶段的时间范围。

- **life 话题**：年龄范围，如 `{ min: 0, max: 6 }` 表示 0-6 岁
- **research 话题**：周数范围，如 `{ min: 0, max: 54 }` 表示前 54 周（研一）
- **注意**：所有阶段的 ageRange 必须覆盖 0 到 `parameters.maxAge` 的完整范围，不允许有空白

#### `eventWeights`（可选）

该阶段各类 Tag 事件的相对权重。用于 `EventSelector` 动态调整事件类型分布。

```typescript
eventWeights: {
  DAILY: 40,
  OPPORTUNITY: 20,
  CHALLENGE: 10,
  SPECIAL: 5,
}
```

不同阶段设置不同权重，可以营造"早期多机遇、晚期多挑战"的节奏感。

#### `icon`（可选）

阶段图标（emoji），显示在阶段标签旁。

### `defaultStage`

游戏开始时的初始阶段 key。通常设为第一个阶段的 key。

## 阶段推进逻辑

引擎根据 `player.age`（或 `player.week` 等自定义字段）与 `ageRange` 比较，自动确定当前阶段：

```typescript
// 核心逻辑（src/topics/life/stages.config.ts 中的 getStageByAge）
function getStageByAge(age: number): StageDefinition {
  return stages.find(s => age >= s.ageRange.min && age <= s.ageRange.max)
    ?? stages[stages.length - 1];
}
```

阶段切换时引擎会触发 `STAGE` 类型事件，通知玩家进入了新阶段。

## 设计建议

- **阶段数量**：4-8 个（太少缺乏节奏变化，太多切换过频繁）
- **阶段命名**：使用玩家能理解的语义名（如"童年期"而非"phase_1"）
- **ageRange 连续性**：确保 `stages[i].ageRange.max + 1 === stages[i+1].ageRange.min`（或有合理重叠）
- **末尾阶段**：最后一个阶段的 `ageRange.max` 应 >= `parameters.maxAge`

## 参考实现

- `src/topics/life/stages.config.ts` — 6个人生阶段（童年/学生/青年/成年/中年/老年）
- `src/topics/research/stages.config.ts` — 按学位分段（硕士3年/博士4年），含延毕扩展
