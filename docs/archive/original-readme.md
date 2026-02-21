<div align="center">

# SimuEngine

> 文字模拟器开发脚手架 — 基于 React + TypeScript 的可扩展模拟器框架

[![React](https://img.shields.io/badge/React-19.2.0-61DAFB?logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8.2-3178C6?logo=typescript)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-6.2.0-646CFF?logo=vite)](https://vitejs.dev/)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

_专注于构建 AI 驱动的回合制文字模拟游戏_

</div>

---

## 这是什么

SimuEngine 是一个**可扩展的文字模拟器开发脚手架**。它提供了构建回合制文字模拟游戏所需的完整框架，包括：

- **话题包系统**：每个模拟器主题（话题）是一个独立的配置包，可以快速创建、扩展
- **AI 事件引擎**：AI 生成事件文案，引擎负责数值计算和结局判断
- **主题化 UI**：每个话题有独立的视觉主题，框架提供主题化组件库
- **多话题并存**：在同一个应用中运行多个不同主题的模拟器

### 已内置的参考话题

| 话题 | 说明 | 属性维度 | 时间单位 |
|------|------|---------|---------|
| **life** - 人生模拟器 | 从出生到老年的完整人生历程 | 6维（健康/智力/魅力/财富/幸福/压力） | 岁 |
| **research** - 学术之路 | 研究生阶段的学术生涯模拟 | 7维（科研能力/学术热情/导师好感等） | 周 |

---

## 快速开始

### 环境要求

- Node.js >= 18.0.0
- pnpm >= 8.0.0

### 1. 安装依赖

```bash
pnpm install
```

### 2. 配置 AI 服务

```bash
cp env.example .env.local
# 编辑 .env.local，填入 VITE_AI_KEY=your-api-key
```

支持 [SiliconFlow](https://siliconflow.cn)（推荐）或任意 OpenAI 兼容接口。

### 3. 启动开发服务器

```bash
pnpm dev
```

访问 `http://localhost:5173`，可以看到话题选择界面和内置的两个参考话题。

---

## 创建你的第一个话题

以下是创建一个新话题（以"创业模拟器"为例）的核心步骤：

**Step 1** — 复制参考话题作为起点：

```bash
cp -r src/topics/life src/topics/startup
```

**Step 2** — 修改 `src/topics/startup/topic.config.ts`：

```typescript
export const topicConfig: TopicConfigBase = {
  id: 'startup-simulator',   // 全局唯一 ID
  name: '创业模拟器',
  version: '1.0.0',
  // ...
};
```

**Step 3** — 在 `src/core/topicManager.ts` 中注册：

```typescript
import { startupTopicPackage } from '../topics/startup';
topicRegistry.set(startupTopicPackage.config.id, startupTopicPackage);
```

**Step 4** — 运行 `pnpm dev`，话题选择界面自动出现新话题。

完整指南：[docs/getting-started/quickstart.md](docs/getting-started/quickstart.md)

---

## 开发命令

```bash
pnpm dev          # 开发服务器（localhost:5173）
pnpm build        # 生产构建
pnpm preview      # 预览生产版本
pnpm type-check   # TypeScript 类型检查
pnpm lint         # ESLint 检查
```

---

## 技术栈

- **React 19.2.0** — UI 框架
- **TypeScript 5.8.2** — 类型系统
- **Vite 6.2.0** — 构建工具
- **Zod** — AI 输出 Schema 校验
- **pnpm** — 包管理

---

## 文档

完整文档请查看 [docs/](docs/README.md)：

| 文档区域 | 内容 |
|---------|------|
| [快速上手](docs/getting-started/) | 安装、5分钟建话题、核心概念 |
| [话题开发指南](docs/topic-development/) | 话题包每个配置文件的详细说明 |
| [框架原理](docs/framework/) | 架构、游戏循环、Context、引擎、AI 集成 |
| [设计方法论](docs/design-guide/) | 模拟器规范、数值设计、事件设计、Prompt 工程 |
| [API 参考](docs/reference/) | 类型系统、topicManager API、Hooks API |
| [示例](docs/examples/) | 从零创建话题完整示例 |

---

## 许可证

MIT License

---

<div align="center">

Made with care for simulator game developers

</div>
