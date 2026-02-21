# AI 服务集成

## 架构概览

```
话题 PromptsConfig
      ↓
promptService.buildEventPrompt()     ← 注入玩家状态
      ↓
aiService.generateEvent()            ← 调用 AI API
      ↓
Zod Schema 校验                       ← src/schemas/
      ↓
通过 → 应用 Effect
失败 → 降级策略
```

## AIService 核心方法

文件位置：`src/services/aiService.ts`

```typescript
// 生成游戏事件
generateEvent(player: Player, eventType?: string): Promise<GenericEvent>

// 生成选择后果
generateChoiceConsequence(
  player: Player,
  event: GenericEvent,
  choice: GenericChoice
): Promise<{ description: string; effects: GenericEventEffect[] }>

// 获取当前 AI 模型信息
getCurrentModelInfo(): { name: string; provider: string }
```

## AI 配置体系

### config/ai.json（模型列表）

```json
{
  "defaultModel": "qwen-72b",
  "models": [
    {
      "id": "qwen-72b",
      "name": "Qwen2.5-72B-Instruct",
      "provider": "siliconflow",
      "enabled": true
    }
  ]
}
```

### 环境变量

```bash
VITE_AI_KEY=your-api-key           # 必填
VITE_AI_PROVIDER=siliconflow       # 可选，默认 siliconflow
VITE_AI_MODEL_ID=qwen-72b          # 可选，覆盖 defaultModel
```

### 支持的 Provider

- **SiliconFlow**（默认）：访问 [siliconflow.cn](https://siliconflow.cn) 获取 Key
- **OpenAI**：设置 `VITE_AI_PROVIDER=openai`
- **任意 OpenAI 兼容接口**：通过环境变量配置 base URL

## Schema 校验

AI 输出的事件 JSON 必须通过 Zod Schema 校验才能进入游戏逻辑：

```typescript
// src/schemas/event.schema.ts（简化示意）
const AIEventSchema = z.object({
  title: z.string().max(50),
  description: z.string().max(500),
  choices: z.array(
    z.object({
      id: z.string(),
      text: z.string().max(100),
      effects: z.array(
        z.object({
          type: z.enum(['attribute', 'wealth', 'relationship', 'custom']),
          metric: z.string().optional(),
          value: z.number().min(-50).max(50),
        })
      ),
    })
  ).min(2).max(4),
});
```

校验失败时 Schema 会抛出 `ZodError`，`eventService.ts` 捕获后触发降级。

## 降级策略

```typescript
try {
  const event = await aiService.generateEvent(player, tag);
  return event;
} catch (e) {
  // 第一次失败：重试
  try {
    const event = await aiService.generateEvent(player, tag);
    return event;
  } catch (e2) {
    // 第二次失败：使用静态事件库
    const fallbackEvent = getStaticFallbackEvent(tag);
    if (fallbackEvent) return fallbackEvent;

    // 最终兜底：通用 DAILY 事件
    return getDefaultDailyEvent();
  }
}
```

## promptService

文件位置：`src/services/promptService.ts`

职责：从 `TopicPackage.prompts` 读取模板函数，注入 `PromptContext`（玩家状态 + 话题配置），生成最终发送给 AI 的 Prompt 字符串。

```typescript
// 构建事件生成 Prompt
buildEventPrompt(player: Player, topicPackage: TopicPackage, eventType: string): string

// 构建后果生成 Prompt
buildConsequencePrompt(player, topicPackage, event, choice): string
```

## Prompt 调试

在浏览器开发者工具控制台，可以看到 `aiService` 打印的 Prompt 内容（开发模式下）。

如需手动测试 Prompt 效果，可以将 Prompt 复制到 AI 接口的 Playground 中进行调试。
