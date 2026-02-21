# AI Prompt 工程指南

## Prompt 的作用边界

在 SimuEngine 中，Prompt 只决定**叙事内容**，不决定游戏机制：

| Prompt 决定 | 引擎决定 |
|------------|---------|
| 事件的标题和描述文案 | 数值变化是否在边界内（clamp） |
| 选项的描述文字 | 结局是否触发 |
| 氛围和语气 | Tag 冷却管理 |
| 后果描述的文学表达 | 回合推进 |

## Prompt 结构模板

一个有效的 `eventPromptTemplate` 通常包含以下部分：

```
1. 角色背景（WHO） - "你是一个XX模拟游戏的AI..."
2. 玩家状态（WHAT） - 注入当前属性值和语义标注
3. 约束声明（HOW） - 事件类型限制、数值范围
4. 输出格式（FORMAT） - 精确的 JSON 结构要求
5. 注意事项（GUARD） - 防止常见错误
```

## 状态注入技巧

### 数值 + 语义标注

不要只注入原始数字，加上语义帮助 AI 理解状态：

```typescript
const health = player.attributes.health ?? 0;
const healthStatus =
  health < 20 ? '（危急，命悬一线）' :
  health < 40 ? '（较差，需要关注）' :
  health < 60 ? '（一般）' :
  health < 80 ? '（良好）' :
  '（极佳）';

return `健康：${health}/100 ${healthStatus}`;
```

### 阶段上下文

注入当前阶段的中文描述，让 AI 生成符合当前时期的事件：

```typescript
const stageDescriptions = {
  childhood: '童年期（5-10岁，无忧无虑的成长时光）',
  student: '学生期（正在上学，面临学业压力）',
  adult: '成年期（进入社会，承担各种责任）',
};
return `当前阶段：${stageDescriptions[stage] ?? stage}`;
```

## available_tags 约束

这是最关键的约束，必须在 Prompt 中明确声明：

```typescript
// PromptContext 中已包含可用 Tag 列表
const availableTags = context.availableTags ?? ['DAILY'];

return `
## 约束
本次事件类型必须是以下之一（其他类型处于冷却中，禁止使用）：
${availableTags.join(' / ')}
`;
```

如果不加此约束，AI 可能持续生成 CHALLENGE 事件，绕过冷却保护。

## 输出格式强制

### 常见问题：AI 输出 Markdown 代码块

```
// AI 可能输出：
```json
{"title": "..."}
```

// 而不是直接输出：
{"title": "..."}
```

**解决方案**：在 Prompt 末尾强调：

```
重要：只输出纯 JSON，不要任何 markdown 语法，不要 ```json 代码块，不要任何解释文字。
```

### 模板化 JSON 提示

在 Prompt 中给出完整 JSON 结构模板，每个字段标注类型和约束：

```
输出以下格式的 JSON：
{
  "title": "事件标题（中文，不超过20字）",
  "description": "事件描述（中文，80-150字，具体描述场景）",
  "choices": [
    {
      "id": "choice_a",
      "text": "选项描述（中文，不超过20字）",
      "effects": [
        {
          "type": "attribute",
          "metric": "属性key（必须是：health/wealth/happiness/...之一）",
          "value": 整数，绝对值不超过20
        }
      ]
    }
  ]
}
```

## 后果 Prompt 的特殊设计

`consequencePromptTemplate` 的目标是为玩家的选择生成**叙事性后果**，同时给出实际的属性变化。

关键设计：允许 AI 在参考效果基础上有小幅偏差，制造随机感：

```typescript
consequencePromptTemplate: (context) => {
  const choice = context.choice as { effects?: unknown[] };

  return `
玩家选择后的参考效果：${JSON.stringify(choice?.effects)}

请生成：
1. 描述选择后果的叙事文字（50-100字）
2. 实际属性变化（可在参考效果基础上有 ±30% 的偏差，体现随机性）

注意：只影响 1-2 个主要属性，不要修改太多属性。
  `;
}
```

## systemPrompt 设计

`systemPrompt` 作为每次 API 调用的系统角色，应该：

1. **建立角色**：明确 AI 的身份和职责
2. **设定风格**：事件的叙事基调（严肃/轻松/幽默等）
3. **强调格式**：只输出 JSON

```typescript
systemPrompt: `你是"${topicName}"游戏的事件生成AI。
你的职责是根据玩家的当前状态，生成合理、有趣且富有戏剧感的事件。

风格要求：
- 事件描述应当生动具体，有代入感
- 选项应当有明确的权衡取舍，没有绝对"最优解"
- 语言风格：接地气的中文，避免过于文艺或过于口语

格式要求：
- 必须输出纯 JSON，不包含任何其他内容
- 不使用 markdown 代码块`
```

## 常见 Prompt 失败原因

| 问题 | 原因 | 解决方案 |
|------|------|---------|
| JSON 解析失败 | AI 输出了 ```json 代码块 | 在 Prompt 末尾强调"不要代码块" |
| 数值超出范围 | 约束不明确 | 在 Prompt 中写明每个字段的数值范围 |
| 事件与游戏主题无关 | systemPrompt 角色设定太宽泛 | 更具体地描述话题背景和期望的事件类型 |
| 每次事件都很相似 | 状态注入不足 | 注入更多玩家状态维度，特别是异常状态 |
| Tag 约束被绕过 | Prompt 中未强调 Tag 约束 | 将 available_tags 放在"约束"章节并加粗 |

## Prompt 调试方法

1. **控制台日志**：在 `aiService.ts` 开发模式下打印完整 Prompt
2. **直接测试**：将 Prompt 复制到 AI 对话界面，手动测试响应质量
3. **Schema 错误追踪**：捕获 ZodError，打印 AI 的原始响应，分析格式问题
4. **降级频率监控**：如果游戏 Log 中经常出现降级记录，说明 Prompt 质量有问题
