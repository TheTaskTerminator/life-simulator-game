# index.ts 话题包组装与导出

`index.ts` 是话题包的入口文件，将所有配置文件组装成一个 `TopicPackage` 对象并导出。

## 标准模板

```typescript
import { TopicPackage } from '../../core/types/base';
import { topicConfig } from './topic.config';
import { metricsConfig } from './metrics.config';
import { stagesConfig } from './stages.config';
import { endingsConfig } from './endings.config';
import { themeConfig } from './theme.config';
import { textsConfig } from './texts.config';
import { promptsConfig } from './prompts.config';

export const myTopicPackage: TopicPackage = {
  config: topicConfig,
  metrics: metricsConfig,
  stages: stagesConfig,
  endings: endingsConfig,
  theme: themeConfig,
  texts: textsConfig,
  prompts: promptsConfig,
};
```

## 命名规范

导出的变量名应为：`{camelCase话题名}TopicPackage`

- `lifeTopicPackage` — 人生模拟器
- `researchTopicPackage` — 学术之路
- `riderTopicPackage` — 外卖骑手

## 可选：自定义组件

如果话题需要替换默认的 UI 组件（如 StartScreen、EventModal），通过 `components` 字段注册：

```typescript
import { MyTopicStartScreen } from './components/StartScreen';
import { MyTopicEventModal } from './components/EventModal';

export const myTopicPackage: TopicPackage = {
  // ... 其他配置
  components: {
    StartScreen: MyTopicStartScreen,
    EventModal: MyTopicEventModal,
  },
};
```

**注意**：自定义组件目前需要在 `src/App.tsx` 中的条件渲染逻辑中手动集成（详见 [registration.md](registration.md)）。

## 重导出话题特有类型（推荐）

将话题的特有类型重导出，方便其他文件引用：

```typescript
// index.ts 底部添加
export type { MyMetricKey, MyStageKey } from './types.config';
export { topicConfig, metricsConfig }; // 如需直接访问子配置
```

## 参考实现

- `src/topics/life/index.ts`
- `src/topics/research/index.ts`
