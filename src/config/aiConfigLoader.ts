/**
 * AI 配置加载器
 * 从配置文件加载 AI 配置，方便运维人员调整
 * 
 * 配置文件位置: config/ai.json
 * 修改配置文件后重新部署即可生效，无需修改代码
 */

export interface AIModelConfig {
  id: string;
  name: string;
  provider: 'siliconflow' | 'openai' | 'custom';
  model: string;
  apiUrl: string;
  description: string;
  temperature?: number;
  maxTokens?: number;
  enabled: boolean;
}

export interface AIConfigFile {
  version: string;
  description: string;
  defaultModel: string;
  defaultProvider: string;
  models: AIModelConfig[];
  prompt: {
    systemMessage: string;
    temperature: number;
    maxTokens: number;
    eventDescriptionMinLength: number;
  };
  fallback: {
    enabled: boolean;
    usePresetEvents: boolean;
  };
}

import { cacheManager } from '../utils/cacheUtils';
import { STORAGE_KEYS, CACHE_CONFIG } from '../constants';

let cachedConfig: AIConfigFile | null = null;

/**
 * 加载 AI 配置文件
 * 使用缓存机制，避免重复加载
 */
export async function loadAIConfig(): Promise<AIConfigFile> {
  // 先尝试从缓存获取
  const cached = cacheManager.get<AIConfigFile>('ai-config', {
    useLocalStorage: true,
    keyPrefix: STORAGE_KEYS.CACHE_PREFIX,
    ttl: CACHE_CONFIG.DATA_TTL,
  });
  if (cached) {
    cachedConfig = cached;
    return cached;
  }

  // 如果内存缓存存在，直接返回
  if (cachedConfig) {
    return cachedConfig;
  }

  try {
    let configData: AIConfigFile | null = null;
    
    // 在开发环境中，直接从文件系统读取
    if (import.meta.env.DEV) {
      try {
        // @ts-ignore - Vite 会处理 JSON 导入
        const configModule = await import('../../config/ai.json');
        configData = configModule.default || configModule;
      } catch (importError) {
        // 如果导入失败，尝试从 public 目录加载
        console.warn('从文件系统导入失败，尝试从 public 目录加载:', importError);
        const response = await fetch('/config/ai.json');
        if (response.ok) {
          configData = await response.json();
        }
      }
    } else {
      // 生产环境中，从 public 目录加载
      const response = await fetch('/config/ai.json');
      if (response.ok) {
        configData = await response.json();
      } else {
        throw new Error(`无法加载配置文件: ${response.status} ${response.statusText}`);
      }
    }
    
    if (!configData) {
      throw new Error('配置文件为空');
    }
    
    cachedConfig = configData;
    
    // 保存到缓存（24小时过期，持久化到 localStorage）
    cacheManager.set('ai-config', configData, {
      ttl: CACHE_CONFIG.DATA_TTL,
      useLocalStorage: true,
      keyPrefix: STORAGE_KEYS.CACHE_PREFIX,
    });
    
    return cachedConfig;
  } catch (error) {
    console.error('加载 AI 配置文件失败:', error);
    // 返回默认配置
    cachedConfig = getDefaultConfig();
    return cachedConfig;
  }
}

/**
 * 获取默认配置
 */
function getDefaultConfig(): AIConfigFile {
  return {
    version: '1.0.0',
    description: '默认 AI 配置',
    defaultModel: 'qwen-72b',
    defaultProvider: 'siliconflow',
    models: [
      {
        id: 'qwen-72b',
        name: 'Qwen 2.5 72B',
        provider: 'siliconflow',
        model: 'Qwen/Qwen2.5-72B-Instruct',
        apiUrl: 'https://api.siliconflow.cn/v1/chat/completions',
        description: '通义千问 72B 模型，性能强大',
        temperature: 0.8,
        maxTokens: 2000,
        enabled: true,
      },
    ],
    prompt: {
      systemMessage: '你是一个专业的人生模拟游戏事件生成器，总是返回有效的 JSON 格式数据。',
      temperature: 0.8,
      maxTokens: 2000,
      eventDescriptionMinLength: 100,
    },
    fallback: {
      enabled: true,
      usePresetEvents: true,
    },
  };
}

/**
 * 获取默认模型配置（同步版本，用于初始化）
 */
export function getDefaultModelConfig(): AIModelConfig | null {
  // 如果配置已缓存，直接返回
  if (cachedConfig) {
    const defaultModel = cachedConfig.models.find(
      (m) => m.id === cachedConfig!.defaultModel && m.enabled
    );
    return defaultModel || cachedConfig.models.find((m) => m.enabled) || null;
  }
  
  // 否则返回默认配置中的模型
  const defaultConfig = getDefaultConfig();
  return defaultConfig.models[0] || null;
}

/**
 * 根据 ID 获取模型配置（同步版本）
 */
export function getModelConfigById(id: string): AIModelConfig | null {
  if (!cachedConfig) {
    return null;
  }
  return cachedConfig.models.find((m) => m.id === id && m.enabled) || null;
}

/**
 * 获取所有启用的模型（同步版本）
 */
export function getEnabledModels(): AIModelConfig[] {
  if (!cachedConfig) {
    return getDefaultConfig().models;
  }
  return cachedConfig.models.filter((m) => m.enabled);
}

/**
 * 获取提示词配置（同步版本）
 */
export function getPromptConfig() {
  if (!cachedConfig) {
    return getDefaultConfig().prompt;
  }
  return cachedConfig.prompt;
}

/**
 * 获取降级配置（同步版本）
 */
export function getFallbackConfig() {
  if (!cachedConfig) {
    return getDefaultConfig().fallback;
  }
  return cachedConfig.fallback;
}

// 初始化时加载配置（异步，不阻塞）
if (typeof window !== 'undefined') {
  loadAIConfig().catch((error) => {
    console.error('初始化 AI 配置失败:', error);
  });
}
