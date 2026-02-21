import { MetricsConfig } from '../../core/types/base';

/**
 * 人生模拟器 - 属性配置
 */
export const metricsConfig: MetricsConfig = {
  definitions: {
    health: {
      key: 'health',
      label: '健康',
      icon: '❤️',
      color: '#e74c3c',
      bounds: { min: 0, max: 100 },
      isLowWhenBelow: 30,
      isGameOverAt: 0,
      description: '身体健康状况，降到0意味着生命终结',
    },
    intelligence: {
      key: 'intelligence',
      label: '智力',
      icon: '🧠',
      color: '#3498db',
      bounds: { min: 0, max: 100 },
      isLowWhenBelow: 30,
      description: '学习能力与知识水平',
    },
    charm: {
      key: 'charm',
      label: '魅力',
      icon: '✨',
      color: '#9b59b6',
      bounds: { min: 0, max: 100 },
      isLowWhenBelow: 30,
      description: '人际交往能力和吸引力',
    },
    wealth: {
      key: 'wealth',
      label: '财富',
      icon: '💰',
      color: '#f1c40f',
      bounds: { min: 0, max: Infinity },
      description: '拥有的金钱数量',
    },
    happiness: {
      key: 'happiness',
      label: '幸福',
      icon: '😊',
      color: '#2ecc71',
      bounds: { min: 0, max: 100 },
      isLowWhenBelow: 30,
      description: '生活满意度和快乐程度',
    },
    stress: {
      key: 'stress',
      label: '压力',
      icon: '😰',
      color: '#e67e22',
      bounds: { min: 0, max: 100 },
      isLowWhenBelow: 0,
      isInverted: true,
      description: '心理压力水平，越高越不利',
    },
  },

  initialValues: {
    health: { min: 50, max: 100 },
    intelligence: { min: 30, max: 80 },
    charm: { min: 30, max: 80 },
    wealth: { min: 0, max: 10000 },
    happiness: { min: 50, max: 100 },
    stress: { min: 0, max: 30 },
  },

  maxEffectValue: {
    health: 30,
    intelligence: 30,
    charm: 30,
    happiness: 30,
    stress: 30,
    wealth: 5000,
  },
};

export default metricsConfig;

/**
 * 属性键类型
 * 用于类型安全地引用属性
 */
export type LifeMetricKey = keyof typeof metricsConfig.definitions;
