# 示例：从零创建话题

本文通过一个完整的"职场新人模拟器"示例，展示创建一个新话题所需的全部代码。

## 话题设定

**职场新人模拟器**（`workplace-simulator`）：
- 扮演刚入职的职场新人，在 180 个工作日内打怪升级
- 5 维属性：工作能力、人际关系、薪资、精力、职场压力
- 3 个阶段：试用期（0-60天）、成长期（61-120天）、独当一面（121-180天）

## 文件结构

```
src/topics/workplace/
├── topic.config.ts
├── metrics.config.ts
├── stages.config.ts
├── endings.config.ts
├── theme.config.ts
├── texts.config.ts
├── prompts.config.ts
└── index.ts
```

---

## topic.config.ts

```typescript
import { TopicConfigBase } from '../../core/types/base';

export const topicConfig: TopicConfigBase = {
  id: 'workplace-simulator',
  name: '职场新人',
  version: '1.0.0',
  description: '从实习生到独当一面的职场成长之路',
  features: {
    hasCareer: false,
    hasEducation: false,
    hasProperty: false,
    hasRelationship: false,
    hasInvestment: false,
    hasAchievement: true,
  },
  parameters: {
    maxTurn: 180,
    maxAge: 180,
    eventsPerTurn: 1,
  },
};
```

---

## metrics.config.ts

```typescript
import { MetricsConfig } from '../../core/types/base';

export const metricsConfig: MetricsConfig = {
  definitions: {
    skill: {
      key: 'skill',
      label: '工作能力',
      icon: '💼',
      color: '#4CAF50',
      bounds: { min: 0, max: 100 },
      isLowWhenBelow: 20,
      description: '处理工作任务的专业能力',
    },
    network: {
      key: 'network',
      label: '人际关系',
      icon: '🤝',
      color: '#2196F3',
      bounds: { min: 0, max: 100 },
      isLowWhenBelow: 20,
      description: '与同事、上司、客户的关系网络',
    },
    salary: {
      key: 'salary',
      label: '月薪（K）',
      icon: '💰',
      color: '#FFD700',
      bounds: { min: 3, max: 100 },
      description: '当前月薪（千元）',
    },
    energy: {
      key: 'energy',
      label: '精力',
      icon: '⚡',
      color: '#FF9800',
      bounds: { min: 0, max: 100 },
      isLowWhenBelow: 20,
      isGameOverAt: 0,
      description: '身心精力储备，耗尽则倦怠离职',
    },
    stress: {
      key: 'stress',
      label: '职场压力',
      icon: '😰',
      color: '#9C27B0',
      bounds: { min: 0, max: 100 },
      isInverted: true,
      description: '来自工作的心理压力（越低越好）',
    },
  },
  initialValues: {
    skill:   { min: 30, max: 60 },
    network: { min: 20, max: 50 },
    salary:  { min: 5, max: 10 },
    energy:  { min: 70, max: 90 },
    stress:  { min: 10, max: 30 },
  },
  maxEffectValue: {
    skill:   15,
    network: 15,
    salary:  5,
    energy:  20,
    stress:  20,
  },
};
```

---

## stages.config.ts

```typescript
import { StagesConfig } from '../../core/types/base';

export const stagesConfig: StagesConfig = {
  stages: [
    {
      key: 'probation',
      label: '试用期',
      description: '小心谨慎，努力适应新环境',
      icon: '🌱',
      ageRange: { min: 0, max: 60 },
      eventWeights: {
        DAILY: 50,
        OPPORTUNITY: 15,
        CHALLENGE: 20,
        SPECIAL: 5,
      },
    },
    {
      key: 'growth',
      label: '成长期',
      description: '逐渐找到节奏，展露才华',
      icon: '🌿',
      ageRange: { min: 61, max: 120 },
      eventWeights: {
        DAILY: 40,
        OPPORTUNITY: 25,
        CHALLENGE: 20,
        SPECIAL: 8,
      },
    },
    {
      key: 'independent',
      label: '独当一面',
      description: '成为团队核心，面对更大挑战',
      icon: '🌳',
      ageRange: { min: 121, max: 180 },
      eventWeights: {
        DAILY: 30,
        OPPORTUNITY: 25,
        CHALLENGE: 30,
        SPECIAL: 10,
      },
    },
  ],
  defaultStage: 'probation',
};
```

