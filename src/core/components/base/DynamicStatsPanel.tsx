import React, { useMemo } from 'react';
import { useTheme, useMetrics, useTexts } from '../../context/TopicContext';

/**
 * 动态属性面板 Props
 */
export interface DynamicStatsPanelProps {
  /** 玩家属性值 */
  attributes: Record<string, number>;
  /** 累积指标（可选） */
  cumulative?: Record<string, number>;
  /** 额外的状态信息 */
  extraInfo?: {
    stage?: string;
    stageLabel?: string;
    week?: number;
    semesterInfo?: string;
    actionPoints?: number;
    maxActionPoints?: number;
  };
  /** 自定义样式 */
  style?: React.CSSProperties;
}

/**
 * 动态属性面板组件
 * 根据话题配置动态显示属性
 */
export function DynamicStatsPanel({
  attributes,
  cumulative,
  extraInfo,
  style,
}: DynamicStatsPanelProps): React.ReactElement {
  const theme = useTheme();
  const metrics = useMetrics();
  const texts = useTexts();

  // 生成属性卡片
  const attributeCards = useMemo(() => {
    return Object.entries(metrics.definitions).map(([key, def]) => {
      const value = attributes[key] ?? 0;
      const percentage = def.bounds.max === Infinity
        ? 100
        : Math.min(100, Math.max(0, (value / def.bounds.max) * 100));

      const isLow = def.isLowWhenBelow !== undefined && value < def.isLowWhenBelow;
      const isCritical = def.isGameOverAt !== undefined && value <= def.isGameOverAt;

      return {
        key,
        label: def.label,
        icon: def.icon,
        value: def.bounds.max === Infinity ? value : `${value}/${def.bounds.max}`,
        percentage,
        color: def.color,
        isLow,
        isCritical,
        isInverted: def.isInverted,
      };
    });
  }, [metrics, attributes]);

  // 样式定义
  const containerStyle: React.CSSProperties = {
    background: theme.colors.card,
    borderRadius: `${theme.borderRadius.lg}px`,
    padding: `${theme.spacing.md}px`,
    border: `1px solid ${theme.colors.border}`,
    ...style,
  };

  const titleStyle: React.CSSProperties = {
    fontFamily: theme.fonts.heading,
    fontSize: '18px',
    fontWeight: 600,
    color: theme.colors.text,
    marginBottom: `${theme.spacing.md}px`,
    display: 'flex',
    alignItems: 'center',
    gap: `${theme.spacing.sm}px`,
  };

  const gridStyle: React.CSSProperties = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
    gap: `${theme.spacing.sm}px`,
  };

  const cardStyle = (card: typeof attributeCards[0]): React.CSSProperties => ({
    background: theme.colors.backgroundSecondary,
    borderRadius: `${theme.borderRadius.md}px`,
    padding: `${theme.spacing.sm}px ${theme.spacing.md}px`,
    border: `1px solid ${card.isCritical ? theme.colors.danger : card.isLow ? theme.colors.warning : 'transparent'}`,
    transition: 'all 0.2s ease',
  });

  const cardHeaderStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: `${theme.spacing.xs}px`,
    marginBottom: `${theme.spacing.xs}px`,
  };

  const iconStyle = (): React.CSSProperties => ({
    fontSize: '16px',
  });

  const labelStyle: React.CSSProperties = {
    fontSize: '13px',
    color: theme.colors.textSecondary,
    flex: 1,
  };

  const valueStyle = (isLow: boolean, isCritical: boolean, isInverted?: boolean): React.CSSProperties => ({
    fontSize: '14px',
    fontWeight: 600,
    color: isCritical
      ? theme.colors.danger
      : isLow && !isInverted
        ? theme.colors.warning
        : isInverted && !isLow
          ? theme.colors.success
          : theme.colors.text,
  });

  const progressContainerStyle: React.CSSProperties = {
    height: '4px',
    background: theme.colors.background,
    borderRadius: '2px',
    overflow: 'hidden',
    marginTop: `${theme.spacing.xs}px`,
  };

  const progressFillStyle = (card: typeof attributeCards[0]): React.CSSProperties => ({
    height: '100%',
    width: `${card.percentage}%`,
    background: card.color,
    borderRadius: '2px',
    transition: 'width 0.3s ease',
  });

  return (
    <div style={containerStyle}>
      <h3 style={titleStyle}>
        <span>📊</span>
        {texts.statsPanelTitle}
      </h3>

      {/* 额外信息 */}
      {extraInfo && (
        <div style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: `${theme.spacing.sm}px`,
          marginBottom: `${theme.spacing.md}px`,
          padding: `${theme.spacing.sm}px`,
          background: theme.colors.backgroundSecondary,
          borderRadius: `${theme.borderRadius.sm}px`,
        }}>
          {extraInfo.stageLabel && (
            <span style={{
              fontSize: '13px',
              color: theme.colors.accent,
              fontWeight: 500,
            }}>
              📚 {extraInfo.stageLabel}
            </span>
          )}
          {extraInfo.week !== undefined && (
            <span style={{ fontSize: '13px', color: theme.colors.textSecondary }}>
              📅 第{extraInfo.week}周
            </span>
          )}
          {extraInfo.semesterInfo && (
            <span style={{ fontSize: '13px', color: theme.colors.textSecondary }}>
              {extraInfo.semesterInfo}
            </span>
          )}
          {extraInfo.actionPoints !== undefined && (
            <span style={{
              fontSize: '13px',
              color: extraInfo.actionPoints > 3 ? theme.colors.success : theme.colors.warning,
            }}>
              ⚡ {extraInfo.actionPoints}/{extraInfo.maxActionPoints || 10} 行动点
            </span>
          )}
        </div>
      )}

      {/* 属性网格 */}
      <div style={gridStyle}>
        {attributeCards.map(card => (
          <div key={card.key} style={cardStyle(card)}>
            <div style={cardHeaderStyle}>
              <span style={iconStyle()}>{card.icon}</span>
              <span style={labelStyle}>{card.label}</span>
              <span style={valueStyle(card.isLow, card.isCritical, card.isInverted)}>
                {card.value}
              </span>
            </div>
            {metrics.definitions[card.key].bounds.max !== Infinity && (
              <div style={progressContainerStyle}>
                <div style={progressFillStyle(card)} />
              </div>
            )}
          </div>
        ))}
      </div>

      {/* 累积指标 */}
      {cumulative && Object.keys(cumulative).length > 0 && (
        <div style={{
          marginTop: `${theme.spacing.md}px`,
          padding: `${theme.spacing.sm}px`,
          background: theme.colors.backgroundSecondary,
          borderRadius: `${theme.borderRadius.sm}px`,
        }}>
          <div style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: `${theme.spacing.md}px`,
          }}>
            {cumulative.credits !== undefined && (
              <div style={{ fontSize: '13px' }}>
                <span style={{ color: theme.colors.textSecondary }}>学分: </span>
                <span style={{ color: theme.colors.accent, fontWeight: 500 }}>
                  {cumulative.credits}
                </span>
              </div>
            )}
            {cumulative.papers_published !== undefined && (
              <div style={{ fontSize: '13px' }}>
                <span style={{ color: theme.colors.textSecondary }}>已发论文: </span>
                <span style={{ color: theme.colors.success, fontWeight: 500 }}>
                  {cumulative.papers_published}
                </span>
              </div>
            )}
            {cumulative.papers_submitted !== undefined && cumulative.papers_submitted > 0 && (
              <div style={{ fontSize: '13px' }}>
                <span style={{ color: theme.colors.textSecondary }}>在投: </span>
                <span style={{ color: theme.colors.warning, fontWeight: 500 }}>
                  {cumulative.papers_submitted}
                </span>
              </div>
            )}
            {cumulative.h_index !== undefined && cumulative.h_index > 0 && (
              <div style={{ fontSize: '13px' }}>
                <span style={{ color: theme.colors.textSecondary }}>H-index: </span>
                <span style={{ color: theme.colors.accent, fontWeight: 500 }}>
                  {cumulative.h_index}
                </span>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default DynamicStatsPanel;
