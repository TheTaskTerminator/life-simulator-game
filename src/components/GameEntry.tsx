import React from 'react';

interface GameEntryProps {
  topicName: string;
  topicDescription: string;
  topicIcon: string;
  hasSave: boolean;
  onNewGame: () => void;
  onContinue: () => void;
  onBack: () => void;
}

export function GameEntry({
  topicName,
  topicDescription,
  topicIcon,
  hasSave,
  onNewGame,
  onContinue,
  onBack,
}: GameEntryProps): React.ReactElement {
  const containerStyle: React.CSSProperties = {
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'linear-gradient(135deg, #0a0a1a 0%, #1a1a2e 100%)',
    padding: '40px 20px',
    fontFamily: "'Noto Sans SC', sans-serif",
  };

  const cardStyle: React.CSSProperties = {
    background: 'rgba(26, 26, 46, 0.9)',
    borderRadius: '20px',
    padding: '48px',
    maxWidth: '500px',
    width: '100%',
    border: '2px solid rgba(212, 175, 55, 0.3)',
    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.5)',
    textAlign: 'center',
  };

  const iconStyle: React.CSSProperties = {
    fontSize: '64px',
    marginBottom: '24px',
  };

  const titleStyle: React.CSSProperties = {
    fontFamily: "'Cinzel', serif",
    fontSize: '32px',
    fontWeight: 700,
    color: '#d4af37',
    marginBottom: '16px',
    letterSpacing: '4px',
  };

  const descriptionStyle: React.CSSProperties = {
    fontSize: '16px',
    color: '#a0a0b0',
    lineHeight: 1.6,
    marginBottom: '40px',
  };

  const buttonContainerStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
    marginBottom: '32px',
  };

  const primaryButtonStyle: React.CSSProperties = {
    padding: '16px 32px',
    fontSize: '18px',
    fontWeight: 600,
    border: '2px solid #d4af37',
    borderRadius: '12px',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    fontFamily: "'Noto Sans SC', sans-serif",
    letterSpacing: '2px',
    background: 'linear-gradient(135deg, rgba(212, 175, 55, 0.2) 0%, rgba(180, 140, 40, 0.2) 100%)',
    color: '#d4af37',
  };

  const secondaryButtonStyle: React.CSSProperties = {
    padding: '14px 28px',
    fontSize: '16px',
    fontWeight: 500,
    border: '1px solid rgba(212, 175, 55, 0.5)',
    borderRadius: '12px',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    fontFamily: "'Noto Sans SC', sans-serif",
    letterSpacing: '2px',
    background: 'transparent',
    color: '#a0a0b0',
  };

  const backButtonStyle: React.CSSProperties = {
    padding: '12px 24px',
    fontSize: '14px',
    border: '1px solid rgba(255, 255, 255, 0.2)',
    borderRadius: '8px',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    fontFamily: "'Noto Sans SC', sans-serif",
    background: 'transparent',
    color: '#666',
  };

  const handlePrimaryClick = () => {
    if (hasSave) {
      onContinue();
    } else {
      onNewGame();
    }
  };

  const handleSecondaryClick = () => {
    onNewGame();
  };

  return (
    <div style={containerStyle}>
      <div style={cardStyle}>
        <div style={iconStyle}>{topicIcon}</div>
        <h1 style={titleStyle}>{topicName}</h1>
        <p style={descriptionStyle}>{topicDescription}</p>

        <div style={buttonContainerStyle}>
          {hasSave ? (
            <>
              <button
                style={primaryButtonStyle}
                onClick={handlePrimaryClick}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'linear-gradient(135deg, rgba(212, 175, 55, 0.3) 0%, rgba(180, 140, 40, 0.3) 100%)';
                  e.currentTarget.style.transform = 'translateY(-2px)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'linear-gradient(135deg, rgba(212, 175, 55, 0.2) 0%, rgba(180, 140, 40, 0.2) 100%)';
                  e.currentTarget.style.transform = 'translateY(0)';
                }}
              >
                继续上一次
              </button>
              <button
                style={secondaryButtonStyle}
                onClick={handleSecondaryClick}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = '#d4af37';
                  e.currentTarget.style.color = '#d4af37';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = 'rgba(212, 175, 55, 0.5)';
                  e.currentTarget.style.color = '#a0a0b0';
                }}
              >
                新游戏
              </button>
            </>
          ) : (
            <button
              style={primaryButtonStyle}
              onClick={onNewGame}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'linear-gradient(135deg, rgba(212, 175, 55, 0.3) 0%, rgba(180, 140, 40, 0.3) 100%)';
                e.currentTarget.style.transform = 'translateY(-2px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'linear-gradient(135deg, rgba(212, 175, 55, 0.2) 0%, rgba(180, 140, 40, 0.2) 100%)';
                e.currentTarget.style.transform = 'translateY(0)';
              }}
            >
              开始新游戏
            </button>
          )}
        </div>

        <button
          style={backButtonStyle}
          onClick={onBack}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.5)';
            e.currentTarget.style.color = '#a0a0a0';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.2)';
            e.currentTarget.style.color = '#666';
          }}
        >
          ← 返回选择模拟器
        </button>
      </div>
    </div>
  );
}

export default GameEntry;
