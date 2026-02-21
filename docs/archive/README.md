# 历史文档存档

本目录存放项目重定位前的历史文档，供历史参考。

## 重定位背景

项目 `life-simulator-game` 已于 2026-02 正式重定位为 **SimuEngine - 文字模拟器开发脚手架**。
原有文档面向"人生模拟器游戏玩家"，与新的开发者脚手架定位不符，故存档于此。

## 存档文件清单

| 存档文件 | 原文件位置 | 存档原因 |
|----------|-----------|---------|
| `original-readme.md` | `README.md`（根目录） | 面向游戏玩家的说明，已被开发者脚手架文档替代 |
| `abstract-v0.2.md` | `abstract.md`（根目录） | 模拟器规范原文保留；内容已升级为 `docs/design-guide/simulator-design.md` v0.3 |
| `original-deployment.md` | `DEPLOYMENT.md`（根目录） | 品牌名已变更；内容仍有参考价值，根目录 DEPLOYMENT.md 已更新 |
| `original-security.md` | `SECURITY.md`（根目录） | 内容通用；根目录 SECURITY.md 保持原样 |
| `doc/` | `doc/`（根目录） | 旧架构下的多个文档文件，整体存档 |

## 关键内容迁移说明

### abstract.md → simulator-design.md v0.3

`abstract-v0.2.md` 中的模拟器设计规范核心内容已升级为：

**新位置**：`docs/design-guide/simulator-design.md`（版本 v0.3）

**v0.3 升级内容**：
- 更新了"附录：规范概念与代码对照"，映射到新的 `src/core/` 和 `src/topics/` 架构
- 补充了 `PromptsConfig` 和 `PromptContext` 的具体使用说明
- 新增了 TopicPackage 与规范实体的对应关系说明

### 旧 doc/ 目录

旧 `doc/` 目录包含以下文件（基于旧架构编写，仅供参考）：

- `API.md` - 旧版 API 文档
- `ARCHITECTURE.md` - 旧版架构文档
- `CONTRIBUTING.md` - 贡献指南
- `DEVELOPMENT.md` - 旧版开发指南
- `GAMEPLAY.md` - 游戏玩法说明
- `IMPLEMENTATION.md` - 实现方案
- `MODULES.md` - 模块说明
- `QUICK_START.md` - 旧版快速开始
- `README.md` - 旧版文档中心
- `STANDARDS.md` - 代码规范

新文档请参阅项目根目录 `README.md` 和 `docs/` 目录。
