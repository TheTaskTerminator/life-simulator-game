import { useState, useEffect } from 'react';
import { Player } from '../types';
import { generateRandomAttributes } from '../utils/attributeUtils';

interface StartScreenProps {
  onCreateGame: (name: string, attributes: Player['attributes']) => void;
}

export default function StartScreen({ onCreateGame }: StartScreenProps) {
  const [name, setName] = useState('');
  const [attributes, setAttributes] = useState(generateRandomAttributes());
  const [isRolling, setIsRolling] = useState(false);
  const [showCard, setShowCard] = useState(false);

  // 属性配置
  const attributeConfig = [
    { key: 'health' as const, label: '生命', icon: '💚', color: '#4CAF50' },
    { key: 'intelligence' as const, label: '智慧', icon: '🔮', color: '#2196F3' },
    { key: 'charm' as const, label: '魅力', icon: '✨', color: '#E91E63' },
    { key: 'happiness' as const, label: '命运', icon: '🌟', color: '#FFD700' },
    { key: 'stress' as const, label: '劫数', icon: '⚡', color: '#F44336' },
  ];

  const handleRandomize = () => {
    setIsRolling(true);
    setShowCard(false);

    // 模拟骰子滚动动画
    let rollCount = 0;
    const rollInterval = setInterval(() => {
      setAttributes(generateRandomAttributes());
      rollCount++;
      if (rollCount >= 10) {
        clearInterval(rollInterval);
        setIsRolling(false);
        setTimeout(() => setShowCard(true), 100);
      }
    }, 80);
  };

  const handleStart = () => {
    if (!name.trim()) {
      alert('请输入你的名字，开启命运之旅');
      return;
    }
    onCreateGame(name.trim(), attributes);
  };

  useEffect(() => {
    setShowCard(true);
  }, []);

  return (
    <div className="start-screen">
      {/* 星空背景 */}
      <div className="starfield">
        {[...Array(50)].map((_, i) => (
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

      <div className="start-container">
        {/* 标题区域 */}
        <div className="title-section">
          <div className="mystical-symbol">☽ ☉ ☾</div>
          <h1 className="game-title">命 运 之 轮</h1>
          <p className="subtitle">抽取你的命运牌，开启人生之旅</p>
        </div>

        {/* 命运之门输入 */}
        <div className="fate-input-section">
          <label className="input-label">刻下你的名字</label>
          <div className="mystical-input-wrapper">
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="旅者之名..."
              maxLength={20}
              className="mystical-input"
            />
            <div className="input-glow" />
          </div>
        </div>

        {/* 命运牌区域 */}
        <div className="destiny-cards">
          <div className="cards-header">
            <h2> destiny cards </h2>
            <button
              onClick={handleRandomize}
              className={`btn-shuffle ${isRolling ? 'rolling' : ''}`}
              disabled={isRolling}
            >
              {isRolling ? '命运转动中...' : '重洗命运牌'}
            </button>
          </div>

          <div className="cards-grid">
            {attributeConfig.map((attr, index) => (
              <div
                key={attr.key}
                className={`destiny-card ${showCard ? 'revealed' : ''} ${isRolling ? 'rolling' : ''}`}
                style={{
                  animationDelay: showCard ? `${index * 0.15}s` : '0s',
                }}
              >
                <div className="card-inner">
                  <div className="card-front">
                    <span className="card-icon">{attr.icon}</span>
                    <span className="card-label">{attr.label}</span>
                    <div
                      className="card-value"
                      style={{ color: attr.color }}
                    >
                      {attributes[attr.key]}
                    </div>
                    <div className="card-bar">
                      <div
                        className="card-bar-fill"
                        style={{
                          width: `${attributes[attr.key]}%`,
                          backgroundColor: attr.color,
                        }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {/* 财富特殊卡片 */}
            <div
              className={`destiny-card wealth-card ${showCard ? 'revealed' : ''} ${isRolling ? 'rolling' : ''}`}
              style={{ animationDelay: showCard ? `${5 * 0.15}s` : '0s' }}
            >
              <div className="card-inner">
                <div className="card-front">
                  <span className="card-icon">💰</span>
                  <span className="card-label">财富</span>
                  <div className="card-value gold">
                    {attributes.wealth.toLocaleString()}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 开始按钮 */}
        <button
          onClick={handleStart}
          className="btn-enter-fate"
          disabled={!name.trim() || isRolling}
        >
          <span className="btn-text">开启命运之门</span>
          <span className="btn-glow" />
        </button>
      </div>

      <style>{`
        * {
          box-sizing: border-box;
        }

        .start-screen {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          background: linear-gradient(135deg, #0a0a1a 0%, #1a1a3e 50%, #0f0f2a 100%);
          padding: 20px;
          position: relative;
          overflow: hidden;
          font-family: 'Noto Sans SC', sans-serif;
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

        .start-container {
          position: relative;
          z-index: 1;
          max-width: 700px;
          width: 100%;
          padding: 40px;
        }

        /* 标题区域 */
        .title-section {
          text-align: center;
          margin-bottom: 40px;
        }

        .mystical-symbol {
          font-size: 24px;
          color: #d4af37;
          letter-spacing: 20px;
          margin-bottom: 16px;
          animation: glow 2s ease-in-out infinite;
        }

        @keyframes glow {
          0%, 100% { text-shadow: 0 0 10px rgba(212, 175, 55, 0.5); }
          50% { text-shadow: 0 0 30px rgba(212, 175, 55, 0.8), 0 0 60px rgba(212, 175, 55, 0.4); }
        }

        .game-title {
          font-family: 'Cinzel', serif;
          font-size: 3em;
          font-weight: 700;
          color: transparent;
          background: linear-gradient(180deg, #d4af37 0%, #f5d47e 50%, #d4af37 100%);
          -webkit-background-clip: text;
          background-clip: text;
          margin: 0 0 16px 0;
          letter-spacing: 16px;
          text-shadow: 0 4px 20px rgba(212, 175, 55, 0.3);
        }

        .subtitle {
          color: #8b8ba3;
          font-size: 1.1em;
          margin: 0;
          letter-spacing: 4px;
        }

        /* 输入区域 */
        .fate-input-section {
          margin-bottom: 40px;
        }

        .input-label {
          display: block;
          color: #d4af37;
          font-size: 14px;
          margin-bottom: 12px;
          letter-spacing: 4px;
          text-align: center;
        }

        .mystical-input-wrapper {
          position: relative;
        }

        .mystical-input {
          width: 100%;
          padding: 16px 24px;
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(212, 175, 55, 0.3);
          border-radius: 8px;
          color: #f0f0f0;
          font-size: 18px;
          font-family: 'Noto Sans SC', sans-serif;
          text-align: center;
          letter-spacing: 2px;
          transition: all 0.3s ease;
        }

        .mystical-input::placeholder {
          color: #555;
        }

        .mystical-input:focus {
          outline: none;
          border-color: #d4af37;
          background: rgba(212, 175, 55, 0.1);
          box-shadow: 0 0 30px rgba(212, 175, 55, 0.2);
        }

        .input-glow {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: 100%;
          height: 100%;
          background: radial-gradient(ellipse at center, rgba(212, 175, 55, 0.1) 0%, transparent 70%);
          pointer-events: none;
          opacity: 0;
          transition: opacity 0.3s;
        }

        .mystical-input:focus + .input-glow {
          opacity: 1;
        }

        /* 命运牌区域 */
        .destiny-cards {
          margin-bottom: 40px;
        }

        .cards-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 24px;
        }

        .cards-header h2 {
          font-family: 'Cinzel', serif;
          color: #d4af37;
          font-size: 1.2em;
          margin: 0;
          letter-spacing: 4px;
        }

        .btn-shuffle {
          padding: 10px 20px;
          background: transparent;
          border: 1px solid rgba(212, 175, 55, 0.5);
          border-radius: 6px;
          color: #d4af37;
          font-size: 14px;
          cursor: pointer;
          transition: all 0.3s ease;
          font-family: 'Noto Sans SC', sans-serif;
        }

        .btn-shuffle:hover:not(:disabled) {
          background: rgba(212, 175, 55, 0.1);
          border-color: #d4af37;
          box-shadow: 0 0 20px rgba(212, 175, 55, 0.3);
        }

        .btn-shuffle:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .btn-shuffle.rolling {
          animation: shake 0.1s infinite;
        }

        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-2px); }
          75% { transform: translateX(2px); }
        }

        .cards-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 16px;
        }

        @media (max-width: 600px) {
          .cards-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }

        .destiny-card {
          perspective: 1000px;
          height: 140px;
        }

        .card-inner {
          position: relative;
          width: 100%;
          height: 100%;
          transition: transform 0.6s;
          transform-style: preserve-3d;
        }

        .destiny-card.revealed .card-inner {
          animation: flipIn 0.6s ease-out forwards;
        }

        .destiny-card.rolling .card-inner {
          animation: cardRoll 0.1s infinite;
        }

        @keyframes flipIn {
          0% {
            opacity: 0;
            transform: rotateY(180deg) scale(0.8);
          }
          100% {
            opacity: 1;
            transform: rotateY(0) scale(1);
          }
        }

        @keyframes cardRoll {
          0% { transform: rotateX(0deg); }
          50% { transform: rotateX(180deg); }
          100% { transform: rotateX(360deg); }
        }

        .card-front {
          position: absolute;
          width: 100%;
          height: 100%;
          backface-visibility: hidden;
          background: linear-gradient(145deg, rgba(30, 30, 50, 0.9) 0%, rgba(20, 20, 35, 0.95) 100%);
          border: 1px solid rgba(212, 175, 55, 0.4);
          border-radius: 12px;
          padding: 16px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          box-shadow:
            0 4px 20px rgba(0, 0, 0, 0.5),
            inset 0 1px 0 rgba(212, 175, 55, 0.2);
          transition: all 0.3s ease;
        }

        .destiny-card:hover .card-front {
          border-color: #d4af37;
          box-shadow:
            0 8px 30px rgba(0, 0, 0, 0.6),
            0 0 30px rgba(212, 175, 55, 0.3),
            inset 0 1px 0 rgba(212, 175, 55, 0.3);
          transform: translateY(-4px);
        }

        .card-icon {
          font-size: 28px;
          margin-bottom: 8px;
        }

        .card-label {
          color: #8b8ba3;
          font-size: 12px;
          letter-spacing: 2px;
          margin-bottom: 8px;
        }

        .card-value {
          font-family: 'Cinzel', serif;
          font-size: 28px;
          font-weight: 700;
        }

        .card-value.gold {
          background: linear-gradient(180deg, #d4af37 0%, #f5d47e 50%, #d4af37 100%);
          -webkit-background-clip: text;
          background-clip: text;
          color: transparent;
        }

        .card-bar {
          width: 100%;
          height: 4px;
          background: rgba(255, 255, 255, 0.1);
          border-radius: 2px;
          margin-top: 8px;
          overflow: hidden;
        }

        .card-bar-fill {
          height: 100%;
          border-radius: 2px;
          transition: width 0.3s ease;
          box-shadow: 0 0 10px currentColor;
        }

        .wealth-card .card-front {
          background: linear-gradient(145deg, rgba(50, 40, 20, 0.9) 0%, rgba(30, 25, 15, 0.95) 100%);
          border-color: rgba(212, 175, 55, 0.6);
        }

        /* 开始按钮 */
        .btn-enter-fate {
          position: relative;
          width: 100%;
          padding: 20px;
          background: linear-gradient(135deg, rgba(212, 175, 55, 0.2) 0%, rgba(180, 140, 40, 0.2) 100%);
          border: 2px solid #d4af37;
          border-radius: 12px;
          color: #d4af37;
          font-family: 'Cinzel', serif;
          font-size: 1.3em;
          font-weight: 600;
          letter-spacing: 6px;
          cursor: pointer;
          overflow: hidden;
          transition: all 0.3s ease;
        }

        .btn-enter-fate:hover:not(:disabled) {
          background: linear-gradient(135deg, rgba(212, 175, 55, 0.3) 0%, rgba(180, 140, 40, 0.3) 100%);
          box-shadow:
            0 0 40px rgba(212, 175, 55, 0.4),
            inset 0 0 30px rgba(212, 175, 55, 0.1);
          transform: translateY(-2px);
        }

        .btn-enter-fate:disabled {
          opacity: 0.4;
          cursor: not-allowed;
        }

        .btn-text {
          position: relative;
          z-index: 1;
        }

        .btn-glow {
          position: absolute;
          top: 50%;
          left: -100%;
          transform: translateY(-50%);
          width: 50%;
          height: 200%;
          background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
          animation: btnShine 3s infinite;
        }

        @keyframes btnShine {
          0% { left: -100%; }
          50%, 100% { left: 150%; }
        }

        /* 响应式 */
        @media (max-width: 500px) {
          .game-title {
            font-size: 2em;
            letter-spacing: 8px;
          }

          .start-container {
            padding: 20px;
          }

          .destiny-card {
            height: 120px;
          }

          .card-value {
            font-size: 22px;
          }
        }
      `}</style>
    </div>
  );
}
