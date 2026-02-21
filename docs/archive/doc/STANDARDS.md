# 📋 项目规范

本文档详细说明项目的代码规范、命名规范和最佳实践。

## 📝 代码规范

### TypeScript 规范

#### 类型定义

```typescript
// ✅ 好的做法：明确的类型
interface Player {
  name: string;
  age: number;
  attributes: PlayerAttributes;
}

// ❌ 不好的做法：使用 any
const player: any = { ... };
```

#### 函数签名

```typescript
// ✅ 好的做法：明确的参数和返回类型
function handleEvent(player: Player, event: Event): Promise<EventResult> {
  // ...
}

// ❌ 不好的做法：缺少类型
function handleEvent(player, event) {
  // ...
}
```

### React 规范

#### 组件定义

```typescript
// ✅ 好的做法：函数组件
export default function EventModal({ event, onChoice }: EventModalProps) {
  return <div>...</div>;
}

// ✅ 好的做法：使用 React.memo 优化
export default React.memo(EventModal);
```

#### Hooks 使用

```typescript
// ✅ 好的做法：正确的依赖数组
useEffect(() => {
  // ...
}, [player, logs]);

// ❌ 不好的做法：缺少依赖
useEffect(() => {
  // ...
}, []); // 缺少 player 依赖
```

### 命名规范

- **组件**: PascalCase (`EventModal.tsx`)
- **函数**: camelCase (`handleEvent`)
- **常量**: UPPER_SNAKE_CASE (`LIFE_STAGES`)
- **类型/接口**: PascalCase (`Player`, `Event`)
- **文件**: 与导出名称一致
- **目录**: kebab-case (`life-simulator-game`)

### 代码组织

```typescript
// 1. 导入顺序
// React
import React, { useState } from 'react';
// 第三方库
import { Heart } from 'lucide-react';
// 类型
import { Player } from '../types';
// 常量
import { LIFE_STAGES } from '../constants';
// 服务
import { generateEvent } from '../services/eventService';
// 组件
import StatsPanel from './StatsPanel';

// 2. 组件结构
export default function Component() {
  // 1. Hooks
  const [state, setState] = useState();
  
  // 2. 计算值
  const computed = useMemo(() => {...}, [deps]);
  
  // 3. 事件处理
  const handleClick = useCallback(() => {...}, [deps]);
  
  // 4. 副作用
  useEffect(() => {...}, [deps]);
  
  // 5. 渲染
  return <div>...</div>;
}
```

## 🎯 项目结构规范

### 目录组织

```
life-simulator-game/
├── components/     # 纯 UI 组件，无业务逻辑
├── views/          # 视图组件，包含业务逻辑 Handlers
├── features/       # 可复用的功能 Hooks
├── hooks/          # 通用 Hooks
├── services/       # 业务逻辑服务
├── utils/          # 工具函数
├── config/         # 配置文件
└── types.ts        # 类型定义
```

### 文件命名

- **组件文件**: PascalCase (`EventModal.tsx`)
- **工具文件**: camelCase (`gameUtils.ts`)
- **服务文件**: camelCase (`eventService.ts`)
- **类型文件**: `types.ts`
- **常量文件**: `constants.ts`

### 模块导出

```typescript
// views/event/index.ts
export { useEventHandlers } from './useEventHandlers';
export type { EventHandlerProps } from './useEventHandlers';

// features/event/index.ts
export { useEvent } from './useEvent';
```

## 📦 模块规范

### Handlers 模式

每个功能模块的 `useXxxHandlers.ts` 文件：

```typescript
export function useEventHandlers({
  player,
  setPlayer,
  addLog,
  // ... 其他依赖
}: EventHandlerProps) {
  const handleEvent = useCallback(async (event: Event) => {
    // 业务逻辑
    // 调用 services 或 utils
    // 更新状态
  }, [dependencies]);
  
  return { handleEvent, ... };
}
```

### 服务层模式

```typescript
// services/eventService.ts
export class EventService {
  async generateEvent(player: Player): Promise<Event> {
    // 业务逻辑
  }
  
  private async generateAIEvent(player: Player): Promise<Event> {
    // 私有方法
  }
}
```

### 工具函数模式

