import { ThemeConfig } from '../../core/types/base';

/**
 * 学术之路 - 研究生模拟器主题配置
 *
 * 设计理念：
 * - 学术蓝主色调，专业稳重
 * - 象牙白强调色，干净清爽
 * - 简洁专业的界面风格
 */
export const themeConfig: ThemeConfig = {
  name: 'Academic Scholar',

  colors: {
    // 主色调
    background: '#0f172a',        // 深学术蓝背景
    backgroundSecondary: '#1e293b', // 次级背景
    text: '#e2e8f0',              // 主文字色
    textSecondary: '#94a3b8',     // 次级文字色
    accent: '#38bdf8',            // 亮蓝色强调
    success: '#22c55e',           // 成功绿
    warning: '#f59e0b',           // 警告橙
    danger: '#ef4444',            // 危险红
    border: '#334155',            // 边框色
    card: '#1e293b',              // 卡片背景
    modal: '#0f172a',             // 模态框背景
  },

  fonts: {
    heading: "'Source Serif Pro', 'Noto Serif SC', Georgia, serif",
    body: "'Inter', 'Noto Sans SC', -apple-system, sans-serif",
    baseSize: 16,
  },

  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
  },

  shadows: {
    sm: '0 1px 2px rgba(0, 0, 0, 0.4)',
    md: '0 4px 6px rgba(0, 0, 0, 0.5)',
    lg: '0 10px 15px rgba(0, 0, 0, 0.6)',
  },

  borderRadius: {
    sm: 4,
    md: 8,
    lg: 12,
  },

  globalStyles: `
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Source+Serif+Pro:wght@400;600;700&family=Noto+Sans+SC:wght@300;400;500;700&family=Noto+Serif+SC:wght@400;600;700&display=swap');

    :root {
      /* 学术蓝配色 */
      --color-background: #0f172a;
      --color-background-secondary: #1e293b;
      --color-text: #e2e8f0;
      --color-text-secondary: #94a3b8;
      --color-accent: #38bdf8;
      --color-accent-hover: #7dd3fc;
      --color-success: #22c55e;
      --color-warning: #f59e0b;
      --color-danger: #ef4444;
      --color-border: #334155;
      --color-card: #1e293b;
      --color-modal: #0f172a;

      /* 属性颜色 */
      --color-research-ability: #22c55e;
      --color-academic-passion: #f97316;
      --color-advisor-favor: #3b82f6;
      --color-peer-relation: #a855f7;
      --color-health: #ec4899;
      --color-finance: #eab308;
      --color-pressure: #ef4444;

      /* 字体 */
      --font-heading: 'Source Serif Pro', 'Noto Serif SC', Georgia, serif;
      --font-body: 'Inter', 'Noto Sans SC', -apple-system, sans-serif;
      --font-size-base: 16px;

      /* 间距 */
      --spacing-xs: 4px;
      --spacing-sm: 8px;
      --spacing-md: 16px;
      --spacing-lg: 24px;
      --spacing-xl: 32px;

      /* 阴影 */
      --shadow-sm: 0 1px 2px rgba(0, 0, 0, 0.4);
      --shadow-md: 0 4px 6px rgba(0, 0, 0, 0.5);
      --shadow-lg: 0 10px 15px rgba(0, 0, 0, 0.6);

      /* 圆角 */
      --radius-sm: 4px;
      --radius-md: 8px;
      --radius-lg: 12px;

      /* 过渡 */
      --transition-fast: 150ms ease;
      --transition-normal: 250ms ease;
      --transition-slow: 350ms ease;
    }

    body {
      background-color: var(--color-background);
      color: var(--color-text);
      font-family: var(--font-body);
      font-size: var(--font-size-base);
      line-height: 1.6;
      margin: 0;
      padding: 0;
      min-height: 100vh;
    }

    * {
      box-sizing: border-box;
    }

    h1, h2, h3, h4, h5, h6 {
      font-family: var(--font-heading);
      color: var(--color-text);
      margin-top: 0;
      font-weight: 600;
    }

    h1 {
      font-size: 2rem;
      letter-spacing: -0.02em;
    }

    h2 {
      font-size: 1.5rem;
      letter-spacing: -0.01em;
    }

    h3 {
      font-size: 1.25rem;
    }

    a {
      color: var(--color-accent);
      text-decoration: none;
      transition: color var(--transition-fast);
    }

    a:hover {
      color: var(--color-accent-hover);
    }

    button {
      font-family: var(--font-body);
      cursor: pointer;
      transition: all var(--transition-fast);
    }

    button:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }

    /* 滚动条 */
    ::-webkit-scrollbar {
      width: 8px;
      height: 8px;
    }

    ::-webkit-scrollbar-track {
      background: var(--color-background-secondary);
    }

    ::-webkit-scrollbar-thumb {
      background: var(--color-border);
      border-radius: 4px;
    }

    ::-webkit-scrollbar-thumb:hover {
      background: var(--color-accent);
    }

    /* 动画 */
    @keyframes fadeIn {
      from { opacity: 0; }
      to { opacity: 1; }
    }

    @keyframes slideUp {
      from {
        opacity: 0;
        transform: translateY(20px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }

    @keyframes pulse {
      0%, 100% { opacity: 1; }
      50% { opacity: 0.5; }
    }

    @keyframes shake {
      0%, 100% { transform: translateX(0); }
      25% { transform: translateX(-5px); }
      75% { transform: translateX(5px); }
    }

    /* 学术风格卡片 */
    .academic-card {
      background: var(--color-card);
      border: 1px solid var(--color-border);
      border-radius: var(--radius-md);
      padding: var(--spacing-md);
      transition: all var(--transition-normal);
    }

    .academic-card:hover {
      border-color: var(--color-accent);
      box-shadow: var(--shadow-md);
    }

    /* 进度条样式 */
    .progress-bar {
      height: 8px;
      background: var(--color-background);
      border-radius: var(--radius-sm);
      overflow: hidden;
    }

    .progress-bar-fill {
      height: 100%;
      transition: width var(--transition-normal);
      border-radius: var(--radius-sm);
    }

    /* 属性标签 */
    .attribute-tag {
      display: inline-flex;
      align-items: center;
      gap: 4px;
      padding: 4px 8px;
      border-radius: var(--radius-sm);
      font-size: 0.875rem;
      font-weight: 500;
    }

    /* 选择按钮样式 */
    .choice-button {
      width: 100%;
      padding: var(--spacing-md);
      background: var(--color-card);
      border: 1px solid var(--color-border);
      border-radius: var(--radius-md);
      color: var(--color-text);
      text-align: left;
      transition: all var(--transition-fast);
    }

    .choice-button:hover {
      background: var(--color-background-secondary);
      border-color: var(--color-accent);
    }

    .choice-button:active {
      transform: scale(0.98);
    }
  `,
};

export default themeConfig;

/**
 * 属性颜色映射
 */
export const attributeColors: Record<string, string> = {
  research_ability: '#22c55e',
  academic_passion: '#f97316',
  advisor_favor: '#3b82f6',
  peer_relation: '#a855f7',
  health: '#ec4899',
  finance: '#eab308',
  pressure: '#ef4444',
};

/**
 * 获取属性颜色
 */
export function getAttributeColor(key: string): string {
  return attributeColors[key] || '#64748b';
}
