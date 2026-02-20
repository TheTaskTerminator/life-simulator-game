import { useEffect, useState } from 'react';
import { Event, Choice } from '../types';

interface EventModalProps {
  event: Event | null;
  isOpen: boolean;
  onChoice: (choice: Choice) => void;
  onClose: () => void;
}

// 事件类型配置
const eventTypeConfig: Record<Event['type'], { symbol: string; label: string; color: string }> = {
  opportunity: { symbol: '♈', label: '机缘', color: '#4CAF50' },
  challenge: { symbol: '♏', label: '劫难', color: '#F44336' },
  daily: { symbol: '♊', label: '日常', color: '#2196F3' },
  special: { symbol: '♌', label: '奇遇', color: '#FF9800' },
  stage: { symbol: '♑', label: '命运', color: '#9C27B0' },
};

export default function EventModal({
  event,
  isOpen,
  onChoice,
  onClose,
}: EventModalProps) {
  const [isRevealing, setIsRevealing] = useState(false);
  const [isRevealed, setIsRevealed] = useState(false);

  useEffect(() => {
    if (isOpen && event) {
      setIsRevealing(true);
      setIsRevealed(false);
      const timer = setTimeout(() => {
        setIsRevealing(false);
        setIsRevealed(true);
      }, 600);
      return () => clearTimeout(timer);
    } else {
      setIsRevealing(false);
      setIsRevealed(false);
    }
  }, [isOpen, event?.id]);

  if (!isOpen || !event) return null;

  const handleChoice = (choice: Choice) => {
    onChoice(choice);
    onClose();
  };

  const typeConfig = eventTypeConfig[event.type] || eventTypeConfig.daily;

  return (
    <div className="modal-overlay" onClick={onClose}>
      {/* 星尘粒子效果 */}
      <div className="stardust">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="dust"
            style={{
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 2}s`,
              animationDuration: `${3 + Math.random() * 2}s`,
            }}
          />
        ))}
      </div>

      <div
        className={`modal-card ${isRevealing ? 'revealing' : ''} ${isRevealed ? 'revealed' : ''}`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* 金色边框光晕 */}
        <div className="card-glow" style={{ borderColor: typeConfig.color }} />

        {/* 卡片头部 */}
        <div className="card-header">
          <div
            className="event-type-seal"
            style={{
              background: `linear-gradient(135deg, ${typeConfig.color}40, ${typeConfig.color}20)`,
              borderColor: typeConfig.color,
            }}
          >
            <span className="seal-symbol">{typeConfig.symbol}</span>
            <span className="seal-label">{typeConfig.label}</span>
          </div>
          <button className="modal-close" onClick={onClose}>
            ✕
          </button>
        </div>

        {/* 卡片主体 */}
        <div className="card-body">
          <div className="event-decoration">
            <span className="deco-line" />
            <span className="deco-diamond">◆</span>
            <span className="deco-line" />
          </div>

          <h2 className="event-title">{event.title}</h2>

          <div className="event-description">
            <p>{event.description}</p>
          </div>

          <div className="event-decoration bottom">
            <span className="deco-line" />
            <span className="deco-diamond">◆</span>
            <span className="deco-line" />
          </div>

          {/* 选项列表 */}
          <div className="choices-list">
            {event.choices.map((choice, index) => (
              <button
                key={choice.id}
                className="choice-button"
                onClick={() => handleChoice(choice)}
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <span className="choice-number">{index + 1}</span>
                <span className="choice-text">{choice.text}</span>
                <span className="choice-arrow">→</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      <style>{`
        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.85);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
          padding: 20px;
          font-family: 'Noto Sans SC', sans-serif;
        }

        /* 星尘效果 */
        .stardust {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          pointer-events: none;
          overflow: hidden;
        }

        .dust {
          position: absolute;
          width: 4px;
          height: 4px;
          background: rgba(212, 175, 55, 0.6);
          border-radius: 50%;
          animation: float 4s infinite ease-in-out;
        }

        @keyframes float {
          0%, 100% {
            transform: translateY(100vh) scale(0);
            opacity: 0;
          }
          10% {
            opacity: 1;
          }
          90% {
            opacity: 1;
          }
          100% {
            transform: translateY(-20px) scale(1);
            opacity: 0;
          }
        }

        /* 卡片 */
        .modal-card {
          position: relative;
          background: linear-gradient(160deg, #1a1a2e 0%, #16213e 50%, #0f0f2a 100%);
          border: 1px solid rgba(212, 175, 55, 0.3);
          border-radius: 16px;
          max-width: 520px;
          width: 100%;
          max-height: 90vh;
          overflow-y: auto;
          box-shadow:
            0 20px 60px rgba(0, 0, 0, 0.6),
            0 0 40px rgba(212, 175, 55, 0.1);
          transform-style: preserve-3d;
          transform: perspective(1000px) rotateY(0deg);
        }

        .modal-card.revealing {
          animation: cardReveal 0.6s ease-out;
        }

        .modal-card.revealed {
          animation: cardIdle 3s ease-in-out infinite;
        }

        @keyframes cardReveal {
          0% {
            opacity: 0;
            transform: perspective(1000px) rotateY(180deg) scale(0.8);
          }
          100% {
            opacity: 1;
            transform: perspective(1000px) rotateY(0deg) scale(1);
          }
        }

        @keyframes cardIdle {
          0%, 100% {
            box-shadow:
              0 20px 60px rgba(0, 0, 0, 0.6),
              0 0 40px rgba(212, 175, 55, 0.1);
          }
          50% {
            box-shadow:
              0 25px 70px rgba(0, 0, 0, 0.7),
              0 0 60px rgba(212, 175, 55, 0.2);
          }
        }

        /* 金色光晕 */
        .card-glow {
          position: absolute;
          top: -2px;
          left: -2px;
          right: -2px;
          bottom: -2px;
          border-radius: 18px;
          border: 2px solid transparent;
          opacity: 0;
          transition: opacity 0.3s;
          pointer-events: none;
          z-index: -1;
        }

        .modal-card.revealed .card-glow {
          opacity: 0.5;
          animation: glowPulse 2s ease-in-out infinite;
        }

        @keyframes glowPulse {
          0%, 100% { opacity: 0.3; filter: blur(4px); }
          50% { opacity: 0.6; filter: blur(8px); }
        }

        /* 头部 */
        .card-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 20px 24px;
          border-bottom: 1px solid rgba(212, 175, 55, 0.15);
        }

        .event-type-seal {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 8px 16px;
          border-radius: 20px;
          border: 1px solid;
        }

        .seal-symbol {
          font-size: 18px;
          color: #d4af37;
        }

        .seal-label {
          font-size: 14px;
          color: #f0f0f0;
          font-weight: 500;
          letter-spacing: 2px;
        }

        .modal-close {
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.1);
          color: #8b8ba3;
          width: 36px;
          height: 36px;
          border-radius: 50%;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.3s;
          font-size: 16px;
        }

        .modal-close:hover {
          background: rgba(244, 67, 54, 0.2);
          border-color: rgba(244, 67, 54, 0.5);
          color: #F44336;
        }

        /* 主体 */
        .card-body {
          padding: 24px;
        }

        .event-decoration {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 16px;
          margin-bottom: 20px;
        }

        .event-decoration.bottom {
          margin-bottom: 24px;
          margin-top: 20px;
        }

        .deco-line {
          height: 1px;
          flex: 1;
          background: linear-gradient(90deg, transparent, rgba(212, 175, 55, 0.3), transparent);
        }

        .deco-diamond {
          color: #d4af37;
          font-size: 10px;
          animation: diamondPulse 2s ease-in-out infinite;
        }

        @keyframes diamondPulse {
          0%, 100% { opacity: 0.5; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.2); }
        }

        .event-title {
          margin: 0 0 16px 0;
          font-family: 'Cinzel', serif;
          font-size: 1.6em;
          text-align: center;
          background: linear-gradient(180deg, #d4af37 0%, #f5d47e 50%, #d4af37 100%);
          -webkit-background-clip: text;
          background-clip: text;
          color: transparent;
          letter-spacing: 4px;
        }

        .event-description {
          text-align: center;
          color: #c0c0d0;
          font-size: 15px;
          line-height: 1.8;
          padding: 0 16px;
        }

        .event-description p {
          margin: 0;
        }

        /* 选项 */
        .choices-list {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .choice-button {
          display: flex;
          align-items: center;
          gap: 16px;
          padding: 16px 20px;
          background: linear-gradient(135deg, rgba(30, 30, 50, 0.6) 0%, rgba(20, 20, 35, 0.8) 100%);
          border: 1px solid rgba(212, 175, 55, 0.2);
          border-radius: 10px;
          color: #f0f0f0;
          font-size: 15px;
          cursor: pointer;
          transition: all 0.3s ease;
          text-align: left;
          font-family: 'Noto Sans SC', sans-serif;
        }

        .choice-button:hover {
          background: linear-gradient(135deg, rgba(212, 175, 55, 0.15) 0%, rgba(180, 140, 40, 0.1) 100%);
          border-color: #d4af37;
          box-shadow:
            0 4px 20px rgba(212, 175, 55, 0.2),
            inset 0 0 30px rgba(212, 175, 55, 0.05);
          transform: translateX(8px);
        }

        .choice-button:hover .choice-arrow {
          opacity: 1;
          transform: translateX(4px);
        }

        .choice-number {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 28px;
          height: 28px;
          background: rgba(212, 175, 55, 0.2);
          border: 1px solid rgba(212, 175, 55, 0.4);
          border-radius: 50%;
          color: #d4af37;
          font-size: 13px;
          font-weight: 600;
          flex-shrink: 0;
        }

        .choice-text {
          flex: 1;
          line-height: 1.5;
        }

        .choice-arrow {
          color: #d4af37;
          font-size: 18px;
          opacity: 0;
          transform: translateX(-8px);
          transition: all 0.3s ease;
        }

        /* 响应式 */
        @media (max-width: 500px) {
          .card-header {
            padding: 16px;
          }

          .card-body {
            padding: 16px;
          }

          .event-title {
            font-size: 1.3em;
          }

          .choice-button {
            padding: 14px 16px;
          }
        }
      `}</style>
    </div>
  );
}
