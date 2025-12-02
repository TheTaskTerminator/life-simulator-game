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
  duration = 800 
}: { 
  value: number; 
  suffix?: string; 
  duration?: number;
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
    <span className={`animated-number ${isAnimating ? 'animating' : ''}`}>
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

    // 检查每个属性的变化
    (Object.keys(current) as Array<keyof Player['attributes']>).forEach((key) => {
      if (prev[key] !== current[key]) {
        changed.add(key);
      }
    });

    if (changed.size > 0) {
      // 高亮变化的属性
      setHighlightedAttrs(changed);
      
      // 3秒后移除高亮
      const timer = setTimeout(() => {
        setHighlightedAttrs(new Set());
      }, 3000);

      // 更新引用
      prevAttributesRef.current = { ...current };

      return () => clearTimeout(timer);
    }
  }, [player.attributes]);

  const statCards = [
    {
      key: 'health' as const,
      label: '健康',
      value: player.attributes.health,
      max: 100,
      color: '#4caf50',
      icon: '💚',
      hasBar: true,
    },
    {
      key: 'intelligence' as const,
      label: '智力',
      value: player.attributes.intelligence,
      max: 100,
      color: '#2196f3',
      icon: '🧠',
      hasBar: true,
    },
    {
      key: 'charm' as const,
      label: '魅力',
      value: player.attributes.charm,
      max: 100,
      color: '#e91e63',
      icon: '✨',
      hasBar: true,
    },
    {
      key: 'happiness' as const,
      label: '幸福度',
      value: player.attributes.happiness,
      max: 100,
      color: '#ff9800',
      icon: '😊',
      hasBar: true,
    },
    {
      key: 'stress' as const,
      label: '压力',
      value: player.attributes.stress,
      max: 100,
      color: '#f44336',
      icon: '😰',
      hasBar: true,
    },
    {
      key: 'wealth' as const,
      label: '财富',
      value: player.attributes.wealth,
      max: null,
      color: '#4caf50',
      icon: '💰',
      hasBar: false,
    },
  ];

  return (
    <div className="stats-panel">
      <div className="stats-header">
        <h2>{player.name}</h2>
        <span className="age"><AnimatedNumber value={player.age} suffix=" 岁" /></span>
        <span className="stage">{STAGE_NAMES[player.stage]}</span>
      </div>

      <div className="stats-cards-grid">
        {statCards.map((stat) => {
          const isHighlighted = highlightedAttrs.has(stat.key);
          return (
            <div
              key={stat.key}
              className={`stat-card ${isHighlighted ? 'highlighted' : ''}`}
              style={{ '--card-color': stat.color } as React.CSSProperties}
            >
              <div className="stat-card-header">
                <span className="stat-icon">{stat.icon}</span>
                <span className="stat-label">{stat.label}</span>
          </div>
              <div className="stat-card-body">
                {stat.hasBar ? (
                  <>
          <div className="stat-bar">
            <div
                        className="stat-fill"
                        style={{ 
                          width: `${stat.value}%`,
                          backgroundColor: stat.color
                        }}
            />
          </div>
                    <div className="stat-value">
                      <AnimatedNumber value={stat.value} suffix="/100" />
        </div>
                  </>
                ) : (
                  <div className="stat-value-large">
                    <AnimatedNumber value={stat.value} suffix="元" />
          </div>
                )}
        </div>
        </div>
          );
        })}
      </div>

      <div className="stats-info">
        <div className="info-item">
          <span className="info-label">教育:</span>
          <span className="info-value">{player.education || '无'}</span>
        </div>
        <div className="info-item">
          <span className="info-label">职业:</span>
          <span className="info-value">{player.career?.name || '无'}</span>
        </div>
        <div className="info-item">
          <span className="info-label">婚姻:</span>
          <span className="info-value">{player.maritalStatus || '单身'}</span>
        </div>
      </div>

      <style>{`
        .stats-panel {
          background: white;
          border-radius: 16px;
          padding: 24px;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }

        .stats-header {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 24px;
          padding-bottom: 16px;
          border-bottom: 2px solid #f0f0f0;
        }

        .stats-header h2 {
          margin: 0;
          font-size: 1.5em;
          color: #333;
        }

        .age {
          background: #667eea;
          color: white;
          padding: 4px 12px;
          border-radius: 12px;
          font-size: 14px;
          font-weight: 600;
        }

        .stage {
          background: #f0f0f0;
          color: #666;
          padding: 4px 12px;
          border-radius: 12px;
          font-size: 14px;
        }

        .stats-cards-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 16px;
          margin-bottom: 24px;
        }

        .stat-card {
          background: linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%);
          border: 2px solid #e0e0e0;
          border-radius: 12px;
          padding: 16px;
          transition: all 0.3s ease;
          position: relative;
          overflow: hidden;
        }

        .stat-card::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 4px;
          background: var(--card-color);
          transform: scaleX(0);
          transition: transform 0.3s ease;
        }

        .stat-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
          border-color: var(--card-color);
        }

        .stat-card:hover::before {
          transform: scaleX(1);
        }

        .stat-card.highlighted {
          background: linear-gradient(135deg, rgba(255, 235, 59, 0.1) 0%, rgba(255, 235, 59, 0.2) 100%);
          border-color: #ffc107;
          box-shadow: 0 0 20px rgba(255, 193, 7, 0.4);
          animation: cardPulse 0.6s ease-in-out;
        }

        .stat-card.highlighted::before {
          background: #ffc107;
          transform: scaleX(1);
        }

        @keyframes cardPulse {
          0%, 100% {
            transform: scale(1);
          }
          50% {
            transform: scale(1.05);
          }
        }

        .stat-card-header {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 12px;
        }

        .stat-icon {
          font-size: 20px;
        }

        .stat-label {
          font-weight: 600;
          color: #555;
          font-size: 14px;
        }

        .stat-card-body {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .stat-bar {
          width: 100%;
          height: 8px;
          background: #e0e0e0;
          border-radius: 4px;
          overflow: hidden;
        }

        .stat-fill {
          height: 100%;
          border-radius: 4px;
          transition: width 0.8s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .stat-card.highlighted .stat-fill {
          box-shadow: 0 0 12px rgba(255, 255, 255, 0.8);
        }

        .stat-value {
          font-size: 18px;
          font-weight: 700;
          color: #333;
          text-align: right;
        }

        .stat-value-large {
          font-size: 24px;
          font-weight: 700;
          color: #4caf50;
          text-align: center;
          padding: 8px 0;
        }

        .animated-number {
          display: inline-block;
          transition: all 0.3s ease;
        }

        .animated-number.animating {
          color: var(--card-color, #667eea);
          transform: scale(1.1);
        }

        .stats-info {
          display: flex;
          flex-direction: column;
          gap: 8px;
          padding-top: 16px;
          border-top: 2px solid #f0f0f0;
        }

        .info-item {
          display: flex;
          justify-content: space-between;
          font-size: 14px;
        }

        .info-label {
          color: #666;
        }

        .info-value {
          color: #333;
          font-weight: 600;
        }
      `}</style>
    </div>
  );
}
