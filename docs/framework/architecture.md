# 整体架构

SimuEngine 采用分层架构，核心层与话题层完全解耦。

## 分层架构图

```
┌─────────────────────────────────────────────────┐
│                   话题层（可扩展）                  │
│  src/topics/life/    src/topics/research/   ...  │
│  TopicPackage        TopicPackage                │
└───────────────────────┬─────────────────────────┘
                        │ 注册到
┌───────────────────────▼─────────────────────────┐
│                   框架核心层                       │
│  src/core/types/base.ts    ← 类型定义              │
│  src/core/topicManager.ts  ← 注册表                │
│  src/core/context/         ← React Context        │
│  src/core/components/base/ ← 主题化 UI 组件         │
└───────────────────────┬─────────────────────────┘
                        │
┌───────────────────────▼─────────────────────────┐
│                   引擎层                           │
│  src/engine/endingEngine.ts   ← 结局计算           │
│  src/engine/turnEngine.ts     ← 回合系统           │
│  src/engine/eventSelector.ts  ← 事件选择           │
└───────────────────────┬─────────────────────────┘
                        │
┌───────────────────────▼─────────────────────────┐
│                   服务层                           │
│  src/services/aiService.ts     ← AI 事件生成       │
│  src/services/eventService.ts  ← 事件处理缓存      │
│  src/services/promptService.ts ← Prompt 构建      │
└───────────────────────┬─────────────────────────┘
                        │
┌───────────────────────▼─────────────────────────┐
│                   视图层                           │
│  src/views/GameView.tsx          ← 通用游戏视图    │
│  src/views/ResearchGameView.tsx  ← 专属视图示例    │
│  src/components/                 ← UI 组件         │
└─────────────────────────────────────────────────┘
```

## 核心层（src/core/）

框架的骨架，与话题内容无关，不应轻易修改。

| 文件/目录 | 职责 |
|-----------|------|
| `types/base.ts` | 所有 TopicPackage 相关类型的权威来源 |
| `topicManager.ts` | 话题注册表（Map），提供注册和查询 API |
| `context/TopicContext.tsx` | React Context，向组件树注入当前话题配置 |
| `components/base/` | 6个主题化基础 UI 组件 |
| `index.ts` | 核心层统一导出入口 |

## 话题层（src/topics/）

开发者创作区，每个话题是一个独立目录，互不干扰。

- 修改/删除某个话题不会影响其他话题
- 新增话题只需创建目录 + 注册，不改动框架代码

## 引擎层（src/engine/）

负责游戏机制的确定性逻辑。**引擎不依赖具体话题的语义**，通过 TopicContext 读取配置。

- `endingEngine.ts`：根据 `EndingsConfig` 检查结局条件
- `turnEngine.ts`：推进回合，管理 Tag 冷却状态
- `eventSelector.ts`：根据玩家状态和冷却机制选择事件类型

## 数据流

```
用户点击"下一回合"
       ↓
eventSelector.selectSmartEventType(player)  → 选择事件 Tag
       ↓
aiService.generateEvent(player, tag)        → AI 生成事件
       ↓
EventModal 显示事件，等待玩家选择
       ↓
aiService.generateChoiceConsequence(...)    → AI 生成后果描述
       ↓
updatePlayer(effects)                       → 应用效果（引擎 clamp）
       ↓
endingEngine.checkHardEnding(player)        → 检查硬结局
       ↓
turnEngine.advanceTurn()                    → 更新回合/冷却
       ↓
（循环）
```

## 状态管理

- 游戏状态通过 `useGameState(topicId)` Hook 管理（`src/hooks/useGameState.ts`）
- 持久化到 localStorage，Key 为 `game-save-{topicId}`
- `GameStateProvider` 通过 `topicId` 实现多话题状态隔离

## App.tsx 的角色

`src/App.tsx` 是话题感知路由层：

1. 从 localStorage 恢复上次选择的话题
2. 显示 `TopicSelector`（未选话题时）或游戏内容（已选话题时）
3. 用 `TopicProvider` 包裹游戏内容，注入话题配置
4. 根据 `topicId` 选择对应的 StartScreen 和 GameView 组件
