# 🏗️ 架构设计文档

本文档详细说明人生模拟器文字游戏的架构设计、技术选型和核心设计模式。

## 📐 整体架构

### 架构图

```
┌─────────────────────────────────────────────────────────┐
│                     浏览器客户端                          │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐ │
│  │   React UI   │  │  状态管理     │  │  本地存储     │ │
│  │   Components │  │  (Hooks)     │  │ (localStorage)│ │
│  └──────────────┘  └──────────────┘  └──────────────┘ │
└─────────────────────────────────────────────────────────┘
                          │
                          │ HTTP/HTTPS
                          ▼
┌─────────────────────────────────────────────────────────┐
│                    Vercel Serverless                    │
│  ┌──────────────────────────────────────────────────┐  │
│  │         API Proxy (api/proxy.js)                 │  │
│  │  - 处理跨域问题                                   │  │
│  │  - 转发 API 请求                                  │  │
│  └──────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────┘
                          │
                          │ API Request
                          ▼
┌─────────────────────────────────────────────────────────┐
│              AI API (SiliconFlow/OpenAI)                 │
│  - 生成人生事件和剧情                                   │
│  - 动态内容生成                                         │
└─────────────────────────────────────────────────────────┘
```

## 🎯 技术栈

### 前端技术

| 技术         | 版本    | 用途     |
| ------------ | ------- | -------- |
| React        | 19.2.0  | UI 框架  |
| TypeScript   | 5.8.2   | 类型系统 |
| Vite         | 6.2.0   | 构建工具 |
| Lucide React | 0.554.0 | 图标库   |

### 服务与 API

| 服务             | 用途           |
| ---------------- | -------------- |
| SiliconFlow API  | AI 事件生成    |
| OpenAI API       | AI 事件生成（备选）|
| Vercel Functions | API 代理和部署 |
| localStorage     | 数据持久化     |

## 📁 项目结构

```
life-simulator-game/
├── components/              # UI 组件层（纯展示组件）
│   ├── EventModal.tsx           # 事件弹窗
│   ├── CharacterModal.tsx       # 角色信息弹窗
│   ├── CareerModal.tsx          # 职业选择弹窗
│   ├── EducationModal.tsx       # 教育选择弹窗
│   ├── RelationshipModal.tsx     # 人际关系弹窗
│   ├── PropertyModal.tsx        # 房产弹窗
│   ├── InvestmentModal.tsx       # 投资弹窗
│   ├── AchievementModal.tsx      # 成就弹窗
│   ├── SettingsModal.tsx         # 设置弹窗
│   ├── StartScreen.tsx           # 开始界面
│   ├── WelcomeScreen.tsx         # 欢迎界面
│   ├── StatsPanel.tsx            # 属性面板
│   ├── LogPanel.tsx              # 日志面板
│   ├── StageIndicator.tsx        # 阶段指示器
│   └── LifeTimeline.tsx          # 人生时间线
│
├── views/                  # 视图层（业务逻辑 + UI）
│   ├── GameView.tsx           # 主游戏视图
│   ├── GameHeader.tsx         # 游戏头部导航
│   ├── ActionBar.tsx          # 操作按钮栏
│   ├── NotificationToast.tsx  # 通知弹窗
│   ├── ModalsContainer.tsx     # 弹窗容器
│   ├── stage/                  # 阶段模块
│   │   ├── index.ts
│   │   └── useStageHandlers.ts
│   ├── event/                  # 事件模块
│   │   ├── index.ts
│   │   └── useEventHandlers.ts
│   ├── career/                 # 职业模块
│   │   ├── index.ts
│   │   └── useCareerHandlers.ts
│   ├── education/              # 教育模块
│   │   ├── index.ts
│   │   └── useEducationHandlers.ts
│   ├── relationship/           # 人际关系模块
│   │   ├── index.ts
│   │   └── useRelationshipHandlers.ts
│   ├── property/               # 房产模块
│   │   ├── index.ts
│   │   └── usePropertyHandlers.ts
│   ├── investment/             # 投资模块
│   │   ├── index.ts
│   │   └── useInvestmentHandlers.ts
│   └── achievement/            # 成就模块
│       ├── index.ts
│       └── useAchievementHandlers.ts
│
├── features/               # 功能模块（可复用的 Hooks）
│   ├── stage/                 # 阶段相关
│   │   └── useStage.ts
│   ├── event/                 # 事件相关
│   │   └── useEvent.ts
│   ├── attribute/             # 属性相关
│   │   └── useAttribute.ts
│   ├── career/                # 职业相关
│   │   └── useCareer.ts
│   ├── relationship/          # 人际关系相关
│   │   └── useRelationship.ts
│   └── modal/                 # 模态框状态管理
│       └── useModalState.ts
│
├── hooks/                  # 通用 Hooks
│   ├── useGameState.ts      # 游戏状态管理
│   └── useGameEffects.ts   # 游戏副作用处理
│
├── utils/                  # 工具函数
│   ├── gameUtils.ts        # 游戏工具函数
│   ├── attributeUtils.ts   # 属性计算工具
│   ├── stageUtils.ts       # 阶段工具函数
│   ├── eventUtils.ts       # 事件工具函数
│   └── careerUtils.ts      # 职业工具函数
│
├── services/               # 业务逻辑服务层
│   ├── aiService.ts        # AI 事件生成服务
│   ├── eventService.ts     # 事件处理服务
│   ├── stageService.ts    # 阶段管理服务
│   ├── careerService.ts   # 职业管理服务
│   └── relationshipService.ts # 人际关系服务
│
├── config/                 # 配置文件
│   ├── aiConfig.ts         # AI 配置（支持多提供商）
│   └── README.md           # 配置说明
│
├── api/                    # API 层
│   └── proxy.js            # Vercel Serverless Function
│
├── doc/                    # 项目文档
│
├── assets/                 # 静态资源
│   └── images/             # 图片资源
│
├── App.tsx                 # 主应用组件（协调器）
├── types.ts                # TypeScript 类型定义
├── constants.ts            # 游戏常量配置
├── index.tsx               # 应用入口
├── vite.config.ts          # Vite 配置
└── vercel.json             # Vercel 部署配置
```

