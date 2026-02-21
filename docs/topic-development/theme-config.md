# theme.config.ts 主题与样式

定义话题的完整视觉外观，包括颜色、字体、间距和全局 CSS 样式。

类型：`ThemeConfig`（`src/core/types/base.ts`）

## 完整接口

```typescript
interface ThemeConfig {
  name: string;
  colors: ColorTheme;
  fonts: FontTheme;
  spacing: SpacingTheme;
  shadows: ShadowTheme;
  borderRadius: { sm: number; md: number; lg: number };
  globalStyles?: string;
}
```

## `colors`（颜色主题）

```typescript
interface ColorTheme {
  background: string;           // 主页面背景色
  backgroundSecondary: string;  // 卡片/面板背景色
  text: string;                 // 主文字颜色
  textSecondary: string;        // 次要文字颜色（描述、标签等）
  accent: string;               // 强调色（按钮、标题高亮、进度条）
  success: string;              // 成功/正向颜色
  warning: string;              // 警告颜色
  danger: string;               // 危险/错误颜色
  border: string;               // 边框颜色
  card: string;                 // 卡片背景（通常比 background 稍亮）
  modal: string;                // 模态框背景
}
```

**设计要点**：
- `accent` 是话题的"灵魂色"，建议选一个鲜明的颜色，与 `background` 形成对比
- `background` 通常为深色（游戏/沉浸感场景），`text` 为浅色

**两个参考主题对比**：

| 颜色 | life（午夜金色） | research（学术蓝） |
|------|----------------|------------------|
| background | `#0a0a1a`（深蓝黑） | `#0f172a`（深学术蓝） |
| accent | `#d4af37`（金色） | `#38bdf8`（天蓝） |
| card | `#1a1a2e`（深紫蓝） | `#1e293b`（深蓝） |

## `fonts`（字体主题）

```typescript
interface FontTheme {
  heading: string;  // 标题字体族（CSS font-family 格式）
  body: string;     // 正文字体族
  baseSize: number; // 基础字号（px）
}
```

**引入自定义字体**：在 `globalStyles` 中通过 `@import` 引入 Google Fonts：

```typescript
globalStyles: `
  @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@400;700&display=swap');
`,
fonts: {
  heading: "'Cinzel', serif",
  body: "'Noto Sans SC', sans-serif",
  baseSize: 16,
}
```

## `globalStyles`（全局 CSS）

`TopicProvider` 会将此字符串注入到页面 `<style>` 标签中。用于：

- 引入字体（Google Fonts @import）
- 定义全局 CSS 变量
- 定义动画关键帧（@keyframes）
- 定义话题特有的 CSS 类

```typescript
globalStyles: `
  @import url('...');

  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(10px); }
    to { opacity: 1; transform: translateY(0); }
  }

  .game-card {
    animation: fadeIn 0.3s ease-out;
  }
`
```

## `spacing`、`shadows`、`borderRadius`

间距（5级）、阴影（3级）、圆角（3级）配置，通过 `useTheme()` 在组件中使用：

```typescript
const theme = useTheme();
// theme.spacing.md    → 16（px）
// theme.shadows.lg    → '0 8px 32px rgba(0,0,0,0.4)'
// theme.borderRadius.md → 8（px）
```

## 在组件中使用主题

通过 `useTheme()` Hook 获取主题配置（需在 TopicProvider 内）：

```typescript
import { useTheme } from '../core/context/TopicContext';

function MyComponent() {
  const theme = useTheme();
  return (
    <div style={{
      background: theme.colors.card,
      color: theme.colors.text,
      padding: `${theme.spacing.md}px`,
      borderRadius: `${theme.borderRadius.md}px`,
    }}>
      ...
    </div>
  );
}
```

## 参考实现

- `src/topics/life/theme.config.ts` — 午夜蓝 + 金色主题（Midnight Gold）
- `src/topics/research/theme.config.ts` — 深学术蓝 + 天蓝色主题（Academic Scholar）
