import React, { CSSProperties, ReactNode } from 'react';
import { useTheme } from '../../context/TopicContext';

export interface TypographyProps {
  children: ReactNode;
  variant?: 'h1' | 'h2' | 'h3' | 'h4' | 'body' | 'caption' | 'label';
  color?: string;
  align?: 'left' | 'center' | 'right';
  weight?: CSSProperties['fontWeight'];
  italic?: boolean;
  style?: CSSProperties;
}

/**
 * 主题化文字组件
 */
export function Typography({
  children,
  variant = 'body',
  color,
  align = 'left',
  weight,
  italic = false,
  style,
}: TypographyProps): React.ReactElement {
  const theme = useTheme();

  const variantStyles: Record<string, CSSProperties> = {
    h1: {
      fontFamily: theme.fonts.heading,
      fontSize: '36px',
      fontWeight: 700,
      lineHeight: 1.2,
      color: theme.colors.accent,
    },
    h2: {
      fontFamily: theme.fonts.heading,
      fontSize: '28px',
      fontWeight: 600,
      lineHeight: 1.3,
      color: theme.colors.text,
    },
    h3: {
      fontFamily: theme.fonts.heading,
      fontSize: '22px',
      fontWeight: 600,
      lineHeight: 1.4,
      color: theme.colors.text,
    },
    h4: {
      fontFamily: theme.fonts.heading,
      fontSize: '18px',
      fontWeight: 500,
      lineHeight: 1.4,
      color: theme.colors.text,
    },
    body: {
      fontFamily: theme.fonts.body,
      fontSize: '16px',
      fontWeight: 400,
      lineHeight: 1.6,
      color: theme.colors.text,
    },
    caption: {
      fontFamily: theme.fonts.body,
      fontSize: '14px',
      fontWeight: 400,
      lineHeight: 1.5,
      color: theme.colors.textSecondary,
    },
    label: {
      fontFamily: theme.fonts.body,
      fontSize: '14px',
      fontWeight: 500,
      lineHeight: 1.4,
      color: theme.colors.textSecondary,
      textTransform: 'uppercase',
      letterSpacing: '0.5px',
    },
  };

  const baseStyle: CSSProperties = {
    margin: 0,
    textAlign: align,
    fontStyle: italic ? 'italic' : 'normal',
    ...variantStyles[variant],
    ...(color && { color }),
    ...(weight && { fontWeight: weight }),
    ...style,
  };

  const componentMap: Record<string, keyof JSX.IntrinsicElements> = {
    h1: 'h1',
    h2: 'h2',
    h3: 'h3',
    h4: 'h4',
    body: 'p',
    caption: 'span',
    label: 'span',
  };

  const Component = componentMap[variant];

  return <Component style={baseStyle}>{children}</Component>;
}

export default Typography;
