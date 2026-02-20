import React, { useEffect, useState } from 'react';
import type { EndingResult, EndingEvaluation } from '../types/ending';

interface EndingScreenProps {
  result: EndingResult;
  evaluation: EndingEvaluation;
  onRestart: () => void;
}

/**
 * 结局界面组件 - 命运之轮主题
 */
const EndingScreen: React.FC<EndingScreenProps> = ({ result, evaluation, onRestart }) => {
  const { ending, stats } = result;
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

  // 根据结局类型设置颜色
  const getTypeColor = () => {
    switch (ending.type) {
      case 'good':
        return '#4CAF50';
      case 'neutral':
        return '#FFD700';
      case 'bad':
        return '#F44336';
      default:
        return '#9E9E9E';
    }
  };

  // 根据评价等级设置颜色
  const getGradeColor = () => {
    switch (evaluation.grade) {
      case 'S':
        return '#FFD700';
      case 'A':
        return '#4CAF50';
      case 'B':
        return '#2196F3';
      case 'C':
        return '#FF9800';
      case 'D':
        return '#FF5722';
      case 'F':
        return '#F44336';
      default:
        return '#9E9E9E';
    }
  };

  // 格式化财富
  const formatWealth = (wealth: number) => {
    if (wealth >= 100000000) {
      return `${(wealth / 100000000).toFixed(2)}亿`;
    }
    if (wealth >= 10000) {
      return `${(wealth / 10000).toFixed(2)}万`;
    }
    return `${wealth}`;
  };

  const typeColor = getTypeColor();
  const gradeColor = getGradeColor();

  return (
    <div className="ending-screen">
      {/* 星空背景 */}
      <div className="starfield">
        {[...Array(80)].map((_, i) => (
          <div
            key={i}
            className="star"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${2 + Math.random() * 3}s`,
            }}
          />
        ))}
      </div>

      {/* 命运之轮装饰 */}
      <div className="wheel-decoration">
        <div className="wheel-outer" />
        <div className="wheel-inner" />
        <div className="wheel-center">☽</div>
      </div>

      <div className={`ending-content ${isVisible ? 'visible' : ''}`}>
        {/* 结局标题 */}
        <div className="ending-header">
          <div className="header-decoration">
            <span className="deco-line" />
            <span className="deco-symbol">☆</span>
            <span className="deco-line" />
          </div>

          <h1 className="ending-title" style={{ color: typeColor }}>
            {ending.title}
          </h1>

          <div className="ending-grade" style={{ color: gradeColor }}>
            <span className="grade-label">最终评价</span>
            <span className="grade-value">{evaluation.grade}</span>
          </div>

          <div className="header-decoration">
            <span className="deco-line" />
            <span className="deco-symbol">☆</span>
            <span className="deco-line" />
          </div>
        </div>

        {/* 结局描述 */}
        <div className="ending-description">
          <p>{ending.description}</p>
        </div>

        {/* 人生统计 */}
        <div className="ending-stats">
          <h2>人生轨迹</h2>
          <div className="stats-grid">
            <div className="stat-item">
              <span className="stat-icon">⏳</span>
              <span className="stat-label">享年</span>
              <span className="stat-value">{stats.finalAge}岁</span>
            </div>
            <div className="stat-item">
              <span className="stat-icon">✧</span>
              <span className="stat-label">经历</span>
              <span className="stat-value">{stats.totalEvents}事</span>
            </div>
            <div className="stat-item">
              <span className="stat-icon">◈</span>
              <span className="stat-label">抉择</span>
              <span className="stat-value">{stats.totalChoices}次</span>
            </div>
            <div className="stat-item">
              <span className="stat-icon">💰</span>
              <span className="stat-label">财富</span>
              <span className="stat-value">{formatWealth(stats.finalWealth)}</span>
            </div>
            <div className="stat-item">
              <span className="stat-icon">★</span>
              <span className="stat-label">成就</span>
              <span className="stat-value">{stats.achievements}个</span>
            </div>
            <div className="stat-item">
              <span className="stat-icon">◉</span>
              <span className="stat-label">评分</span>
              <span className="stat-value">{(evaluation.totalScore * 100).toFixed(0)}分</span>
            </div>
          </div>
        </div>

        {/* 属性得分 */}
        <div className="ending-scores">
          <h2>命运评价</h2>
          <div className="scores-container">
            <div className="score-item">
              <div className="score-header">
                <span className="score-icon">💚</span>
                <span className="score-label">生命力</span>
                <span className="score-value">{(evaluation.healthScore * 100).toFixed(0)}%</span>
              </div>
              <div className="score-bar">
                <div
                  className="score-fill health"
                  style={{ width: `${evaluation.healthScore * 100}%` }}
                />
              </div>
            </div>

            <div className="score-item">
              <div className="score-header">
                <span className="score-icon">💰</span>
                <span className="score-label">财富值</span>
                <span className="score-value">{(evaluation.wealthScore * 100).toFixed(0)}%</span>
              </div>
              <div className="score-bar">
                <div
                  className="score-fill wealth"
                  style={{ width: `${evaluation.wealthScore * 100}%` }}
                />
              </div>
            </div>

            <div className="score-item">
              <div className="score-header">
                <span className="score-icon">🌟</span>
                <span className="score-label">幸福度</span>
                <span className="score-value">{(evaluation.happinessScore * 100).toFixed(0)}%</span>
              </div>
              <div className="score-bar">
                <div
                  className="score-fill happiness"
                  style={{ width: `${evaluation.happinessScore * 100}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* 重新开始按钮 */}
        <button className="restart-button" onClick={onRestart}>
          <span className="btn-icon">☽</span>
          <span className="btn-text">再次轮回</span>
          <span className="btn-glow" />
        </button>
      </div>

      <style>{`
        .ending-screen {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
          background: linear-gradient(135deg, #0a0a1a 0%, #1a1a3e 50%, #0f0f2a 100%);
          font-family: 'Noto Sans SC', sans-serif;
          overflow: hidden;
        }

        /* 星空背景 */
        .starfield {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          pointer-events: none;
        }

        .star {
          position: absolute;
          width: 2px;
          height: 2px;
          background: white;
          border-radius: 50%;
          animation: twinkle 2s infinite ease-in-out;
        }

        @keyframes twinkle {
          0%, 100% { opacity: 0.3; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.5); }
        }

        /* 命运之轮装饰 */
        .wheel-decoration {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          pointer-events: none;
        }

        .wheel-outer {
          position: absolute;
          width: 600px;
          height: 600px;
          top: -300px;
          left: -300px;
          border: 1px solid rgba(212, 175, 55, 0.1);
          border-radius: 50%;
          animation: wheelRotate 60s linear infinite;
        }

        .wheel-inner {
          position: absolute;
          width: 400px;
          height: 400px;
          top: -200px;
          left: -200px;
          border: 1px solid rgba(212, 175, 55, 0.15);
          border-radius: 50%;
          animation: wheelRotate 40s linear infinite reverse;
        }

        .wheel-center {
          position: absolute;
          font-size: 48px;
          color: rgba(212, 175, 55, 0.2);
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          animation: pulse 3s ease-in-out infinite;
        }

        @keyframes wheelRotate {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        @keyframes pulse {
          0%, 100% { opacity: 0.2; transform: translate(-50%, -50%) scale(1); }
          50% { opacity: 0.4; transform: translate(-50%, -50%) scale(1.1); }
        }

        /* 内容容器 */
        .ending-content {
          position: relative;
          z-index: 1;
          max-width: 560px;
          width: 90%;
          max-height: 90vh;
          overflow-y: auto;
          background: linear-gradient(180deg, rgba(20, 20, 40, 0.95) 0%, rgba(15, 15, 30, 0.98) 100%);
          border: 1px solid rgba(212, 175, 55, 0.3);
          border-radius: 20px;
          padding: 40px;
          box-shadow:
            0 20px 60px rgba(0, 0, 0, 0.6),
            0 0 40px rgba(212, 175, 55, 0.1);
          opacity: 0;
          transform: translateY(30px) scale(0.95);
          transition: all 0.8s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .ending-content.visible {
          opacity: 1;
          transform: translateY(0) scale(1);
        }

        /* 头部 */
        .ending-header {
          text-align: center;
          margin-bottom: 30px;
        }

        .header-decoration {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 16px;
          margin: 16px 0;
        }

        .header-decoration .deco-line {
          height: 1px;
          flex: 1;
          background: linear-gradient(90deg, transparent, rgba(212, 175, 55, 0.4), transparent);
        }

        .header-decoration .deco-symbol {
          color: #d4af37;
          font-size: 16px;
          animation: symbolPulse 2s ease-in-out infinite;
        }

        @keyframes symbolPulse {
          0%, 100% { opacity: 0.5; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.2); }
        }

        .ending-title {
          font-family: 'Cinzel', serif;
          font-size: 2.2em;
          font-weight: bold;
          margin: 0;
          text-shadow: 0 2px 20px currentColor;
          letter-spacing: 4px;
        }

        .ending-grade {
          display: flex;
          flex-direction: column;
          align-items: center;
          margin-top: 20px;
        }

        .grade-label {
          font-size: 12px;
          color: #8b8ba3;
          letter-spacing: 4px;
          margin-bottom: 8px;
        }

        .grade-value {
          font-family: 'Cinzel', serif;
          font-size: 5em;
          font-weight: bold;
          text-shadow: 0 0 30px currentColor, 0 0 60px currentColor;
          animation: gradeGlow 2s ease-in-out infinite;
        }

        @keyframes gradeGlow {
          0%, 100% { filter: brightness(1); }
          50% { filter: brightness(1.3); }
        }

        /* 描述 */
        .ending-description {
          text-align: center;
          color: #c0c0d0;
          font-size: 1em;
          line-height: 1.9;
          margin-bottom: 30px;
          padding: 0 16px;
          white-space: pre-line;
        }

        .ending-description p {
          margin: 0;
        }

        /* 统计 */
        .ending-stats h2,
        .ending-scores h2 {
          font-family: 'Cinzel', serif;
          color: #d4af37;
          font-size: 1.1em;
          margin-bottom: 16px;
          text-align: center;
          letter-spacing: 4px;
        }

        .stats-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 12px;
          margin-bottom: 30px;
        }

        .stat-item {
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid rgba(212, 175, 55, 0.15);
          border-radius: 10px;
          padding: 14px 10px;
          text-align: center;
          transition: all 0.3s;
        }

        .stat-item:hover {
          background: rgba(212, 175, 55, 0.05);
          border-color: rgba(212, 175, 55, 0.3);
        }

        .stat-icon {
          display: block;
          font-size: 18px;
          margin-bottom: 6px;
        }

        .stat-label {
          display: block;
          color: #666;
          font-size: 11px;
          margin-bottom: 4px;
          letter-spacing: 1px;
        }

        .stat-value {
          display: block;
          color: #d4af37;
          font-size: 1.1em;
          font-weight: 600;
        }

        /* 得分条 */
        .ending-scores {
          margin-bottom: 30px;
        }

        .scores-container {
          background: rgba(255, 255, 255, 0.02);
          border: 1px solid rgba(212, 175, 55, 0.1);
          border-radius: 12px;
          padding: 20px;
        }

        .score-item {
          margin-bottom: 16px;
        }

        .score-item:last-child {
          margin-bottom: 0;
        }

        .score-header {
          display: flex;
          align-items: center;
          margin-bottom: 8px;
        }

        .score-icon {
          font-size: 16px;
          margin-right: 8px;
        }

        .score-label {
          flex: 1;
          color: #8b8ba3;
          font-size: 13px;
        }

        .score-value {
          color: #f0f0f0;
          font-weight: 600;
          font-size: 14px;
        }

        .score-bar {
          width: 100%;
          height: 8px;
          background: rgba(255, 255, 255, 0.1);
          border-radius: 4px;
          overflow: hidden;
        }

        .score-fill {
          height: 100%;
          border-radius: 4px;
          transition: width 1.5s cubic-bezier(0.4, 0, 0.2, 1);
          position: relative;
        }

        .score-fill::after {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.3) 50%, transparent 100%);
          animation: shimmer 2s infinite;
        }

        .score-fill.health {
          background: linear-gradient(90deg, #4CAF5060, #4CAF50);
          box-shadow: 0 0 10px #4CAF5060;
        }

        .score-fill.wealth {
          background: linear-gradient(90deg, #FFD70060, #FFD700);
          box-shadow: 0 0 10px #FFD70060;
        }

        .score-fill.happiness {
          background: linear-gradient(90deg, #E91E6360, #E91E63);
          box-shadow: 0 0 10px #E91E6360;
        }

        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }

        /* 重新开始按钮 */
        .restart-button {
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 12px;
          width: 100%;
          padding: 18px;
          background: linear-gradient(135deg, rgba(212, 175, 55, 0.15) 0%, rgba(180, 140, 40, 0.1) 100%);
          border: 2px solid rgba(212, 175, 55, 0.5);
          border-radius: 12px;
          color: #d4af37;
          font-family: 'Cinzel', serif;
          font-size: 1.1em;
          font-weight: 600;
          letter-spacing: 4px;
          cursor: pointer;
          overflow: hidden;
          transition: all 0.3s ease;
        }

        .restart-button:hover {
          background: linear-gradient(135deg, rgba(212, 175, 55, 0.25) 0%, rgba(180, 140, 40, 0.2) 100%);
          border-color: #d4af37;
          box-shadow:
            0 0 40px rgba(212, 175, 55, 0.3),
            inset 0 0 30px rgba(212, 175, 55, 0.1);
          transform: translateY(-2px);
        }

        .restart-button .btn-icon {
          font-size: 20px;
        }

        .restart-button .btn-text {
          position: relative;
          z-index: 1;
        }

        .restart-button .btn-glow {
          position: absolute;
          top: 50%;
          left: -100%;
          transform: translateY(-50%);
          width: 50%;
          height: 200%;
          background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.15), transparent);
          animation: btnShine 3s infinite;
        }

        @keyframes btnShine {
          0% { left: -100%; }
          50%, 100% { left: 150%; }
        }

        /* 响应式 */
        @media (max-width: 500px) {
          .ending-content {
            padding: 25px;
          }

          .stats-grid {
            grid-template-columns: repeat(2, 1fr);
          }

          .ending-title {
            font-size: 1.8em;
          }

          .grade-value {
            font-size: 4em;
          }
        }
      `}</style>
    </div>
  );
};

export default EndingScreen;
