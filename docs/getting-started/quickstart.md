# 5分钟创建第一个话题

本文通过一个"外卖骑手模拟器"示例，带你完成从零到运行的完整流程。

## 前提

已完成 [安装与环境配置](installation.md)，`pnpm dev` 可以正常运行。

---

## Step 1: 复制参考话题

以人生模拟器话题作为起点：

```bash
cp -r src/topics/life src/topics/rider
```

这会复制所有 8 个标准配置文件。

---

## Step 2: 修改元配置

编辑 `src/topics/rider/topic.config.ts`，修改以下 3 个必改字段：

```typescript
export const topicConfig: TopicConfigBase = {
  id: 'rider-simulator',    // 必须全局唯一，命名规范：kebab-case
  name: '外卖骑手',
  version: '1.0.0',
  description: '驾驶电动车穿梭城市，体验骑手生涯',
  features: {
    hasCareer: false,
    hasEducation: false,
    hasProperty: false,
    hasRelationship: false,
    hasInvestment: false,
    hasAchievement: true,
  },
  parameters: {
    maxTurn: 365,      // 365天
    maxAge: 365,
    eventsPerTurn: 1,
  },
};
```

---

## Step 3: 定义属性

编辑 `src/topics/rider/metrics.config.ts`，定义骑手专属属性：

```typescript
export const metricsConfig: MetricsConfig = {
  definitions: {
    stamina: {
      key: 'stamina',
      label: '体力',
      icon: '💪',
      color: '#4CAF50',
      bounds: { min: 0, max: 100 },
      isLowWhenBelow: 20,
      isGameOverAt: 0,      // 体力耗尽 = 游戏结束
      description: '决定每天的配送能力',
    },
    income: {
      key: 'income',
      label: '日收入',
      icon: '💴',
      color: '#FFD700',
      bounds: { min: 0, max: 1000 },
      description: '当天的外卖收入',
    },
    rating: {
      key: 'rating',
      label: '好评率',
      icon: '⭐',
      color: '#FF9800',
      bounds: { min: 0, max: 100 },
      isLowWhenBelow: 60,
      description: '影响订单分配',
    },
    mood: {
      key: 'mood',
      label: '心情',
      icon: '😊',
      color: '#9C27B0',
      bounds: { min: 0, max: 100 },
      description: '骑手的精神状态',
    },
    fatigue: {
      key: 'fatigue',
      label: '疲惫',
      icon: '😴',
      color: '#607D8B',
      bounds: { min: 0, max: 100 },
      isInverted: true,     // 值越高越不好
      description: '累积疲惫会影响体力恢复',
    },
  },
  initialValues: {
    stamina: { min: 70, max: 90 },
    income: { min: 0, max: 50 },
    rating: { min: 80, max: 95 },
    mood: { min: 60, max: 80 },
    fatigue: { min: 10, max: 30 },
  },
  maxEffectValue: {
    stamina: 20,
    income: 200,
    rating: 10,
    mood: 20,
    fatigue: 20,
  },
};
```

---

## Step 4: 更新 UI 文案

编辑 `src/topics/rider/texts.config.ts`，把文案改为骑手风格：

```typescript
export const textsConfig: TextsConfig = {
  gameTitle: '外卖骑手',
  gameSubtitle: '穿梭城市的日与夜',
  startButton: '开始配送',
  restartButton: '重新出发',
  confirmButton: '确认',
  cancelButton: '取消',
  statsPanelTitle: '骑手状态',
  logPanelTitle: '今日记录',
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
    gameOverTitle: '骑手生涯结束',
    scoreLabel: '综合评分',
    summaryLabel: '生涯总结',
  },
  messages: {
    loading: '正在获取订单...',
    saving: '保存中...',
    error: '出错了',
    confirmQuit: '确定要放弃今天的配送吗？',
    newGame: '重新出发',
  },
};
```

---

## Step 5: 更新 index.ts

编辑 `src/topics/rider/index.ts`，确保导出正确：

```typescript
import { TopicPackage } from '../../core/types/base';
import { topicConfig } from './topic.config';
import { metricsConfig } from './metrics.config';
import { stagesConfig } from './stages.config';
import { endingsConfig } from './endings.config';
import { themeConfig } from './theme.config';
import { textsConfig } from './texts.config';
import { promptsConfig } from './prompts.config';

export const riderTopicPackage: TopicPackage = {
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

## Step 6: 注册话题

编辑 `src/core/topicManager.ts`，添加两行：

```typescript
// 在文件顶部 import 区域添加：
import { riderTopicPackage } from '../topics/rider';

// 在注册区域添加：
topicRegistry.set(riderTopicPackage.config.id, riderTopicPackage);
```

---

## 验证

运行 `pnpm dev`，打开浏览器，话题选择界面应出现"外卖骑手"选项。点击进入，验证：

- 游戏标题显示为"外卖骑手"
- 属性面板显示 5 个骑手专属属性
- 回合标签显示为"天"而非"岁"

---

## 下一步

- 修改 `stages.config.ts` 定义骑手的生涯阶段（新手期、熟练期、老司机期等）
- 修改 `endings.config.ts` 定义结局（退休、转行、坚守岗位等）
- 修改 `prompts.config.ts` 让 AI 生成骑手相关的事件
- 修改 `theme.config.ts` 设计骑手风格的视觉主题

完整配置文件说明：[话题开发指南](../topic-development/overview.md)
