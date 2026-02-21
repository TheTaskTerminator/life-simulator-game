import React from 'react';
import { getAvailableTopics, getTopic, TopicPackage } from '../core';

interface TopicSelectorProps {
  onSelectTopic: (topicId: string) => void;
}

export function TopicSelector({ onSelectTopic }: TopicSelectorProps): React.ReactElement {
  const topicIds = getAvailableTopics();
  const topics: TopicPackage[] = topicIds.map(id => getTopic(id));

  const containerStyle: React.CSSProperties = {
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'linear-gradient(135deg, #0a0a1a 0%, #1a1a2e 100%)',
    padding: '40px 20px',
  };

  const titleStyle: React.CSSProperties = {
    fontFamily: "'Cinzel', serif",
    fontSize: '48px',
    fontWeight: 700,
    color: '#d4af37',
    marginBottom: '16px',
    textAlign: 'center',
  };

  const subtitleStyle: React.CSSProperties = {
    fontSize: '18px',
    color: '#a0a0b0',
    marginBottom: '48px',
    textAlign: 'center',
  };

  const gridStyle: React.CSSProperties = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
    gap: '24px',
    maxWidth: '900px',
    width: '100%',
  };

  const cardStyle = (topic: TopicPackage): React.CSSProperties => ({
    background: 'rgba(26, 26, 46, 0.8)',
    borderRadius: '16px',
    padding: '32px',
    border: `2px solid ${topic.theme.colors.border}`,
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    position: 'relative',
    overflow: 'hidden',
  });

  const cardHoverStyle = (topic: TopicPackage): React.CSSProperties => ({
    transform: 'translateY(-4px)',
    borderColor: topic.theme.colors.accent,
    boxShadow: `0 8px 32px ${topic.theme.colors.accent}33`,
  });

  const topicHeaderStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
    marginBottom: '16px',
  };

  const iconStyle = (topic: TopicPackage): React.CSSProperties => ({
    width: '56px',
    height: '56px',
    borderRadius: '12px',
    background: `linear-gradient(135deg, ${topic.theme.colors.accent}33, ${topic.theme.colors.accent}11)`,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '28px',
  });

  const topicNameStyle = (topic: TopicPackage): React.CSSProperties => ({
    fontFamily: topic.theme.fonts.heading,
    fontSize: '24px',
    fontWeight: 600,
    color: topic.theme.colors.accent,
    margin: 0,
  });

  const topicVersionStyle: React.CSSProperties = {
    fontSize: '12px',
    color: '#666',
    marginTop: '4px',
  };

  const descriptionStyle: React.CSSProperties = {
    fontSize: '15px',
    color: '#c0c0c0',
    lineHeight: 1.6,
    marginBottom: '20px',
  };

  const featuresStyle: React.CSSProperties = {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '8px',
  };

  const featureTagStyle = (topic: TopicPackage): React.CSSProperties => ({
    padding: '4px 12px',
    borderRadius: '12px',
    background: `${topic.theme.colors.accent}22`,
    color: topic.theme.colors.accent,
    fontSize: '12px',
    fontWeight: 500,
  });

  const handleCardClick = (topicId: string) => {
    onSelectTopic(topicId);
  };

  const [hoveredTopic, setHoveredTopic] = React.useState<string | null>(null);

  return (
    <div style={containerStyle}>
      <h1 style={titleStyle}>选择模拟器</h1>
      <p style={subtitleStyle}>选择一个话题开始你的模拟之旅</p>

      <div style={gridStyle}>
        {topics.map(topic => (
          <div
            key={topic.config.id}
            style={{
              ...cardStyle(topic),
              ...(hoveredTopic === topic.config.id ? cardHoverStyle(topic) : {}),
            }}
            onClick={() => handleCardClick(topic.config.id)}
            onMouseEnter={() => setHoveredTopic(topic.config.id)}
            onMouseLeave={() => setHoveredTopic(null)}
          >
            <div style={topicHeaderStyle}>
              <div style={iconStyle(topic)}>
                {topic.config.id === 'life-simulator' ? '🎮' : '🔬'}
              </div>
              <div>
                <h2 style={topicNameStyle(topic)}>{topic.config.name}</h2>
                <div style={topicVersionStyle}>v{topic.config.version}</div>
              </div>
            </div>

            <p style={descriptionStyle}>
              {topic.config.description}
            </p>

            <div style={featuresStyle}>
              {topic.config.features.hasCareer && (
                <span style={featureTagStyle(topic)}>职业系统</span>
              )}
              {topic.config.features.hasEducation && (
                <span style={featureTagStyle(topic)}>教育系统</span>
              )}
              {topic.config.features.hasRelationship && (
                <span style={featureTagStyle(topic)}>关系系统</span>
              )}
              {topic.config.features.hasProperty && (
                <span style={featureTagStyle(topic)}>资产系统</span>
              )}
              {topic.config.features.hasAchievement && (
                <span style={featureTagStyle(topic)}>成就系统</span>
              )}
            </div>

            {/* 底部装饰线 */}
            <div
              style={{
                position: 'absolute',
                bottom: 0,
                left: 0,
                right: 0,
                height: '3px',
                background: `linear-gradient(90deg, transparent, ${topic.theme.colors.accent}, transparent)`,
                opacity: hoveredTopic === topic.config.id ? 1 : 0,
                transition: 'opacity 0.3s',
              }}
            />
          </div>
        ))}
      </div>
    </div>
  );
}

export default TopicSelector;
