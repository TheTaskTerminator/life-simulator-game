import { ThemeConfig } from '../../core/types/base';

/**
 * 人生模拟器 - 主题配置
 * 午夜蓝 + 金色强调色主题
 */
export const themeConfig: ThemeConfig = {
  name: 'Midnight Gold',

  colors: {
    background: '#0a0a1a',
    backgroundSecondary: '#12122a',
    text: '#e8e8e8',
    textSecondary: '#a0a0b0',
    accent: '#d4af37',
    success: '#2ecc71',
    warning: '#f39c12',
    danger: '#e74c3c',
    border: '#2a2a4a',
    card: '#1a1a2e',
    modal: '#12122a',
  },

  fonts: {
    heading: "'Cinzel', 'Noto Serif SC', serif",
    body: "'Noto Sans SC', sans-serif",
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
    sm: '0 2px 4px rgba(0, 0, 0, 0.3)',
    md: '0 4px 8px rgba(0, 0, 0, 0.4)',
    lg: '0 8px 16px rgba(0, 0, 0, 0.5)',
  },

  borderRadius: {
    sm: 4,
    md: 8,
    lg: 12,
  },

  globalStyles: `
    @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@400;600;700&family=Noto+Sans+SC:wght@300;400;500;700&family=Noto+Serif+SC:wght@400;600;700&display=swap');

    :root {
      --color-background: #0a0a1a;
      --color-background-secondary: #12122a;
      --color-text: #e8e8e8;
      --color-text-secondary: #a0a0b0;
      --color-accent: #d4af37;
      --color-success: #2ecc71;
      --color-warning: #f39c12;
      --color-danger: #e74c3c;
      --color-border: #2a2a4a;
      --color-card: #1a1a2e;
      --color-modal: #12122a;

      --font-heading: 'Cinzel', 'Noto Serif SC', serif;
      --font-body: 'Noto Sans SC', sans-serif;
      --font-size-base: 16px;

      --spacing-xs: 4px;
      --spacing-sm: 8px;
      --spacing-md: 16px;
      --spacing-lg: 24px;
      --spacing-xl: 32px;

      --shadow-sm: 0 2px 4px rgba(0, 0, 0, 0.3);
      --shadow-md: 0 4px 8px rgba(0, 0, 0, 0.4);
      --shadow-lg: 0 8px 16px rgba(0, 0, 0, 0.5);

      --radius-sm: 4px;
      --radius-md: 8px;
      --radius-lg: 12px;
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

    /* 滚动条样式 */
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
      50% { opacity: 0.6; }
    }

    @keyframes shimmer {
      0% { background-position: -200% 0; }
      100% { background-position: 200% 0; }
    }
  `,
};

export default themeConfig;
