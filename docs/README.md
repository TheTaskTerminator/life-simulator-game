# SimuEngine 文档中心

欢迎来到 SimuEngine 文字模拟器开发脚手架文档。

## 我想要...

| 我想做的事 | 去哪里 |
|-----------|-------|
| 安装项目并运行 | [快速上手 → 安装](getting-started/installation.md) |
| 5分钟创建一个新话题 | [快速上手 → 快速开始](getting-started/quickstart.md) |
| 理解什么是"话题包" | [快速上手 → 核心概念](getting-started/concepts.md) |
| 详细了解某个配置文件 | [话题开发指南](topic-development/overview.md) |
| 理解游戏引擎是怎么工作的 | [框架原理](framework/architecture.md) |
| 学习如何设计好的模拟器游戏 | [设计方法论](design-guide/simulator-design.md) |
| 查找某个 API 的用法 | [API 参考](reference/type-definitions.md) |
| 看完整的创建话题示例 | [示例：从零创建话题](examples/topic-from-scratch.md) |

---

## 文档地图

```
docs/
├── getting-started/          # 快速上手
│   ├── installation.md       # 安装与环境配置
│   ├── quickstart.md         # 5分钟创建第一个话题
│   └── concepts.md           # 核心概念速览
│
├── topic-development/        # 话题开发完整指南（核心）
│   ├── overview.md           # 话题包结构总览
│   ├── topic-config.md       # topic.config.ts 字段详解
│   ├── metrics-config.md     # 属性系统
│   ├── stages-config.md      # 阶段系统
│   ├── endings-config.md     # 结局系统
│   ├── theme-config.md       # 主题与样式
│   ├── texts-config.md       # UI 文案
│   ├── prompts-config.md     # AI 提示词
│   ├── index-export.md       # 话题包组装与导出
│   └── registration.md       # 注册到框架并集成 UI
│
├── framework/                # 框架原理
│   ├── architecture.md       # 整体架构
│   ├── core-loop.md          # 核心游戏循环
│   ├── topic-context.md      # TopicContext & Hooks
│   ├── base-components.md    # 主题化基础组件
│   ├── engine.md             # 引擎层（结局/回合/事件选择）
│   └── ai-integration.md     # AI 服务与 Schema 校验
│
├── design-guide/             # 游戏设计方法论
│   ├── simulator-design.md   # 模拟器设计规范 v0.3
│   ├── metric-design.md      # 属性数值设计指南
│   ├── event-design.md       # 事件与选择设计指南
│   ├── ending-design.md      # 结局系统设计指南
│   └── prompt-engineering.md # AI Prompt 工程指南
│
├── reference/                # API 参考
│   ├── type-definitions.md   # 完整类型系统
│   ├── topic-manager-api.md  # topicManager API
│   └── context-hooks-api.md  # TopicContext Hooks API
│
├── examples/
│   └── topic-from-scratch.md # 从零创建话题完整示例
│
└── archive/                  # 历史文档存档
    └── README.md             # 存档说明
```

---

## 参考实现

开发新话题时，推荐参考以下已实现的话题作为起点：

- **`src/topics/life/`** — 最完整的标准参考实现（人生模拟器）
- **`src/topics/research/`** — 扩展特性示例（学术之路：customParams、周制时间等）
