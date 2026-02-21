import React, { ButtonHTMLAttributes, forwardRef } from 'react';
import { useTheme } from '../../context/TopicContext';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
}

/**
 * 主题化按钮组件
 */
export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = 'primary', size = 'md', fullWidth = false, style, children, ...props }, ref) => {
    const theme = useTheme();

    const baseStyles: React.CSSProperties = {
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: theme.fonts.body,
      fontWeight: 500,
      border: 'none',
      borderRadius: `${theme.borderRadius.md}px`,
      cursor: 'pointer',
      transition: 'all 0.2s ease',
      width: fullWidth ? '100%' : 'auto',
    };

    const sizeStyles: Record<string, React.CSSProperties> = {
      sm: {
        padding: `${theme.spacing.xs}px ${theme.spacing.sm}px`,
        fontSize: '14px',
      },
      md: {
        padding: `${theme.spacing.sm}px ${theme.spacing.md}px`,
        fontSize: '16px',
      },
      lg: {
        padding: `${theme.spacing.md}px ${theme.spacing.lg}px`,
        fontSize: '18px',
      },
    };

    const variantStyles: Record<string, React.CSSProperties> = {
      primary: {
        background: `linear-gradient(135deg, ${theme.colors.accent}, ${theme.colors.accent}dd)`,
        color: '#0a0a1a',
        boxShadow: theme.shadows.sm,
      },
      secondary: {
        background: 'transparent',
        color: theme.colors.accent,
        border: `2px solid ${theme.colors.accent}`,
      },
      danger: {
        background: theme.colors.danger,
        color: '#fff',
      },
      ghost: {
        background: 'transparent',
        color: theme.colors.textSecondary,
      },
    };

    const combinedStyles: React.CSSProperties = {
      ...baseStyles,
      ...sizeStyles[size],
      ...variantStyles[variant],
      ...style,
    };

    return (
      <button ref={ref} style={combinedStyles} {...props}>
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';

export default Button;
