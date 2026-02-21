# 🚀 快速开始指南

本文档将帮助你快速开始使用和开发人生模拟器文字游戏。

## 📋 前置要求

### 必需

- **Node.js** >= 18.0.0
- **pnpm** >= 8.0.0 (推荐) 或 **npm** >= 9.0.0
- **Git** (用于克隆项目)

### 可选

- **VS Code** - 推荐的代码编辑器
- **React DevTools** - 浏览器扩展，用于调试

## 🏃 快速开始

### 1. 克隆项目

```bash
git clone <repository-url>
cd life-simulator-game
```

### 2. 安装依赖

使用 **pnpm** (推荐):

```bash
pnpm install
```

或使用 **npm**:

```bash
npm install
```

### 3. 配置环境变量

在项目根目录创建 `.env.local` 文件：

```bash
# .env.local
# AI 服务配置（必需）
VITE_AI_KEY=your-api-key-here

# 可选配置
# VITE_AI_PROVIDER=siliconflow  # 默认: siliconflow
# VITE_AI_MODEL=Qwen/Qwen2.5-72B-Instruct  # 默认模型
```

> 💡 **获取 API Key**:
>
> - 访问 [SiliconFlow](https://siliconflow.cn) 注册账号并创建 API Key
> - 如需使用其他 AI 服务，设置 `VITE_AI_PROVIDER` 环境变量
>
> ⚠️ **安全提示**: `.env.local` 文件已添加到 `.gitignore`，不会被提交到 Git。

### 4. 启动开发服务器

```bash
# 使用 pnpm
pnpm dev

# 或使用 npm
npm run dev
```

### 5. 访问游戏

打开浏览器访问: `http://localhost:5173`

## 🎮 开始游戏

### 1. 创建角色

1. 输入角色名称
2. 选择或随机生成初始属性
3. 选择出生家庭背景
4. 点击"开始游戏"

### 2. 游戏操作

- **触发事件**: 点击"触发事件"按钮，遇到人生中的各种事件
- **做出选择**: 在事件中选择你的行动
- **查看状态**: 查看当前属性、财富、阶段等信息
- **年龄增长**: 点击"年龄+1"按钮，进入下一年

### 3. 游戏目标

- 完成各个阶段的目标
- 提升属性
- 积累财富
- 建立人际关系
- 完成成就

## 🛠️ 开发模式

### 查看游戏状态

在浏览器控制台中：

```javascript
// 查看当前存档
const save = JSON.parse(localStorage.getItem('life-simulator-save'));
console.log(save);

// 修改属性（用于测试）
save.player.attributes.wealth = 999999;
localStorage.setItem('life-simulator-save', JSON.stringify(save));
location.reload();
```

### 调试技巧

1. **React DevTools**: 安装浏览器扩展，查看组件状态
2. **控制台日志**: 在代码中使用 `console.log` 调试
3. **断点调试**: 使用 `debugger` 语句

## 📦 构建生产版本

```bash
# 构建
pnpm build

# 预览构建结果
pnpm preview
```

构建产物在 `dist/` 目录。

## 🚀 部署

### Vercel 部署

1. 将代码推送到 GitHub
2. 在 [Vercel](https://vercel.com) 导入项目
3. 配置环境变量
4. 部署

### GitHub Pages 部署

```bash
pnpm build
# 将 dist/ 目录内容部署到 GitHub Pages
```

## 📚 下一步

- 阅读 [游戏玩法说明](./GAMEPLAY.md) 了解游戏机制
- 阅读 [开发指南](./DEVELOPMENT.md) 了解开发流程
- 阅读 [架构设计](./ARCHITECTURE.md) 了解项目架构
- 阅读 [实现方案](./IMPLEMENTATION.md) 了解技术实现

## ❓ 常见问题

### Q: 如何获取 AI API Key？

A: 访问 [SiliconFlow](https://siliconflow.cn) 注册账号，在控制台创建 API Key。

### Q: 可以使用其他 AI 服务吗？

A: 可以，设置 `VITE_AI_PROVIDER` 环境变量，支持 `siliconflow`、`openai`、`custom`。

### Q: 开发服务器无法启动？

A: 检查 Node.js 版本（需要 >= 18.0.0），清除 `node_modules` 重新安装依赖。

### Q: API 请求失败？

A: 检查 API Key 是否正确，网络连接是否正常，查看浏览器控制台错误信息。

### Q: 如何清除存档？

A: 在浏览器控制台执行：
```javascript
localStorage.removeItem('life-simulator-save');
location.reload();
```

## 🆘 获取帮助

- 查看 [开发指南](./DEVELOPMENT.md) 的故障排查部分
- 在 GitHub 上提交 Issue
- 查看相关文档

---

**提示**: 如果遇到问题，请先查看文档，或提交 Issue 寻求帮助。

