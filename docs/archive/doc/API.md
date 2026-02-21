# 📡 API 文档

本文档说明项目中使用的 API 服务和接口。

## 🤖 AI 服务 API

### 配置

AI 服务配置位于 `config/aiConfig.ts`，支持多种提供商。

### SiliconFlow API

**默认提供商**，推荐使用。

#### 配置

```typescript
VITE_AI_PROVIDER=siliconflow
VITE_AI_KEY=your-api-key
VITE_AI_MODEL=Qwen/Qwen2.5-72B-Instruct
```

#### API 端点

```
https://api.siliconflow.cn/v1/chat/completions
```

#### 使用示例

```typescript
import { generateEvent } from './services/aiService';

const event = await generateEvent(player, EventType.OPPORTUNITY);
```

### OpenAI API

#### 配置

```typescript
VITE_AI_PROVIDER=openai
VITE_AI_KEY=sk-your-api-key
VITE_AI_MODEL=gpt-3.5-turbo
```

#### API 端点

```
https://api.openai.com/v1/chat/completions
```

### 自定义 API

#### 配置

```typescript
VITE_AI_PROVIDER=custom
VITE_AI_KEY=your-api-key
VITE_AI_API_URL=https://your-api.com/v1/chat/completions
VITE_AI_MODEL=your-model-name
```

## 🔧 服务接口

### aiService.ts

#### generateEvent()

生成人生事件。

```typescript
async function generateEvent(
  player: Player,
  eventType?: EventType
): Promise<Event>
```

**参数**:
- `player: Player` - 玩家数据
- `eventType?: EventType` - 事件类型（可选）

**返回**: `Promise<Event>` - 生成的事件

**示例**:

```typescript
const event = await generateEvent(player, EventType.OPPORTUNITY);
```

### eventService.ts

#### generateEvent()

生成事件（包含预设事件检查）。

```typescript
async function generateEvent(
  player: Player,
  eventType?: EventType
): Promise<Event>
```

#### checkPresetEvents()

检查是否有预设事件。

```typescript
function checkPresetEvents(player: Player): Event | null
```

### stageService.ts

#### getCurrentStage()

获取当前人生阶段。

```typescript
function getCurrentStage(age: number): LifeStage
```

#### checkStageTransition()

检查阶段转换。

```typescript
function checkStageTransition(
  player: Player,
  newAge: number
): LifeStage | null
```

### careerService.ts

#### getAvailableCareers()

获取可用职业列表。

```typescript
function getAvailableCareers(player: Player): Career[]
```

#### calculateIncome()

计算收入。

```typescript
function calculateIncome(player: Player): number
```

## 🛠️ 工具函数

### attributeUtils.ts

#### calculateAttributes()

计算玩家属性（包含加成）。

```typescript
function calculateAttributes(player: Player): PlayerAttributes
```

#### applyEventEffects()

应用事件效果。

```typescript
function applyEventEffects(
  player: Player,
  effects: EventEffect[]
): Player
```

### gameUtils.ts

#### saveGame()

保存游戏。

```typescript
function saveGame(player: Player): void
```

#### loadGame()

加载游戏。

```typescript
function loadGame(): Player | null
```

## 🔐 API 安全

### API Key 管理

- **开发环境**: 使用 `.env.local` 文件
- **生产环境**: 使用环境变量，不暴露在代码中
- **代理**: 使用 Vercel Function 代理，隐藏 API Key

### 跨域处理

- **开发环境**: Vite 代理配置
- **生产环境**: Vercel Function 代理

## 📊 错误处理

### API 错误

```typescript
try {
  const event = await generateEvent(player);
} catch (error) {
  console.error('API Error:', error);
  // 降级方案
  const fallbackEvent = getFallbackEvent();
}
```

### 网络错误

```typescript
if (!navigator.onLine) {
  // 使用离线模式
  return getOfflineEvent();
}
```

## 🚀 性能优化

### 事件缓存

```typescript
// 缓存 AI 生成的事件
const eventCache = new Map<string, Event>();

export async function generateEvent(player: Player): Promise<Event> {
  const cacheKey = generateCacheKey(player);
  
  if (eventCache.has(cacheKey)) {
    return eventCache.get(cacheKey)!;
  }
  
  const event = await aiService.generateEvent(player);
  eventCache.set(cacheKey, event);
  
  return event;
}
```

### 请求去重

```typescript
// 防止重复请求
let pendingRequest: Promise<Event> | null = null;

export async function generateEvent(player: Player): Promise<Event> {
  if (pendingRequest) {
    return pendingRequest;
  }
  
  pendingRequest = aiService.generateEvent(player);
  const result = await pendingRequest;
  pendingRequest = null;
  
  return result;
}
```

## 📝 使用示例

### 生成事件

```typescript
import { generateEvent } from './services/eventService';
import { EventType } from './types';

// 生成随机事件
const event = await generateEvent(player);

// 生成特定类型事件
const opportunityEvent = await generateEvent(player, EventType.OPPORTUNITY);
```

### 处理事件选择

```typescript
import { applyEventEffects } from './utils/attributeUtils';

function handleEventChoice(player: Player, choice: Choice): Player {
  const updated = applyEventEffects(player, choice.effects);
  return updated;
}
```

---

**提示**: 更多详细信息请参考 [实现方案](./IMPLEMENTATION.md) 文档。

