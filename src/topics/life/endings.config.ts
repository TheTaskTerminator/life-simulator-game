import { EndingsConfig } from '../../core/types/base';

/**
 * 人生模拟器 - 结局配置
 */
export const endingsConfig: EndingsConfig = {
  hard: [
    {
      id: 'ending_health_death',
      title: '生命终结',
      description: '你的健康值降到了0，生命就此终结。',
      type: 'bad',
      condition: {
        attributes: {
          health: { max: 0 },
        },
      },
      icon: '💔',
    },
    {
      id: 'ending_age_limit',
      title: '百年人生',
      description: '你已经活到了100岁，人生旅途到此结束。',
      type: 'neutral',
      condition: {
        age: { min: 100 },
      },
      icon: '🎂',
    },
  ],

  soft: [
    {
      id: 'ending_flourishing',
      title: '人生巅峰',
      description: '你的人生精彩纷呈，健康、财富、幸福皆备，是人人羡慕的人生赢家！',
      type: 'good',
      scoreThreshold: 0.8,
      icon: '🏆',
    },
    {
      id: 'ending_balanced',
      title: '平稳人生',
      description: '你的人生虽然平凡，但健康、财富、幸福都有所兼顾，也算得上圆满。',
      type: 'good',
      scoreThreshold: 0.6,
      icon: '✨',
    },
    {
      id: 'ending_mediocre',
      title: '平凡一生',
      description: '你的人生平淡无奇，虽然没有大起大落，但也缺乏亮点。',
      type: 'neutral',
      scoreThreshold: 0.4,
      icon: '🌙',
    },
    {
      id: 'ending_regret',
      title: '充满遗憾',
      description: '回首往事，你的人生充满了遗憾和无奈，很多事情没能如愿。',
      type: 'bad',
      scoreThreshold: 0,
      icon: '😢',
    },
  ],
};

export default endingsConfig;
