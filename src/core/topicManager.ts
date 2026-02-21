import { TopicPackage } from './types/base';
import { lifeTopicPackage } from '../topics/life';
import { researchTopicPackage } from '../topics/research';

/**
 * 话题注册表
 */
const topicRegistry: Map<string, TopicPackage> = new Map();

// 注册默认话题
topicRegistry.set(lifeTopicPackage.config.id, lifeTopicPackage);

// 注册科研模拟器话题
topicRegistry.set(researchTopicPackage.config.id, researchTopicPackage);

/**
 * 注册话题包
 */
export function registerTopic(topic: TopicPackage): void {
  topicRegistry.set(topic.config.id, topic);
}

/**
 * 获取话题包
 */
export function getTopic(topicId: string): TopicPackage {
  const topic = topicRegistry.get(topicId);
  if (!topic) {
    throw new Error(`Topic not found: ${topicId}`);
  }
  return topic;
}

/**
 * 获取所有已注册的话题 ID
 */
export function getAvailableTopics(): string[] {
  return Array.from(topicRegistry.keys());
}

/**
 * 检查话题是否存在
 */
export function hasTopic(topicId: string): boolean {
  return topicRegistry.has(topicId);
}

/**
 * 获取默认话题
 */
export function getDefaultTopic(): TopicPackage {
  return lifeTopicPackage;
}

export default {
  registerTopic,
  getTopic,
  getAvailableTopics,
  hasTopic,
  getDefaultTopic,
};
