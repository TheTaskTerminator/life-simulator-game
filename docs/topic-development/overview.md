# 话题包结构总览

每个话题是一个**独立目录**，包含 8 个标准配置文件，组装成一个 `TopicPackage` 对象注册到框架中。

## 标准目录结构

```
src/topics/{your-topic}/
├── topic.config.ts      # 元配置（入口，定义话题 ID、名称、特性开关、参数）
├── metrics.config.ts    # 属性系统（玩家的数值维度定义）
├── stages.config.ts     # 阶段系统（游戏时间轴分段）
├── endings.config.ts    # 结局系统（硬结局 + 软结局）
├── theme.config.ts      # 视觉主题（颜色、字体、间距、全局样式）
├── texts.config.ts      # UI 文案（按钮、标签、提示语）
├── prompts.config.ts    # AI 提示词模板
└── index.ts             # 组装 TopicPackage 并导出
```

## TopicPackage 接口

类型定义位于 `src/core/types/base.ts`：

```typescript
interface TopicPackage {
  config: TopicConfigBase;        // 元配置
  metrics: MetricsConfig;         // 属性系统
  stages: StagesConfig;           // 阶段系统
  endings: EndingsConfig;         // 结局系统
  theme: ThemeConfig;             // 视觉主题
  texts: TextsConfig;             // UI 文案
  prompts: PromptsConfig;         // AI 提示词
  components?: TopicComponents;   // 可选：自定义组件
  types?: Record<string, unknown>;// 可选：话题特定类型
}
```

## 两个参考实现对比

| 配置项 | life（人生模拟器） | research（学术之路） |
|--------|------------------|-------------------|
| 目录 | `src/topics/life/` | `src/topics/research/` |
| 时间单位 | 岁（age） | 周（week） |
| 属性维度 | 6维 | 7维 |
| 特殊系统 | 职业/教育/房产/关系 | 导师/论文/毕业条件 |
| 自定义参数 | 无 | customParams（学位类型、学期周数等） |
| 专属视图 | GameView（通用） | ResearchGameView（定制） |

## 开发流程

1. **创建目录** — `cp -r src/topics/life src/topics/your-topic`
2. **修改各配置文件** — 按需修改 8 个文件（优先改 topic.config.ts 和 metrics.config.ts）
3. **组装 TopicPackage** — 在 index.ts 中导出
4. **注册话题** — 在 `src/core/topicManager.ts` 中注册（[详见 registration.md](registration.md)）
5. **验证** — `pnpm dev` 查看话题选择界面

## 各配置文件详解

| 文件 | 详细文档 |
|------|---------|
| `topic.config.ts` | [topic-config.md](topic-config.md) |
| `metrics.config.ts` | [metrics-config.md](metrics-config.md) |
| `stages.config.ts` | [stages-config.md](stages-config.md) |
| `endings.config.ts` | [endings-config.md](endings-config.md) |
| `theme.config.ts` | [theme-config.md](theme-config.md) |
| `texts.config.ts` | [texts-config.md](texts-config.md) |
| `prompts.config.ts` | [prompts-config.md](prompts-config.md) |
| `index.ts` | [index-export.md](index-export.md) |
