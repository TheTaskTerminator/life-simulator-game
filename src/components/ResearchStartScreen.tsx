import React, { useState, useCallback } from 'react';
import { useTheme, useTexts } from '../core/context/TopicContext';
import {
  mentorTypes,
  MentorType,
  MentorTypeConfig,
} from '../topics/research/mentors.config';
import {
  DegreeType,
} from '../topics/research/time.config';

interface ResearchStartScreenProps {
  onCreateGame: (
    name: string,
    attributes: Record<string, number>,
    options?: {
      degreeType: DegreeType;
      mentorType: MentorType;
    }
  ) => void;
  onBack?: () => void;
}

// 研究生属性默认值
const defaultResearchAttributes: Record<string, number> = {
  research_ability: 50,
  academic_passion: 70,
  advisor_favor: 50,
  peer_relation: 60,
  health: 80,
  finance: 50,
  pressure: 30,
};

// 随机生成属性
function generateRandomResearchAttributes(): Record<string, number> {
  return {
    research_ability: Math.floor(Math.random() * 40) + 40, // 40-80
    academic_passion: Math.floor(Math.random() * 40) + 50, // 50-90
    advisor_favor: Math.floor(Math.random() * 30) + 40,    // 40-70
    peer_relation: Math.floor(Math.random() * 30) + 50,    // 50-80
    health: Math.floor(Math.random() * 30) + 60,           // 60-90
    finance: Math.floor(Math.random() * 40) + 30,          // 30-70
    pressure: Math.floor(Math.random() * 30) + 20,         // 20-50
  };
}

// 属性配置
const attributeConfig = [
  { key: 'research_ability', label: '科研能力', icon: '🔬', color: '#4CAF50' },
  { key: 'academic_passion', label: '学术热情', icon: '🔥', color: '#FF9800' },
  { key: 'advisor_favor', label: '导师好感', icon: '👨‍🏫', color: '#2196F3' },
  { key: 'peer_relation', label: '同门关系', icon: '🤝', color: '#9C27B0' },
  { key: 'health', label: '身心健康', icon: '❤️', color: '#E91E63' },
  { key: 'finance', label: '经济状况', icon: '💰', color: '#FFD700' },
  { key: 'pressure', label: '压力值', icon: '😰', color: '#F44336' },
];

// 学历选项
const degreeOptions: { type: DegreeType; label: string; description: string; icon: string }[] = [
  {
    type: 'master_academic',
    label: '学术硕士',
    description: '3年制，侧重科研训练',
    icon: '📚',
  },
  {
    type: 'master_professional',
    label: '专业硕士',
    description: '2-3年制，侧重实践应用',
    icon: '💼',
  },
  {
    type: 'doctor',
    label: '博士研究生',
    description: '4年制，深耕学术领域',
    icon: '🎓',
  },
];

