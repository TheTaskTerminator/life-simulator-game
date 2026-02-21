import React, { ReactNode, CSSProperties } from 'react';
import { useTheme } from '../../context/TopicContext';

export interface CardProps {
  children: ReactNode;
  title?: string;
  subtitle?: string;
  icon?: string;
  padding?: 'none' | 'sm' | 'md' | 'lg';
  hoverable?: boolean;
  onClick?: () => void;
  style?: CSSProperties;
}

/**
 * 主题化卡片组件
 */
export function Card({
  children,
  title,
  subtitle,
  icon,
  padding = 'md',
  hoverable = false,
  onClick,
  style,
}: CardProps): React.ReactElement {
  const theme = useTheme();

  const paddingStyles: Record<string, CSSProperties['padding']> = {
    none: 0,
    sm: `${theme.spacing.sm}px`,
    md: `${theme.spacing.md}px`,
    lg: `${theme.spacing.lg}px`,
  };

  const cardStyles: CSSProperties = {
    background: theme.colors.card,
    borderRadius: `${theme.borderRadius.md}px`,
    border: `1px solid ${theme.colors.border}`,
    boxShadow: theme.shadows.sm,
    padding: paddingStyles[padding],
    transition: hoverable ? 'transform 0.2s, box-shadow 0.2s' : undefined,
    cursor: onClick ? 'pointer' : 'default',
    ...style,
  };

  const handleMouseEnter = (e: React.MouseEvent<HTMLDivElement>) => {
    if (hoverable) {
      e.currentTarget.style.transform = 'translateY(-2px)';
      e.currentTarget.style.boxShadow = theme.shadows.md;
    }
  };

  const handleMouseLeave = (e: React.MouseEvent<HTMLDivElement>) => {
    if (hoverable) {
      e.currentTarget.style.transform = 'translateY(0)';
      e.currentTarget.style.boxShadow = theme.shadows.sm;
    }
  };

  const headerStyles: CSSProperties = {
    marginBottom: title || subtitle ? theme.spacing.md : 0,
  };

  const titleStyles: CSSProperties = {
    fontFamily: theme.fonts.heading,
    fontSize: '18px',
    fontWeight: 600,
    color: theme.colors.text,
    margin: 0,
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing.sm,
  };

  const subtitleStyles: CSSProperties = {
    fontSize: '14px',
    color: theme.colors.textSecondary,
    marginTop: theme.spacing.xs,
  };

  return (
    <div
      style={cardStyles}
      onClick={onClick}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {(title || subtitle) && (
        <div style={headerStyles}>
          {title && (
            <h3 style={titleStyles}>
              {icon && <span>{icon}</span>}
              {title}
            </h3>
          )}
          {subtitle && <p style={subtitleStyles}>{subtitle}</p>}
        </div>
      )}
      {children}
    </div>
  );
}

export default Card;
