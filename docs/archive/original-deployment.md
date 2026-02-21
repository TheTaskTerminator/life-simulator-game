# 🚀 部署指南

本文档说明如何部署和配置人生模拟器游戏。

## 📋 部署前准备

### 1. 配置文件

确保 `config/ai.json` 文件存在并配置正确：

```json
{
  "defaultModel": "qwen-72b",
  "models": [...]
}
```

### 2. 环境变量

创建 `.env.local` 文件（或配置部署平台的环境变量）：

```bash
VITE_AI_KEY=your-api-key-here
```

## 🔧 构建项目

```bash
# 安装依赖
pnpm install

# 构建生产版本
pnpm build
```

构建过程中会自动：
- 将 `config/ai.json` 复制到 `public/config/ai.json`
- 打包所有静态资源到 `dist/` 目录

## 🌐 部署方式

### Vercel 部署

1. **连接 GitHub 仓库**
   - 在 Vercel 中导入项目
   - 选择 GitHub 仓库

2. **配置环境变量**
   - 在项目设置中添加：
     - `VITE_AI_KEY` - AI API Key（必需）
     - `VITE_AI_MODEL_ID` - 模型 ID（可选，覆盖配置文件）

3. **构建配置**
   - 构建命令：`pnpm build`
   - 输出目录：`dist`
   - 安装命令：`pnpm install`

4. **部署**
   - 点击部署按钮
   - 配置文件会自动从 `config/ai.json` 复制到构建产物中

### 其他平台

#### Netlify

1. 连接 GitHub 仓库
2. 构建命令：`pnpm build`
3. 发布目录：`dist`
4. 环境变量：在 Netlify 设置中配置 `VITE_AI_KEY`

#### GitHub Pages

```bash
# 构建
pnpm build

# 将 dist 目录内容部署到 gh-pages 分支
```

## 🔄 切换 AI 模型

### 方法一：修改配置文件（推荐）

1. 编辑 `config/ai.json`
2. 修改 `defaultModel` 字段
3. 提交到 Git
4. 重新部署

**优点**：
- 配置可版本控制
- 团队协作方便
- 部署后自动生效

### 方法二：环境变量（临时）

在部署平台设置环境变量：

```bash
VITE_AI_MODEL_ID=gpt-4
```

**优点**：
- 快速切换
- 无需修改代码

**缺点**：
- 需要重新构建
- 不便于版本控制

## 📝 配置文件说明

配置文件 `config/ai.json` 包含：

- **defaultModel**: 默认使用的模型 ID
- **models**: 模型列表配置
- **prompt**: 提示词配置
- **fallback**: 降级配置

详细说明请查看 [config/README.md](./config/README.md)

## 🔒 安全注意事项

1. **API Key 管理**
   - 永远不要将 API Key 提交到 Git
   - 使用环境变量或部署平台的环境变量配置
   - `.env.local` 已添加到 `.gitignore`

2. **配置文件**
   - `config/ai.json` 可以提交到 Git（不包含敏感信息）
   - 只包含模型配置，不包含 API Key

3. **生产环境**
   - 确保环境变量正确配置
   - 定期检查 API Key 的有效性

## 🐛 故障排查

### 配置文件未加载

**问题**：控制台显示 "加载 AI 配置文件失败"

**解决**：
1. 检查 `config/ai.json` 是否存在
2. 检查 JSON 格式是否正确
3. 检查构建时是否复制到 `public/config/ai.json`

### API Key 未配置

**问题**：控制台显示 "AI API Key 未配置"

**解决**：
1. 检查环境变量 `VITE_AI_KEY` 是否设置
2. 在部署平台检查环境变量配置
3. 确保环境变量名称正确（Vite 需要 `VITE_` 前缀）

### 模型不存在

**问题**：控制台显示 "模型不存在或未启用"

**解决**：
1. 检查 `config/ai.json` 中的模型 ID 是否正确
2. 检查模型的 `enabled` 字段是否为 `true`
3. 检查环境变量 `VITE_AI_MODEL_ID`（如果设置了）

## 📚 相关文档

- [配置文件说明](./config/README.md)
- [快速开始](./doc/QUICK_START.md)
- [开发指南](./doc/DEVELOPMENT.md)

