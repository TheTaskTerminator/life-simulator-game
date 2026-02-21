import { EndingsConfig } from '../../core/types/base';

/**
 * 科研模拟器 - 结局配置
 */
export const endingsConfig: EndingsConfig = {
  hard: [
    {
      id: 'ending_health_crisis',
      title: '健康危机',
      description: '过度劳累导致身体崩溃，不得不退出学术圈。',
      type: 'bad',
      condition: {
        attributes: {
          health: { max: 0 },
        },
      },
      icon: '🏥',
    },
    {
      id: 'ending_burnout',
      title: '学术倦怠',
      description: '彻底失去了对科研的热情，选择离开学术界。',
      type: 'bad',
      condition: {
        attributes: {
          motivation: { max: 0 },
        },
      },
      icon: '😔',
    },
  ],

  soft: [
    {
      id: 'ending_nobel',
      title: '学术巅峰',
      description: '你的研究改变了学科发展方向，培养了一批优秀的学术继承人，成为享誉世界的学术大师！',
      type: 'good',
      scoreThreshold: 0.85,
      icon: '🏅',
    },
    {
      id: 'ending_distinguished',
      title: '杰出学者',
      description: '你在自己的领域做出了重要贡献，获得了同行的广泛认可，是一名受人尊敬的学者。',
      type: 'good',
      scoreThreshold: 0.65,
      icon: '🎖️',
    },
    {
      id: 'ending_average',
      title: '普通教授',
      description: '你完成了基本的学术任务，培养了几个学生，虽然没有特别突出的成就，但也算得上兢兢业业。',
      type: 'neutral',
      scoreThreshold: 0.4,
      icon: '📜',
    },
    {
      id: 'ending_struggling',
      title: '学术困境',
      description: '在学术道路上你遇到了很多困难，虽然一直在努力，但始终没有取得突破性的成果。',
      type: 'bad',
      scoreThreshold: 0,
      icon: '📉',
    },
  ],
};

export default endingsConfig;
