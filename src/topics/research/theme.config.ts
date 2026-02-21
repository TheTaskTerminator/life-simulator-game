import { ThemeConfig } from '../../core/types/base';

/**
 * 科研模拟器 - 主题配置
 * 学术蓝 + 白色强调色主题
 */
export const themeConfig: ThemeConfig = {
  name: 'Academic Blue',

  colors: {
    background: '#0d1117',
    backgroundSecondary: '#161b22',
    text: '#c9d1d9',
    textSecondary: '#8b949e',
    accent: '#58a6ff',
    success: '#3fb950',
    warning: '#d29922',
    danger: '#f85149',
    border: '#30363d',
    card: '#21262d',
    modal: '#161b22',
  },

  fonts: {
    heading: "'Source Serif Pro', 'Noto Serif SC', serif",
    body: "'Inter', 'Noto Sans SC', sans-serif",
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
    sm: '0 1px 2px rgba(0, 0, 0, 0.3)',
    md: '0 3px 6px rgba(0, 0, 0, 0.4)',
    lg: '0 8px 16px rgba(0, 0, 0, 0.5)',
  },

  borderRadius: {
    sm: 4,
    md: 6,
    lg: 8,
  },

  globalStyles: `
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Source+Serif+Pro:wght@400;600;700&family=Noto+Sans+SC:wght@300;400;500;700&family=Noto+Serif+SC:wght@400;600;700&display=swap');

    :root {
      --color-background: #0d1117;
      --color-background-secondary: #161b22;
      --color-text: #c9d1d9;
      --color-text-secondary: #8b949e;
      --color-accent: #58a6ff;
      --color-success: #3fb950;
      --color-warning: #d29922;
      --color-danger: #f85149;
      --color-border: #30363d;
      --color-card: #21262d;
      --color-modal: #161b22;

      --font-heading: 'Source Serif Pro', 'Noto Serif SC', serif;
      --font-body: 'Inter', 'Noto Sans SC', sans-serif;
      --font-size-base: 16px;

      --spacing-xs: 4px;
      --spacing-sm: 8px;
      --spacing-md: 16px;
      --spacing-lg: 24px;
      --spacing-xl: 32px;

      --shadow-sm: 0 1px 2px rgba(0, 0, 0, 0.3);
      --shadow-md: 0 3px 6px rgba(0, 0, 0, 0.4);
      --shadow-lg: 0 8px 16px rgba(0, 0, 0, 0.5);

      --radius-sm: 4px;
      --radius-md: 6px;
      --radius-lg: 8px;
    }

    body {
      background-color: var(--color-background);
      color: var(--color-text);
      font-family: var(--font-body);
      font-size: var(--font-size-base);
      line-height: 1.6;
      margin: 0;
      padding: 0;
    }

    * {
      box-sizing: border-box;
    }

    h1, h2, h3, h4, h5, h6 {
      font-family: var(--font-heading);
      color: var(--color-accent);
      margin-top: 0;
    }

    button {
      font-family: var(--font-body);
      cursor: pointer;
    }

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
  `,
};

export default themeConfig;
