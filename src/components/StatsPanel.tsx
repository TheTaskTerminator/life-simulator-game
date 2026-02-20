import { useEffect, useRef, useState } from 'react';
import { Player } from '../types';
import { STAGE_NAMES } from '../constants';
import { formatNumber } from '../utils/gameUtils';

interface StatsPanelProps {
  player: Player;
}

// 数字滚动动画组件
function AnimatedNumber({
  value,
  suffix = '',
  duration = 800,
  color,
}: {
  value: number;
  suffix?: string;
  duration?: number;
  color?: string;
}) {
  const [displayValue, setDisplayValue] = useState(value);
  const [isAnimating, setIsAnimating] = useState(false);
  const prevValueRef = useRef(value);
  const animationFrameRef = useRef<number>();

  useEffect(() => {
    const prevValue = prevValueRef.current;
    if (prevValue !== value) {
      setIsAnimating(true);
      const startValue = prevValue;
      const endValue = value;
      const startTime = Date.now();

      const animate = () => {
        const now = Date.now();
        const elapsed = now - startTime;
        const progress = Math.min(elapsed / duration, 1);

        // 使用缓动函数
        const easeOutCubic = 1 - Math.pow(1 - progress, 3);
        const currentValue = Math.round(startValue + (endValue - startValue) * easeOutCubic);

        setDisplayValue(currentValue);

        if (progress < 1) {
          animationFrameRef.current = requestAnimationFrame(animate);
        } else {
          setDisplayValue(endValue);
          setIsAnimating(false);
        }
      };

      animationFrameRef.current = requestAnimationFrame(animate);
      prevValueRef.current = value;
    }

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [value, duration]);

  return (
    <span
      className={`animated-number ${isAnimating ? 'animating' : ''}`}
      style={isAnimating && color ? { color } : undefined}
    >
      {suffix === '元' ? formatNumber(displayValue) : displayValue}{suffix}
    </span>
  );
}

export default function StatsPanel({ player }: StatsPanelProps) {
  const prevAttributesRef = useRef<Player['attributes']>({ ...player.attributes });
  const [highlightedAttrs, setHighlightedAttrs] = useState<Set<keyof Player['attributes']>>(new Set());

  // 检测属性变化并高亮
  useEffect(() => {
    const prev = prevAttributesRef.current;
    const current = player.attributes;
    const changed: Set<keyof Player['attributes']> = new Set();

    (Object.keys(current) as Array<keyof Player['attributes']>).forEach((key) => {
      if (prev[key] !== current[key]) {
        changed.add(key);
      }
    });

    if (changed.size > 0) {
      setHighlightedAttrs(changed);

      const timer = setTimeout(() => {
        setHighlightedAttrs(new Set());
      }, 3000);

      prevAttributesRef.current = { ...current };

      return () => clearTimeout(timer);
    }
  }, [player.attributes]);

  const statCards = [
    {
      key: 'health' as const,
      label: '生命力',
      value: player.attributes.health,
      max: 100,
      color: '#4CAF50',
      icon: '💚',
      isLow: player.attributes.health < 30,
    },
    {
      key: 'intelligence' as const,
      label: '智慧',
      value: player.attributes.intelligence,
      max: 100,
      color: '#2196f3',
      icon: '🔮',
      isLow: player.attributes.intelligence < 30,
    },
    {
      key: 'charm' as const,
      label: '魅力',
      value: player.attributes.charm,
      max: 100,
      color: '#E91E63',
      icon: '✨',
      isLow: player.attributes.charm < 30,
    },
    {
      key: 'happiness' as const,
      label: '幸福感',
      value: player.attributes.happiness,
      max: 100,
      color: '#FFD700',
      icon: '🌟',
      isLow: player.attributes.happiness < 30,
    },
    {
      key: 'stress' as const,
      label: '劫数',
      value: player.attributes.stress,
      max: 100,
      color: '#F44336',
      icon: '⚡',
      isLow: player.attributes.stress > 70, // 压力高是坏事
      isInverted: true,
    },
    {
      key: 'wealth' as const,
      label: '财富',
      value: player.attributes.wealth,
      max: null,
      color: '#d4af37',
      icon: '💰',
      isLow: false,
    },
  ];

  return (
    <div className="stats-panel">
      {/* 头部信息 */}
      <div className="stats-header">
        <div className="player-name">
          <span className="name-icon">☽</span>
          <h2>{player.name}</h2>
        </div>
        <div className="player-meta">
          <span className="age-badge">
            <AnimatedNumber value={player.age} suffix="岁" color="#d4af37" />
          </span>
          <span className="stage-badge">{STAGE_NAMES[player.stage]}</span>
        </div>
      </div>

      {/* 属性卡片网格 */}
      <div className="stats-grid">
        {statCards.map((stat) => {
          const isHighlighted = highlightedAttrs.has(stat.key);
          return (
            <div
              key={stat.key}
              className={`stat-card ${isHighlighted ? 'highlighted' : ''} ${stat.isLow ? 'low-warning' : ''}`}
            >
              <div className="stat-card-glow" style={{ borderColor: stat.color }} />

              <div className="stat-header">
                <span className="stat-icon">{stat.icon}</span>
                <span className="stat-label">{stat.label}</span>
              </div>

              {stat.max ? (
                <>
                  <div className="stat-bar-container">
                    <div
                      className="stat-bar"
                      style={{ background: `rgba(255,255,255,0.1)` }}
                    >
                      <div
                        className="stat-bar-fill"
                        style={{
                          width: `${stat.value}%`,
                          background: `linear-gradient(90deg, ${stat.color}80, ${stat.color})`,
                          boxShadow: `0 0 10px ${stat.color}60`,
                        }}
                      />
                    </div>
                    <span className="stat-value">
                      <AnimatedNumber value={stat.value} color={stat.color} />
                    </span>
                  </div>
                </>
              ) : (
                <div className="stat-value-large">
                  <AnimatedNumber value={stat.value} suffix="元" color="#d4af37" />
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* 信息区 */}
      <div className="stats-info">
        <div className="info-row">
          <span className="info-icon">🎓</span>
          <span className="info-label">教育</span>
          <span className="info-value">{player.education || '无'}</span>
        </div>
        <div className="info-row">
          <span className="info-icon">💼</span>
          <span className="info-label">职业</span>
          <span className="info-value">{player.career?.name || '无'}</span>
        </div>
        <div className="info-row">
          <span className="info-icon">💑</span>
          <span className="info-label">婚姻</span>
          <span className="info-value">{player.maritalStatus || '单身'}</span>
        </div>
      </div>

      <style>{`
        .stats-panel {
          background: linear-gradient(145deg, rgba(20, 20, 35, 0.95) 0%, rgba(15, 15, 28, 0.98) 100%);
          border: 1px solid rgba(212, 175, 55, 0.2);
          border-radius: 16px;
          padding: 24px;
          box-shadow:
            0 8px 32px rgba(0, 0, 0, 0.4),
            inset 0 1px 0 rgba(212, 175, 55, 0.1);
          font-family: 'Noto Sans SC', sans-serif;
        }

        /* 头部 */
        .stats-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 24px;
          padding-bottom: 16px;
          border-bottom: 1px solid rgba(212, 175, 55, 0.15);
        }

        .player-name {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .name-icon {
          font-size: 20px;
          color: #d4af37;
          animation: pulse 2s ease-in-out infinite;
        }

        @keyframes pulse {
          0%, 100% { opacity: 0.7; }
          50% { opacity: 1; }
        }

        .player-name h2 {
          margin: 0;
          font-family: 'Cinzel', serif;
          font-size: 1.5em;
          background: linear-gradient(180deg, #d4af37 0%, #f5d47e 50%, #d4af37 100%);
          -webkit-background-clip: text;
          background-clip: text;
          color: transparent;
          letter-spacing: 2px;
        }

        .player-meta {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .age-badge {
          background: rgba(212, 175, 55, 0.15);
          border: 1px solid rgba(212, 175, 55, 0.3);
          padding: 6px 14px;
          border-radius: 20px;
          color: #d4af37;
          font-size: 14px;
          font-weight: 600;
        }

        .stage-badge {
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.1);
          padding: 6px 14px;
          border-radius: 20px;
          color: #8b8ba3;
          font-size: 13px;
        }

        /* 属性网格 */
        .stats-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 16px;
          margin-bottom: 24px;
        }

        @media (max-width: 600px) {
          .stats-grid {
            grid-template-columns: 1fr;
          }
        }

        .stat-card {
          position: relative;
          background: linear-gradient(145deg, rgba(30, 30, 50, 0.6) 0%, rgba(20, 20, 35, 0.8) 100%);
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 12px;
          padding: 16px;
          transition: all 0.3s ease;
          overflow: hidden;
        }

        .stat-card-glow {
          position: absolute;
          top: -1px;
          left: -1px;
          right: -1px;
          bottom: -1px;
          border-radius: 12px;
          border: 1px solid transparent;
          opacity: 0;
          transition: opacity 0.3s ease;
          pointer-events: none;
        }

        .stat-card:hover {
          transform: translateY(-2px);
          border-color: rgba(212, 175, 55, 0.2);
        }

        .stat-card:hover .stat-card-glow {
          opacity: 1;
        }

        .stat-card.highlighted {
          animation: cardHighlight 0.6s ease-out;
        }

        .stat-card.highlighted .stat-card-glow {
          opacity: 1;
          animation: glowPulse 1.5s ease-out;
        }

        @keyframes cardHighlight {
          0% { transform: scale(1); }
          50% { transform: scale(1.02); }
          100% { transform: scale(1); }
        }

        @keyframes glowPulse {
          0% { opacity: 0.5; }
          50% { opacity: 1; }
          100% { opacity: 0; }
        }

        /* 低值警告 */
        .stat-card.low-warning {
          animation: warningPulse 1.5s ease-in-out infinite;
        }

        .stat-card.low-warning .stat-card-glow {
          border-color: #F44336;
          opacity: 0.5;
          animation: warningGlow 1.5s ease-in-out infinite;
        }

        @keyframes warningPulse {
          0%, 100% { box-shadow: 0 0 0 rgba(244, 67, 54, 0); }
          50% { box-shadow: 0 0 20px rgba(244, 67, 54, 0.3); }
        }

        @keyframes warningGlow {
          0%, 100% { opacity: 0.3; }
          50% { opacity: 0.8; }
        }

        .stat-header {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 12px;
        }

        .stat-icon {
          font-size: 18px;
        }

        .stat-label {
          color: #8b8ba3;
          font-size: 13px;
          letter-spacing: 1px;
        }

        .stat-bar-container {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .stat-bar {
          flex: 1;
          height: 6px;
          border-radius: 3px;
          overflow: hidden;
        }

        .stat-bar-fill {
          height: 100%;
          border-radius: 3px;
          transition: width 0.8s cubic-bezier(0.4, 0, 0.2, 1);
          position: relative;
        }

        .stat-bar-fill::after {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.3) 50%, transparent 100%);
          animation: shimmer 2s infinite;
        }

        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }

        .stat-value {
          min-width: 40px;
          text-align: right;
          color: #f0f0f0;
          font-weight: 600;
          font-size: 15px;
        }

        .stat-value-large {
          text-align: center;
          font-size: 22px;
          font-weight: 700;
          padding: 8px 0;
        }

        .animated-number {
          display: inline-block;
          transition: all 0.3s ease;
        }

        .animated-number.animating {
          transform: scale(1.15);
          text-shadow: 0 0 10px currentColor;
        }

        /* 信息区 */
        .stats-info {
          display: flex;
          flex-direction: column;
          gap: 10px;
          padding-top: 16px;
          border-top: 1px solid rgba(212, 175, 55, 0.15);
        }

        .info-row {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 8px 12px;
          background: rgba(255, 255, 255, 0.02);
          border-radius: 8px;
          transition: background 0.3s;
        }

        .info-row:hover {
          background: rgba(212, 175, 55, 0.05);
        }

        .info-icon {
          font-size: 16px;
        }

        .info-label {
          color: #666;
          font-size: 13px;
          min-width: 40px;
        }

        .info-value {
          color: #d4af37;
          font-size: 13px;
          font-weight: 500;
        }
      `}</style>
    </div>
  );
}
