import { PromptsConfig, PromptContext } from '../core/types/base';
import { promptsConfig as defaultPromptsConfig } from '../topics/life';

/**
 * Prompt 服务
 * 管理 AI Prompt 配置，支持话题切换
 */
class PromptService {
  private config: PromptsConfig = defaultPromptsConfig;

  /**
   * 设置 Prompt 配置
   */
  setConfig(config: PromptsConfig): void {
    this.config = config;
  }

  /**
   * 获取当前 Prompt 配置
   */
  getConfig(): PromptsConfig {
    return this.config;
  }

  /**
   * 获取系统提示词
   */
  getSystemPrompt(): string {
    return this.config.systemPrompt;
  }

  /**
   * 构建事件 Prompt
   */
  buildEventPrompt(context: PromptContext): string {
    return this.config.eventPromptTemplate(context);
  }

  /**
   * 构建后果 Prompt
   */
  buildConsequencePrompt(context: PromptContext): string {
    return this.config.consequencePromptTemplate(context);
  }

  /**
   * 获取自定义 Prompt
   */
  getCustomPrompt(key: string, context: PromptContext): string | undefined {
    if (this.config.custom && this.config.custom[key]) {
      return this.config.custom[key](context);
    }
    return undefined;
  }
}

// 导出单例
export const promptService = new PromptService();

export default promptService;
