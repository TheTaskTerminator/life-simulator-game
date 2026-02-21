# prompts.config.ts AI 提示词

定义 AI 生成游戏事件时使用的提示词模板，是决定游戏叙事风格的核心配置。

类型：`PromptsConfig`（`src/core/types/base.ts`）

## 完整接口

```typescript
interface PromptsConfig {
  systemPrompt: string;
  eventPromptTemplate: (context: PromptContext) => string;
  consequencePromptTemplate: (context: PromptContext) => string;
  custom?: Record<string, (context: PromptContext) => string>;
}

interface PromptContext {
  player: Record<string, unknown>;   // 玩家状态
  stage: string;                      // 当前阶段 key
  eventType?: string;                 // 事件类型 Tag
  metrics: MetricsConfig;             // 属性配置（含定义）
  texts: TextsConfig;                 // 文案配置
  [key: string]: unknown;             // 可扩展
}
```

## `systemPrompt`

定义 AI 的角色和基本行为规范，每次 API 调用都会作为 `system` 消息发送。

```typescript
systemPrompt: `你是一个人生模拟游戏的事件生成AI。
你的任务是为玩家生成真实、有意义的人生事件。
你必须只输出JSON格式的数据，不要包含任何其他内容。`
```

**设计要点**：
- 明确 AI 的身份（"你是...游戏的AI"）
- 明确输出格式要求（"只输出JSON"）
- 如有特殊内容要求（"事件必须正能量"等），在此处声明

## `eventPromptTemplate`

生成游戏事件的 Prompt 模板。接收 `PromptContext`，返回完整的 Prompt 字符串。

### 关键组成部分

```typescript
eventPromptTemplate: (context) => {
  const { player, stage, eventType } = context;

  return `
# 当前状态
- 年龄：${player.age} 岁（阶段：${stage}）
- 健康：${player.attributes?.health ?? 0}/100
- 财富：${player.attributes?.wealth ?? 0}
${/* 注入更多属性... */}

# 任务
生成一个「${eventType ?? 'DAILY'}」类型的人生事件。

## 约束
- 事件必须与当前状态相关
- 每个选项的属性变化绝对值不超过 20
- choices 数量：2-4 个

## 输出格式（JSON）
{
  "title": "事件标题（20字内）",
  "description": "事件描述（80-150字）",
  "choices": [
    {
      "id": "choice_a",
      "text": "选项文字（15字内）",
      "effects": [
        { "type": "attribute", "metric": "health", "value": -10 }
      ]
    }
  ]
}
`;
}
```

### 状态注入最佳实践

在注入属性值时，加上语义标注帮助 AI 理解：

```typescript
const health = player.attributes?.health ?? 0;
const healthDesc = health < 30 ? '（健康堪忧）' : health < 60 ? '（一般）' : '（良好）';

return `健康：${health}/100 ${healthDesc}`;
```

## `consequencePromptTemplate`

生成玩家做出选择后的后果描述。

```typescript
consequencePromptTemplate: (context) => {
  const { player, event, choice } = context;

  return `
玩家在事件「${event?.title}」中选择了「${choice?.text}」。

参考效果：${JSON.stringify(choice?.effects)}

请生成：
1. 一段描述选择后果的文字（50-100字）
2. 实际的属性变化（可与参考效果有小幅偏差，体现随机性）

输出 JSON 格式：
{
  "description": "后果描述",
  "effects": [...]
}
`;
}
```

## 降级策略

AI 生成失败时（网络错误、Schema 校验失败等），引擎按以下顺序降级：

1. **重试**：最多重试 1 次
2. **静态事件库**：如话题配置了预定义事件，按 Tag 随机选取
3. **DAILY 兜底**：使用内置的通用日常事件（低影响，无特殊条件）

每次降级都会记录到游戏 Log 中。

## 参考实现

- `src/topics/life/prompts.config.ts` — 标准人生模拟 Prompt
- `src/topics/research/prompts.config.ts` — 学术场景 Prompt（含学期时间注入、热点系统注入）

详细 Prompt 工程指南：[design-guide/prompt-engineering.md](../design-guide/prompt-engineering.md)