export function ResearchStartScreen({
  onCreateGame,
  onBack,
}: ResearchStartScreenProps): React.ReactElement {
  const theme = useTheme();
  const texts = useTexts();

  // 状态
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [name, setName] = useState('');
  const [degreeType, setDegreeType] = useState<DegreeType>('master_academic');
  const [mentorType, setMentorType] = useState<MentorType>('big_shot');
  const [attributes, setAttributes] = useState<Record<string, number>>(defaultResearchAttributes);
  const [isRolling, setIsRolling] = useState(false);

  // 随机属性
  const handleRandomize = useCallback(() => {
    setIsRolling(true);
    let rollCount = 0;
    const rollInterval = setInterval(() => {
      setAttributes(generateRandomResearchAttributes());
      rollCount++;
      if (rollCount >= 10) {
        clearInterval(rollInterval);
        setIsRolling(false);
      }
    }, 80);
  }, []);

  // 开始游戏
  const handleStart = useCallback(() => {
    if (!name.trim()) {
      alert('请输入你的名字');
      return;
    }
    onCreateGame(name.trim(), attributes, { degreeType, mentorType });
  }, [name, attributes, degreeType, mentorType, onCreateGame]);

  // 样式
  const containerStyle: React.CSSProperties = {
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    background: `linear-gradient(135deg, ${theme.colors.background} 0%, #1a1a2e 100%)`,
    padding: '40px 20px',
    fontFamily: theme.fonts.body,
    color: theme.colors.text,
  };

  const cardStyle: React.CSSProperties = {
    background: theme.colors.card,
    borderRadius: `${theme.borderRadius.lg}px`,
    padding: '40px',
    maxWidth: '600px',
    width: '100%',
    border: `1px solid ${theme.colors.border}`,
    boxShadow: theme.shadows.lg,
  };

  const titleStyle: React.CSSProperties = {
    fontFamily: theme.fonts.heading,
    fontSize: '32px',
    fontWeight: 700,
    color: theme.colors.accent,
    marginBottom: '8px',
    textAlign: 'center',
  };

  const subtitleStyle: React.CSSProperties = {
    fontSize: '16px',
    color: theme.colors.textSecondary,
    marginBottom: '32px',
    textAlign: 'center',
  };

  const stepIndicatorStyle: React.CSSProperties = {
    display: 'flex',
    justifyContent: 'center',
    gap: '12px',
    marginBottom: '32px',
  };

  const stepDotStyle = (isActive: boolean, isCompleted: boolean): React.CSSProperties => ({
    width: '32px',
    height: '32px',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '14px',
    fontWeight: 600,
    background: isCompleted
      ? theme.colors.success
      : isActive
        ? theme.colors.accent
        : theme.colors.backgroundSecondary,
    color: isActive || isCompleted ? '#fff' : theme.colors.textSecondary,
    border: `2px solid ${isActive ? theme.colors.accent : 'transparent'}`,
    transition: 'all 0.3s ease',
  });

  const inputStyle: React.CSSProperties = {
    width: '100%',
    padding: '14px 18px',
    background: theme.colors.backgroundSecondary,
    border: `1px solid ${theme.colors.border}`,
    borderRadius: `${theme.borderRadius.md}px`,
    color: theme.colors.text,
    fontSize: '16px',
    fontFamily: theme.fonts.body,
    outline: 'none',
    transition: 'border-color 0.2s',
  };

  const optionGridStyle: React.CSSProperties = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
    gap: '12px',
  };

  const optionCardStyle = (isSelected: boolean): React.CSSProperties => ({
    padding: '16px',
    background: isSelected ? `${theme.colors.accent}22` : theme.colors.backgroundSecondary,
    border: `2px solid ${isSelected ? theme.colors.accent : theme.colors.border}`,
    borderRadius: `${theme.borderRadius.md}px`,
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    textAlign: 'center',
  });

  const optionIconStyle: React.CSSProperties = {
    fontSize: '28px',
    marginBottom: '8px',
  };

  const optionLabelStyle: React.CSSProperties = {
    fontSize: '15px',
    fontWeight: 600,
    color: theme.colors.text,
    marginBottom: '4px',
  };

  const optionDescStyle: React.CSSProperties = {
    fontSize: '12px',
    color: theme.colors.textSecondary,
  };

  const buttonContainerStyle: React.CSSProperties = {
    display: 'flex',
    gap: '12px',
    marginTop: '24px',
  };

  const buttonStyle = (isPrimary: boolean): React.CSSProperties => ({
    flex: isPrimary ? 2 : 1,
    padding: '14px 24px',
    background: isPrimary ? theme.colors.accent : 'transparent',
    color: isPrimary ? '#fff' : theme.colors.textSecondary,
    border: `1px solid ${isPrimary ? theme.colors.accent : theme.colors.border}`,
    borderRadius: `${theme.borderRadius.md}px`,
    fontSize: '15px',
    fontWeight: 500,
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    fontFamily: theme.fonts.body,
  });

  const backButtonStyle: React.CSSProperties = {
    position: 'absolute',
    top: '20px',
    left: '20px',
    padding: '10px 20px',
    background: 'transparent',
    border: `1px solid ${theme.colors.border}`,
    borderRadius: `${theme.borderRadius.sm}px`,
    color: theme.colors.textSecondary,
    fontSize: '14px',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
  };

  // 渲染步骤1：基础信息
  const renderStep1 = () => (
    <>
      <div style={{ marginBottom: '24px' }}>
        <label style={{ display: 'block', marginBottom: '8px', color: theme.colors.textSecondary, fontSize: '14px' }}>
          你的名字
        </label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="输入你的名字..."
          maxLength={20}
          style={inputStyle}
          onFocus={(e) => { e.target.style.borderColor = theme.colors.accent; }}
          onBlur={(e) => { e.target.style.borderColor = theme.colors.border; }}
        />
      </div>

      <div style={{ marginBottom: '24px' }}>
        <label style={{ display: 'block', marginBottom: '12px', color: theme.colors.textSecondary, fontSize: '14px' }}>
          选择学历层次
        </label>
        <div style={optionGridStyle}>
          {degreeOptions.map((option) => (
            <div
              key={option.type}
              style={optionCardStyle(degreeType === option.type)}
              onClick={() => setDegreeType(option.type)}
            >
              <div style={optionIconStyle}>{option.icon}</div>
              <div style={optionLabelStyle}>{option.label}</div>
              <div style={optionDescStyle}>{option.description}</div>
            </div>
          ))}
        </div>
      </div>

      <div style={buttonContainerStyle}>
        <button style={backButtonStyle} onClick={onBack}>
          ← 返回
        </button>
        <button
          style={buttonStyle(true)}
          onClick={() => setStep(2)}
          disabled={!name.trim()}
        >
          下一步：选择导师
        </button>
      </div>
    </>
  );

  // 渲染步骤2：选择导师
  const renderStep2 = () => {
    const mentorList = Object.values(mentorTypes) as MentorTypeConfig[];

    return (
      <>
        <div style={{ marginBottom: '12px', textAlign: 'center', color: theme.colors.textSecondary, fontSize: '14px' }}>
          选择你的导师类型，这将影响你的研究生生涯
        </div>
        <div style={{ ...optionGridStyle, gridTemplateColumns: '1fr' }}>
          {mentorList.map((mentor) => (
            <div
              key={mentor.type}
              style={{
                ...optionCardStyle(mentorType === mentor.type),
                display: 'flex',
                alignItems: 'flex-start',
                gap: '12px',
                textAlign: 'left',
                padding: '16px',
              }}
              onClick={() => setMentorType(mentor.type)}
            >
              <div style={{ fontSize: '32px', minWidth: '40px' }}>{mentor.icon}</div>
              <div style={{ flex: 1 }}>
                <div style={{ ...optionLabelStyle, marginBottom: '4px' }}>{mentor.name}</div>
                <div style={{ ...optionDescStyle, marginBottom: '8px' }}>{mentor.description}</div>
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                  {mentor.advantages.slice(0, 2).map((adv, i) => (
                    <span
                      key={i}
                      style={{
                        fontSize: '11px',
                        padding: '2px 6px',
                        background: `${theme.colors.success}22`,
                        color: theme.colors.success,
                        borderRadius: '4px',
                      }}
                    >
                      + {adv}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div style={buttonContainerStyle}>
          <button style={buttonStyle(false)} onClick={() => setStep(1)}>
            上一步
          </button>
          <button style={buttonStyle(true)} onClick={() => setStep(3)}>
            下一步：初始属性
          </button>
        </div>
      </>
    );
  };

  // 渲染步骤3：初始属性
  const renderStep3 = () => (
    <>
      <div style={{ marginBottom: '16px', textAlign: 'center' }}>
        <button
          onClick={handleRandomize}
          disabled={isRolling}
          style={{
            padding: '10px 24px',
            background: theme.colors.backgroundSecondary,
            border: `1px solid ${theme.colors.border}`,
            borderRadius: `${theme.borderRadius.md}px`,
            color: theme.colors.text,
            fontSize: '14px',
            cursor: 'pointer',
            transition: 'all 0.2s',
            opacity: isRolling ? 0.7 : 1,
          }}
        >
          {isRolling ? '属性生成中...' : '🎲 随机生成属性'}
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px' }}>
        {attributeConfig.map((attr) => (
          <div
            key={attr.key}
            style={{
              background: theme.colors.backgroundSecondary,
              borderRadius: `${theme.borderRadius.md}px`,
              padding: '12px',
              border: `1px solid ${theme.colors.border}`,
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
              <span style={{ fontSize: '18px' }}>{attr.icon}</span>
              <span style={{ fontSize: '13px', color: theme.colors.textSecondary }}>{attr.label}</span>
              <span style={{ marginLeft: 'auto', fontSize: '16px', fontWeight: 600, color: attr.color }}>
                {attributes[attr.key]}
              </span>
            </div>
            <div style={{ height: '4px', background: theme.colors.background, borderRadius: '2px', overflow: 'hidden' }}>
              <div
                style={{
                  height: '100%',
                  width: `${attributes[attr.key]}%`,
                  background: attr.color,
                  borderRadius: '2px',
                  transition: 'width 0.1s',
                }}
              />
            </div>
          </div>
        ))}
      </div>

      <div style={buttonContainerStyle}>
        <button style={buttonStyle(false)} onClick={() => setStep(2)}>
          上一步
        </button>
        <button
          style={buttonStyle(true)}
          onClick={handleStart}
        >
          🎓 开始研途
        </button>
      </div>
    </>
  );

  return (
    <div style={containerStyle}>
      {onBack && step === 1 && (
        <button
          onClick={onBack}
          style={backButtonStyle}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = theme.colors.accent;
            e.currentTarget.style.color = theme.colors.text;
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = theme.colors.border;
            e.currentTarget.style.color = theme.colors.textSecondary;
          }}
        >
          ← 返回选择模拟器
        </button>
      )}

      <div style={cardStyle}>
        <h1 style={titleStyle}>{texts.gameTitle}</h1>
        <p style={subtitleStyle}>{texts.gameSubtitle}</p>

        {/* 步骤指示器 */}
        <div style={stepIndicatorStyle}>
          <div style={stepDotStyle(step === 1, step > 1)}>1</div>
          <div style={stepDotStyle(step === 2, step > 2)}>2</div>
          <div style={stepDotStyle(step === 3, false)}>3</div>
        </div>

        {/* 步骤标题 */}
        <div style={{ textAlign: 'center', marginBottom: '24px' }}>
          <div style={{ fontSize: '18px', fontWeight: 600, color: theme.colors.text }}>
            {step === 1 && '基础信息'}
            {step === 2 && '选择导师'}
            {step === 3 && '初始属性'}
          </div>
        </div>

        {/* 步骤内容 */}
        {step === 1 && renderStep1()}
        {step === 2 && renderStep2()}
        {step === 3 && renderStep3()}
      </div>
    </div>
  );
}

export default ResearchStartScreen;
