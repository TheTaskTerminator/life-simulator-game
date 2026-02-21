# topicManager API

文件位置：`src/core/topicManager.ts`

## 函数签名

```typescript
// 注册话题（通常在应用启动时调用）
function registerTopic(topic: TopicPackage): void

// 获取话题（找不到时抛出异常）
function getTopic(topicId: string): TopicPackage

// 检查话题是否已注册
function hasTopic(topicId: string): boolean

// 获取所有已注册话题的 ID 列表
function getAvailableTopics(): string[]

// 获取默认话题（返回 'life-simulator'）
function getDefaultTopic(): TopicPackage
```

## 使用方法

### 注册话题

```typescript
import { myTopicPackage } from '../topics/my-topic';
// 在 src/core/topicManager.ts 内部调用
topicRegistry.set(myTopicPackage.config.id, myTopicPackage);
```

### 查询话题

```typescript
import { getTopic, hasTopic, getAvailableTopics } from '../core/topicManager';

// 获取指定话题
const topic = getTopic('life-simulator');

// 安全检查
if (hasTopic('my-topic-id')) {
  const topic = getTopic('my-topic-id');
}

// 获取所有话题 ID（用于渲染选择界面）
const topicIds = getAvailableTopics();
// → ['life-simulator', 'research-simulator', ...]
```

## 错误处理

`getTopic()` 在 ID 不存在时抛出：

```
Error: Topic not found: {topicId}. Available topics: life-simulator, research-simulator
```

建议在调用前先用 `hasTopic()` 检查，或在调用处捕获异常。

## 内部实现说明

`topicRegistry` 是模块级单例 `Map<string, TopicPackage>`：
- 应用启动时，`topicManager.ts` 文件末尾代码自动注册所有内置话题
- 运行时可动态调用 `registerTopic()`（支持热重载）
- Map 中的话题按注册顺序排列，`getAvailableTopics()` 返回同样的顺序
