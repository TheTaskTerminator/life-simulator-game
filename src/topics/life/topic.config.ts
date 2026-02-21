import { TopicConfigBase } from '../../core/types/base';

/**
 * 人生模拟器 - 话题元配置
 */
export const topicConfig: TopicConfigBase = {
  id: 'life-simulator',
  name: '人生模拟器',
  version: '1.0.0',
  description: '体验一段虚拟人生，从童年到老年，做出选择，塑造命运',
  author: 'Life Simulator Team',

  features: {
    hasCareer: true,
    hasEducation: true,
    hasProperty: true,
    hasRelationship: true,
    hasInvestment: true,
    hasAchievement: true,
  },

  parameters: {
    maxTurn: 100,
    maxAge: 100,
    eventsPerTurn: 1,
  },
};

export default topicConfig;