---

## endings.config.ts

```typescript
import { EndingsConfig } from '../../core/types/base';

export const endingsConfig: EndingsConfig = {
  hard: [
    {
      id: 'ending_burnout',
      title: '职场倦怠',
      description: '长期高压工作让你精力耗尽，最终选择离职休息。这不是失败，而是一种自我保护。',
      type: 'bad',
      icon: '😮‍💨',
      condition: {
        attributes: { energy: { max: 0 } },
      },
    },
  ],
  soft: [
    {
      id: 'ending_star',
      title: '职场新星',
      description: '180天里你迅速成长，成为公司最受瞩目的新人，职业生涯一片光明。',
      type: 'good',
      icon: '⭐',
      scoreThreshold: 0.8,
    },
    {
      id: 'ending_stable',
      title: '稳健前行',
      description: '你找到了自己的节奏，工作能力和人际关系都有长足进步，成为团队可靠的一员。',
      type: 'good',
      icon: '👍',
      scoreThreshold: 0.6,
    },
    {
      id: 'ending_learning',
      title: '还在摸索',
      description: '180天的职场磨砺让你明白了很多，虽然还有很多路要走，但方向已经清晰。',
      type: 'neutral',
      icon: '🤔',
      scoreThreshold: 0.4,
    },
    {
      id: 'ending_struggle',
      title: '举步维艰',
      description: '这段职场经历充满了挫折，但每一次跌倒都是成长的养分。',
      type: 'bad',
      icon: '💪',
      scoreThreshold: 0,
    },
  ],
};
```

---

## theme.config.ts

```typescript
import { ThemeConfig } from '../../core/types/base';

export const themeConfig: ThemeConfig = {
  name: 'Corporate Blue',
  colors: {
    background: '#0d1117',
    backgroundSecondary: '#161b22',
    text: '#e6edf3',
    textSecondary: '#8b949e',
    accent: '#58a6ff',
    success: '#3fb950',
    warning: '#d29922',
    danger: '#f85149',
    border: '#30363d',
    card: '#21262d',
    modal: '#1c2128',
  },
  fonts: {
    heading: "'Inter', sans-serif",
    body: "'Inter', sans-serif",
    baseSize: 16,
  },
  spacing: { xs: 4, sm: 8, md: 16, lg: 24, xl: 32 },
  shadows: {
    sm: '0 1px 3px rgba(0,0,0,0.3)',
    md: '0 4px 12px rgba(0,0,0,0.4)',
    lg: '0 8px 32px rgba(0,0,0,0.5)',
  },
  borderRadius: { sm: 4, md: 8, lg: 12 },
  globalStyles: `
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
  `,
};
```

---

## texts.config.ts

```typescript
import { TextsConfig } from '../../core/types/base';

export const textsConfig: TextsConfig = {
  gameTitle: '职场新人',
  gameSubtitle: '从零开始的职场生涯',
  startButton: '入职报到',
  restartButton: '重新求职',
  confirmButton: '确认',
  cancelButton: '取消',
  statsPanelTitle: '个人状态',
  logPanelTitle: '工作日志',
  ageLabel: '第',
  stageLabel: '阶段',
  turnLabel: '天',
  events: {
    opportunityLabel: '好机会',
    challengeLabel: '突发状况',
    dailyLabel: '日常',
    specialLabel: '特殊事件',
    stageLabel: '阶段变化',
    choicePrefix: '你选择',
    effectPrefix: '结果',
  },
  endings: {
    gameOverTitle: '职场故事结束',
    scoreLabel: '综合评分',
    summaryLabel: '职场总结',
  },
  messages: {
    loading: '处理中...',
    saving: '保存中...',
    error: '出了点问题',
    confirmQuit: '确定要辞职吗？',
    newGame: '重新入职',
  },
};
```

