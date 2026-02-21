# topic.config.ts 字段详解

元配置文件，定义话题的基本信息、特性开关和游戏参数。

类型：`TopicConfigBase`（`src/core/types/base.ts`）

## 完整接口

```typescript
interface TopicConfigBase {
  id: string;
  name: string;
  version: string;
  description?: string;
  author?: string;
  features: TopicFeatures;
  parameters: {
    maxTurn: number;
    maxAge: number;
    eventsPerTurn: number;
  };
}
```

## 字段详解

### `id`

话题的全局唯一标识符。

- **命名规范**：kebab-case，如 `startup-simulator`、`rider-simulator`
- **用途**：作为 localStorage 存档 Key 的一部分（`game-save-{id}`）
- **注意**：一旦发布、有用户存档后，不可轻易修改（会导致存档丢失）

```typescript
id: 'my-simulator'
```

### `name`

话题的显示名称，出现在话题选择界面的卡片标题。

```typescript
name: '我的模拟器'
```

### `version`

语义化版本号，遵循 `MAJOR.MINOR.PATCH` 格式。

```typescript
version: '1.0.0'
```

### `description`（可选）

话题简介，显示在话题选择界面的卡片描述。

### `features`

特性开关，控制哪些系统模块在当前话题中启用。

```typescript
interface TopicFeatures {
  hasCareer?: boolean;       // 职业系统（职业选择弹窗）
  hasEducation?: boolean;    // 教育系统（教育升级弹窗）
  hasProperty?: boolean;     // 房产系统
  hasRelationship?: boolean; // 关系系统
  hasInvestment?: boolean;   // 投资系统
  hasAchievement?: boolean;  // 成就系统
  [key: string]: boolean | undefined; // 自定义特性
}
```

**自定义特性**：可添加任意 `key: boolean` 字段，通过 `useFeatureEnabled('yourFeature')` Hook 在组件中读取。

```typescript
features: {
  hasCareer: false,
  hasAchievement: true,
  hasWeekSystem: true,     // 自定义：周制时间
  hasGraduation: true,     // 自定义：毕业条件系统
}
```

### `parameters`

游戏运行的核心参数。

| 字段 | 说明 | life 话题 | research 话题 |
|------|------|-----------|--------------|
| `maxTurn` | 最大回合数，达到后触发软结局评价 | 100 | 144（博士4年=144周） |
| `maxAge` | 最大年龄/时间值（配合 stages 的 ageRange 使用） | 100 | 180 |
| `eventsPerTurn` | 每回合触发的事件数 | 1 | 1 |

**建议**：`eventsPerTurn` 固定为 1，避免每回合信息过多造成玩家疲劳。

## 扩展：customParams

标准接口不包含 `customParams`，但话题可通过类型断言添加话题特有参数：

```typescript
// research 话题的示例
const topicConfig = {
  ...standardConfig,
  customParams: {
    degreeTypes: ['master_academic', 'master_professional', 'doctor'],
    masterWeeks: 108,
    doctorWeeks: 144,
    maxExtendWeeks: 72,
  }
} as TopicConfigBase & { customParams: ResearchCustomParams };
```

在代码中使用时需要类型断言：

```typescript
const researchConfig = topic.config as typeof topicConfig;
const maxWeeks = researchConfig.customParams.masterWeeks;
```

## 参考实现

- life 话题：`src/topics/life/topic.config.ts`
- research 话题：`src/topics/research/topic.config.ts`（含 customParams 示例）
