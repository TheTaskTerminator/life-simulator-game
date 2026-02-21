# 安装与环境配置

## 系统要求

- **Node.js** >= 18.0.0
- **pnpm** >= 8.0.0

## 克隆与安装

```bash
git clone <repository-url>
cd life-simulator-game
pnpm install
```

## AI 服务配置

SimuEngine 使用 AI 接口动态生成游戏事件文案，需要配置 API Key。

### 创建环境变量文件

```bash
cp env.example .env.local
```

### 配置 API Key

编辑 `.env.local`：

```bash
# 必填：AI API Key
VITE_AI_KEY=your-api-key-here

# 可选：覆盖 config/ai.json 中的默认模型
# VITE_AI_MODEL_ID=qwen-72b

# 可选：AI 服务商（默认 siliconflow）
# VITE_AI_PROVIDER=siliconflow
```

### 获取 API Key

- **SiliconFlow（推荐）**：访问 [siliconflow.cn](https://siliconflow.cn) 注册获取
- **OpenAI**：访问 [platform.openai.com](https://platform.openai.com) 获取
- **其他 OpenAI 兼容接口**：设置 `VITE_AI_PROVIDER` 为对应服务商

### 切换 AI 模型

编辑 `config/ai.json`，修改 `defaultModel` 字段：

```json
{
  "defaultModel": "qwen-72b",
  "models": [...]
}
```

## 启动开发服务器

```bash
pnpm dev
```

访问 `http://localhost:5173`，应看到话题选择界面，其中包含两个内置参考话题。

## 常见问题

### "AI API Key 未配置"

确认 `.env.local` 文件存在，并且 `VITE_AI_KEY` 已填入真实的 Key。

### "模型不存在或未启用"

检查 `config/ai.json` 中 `defaultModel` 的值是否在 `models` 列表中，且对应项的 `enabled` 为 `true`。

### 端口被占用

Vite 默认使用 `5173` 端口，如被占用会自动尝试 `5174` 等端口，控制台会显示实际地址。

## 安全提示

- 不要将 `.env.local` 提交到 Git（已在 `.gitignore` 中排除）
- 不要在代码、注释或 PR 中暴露 API Key
- 详见 [SECURITY.md](../../SECURITY.md)