## 🏛️ 架构层次

### 1. 表示层 (Presentation Layer)

**位置**: `components/`

**职责**:

- UI 渲染
- 用户交互处理
- 视觉反馈

**特点**:

- 纯函数组件（Functional Components）
- 无业务逻辑，只负责展示
- 通过 props 接收数据和回调

### 2. 视图层 (View Layer)

**位置**: `views/`

**职责**:

- 组合 UI 组件
- 处理用户交互
- 调用业务逻辑 Handlers

**特点**:

- 使用自定义 Hooks (`useXxxHandlers`) 封装业务逻辑
- 通过 Handlers 与业务逻辑层交互
- 保持组件纯净，业务逻辑在 Handlers 中

### 3. 功能层 (Feature Layer)

**位置**: `features/`

**职责**:

- 提供可复用的功能 Hooks
- 封装特定功能的业务逻辑
- 跨模块共享的功能

### 4. 业务逻辑层 (Business Logic Layer)

**位置**: `services/`, `utils/`

**职责**:

- 游戏规则实现
- AI 事件生成
- 属性计算
- 数据转换和工具函数

### 5. 状态管理层 (State Management Layer)

**位置**: `hooks/useGameState.ts`, `App.tsx`

**职责**:

- 全局状态管理
- 数据持久化
- 状态同步

### 6. 配置层 (Configuration Layer)

**位置**: `config/`

**职责**:

- AI 服务配置
- 环境变量管理
- 多提供商支持

## 🔄 数据流

### 状态管理流程

```
用户操作 → View Handlers → Features/Services → 更新状态 → 触发重渲染 → UI 更新
                ↓
           保存到 localStorage (通过 useGameEffects)
```

### API 调用流程

```
用户触发事件
    │
    ▼
views/event/useEventHandlers.ts: handleEvent()
    │
    ▼
services/eventService.ts: generateEvent()
    │
    ▼
services/aiService.ts: generateAIEvent()
    │
    ▼
config/aiConfig.ts: 获取 AI 配置
    │
    ▼
fetch() → Vercel Function (/api/proxy)
    │
    ▼
AI API (SiliconFlow/OpenAI)
    │
    ▼
返回 JSON 数据
    │
    ▼
解析并更新游戏状态 (通过 useGameState)
```

## 🎨 设计模式

### 1. 组件组合模式

使用组合而非继承来构建 UI

### 2. 受控组件模式

所有表单输入都是受控的

### 3. 容器/展示组件模式

- **容器组件**: `App.tsx` - 协调各模块，管理全局状态
- **视图组件**: `views/*` - 组合 UI 组件，处理用户交互
- **展示组件**: `components/*` - 纯 UI 组件

### 4. 服务层模式

将业务逻辑从组件中分离到服务层和 Handlers

### 5. Hook 模式

使用自定义 Hooks 封装可复用的逻辑

## 🔐 数据持久化

### localStorage 结构

```typescript
// 存档数据
{
  player: Player,        // 玩家数据
  logs: LogEntry[],      // 游戏日志
  timestamp: number      // 保存时间戳
}

// 设置数据
{
  soundEnabled: boolean,
  musicEnabled: boolean,
  autoSave: boolean,
  // ...
}
```

### 自动保存机制

```typescript
useEffect(() => {
  if (player && gameStarted && settings.autoSave) {
    saveGame(player, logs);
  }
}, [player, logs, settings.autoSave]);
```

## 🌐 跨域处理

### 开发环境

使用 Vite 代理

### 生产环境

使用 Vercel Serverless Function

## 📊 性能优化

### 1. React.memo

对频繁渲染的组件使用 `React.memo`

### 2. useCallback

缓存回调函数

### 3. useMemo

缓存计算结果

### 4. 事件缓存

缓存 AI 生成的事件，避免重复请求

## 🔒 安全性

### 1. API Key 管理

- 开发环境：使用环境变量
- 生产环境：使用环境变量，不暴露在代码中

### 2. 输入验证

所有用户输入都经过验证

### 3. XSS 防护

React 自动转义用户输入，防止 XSS 攻击

## 🚀 扩展性

### 添加新功能

1. **添加新组件**: 在 `components/` 目录创建（纯 UI 组件）
2. **添加新视图**: 在 `views/` 目录创建模块（包含 Handlers）
3. **添加新功能 Hook**: 在 `features/` 目录创建（可复用功能）
4. **添加新服务**: 在 `services/` 目录创建（业务逻辑）
5. **添加新工具函数**: 在 `utils/` 目录创建
6. **添加新类型**: 在 `types.ts` 中定义
7. **添加新常量**: 在 `constants.ts` 中定义

---

**相关文档**:

- [实现方案](./IMPLEMENTATION.md) - 详细的技术实现方案
- [模块解析](./MODULES.md) - 详细的模块说明
- [API 文档](./API.md) - API 使用说明
- [开发指南](./DEVELOPMENT.md) - 开发实践
