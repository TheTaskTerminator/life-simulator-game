# 注册话题并集成 UI

创建好话题包后，需要将其注册到框架中，才能在话题选择界面显示。

## Step 1：修改 topicManager.ts

文件位置：`src/core/topicManager.ts`

在文件顶部 import 区域添加：

```typescript
import { myTopicPackage } from '../topics/my-topic';
```

在注册区域添加：

```typescript
topicRegistry.set(myTopicPackage.config.id, myTopicPackage);
```

**完整示例**（基于现有文件结构）：

```typescript
// src/core/topicManager.ts

import { lifeTopicPackage } from '../topics/life';
import { researchTopicPackage } from '../topics/research';
import { myTopicPackage } from '../topics/my-topic';  // 新增

const topicRegistry: Map<string, TopicPackage> = new Map();

// 注册内置话题
topicRegistry.set(lifeTopicPackage.config.id, lifeTopicPackage);
topicRegistry.set(researchTopicPackage.config.id, researchTopicPackage);
topicRegistry.set(myTopicPackage.config.id, myTopicPackage);  // 新增
```

## Step 2：话题选择界面自动更新

`TopicSelector` 组件通过 `getAvailableTopics()` 动态读取所有已注册的话题，**无需修改 UI 代码**。

注册后立即运行 `pnpm dev`，话题选择界面会自动出现新话题的卡片。

## Step 3（可选）：自定义游戏视图

如果你的话题需要专属的开始界面或游戏界面，需要修改 `src/App.tsx`：

```typescript
// src/App.tsx 中的 GameContentInner 组件（简化示意）

// 选择开始界面
if (topicPackage.config.id === 'my-topic-id') {
  return <MyTopicStartScreen onCreateGame={handleCreateGame} />;
} else if (topicPackage.config.id === 'research-simulator') {
  return <ResearchStartScreen onCreateGame={handleCreateGame} />;
} else {
  return <StartScreen onCreateGame={handleCreateGame} />;
}

// 选择游戏界面
if (topicPackage.config.id === 'my-topic-id') {
  return <MyTopicGameView />;
} else if (topicPackage.config.id === 'research-simulator') {
  return <ResearchGameView />;
} else {
  return <GameView />;
}
```

**属性映射**：如果你的话题使用了不同于标准字段名的属性（如用 `research_ability` 而非 `intelligence`），还需要在 `App.tsx` 中添加属性映射逻辑，将话题属性映射到 `Player` 对象的标准字段。

## Step 4：localStorage 隔离自动生效

框架会自动使用 `topicId` 作为存档 Key 的一部分（`game-save-{topicId}`），无需额外配置。切换话题不会互相影响存档。

## 验证注册成功

1. 运行 `pnpm dev`
2. 话题选择界面出现新话题卡片，显示正确的名称和描述
3. 点击进入，开始界面显示正确的主题和文案
4. 游戏运行正常，属性面板显示正确的属性维度

## 常见问题

### 话题未出现在选择界面

检查：
1. `topicRegistry.set()` 是否已添加
2. import 路径是否正确（相对路径）
3. `topic.config.ts` 中的 `id` 是否与其他话题冲突

### 进入游戏后属性面板为空

检查 `metrics.config.ts` 中的 `definitions` 对象是否有内容，以及各 `MetricDefinition` 的 `key` 字段是否正确。

### 主题颜色未生效

检查 `theme.config.ts` 的颜色值格式是否正确（CSS 颜色字符串，如 `'#0a0a1a'` 或 `'rgba(0,0,0,0.8)'`）。
