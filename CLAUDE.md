# CLAUDE.md

本文件为 Claude Code 等 AI 助手提供项目开发指南。

## 项目定位

**SimuEngine** — 文字模拟器开发脚手架。

这不是一个单一游戏，而是一个**多话题模拟器框架**。核心思路：
- `src/core/` — 框架内核（话题无关，不轻易修改）
- `src/topics/` — 话题包目录（开发者创作区，每个话题一个子目录）
- `src/engine/` — 游戏引擎（结局计算、回合系统、事件选择）
- `src/services/` — AI 服务、事件处理、Prompt 生成
- `src/views/` — 游戏视图层（每个话题可有专属视图）
- `src/components/` — UI 组件

## 构建命令

```bash
pnpm install        # 安装依赖
pnpm dev            # 开发服务器（localhost:5173）
pnpm build          # 生产构建（tsc + vite build）
pnpm type-check     # TypeScript 类型检查
pnpm lint           # ESLint 检查
pnpm preview        # 预览生产版本
```

## 关键文件指针

| 用途 | 文件路径 | 关键导出 |
|------|---------|---------|
| 话题类型定义 | `src/core/types/base.ts` | `TopicPackage`, `MetricDefinition`, `TopicConfigBase` 等 |
| 话题注册表 | `src/core/topicManager.ts` | `registerTopic()`, `getTopic()`, `getAvailableTopics()` |
| 话题上下文 | `src/core/context/TopicContext.tsx` | `TopicProvider`, `useTopic()`, `useTheme()` 等 16 个 Hook |
| 基础 UI 组件 | `src/core/components/base/` | `Button`, `Modal`, `Card`, `Typography`, `ProgressBar`, `DynamicStatsPanel` |
| 结局引擎 | `src/engine/endingEngine.ts` | `checkHardEnding()`, `evaluateSoftEnding()` |
| 事件选择 | `src/engine/eventSelector.ts` | `selectSmartEventType()` |
| AI 服务 | `src/services/aiService.ts` | `generateEvent()`, `generateChoiceConsequence()` |
| 游戏状态 | `src/hooks/useGameState.ts` | `useGameState(topicId)` |
| 应用入口 | `src/App.tsx` | 话题感知路由、TopicProvider 包裹 |

## 参考话题

| 话题 | 目录 | 特点 |
|------|------|------|
| 人生模拟器 | `src/topics/life/` | 最完整的参考实现，6维属性，100岁人生 |
| 学术之路 | `src/topics/research/` | 扩展特性示例，周制时间，customParams 机制 |

## 开发新话题：标准 5 步流程

1. **创建目录** `src/topics/<your-topic>/`，包含 8 个标准文件
2. **编写配置** — `topic.config.ts`, `metrics.config.ts`, `stages.config.ts`, `endings.config.ts`, `theme.config.ts`, `texts.config.ts`, `prompts.config.ts`
3. **组装导出** — `index.ts` 中创建并导出 `TopicPackage` 对象
4. **注册话题** — 在 `src/core/topicManager.ts` 中 import 并调用 `topicRegistry.set()`
5. **集成 UI**（可选）— 如需专属界面，在 `src/App.tsx` 添加条件渲染分支

详见：`docs/topic-development/registration.md`

## 重要约束

**禁止随意修改的区域**：
- `src/core/types/base.ts` 的接口定义（改了会影响所有现有话题）
- `src/core/topicManager.ts` 的注册表逻辑（话题注册的核心机制）

**修改需要谨慎的区域**：
- `src/engine/` — 改引擎逻辑会影响所有话题的游戏机制
- `src/hooks/useGameState.ts` — 改状态管理会影响存档兼容性

**可以自由修改的区域**：
- `src/topics/` 下任意话题目录
- `src/views/` 下视图组件
- `src/components/` 下 UI 组件

## 环境配置

```bash
VITE_AI_KEY=your-api-key          # AI API Key（必需）
VITE_AI_PROVIDER=siliconflow      # AI Provider（可选，默认 siliconflow）
VITE_AI_MODEL_ID=qwen-72b         # 模型 ID（可选，覆盖 config/ai.json）
```

模型配置文件：`config/ai.json`

## 代理工具规范

### 复杂任务使用 Task 工具

```
Task tool subagent_type:
- "general-purpose": 代码探索、多步骤任务
- "Explore": 快速代码库搜索
- "Plan": 架构规划与实现设计
- "Bash": 命令执行
```

### 可用 Skills

| Skill | 使用场景 |
|-------|---------|
| `frontend-design` | 创建 UI 组件，高设计质量 |
| `planning-with-files:plan` | 复杂任务的文件驱动规划 |
| `code-review:code-review` | 代码审查 |

### 任务策略

1. **简单任务**（1-3步）：直接执行
2. **中等任务**（3-5步）：使用 Task 工具
3. **复杂任务**（>5步）：使用 `planning-with-files:plan` 或并行多 agent
