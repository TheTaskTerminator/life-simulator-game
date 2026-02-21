import React, { CSSProperties } from 'react';
import { useTheme } from '../../context/TopicContext';

export interface ProgressBarProps {
  value: number;
  max?: number;
  min?: number;
  color?: string;
  height?: number;
  showLabel?: boolean;
  label?: string;
  animated?: boolean;
  inverted?: boolean;
}

/**
 * 主题化进度条组件
 */
export function ProgressBar({
  value,
  max = 100,
  min = 0,
  color,
  height = 8,
  showLabel = false,
  label,
  animated = false,
  inverted = false,
}: ProgressBarProps): React.ReactElement {
  const theme = useTheme();

  // 计算百分比
  const percentage = Math.min(100, Math.max(0, ((value - min) / (max - min)) * 100));

  // 确定颜色
  const barColor = color || (inverted ? theme.colors.danger : theme.colors.accent);

  // 根据值调整颜色（低值警告）
  const getAdjustedColor = (): string => {
    if (inverted) {
      // 反向指标（如压力），值越高颜色越红
      if (percentage > 70) return theme.colors.danger;
      if (percentage > 50) return theme.colors.warning;
      return theme.colors.success;
    } else {
      // 正向指标（如健康），值越低颜色越红
      if (percentage < 30) return theme.colors.danger;
      if (percentage < 50) return theme.colors.warning;
      return barColor;
    }
  };

  const containerStyles: CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing.sm,
  };

  const wrapperStyles: CSSProperties = {
    flex: 1,
    background: theme.colors.backgroundSecondary,
    borderRadius: `${height / 2}px`,
    overflow: 'hidden',
    height: `${height}px`,
  };

  const barStyles: CSSProperties = {
    width: `${percentage}%`,
    height: '100%',
    background: getAdjustedColor(),
    borderRadius: `${height / 2}px`,
    transition: 'width 0.3s ease',
    ...(animated && {
      backgroundImage: `linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent)`,
      backgroundSize: '200% 100%',
      animation: 'shimmer 2s infinite',
    }),
  };

  const labelStyles: CSSProperties = {
    fontSize: '14px',
    color: theme.colors.textSecondary,
    minWidth: '40px',
    textAlign: 'right',
  };

  return (
    <div style={containerStyles}>
      {label && <span style={labelStyles}>{label}</span>}
      <div style={wrapperStyles}>
        <div style={barStyles} />
      </div>
      {showLabel && <span style={labelStyles}>{Math.round(value)}</span>}
    </div>
  );
}

export default ProgressBar;