---

## prompts.config.ts

```typescript
import { PromptsConfig, PromptContext } from '../../core/types/base';

export const promptsConfig: PromptsConfig = {
  systemPrompt: `你是一个职场模拟游戏的事件生成AI。
你的任务是为职场新人生成真实、有意义的职场事件。
请确保每个事件都有明确的职场背景，选项体现真实的职场权衡。
你必须只输出JSON格式的数据，不要包含任何其他内容。`,

  eventPromptTemplate: (context: PromptContext) => {
    const { player, stage, eventType } = context;
    const attrs = (player.attributes as Record<string, number>) ?? {};

    const skill = attrs.skill ?? 50;
    const network = attrs.network ?? 50;
    const energy = attrs.energy ?? 80;
    const stress = attrs.stress ?? 30;

    const stageDesc = {
      probation: '试用期（小心谨慎，努力适应）',
      growth: '成长期（逐渐找到节奏）',
      independent: '独当一面期（成为团队核心）',
    }[stage as string] ?? stage;

    return `
当前职场状态：
- 工作阶段：${stageDesc}
- 工作能力：${skill}/100${skill < 30 ? '（能力不足）' : skill > 70 ? '（能力出众）' : ''}
- 人际关系：${network}/100${network < 30 ? '（人缘较差）' : ''}
- 精力：${energy}/100${energy < 30 ? '（精力不济）' : ''}
- 职场压力：${stress}/100${stress > 70 ? '（压力极大）' : ''}

请生成一个「${eventType ?? 'DAILY'}」类型的职场事件。

要求：
1. 事件必须符合当前职场阶段和状态
2. 每个选项要有明确的职场权衡（利弊清晰）
3. choices 数量：2-3 个
4. 属性变化值绝对值不超过 15

输出 JSON 格式：
{
  "title": "事件标题（15字内）",
  "description": "事件描述（60-120字，具体描述职场场景）",
  "choices": [
    {
      "id": "choice_a",
      "text": "选项文字（15字内）",
      "effects": [
        { "type": "attribute", "metric": "skill", "value": 5 }
      ]
    }
  ]
}`;
  },

  consequencePromptTemplate: (context: PromptContext) => {
    const event = context.event as { title?: string };
    const choice = context.choice as { text?: string; effects?: unknown[] };

    return `
职场新人在「${event?.title ?? '某事件'}」中选择了「${choice?.text ?? '某选项'}」。

参考效果：${JSON.stringify(choice?.effects ?? [])}

请生成：
1. 一段描述职场后果的文字（40-80字）
2. 实际属性变化（可有小幅随机偏差）

输出 JSON：
{
  "description": "后果描述（体现真实职场感）",
  "effects": [...]
}`;
  },
};
```

---

## index.ts

```typescript
import { TopicPackage } from '../../core/types/base';
import { topicConfig } from './topic.config';
import { metricsConfig } from './metrics.config';
import { stagesConfig } from './stages.config';
import { endingsConfig } from './endings.config';
import { themeConfig } from './theme.config';
import { textsConfig } from './texts.config';
import { promptsConfig } from './prompts.config';

export const workplaceTopicPackage: TopicPackage = {
  config: topicConfig,
  metrics: metricsConfig,
  stages: stagesConfig,
  endings: endingsConfig,
  theme: themeConfig,
  texts: textsConfig,
  prompts: promptsConfig,
};
```

---

## 注册话题

在 `src/core/topicManager.ts` 中添加：

```typescript
import { workplaceTopicPackage } from '../topics/workplace';
topicRegistry.set(workplaceTopicPackage.config.id, workplaceTopicPackage);
```

运行 `pnpm dev`，话题选择界面出现"职场新人"话题。

---

## 接下来

- 调整 `prompts.config.ts` 中的 Prompt，让 AI 生成更具体的职场场景
- 修改 `theme.config.ts` 设计更有职场感的视觉主题
- 参考 `src/topics/research/` 了解如何添加话题特有的复杂系统
