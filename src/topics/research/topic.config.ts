import { TopicConfigBase } from '../../core/types/base';

/**
 * 科研模拟器 - 话题元配置
 */
export const topicConfig: TopicConfigBase = {
  id: 'research-simulator',
  name: '学术之路',
  version: '1.0.0',
  description: '踏上学术之路，从博士生到学术大牛，发表顶刊论文，培养学术继承人',
  author: 'Life Simulator Team',

  features: {
    hasCareer: true,      // 学术职位（讲师、副教授、教授等）
    hasEducation: true,   // 学历（博士、博后等）
    hasProperty: false,   // 无房产
    hasRelationship: true, // 学术关系（导师、学生、合作者）
    hasInvestment: false, // 无投资
    hasAchievement: true, // 学术成就
  },

  parameters: {
    maxTurn: 50,  // 50个学年
    maxAge: 40,   // 40年学术生涯
    eventsPerTurn: 1,
  },
};

export default topicConfig;
