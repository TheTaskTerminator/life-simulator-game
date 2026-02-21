# 主题化基础组件

`src/core/components/base/` 提供了 6 个基础 UI 组件，所有组件通过 `useTheme()` Hook 自动跟随当前话题的视觉主题。

## 组件清单

| 组件 | 文件 | 主要用途 |
|------|------|---------|
| `Button` | `Button.tsx` | 操作按钮 |
| `Modal` | `Modal.tsx` | 模态对话框 |
| `Card` | `Card.tsx` | 内容卡片 |
| `Typography` | `Typography.tsx` | 文本标签 |
| `ProgressBar` | `ProgressBar.tsx` | 属性进度条 |
| `DynamicStatsPanel` | `DynamicStatsPanel.tsx` | 动态属性面板 |

---

## Button

```typescript
interface ButtonProps {
  children: ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  disabled?: boolean;
}
```

- `primary`：使用 `theme.colors.accent` 渐变背景，主操作按钮
- `secondary`：透明背景 + 边框，次要操作
- `danger`：红色背景，危险/删除操作
- `ghost`：无背景无边框，轻量操作

---

## Modal

```typescript
interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showCloseButton?: boolean;
}
```

- 自动使用 `theme.colors.modal` 背景
- 支持 `Escape` 键关闭
- 背景蒙层点击关闭

---

## Card

```typescript
interface CardProps {
  children: ReactNode;
  title?: string;
  subtitle?: string;
  icon?: string;
  padding?: 'sm' | 'md' | 'lg';
  hoverable?: boolean;
  onClick?: () => void;
}
```

- 自动使用 `theme.colors.card` 背景
- `hoverable=true` 时鼠标悬停有上浮动画

---

## Typography

```typescript
interface TypographyProps {
  children: ReactNode;
  variant?: 'h1' | 'h2' | 'h3' | 'h4' | 'body' | 'caption' | 'label';
  color?: string;
  align?: 'left' | 'center' | 'right';
  weight?: 'normal' | 'medium' | 'bold';
  italic?: boolean;
}
```

- `h1`-`h4` 自动使用 `theme.fonts.heading` 字体
- `body`/`caption`/`label` 使用 `theme.fonts.body` 字体

---

## ProgressBar

```typescript
interface ProgressBarProps {
  value: number;
  max?: number;
  min?: number;
  color?: string;
  height?: number;
  showLabel?: boolean;
  animated?: boolean;
  inverted?: boolean;
}
```

- `inverted=true`：反向指标，值越高进度条越红（用于压力、疲惫等属性）
- 自动颜色：值高于 60% 显示绿色，40%-60% 显示橙色，低于 40% 显示红色
- 反向时颜色逻辑翻转

---

## DynamicStatsPanel

根据当前话题的 `MetricsConfig` **动态**渲染所有属性，无需手写每个属性的显示逻辑。

```typescript
interface DynamicStatsPanelProps {
  attributes: Record<string, number>;
  cumulative?: Record<string, number>;  // 累积指标（如论文数、学分数）
  extraInfo?: {                          // 额外展示信息
    label: string;
    value: string | number;
  }[];
  style?: React.CSSProperties;
}
```

**工作原理**：
1. 通过 `useMetrics()` 获取话题的属性定义
2. 遍历 `definitions`，为每个属性渲染一个带标签、图标和进度条的卡片
3. 自动处理 `isInverted`（反向进度条颜色）和 `isLowWhenBelow`（低值警告状态）

```typescript
// 在游戏视图中使用
import { DynamicStatsPanel } from '../core/components/base/DynamicStatsPanel';

<DynamicStatsPanel
  attributes={player.attributes}
  extraInfo={[
    { label: '当前阶段', value: player.stage },
  ]}
/>
```

---

## 为什么使用这些组件

直接使用这些组件而非自写 inline style 的好处：
- **主题自动适配**：切换话题主题时，所有使用这些组件的 UI 自动更新
- **一致性保证**：圆角、间距、阴影等保持话题主题一致
- **内置状态处理**：ProgressBar 的颜色变化、Modal 的键盘事件等已内置