```typescript
// utils/attributeUtils.ts
export function calculateAttributes(player: Player): PlayerAttributes {
  // 纯函数，无副作用
}

export function applyEventEffects(
  player: Player,
  effects: EventEffect[]
): Player {
  // 纯函数，返回新对象
}
```

## 🧪 测试规范

### 单元测试

```typescript
// utils/attributeUtils.test.ts
import { calculateAttributes } from './attributeUtils';

describe('calculateAttributes', () => {
  it('should calculate attributes correctly', () => {
    const player = createMockPlayer();
    const attributes = calculateAttributes(player);
    expect(attributes.health).toBeGreaterThan(0);
  });
});
```

### 组件测试

```typescript
// components/EventModal.test.tsx
import { render, screen } from '@testing-library/react';
import EventModal from './EventModal';

describe('EventModal', () => {
  it('should render event title', () => {
    const event = createMockEvent();
    render(<EventModal event={event} />);
    expect(screen.getByText(event.title)).toBeInTheDocument();
  });
});
```

## 📚 文档规范

### 代码注释

```typescript
/**
 * 生成人生事件
 * @param player - 玩家数据
 * @param eventType - 事件类型（可选）
 * @returns 生成的事件
 */
export async function generateEvent(
  player: Player,
  eventType?: EventType
): Promise<Event> {
  // ...
}
```

### README 文件

每个模块目录应包含 README.md 说明：

- 模块职责
- 使用方法
- 示例代码

## 🔍 代码审查规范

### 审查清单

- [ ] 代码符合 TypeScript 规范
- [ ] 组件符合 React 最佳实践
- [ ] 命名符合项目规范
- [ ] 有适当的注释
- [ ] 没有硬编码的值
- [ ] 错误处理完善
- [ ] 性能考虑（memo, useCallback, useMemo）
- [ ] 可测试性

### 提交信息格式

```
<type>(<scope>): <subject>

<body>

<footer>
```

**类型**:

- `feat`: 新功能
- `fix`: Bug 修复
- `docs`: 文档更新
- `style`: 代码格式
- `refactor`: 重构
- `test`: 测试
- `chore`: 构建/工具

**示例**:

```
feat(event): 添加 AI 事件生成功能

实现了基于 AI 的事件生成系统，支持多种事件类型
和动态内容生成。

Closes #123
```

## 🚫 禁止事项

### 代码中禁止

- ❌ 使用 `any` 类型（除非必要）
- ❌ 在组件中直接调用 API
- ❌ 在组件中编写复杂业务逻辑
- ❌ 硬编码配置值
- ❌ 忽略错误处理
- ❌ 提交 API Key 到代码仓库
- ❌ 使用 `console.log` 在生产代码中

### 架构中禁止

- ❌ 组件之间直接通信（应通过 props 或状态管理）
- ❌ 在 utils 中产生副作用
- ❌ 在 services 中直接操作 DOM
- ❌ 循环依赖

## ✅ 最佳实践

### 1. 状态管理

```typescript
// ✅ 好的做法：使用自定义 Hook
const { player, setPlayer } = useGameState();

// ❌ 不好的做法：直接在组件中管理复杂状态
const [player, setPlayer] = useState(initialPlayer);
// 大量状态管理逻辑...
```

### 2. 事件处理

```typescript
// ✅ 好的做法：使用 useCallback
const handleEvent = useCallback((event: Event) => {
  // ...
}, [dependencies]);

// ❌ 不好的做法：每次渲染创建新函数
const handleEvent = (event: Event) => {
  // ...
};
```

### 3. 数据计算

```typescript
// ✅ 好的做法：使用 useMemo
const calculatedAttributes = useMemo(() => {
  return calculateAttributes(player);
}, [player]);

// ❌ 不好的做法：每次渲染都计算
const calculatedAttributes = calculateAttributes(player);
```

### 4. 错误处理

```typescript
// ✅ 好的做法：完善的错误处理
try {
  const event = await generateEvent(player);
  setEvent(event);
} catch (error) {
  console.error('Failed to generate event:', error);
  addLog('生成事件失败，请重试');
  // 降级方案
  setEvent(getFallbackEvent());
}
```

---

**提示**: 遵循这些规范可以保持代码质量和项目的可维护性。
