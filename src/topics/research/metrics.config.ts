import { MetricsConfig } from '../../core/types/base';

/**
 * 科研模拟器 - 属性配置
 */
export const metricsConfig: MetricsConfig = {
  definitions: {
    motivation: {
      key: 'motivation',
      label: '学术热情',
      icon: '🔬',
      color: '#4CAF50',
      bounds: { min: 0, max: 100 },
      isLowWhenBelow: 30,
      description: '对科研的热情和动力',
    },
    creativity: {
      key: 'creativity',
      label: '创造力',
      icon: '💡',
      color: '#FFD700',
      bounds: { min: 0, max: 100 },
      isLowWhenBelow: 30,
      description: '创新思维和突破能力',
    },
    reputation: {
      key: 'reputation',
      label: '学术声誉',
      icon: '🏆',
      color: '#9C27B0',
      bounds: { min: 0, max: 100 },
      isLowWhenBelow: 20,
      description: '在学术界的知名度和影响力',
    },
    funding: {
      key: 'funding',
      label: '科研经费',
      icon: '💵',
      color: '#00BCD4',
      bounds: { min: 0, max: Infinity },
      description: '可支配的科研资金（万元）',
    },
    stress: {
      key: 'stress',
      label: '压力',
      icon: '😓',
      color: '#F44336',
      bounds: { min: 0, max: 100 },
      isLowWhenBelow: 0,
      isInverted: true,
      description: '学术压力和心理负担',
    },
    health: {
      key: 'health',
      label: '健康',
      icon: '❤️',
      color: '#e74c3c',
      bounds: { min: 0, max: 100 },
      isLowWhenBelow: 30,
      isGameOverAt: 0,
      description: '身体健康状况',
    },
  },

  initialValues: {
    motivation: { min: 60, max: 100 },
    creativity: { min: 50, max: 90 },
    reputation: { min: 0, max: 20 },
    funding: { min: 5, max: 20 },
    stress: { min: 20, max: 50 },
    health: { min: 60, max: 100 },
  },

  maxEffectValue: {
    motivation: 20,
    creativity: 20,
    reputation: 15,
    funding: 50,
    stress: 25,
    health: 20,
  },
};

export default metricsConfig;

export type ResearchMetricKey = keyof typeof metricsConfig.definitions;
