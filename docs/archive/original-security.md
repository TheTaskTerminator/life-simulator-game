# 🔒 安全指南

本文档说明如何安全地配置和使用本项目，特别是关于 API Key 的管理。

## ⚠️ 重要安全提示

### API Key 管理

1. **绝对不要硬编码 API Key**
   - ❌ 不要在代码中直接写入 API Key
   - ✅ 使用环境变量配置 API Key

2. **绝对不要提交 API Key 到 Git**
   - ❌ 不要提交 `.env.local` 文件
   - ❌ 不要在代码、注释、Issue、PR 中暴露 API Key
   - ✅ `.env.local` 已添加到 `.gitignore`

3. **如果意外泄露了 API Key**
   - 立即在服务商处重新生成新的 API Key
   - 删除旧的 API Key
   - 更新本地 `.env.local` 文件

## 📝 配置步骤

### 1. 创建环境变量文件

```bash
# 复制示例文件
cp env.example .env.local

# 编辑 .env.local，填入你的实际 API Key
# ⚠️ 不要提交此文件到 Git
```

### 2. 配置 API Key

在 `.env.local` 文件中：

```bash
VITE_AI_KEY=your-actual-api-key-here
VITE_AI_PROVIDER=siliconflow
VITE_AI_MODEL=Qwen/Qwen2.5-72B-Instruct
```

### 3. 验证配置

启动项目后，检查控制台是否有警告信息。如果看到 "AI API Key 未配置" 的警告，说明环境变量未正确加载。

## 🔍 检查清单

在提交代码前，请确认：

- [ ] `.env.local` 文件不在 Git 跟踪中（已添加到 `.gitignore`）
- [ ] 代码中没有硬编码的 API Key
- [ ] 代码注释中没有真实的 API Key
- [ ] Issue 和 PR 中没有暴露 API Key
- [ ] 如果使用 Vercel 部署，API Key 配置在 Vercel 环境变量中，而不是代码中

## 🚀 生产环境部署

### Vercel 部署

1. 在 Vercel 项目设置中添加环境变量：
   - `VITE_AI_KEY`
   - `VITE_AI_PROVIDER`（可选）
   - `VITE_AI_MODEL`（可选）

2. 不要将 API Key 写入代码或配置文件

### 其他平台

根据部署平台的要求，在平台的环境变量配置中添加相应的变量。

## 📚 相关文档

- [快速开始指南](./doc/QUICK_START.md)
- [开发指南](./doc/DEVELOPMENT.md)
- [项目规范](./doc/STANDARDS.md)

---

**记住：安全第一！永远不要将 API Key 提交到代码仓库。**

