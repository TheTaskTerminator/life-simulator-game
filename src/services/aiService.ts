import { getAIConfig, validateAIConfig } from '../config/aiConfig';
import { getPromptConfig } from '../config/aiConfigLoader';
import { Player, Event, EventType, Choice, EventEffect } from '../types';
import { AIEventSchema, AIConsequenceSchema } from '../schemas';
import { eventSelector } from '../engine/eventSelector';
import { promptService } from './promptService';
import { PromptContext } from '../core/types/base';
import { metricsConfig } from '../topics/life/metrics.config';
import { textsConfig } from '../topics/life/texts.config';

/**
 * AI 服务
 * 用于生成人生事件
 * 支持动态切换模型配置
 */
export class AIService {
  /**
   * 获取当前配置（每次调用时重新读取，支持动态切换）
   */
  private getConfig() {
    return getAIConfig();
  }

  /**
   * 生成 AI 事件
   * 注意：缓存逻辑在 eventService 中处理，这里只负责生成
   */
  async generateEvent(
    player: Player,
    eventType?: EventType
  ): Promise<Event> {
    if (!validateAIConfig()) {
      throw new Error('AI 配置无效，请检查环境变量');
    }

    const prompt = this.buildEventPrompt(player, eventType);
    const response = await this.callAI(prompt);
    return this.parseAIResponse(response, player, eventType);
  }

  /**
   * 生成选择后的后果
   * 根据玩家的选择和当前状态，生成可能的好或坏的后果
   * 返回完整的效果列表，由AI决定所有属性变化
   */
  async generateChoiceConsequence(
    player: Player,
    event: Event,
    choice: Choice
  ): Promise<{ description: string; effects: EventEffect[] }> {
    if (!validateAIConfig()) {
      // 如果 AI 配置无效，返回默认后果
      return {
        description: '你的选择产生了影响...',
        effects: [],
      };
    }

    const prompt = this.buildConsequencePrompt(player, event, choice);
    const response = await this.callAI(prompt);
    return this.parseConsequenceResponse(response, player);
  }

  /**
   * 获取当前使用的模型信息
   */
  getCurrentModelInfo() {
    const config = this.getConfig();
    return {
      model: config.model,
      provider: config.provider,
      modelId: config.modelId,
      temperature: config.temperature,
      maxTokens: config.maxTokens,
    };
  }

  /**
   * 构建事件提示词
   * 使用配置化的 Prompt 模板
   */
  private buildEventPrompt(player: Player, eventType?: EventType): string {
    // 获取可用标签
    const availableTags = eventSelector.getAvailableTags(player);
    const cooldownTags = eventSelector.getCooldownTags(player);

    // 确定可用的事件类型
    const availableTypes = eventType
      ? [eventType]
      : availableTags.length > 0
        ? availableTags
        : [EventType.DAILY];

    // 冷却信息
    const cooldownInfo = cooldownTags.length > 0
      ? `\n- 以下类型处于冷却中：${cooldownTags.map(t => `${t.tag}(${t.remaining}回合)`).join('、')}`
      : '';

    // 构建 Prompt 上下文
    const context: PromptContext = {
      player: player as unknown as Record<string, unknown>,
      stage: player.stage,
      eventType,
      availableTypes,
      cooldownInfo,
      metrics: metricsConfig,
      texts: textsConfig,
    };

    return promptService.buildEventPrompt(context);
  }

  /**
   * 调用 AI API
   */
  private async callAI(prompt: string): Promise<string> {
    const config = this.getConfig();
    
    const response = await fetch(config.apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${config.apiKey}`,
      },
      body: JSON.stringify({
        model: config.model,
        messages: [
          {
            role: 'system',
            content: getPromptConfig().systemMessage,
          },
          {
            role: 'user',
            content: prompt,
          },
        ],
        temperature: config.temperature ?? getPromptConfig().temperature,
        max_tokens: config.maxTokens ?? getPromptConfig().maxTokens,
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`AI API 请求失败: ${response.status} ${error}`);
    }

    const data = await response.json();
    return data.choices[0]?.message?.content || '';
  }

  /**
   * 解析 AI 响应
   * 使用 zod 进行 Schema 校验
   */
  private parseAIResponse(
    response: string,
    player: Player,
    eventType?: EventType
  ): Event {
    try {
      // 尝试提取 JSON（AI 可能返回带 markdown 代码块的 JSON）
      let jsonStr = response.trim();
      if (jsonStr.startsWith('```json')) {
        jsonStr = jsonStr.replace(/```json\n?/g, '').replace(/```\n?/g, '');
      } else if (jsonStr.startsWith('```')) {
        jsonStr = jsonStr.replace(/```\n?/g, '');
      }

      const parsed = JSON.parse(jsonStr);

      // 使用 zod 校验
      const validationResult = AIEventSchema.safeParse(parsed);

      if (!validationResult.success) {
        console.warn('AI 响应校验失败:', validationResult.error.issues);
        // 尝试修复常见问题后继续
      }

      // 转换为 Event 格式
      const event: Event = {
        id: `event-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        type: (eventType || parsed.type || 'daily') as EventType,
        title: parsed.title || '未知事件',
        description: parsed.description || '',
        choices: (parsed.choices || []).map((choice: any, index: number) => ({
          id: `choice-${index}`,
          text: choice.text || `选择 ${index + 1}`,
          effects: Object.entries(choice.effects || {}).map(([key, value]) => ({
            type: 'attribute' as const,
            attribute: key as keyof typeof player.attributes,
            // 数值会被 attributeUtils.applyEventEffects 再次 clamp
            value: Number(value) || 0,
          })),
        })),
        aiGenerated: true,
      };

      return event;
    } catch (error) {
      console.error('解析 AI 响应失败:', error);
      console.error('原始响应:', response);
      // 返回默认事件
      return this.getFallbackEvent(player, eventType);
    }
  }

  /**
   * 构建后果提示词
   * 使用配置化的 Prompt 模板
   */
  private buildConsequencePrompt(player: Player, event: Event, choice: Choice): string {
    // 构建 Prompt 上下文
    const context: PromptContext = {
      player: player as unknown as Record<string, unknown>,
      stage: player.stage,
      event: event as unknown as Record<string, unknown>,
      choice: choice as unknown as Record<string, unknown>,
      metrics: metricsConfig,
      texts: textsConfig,
    };

    return promptService.buildConsequencePrompt(context);
  }

  /**
   * 解析后果响应
   * 使用 zod 进行 Schema 校验
   */
  private parseConsequenceResponse(
    response: string,
    player: Player
  ): { description: string; effects: EventEffect[] } {
    try {
      // 尝试提取 JSON
      let jsonStr = response.trim();
      if (jsonStr.startsWith('```json')) {
        jsonStr = jsonStr.replace(/```json\n?/g, '').replace(/```\n?/g, '');
      } else if (jsonStr.startsWith('```')) {
        jsonStr = jsonStr.replace(/```\n?/g, '');
      }

      const parsed = JSON.parse(jsonStr);

      // 使用 zod 校验
      const validationResult = AIConsequenceSchema.safeParse(parsed);

      if (!validationResult.success) {
        console.warn('后果响应校验失败:', validationResult.error.issues);
        // 继续处理，但记录警告
      }

      // 解析效果（支持新格式effects和旧格式additionalEffects以保持兼容）
      const effects: EventEffect[] = [];
      const effectsArray = parsed.effects || parsed.additionalEffects || [];

      if (Array.isArray(effectsArray)) {
        effectsArray.forEach((effect: any) => {
          if (effect.type === 'attribute' && effect.attribute) {
            effects.push({
              type: 'attribute',
              attribute: effect.attribute as keyof typeof player.attributes,
              value: Number(effect.value) || 0,
            });
          } else if (effect.type === 'wealth') {
            effects.push({
              type: 'wealth',
              value: Number(effect.value) || 0,
            });
          }
        });
      }

      return {
        description: parsed.description || '你的选择产生了影响...',
        effects: effects.length > 0 ? effects : [],
      };
    } catch (error) {
      console.error('解析后果响应失败:', error);
      console.error('原始响应:', response);
      // 返回默认后果
      return {
        description: '你的选择产生了影响，时间会证明这个决定的价值。',
        effects: [],
      };
    }
  }

  /**
   * 获取降级事件（当 AI 生成失败时）
   */
  private getFallbackEvent(_player: Player, eventType?: EventType): Event {
    const fallbackEvents: Record<string, Event> = {
      opportunity: {
        id: `event-fallback-${Date.now()}`,
        type: EventType.OPPORTUNITY,
        title: '意外的机会',
        description: '你遇到了一个不错的机会，虽然不确定结果如何，但值得尝试。',
        choices: [
          {
            id: 'choice-1',
            text: '抓住这个机会',
            effects: [
              { type: 'attribute', attribute: 'happiness', value: 5 },
              { type: 'attribute', attribute: 'stress', value: 3 },
            ],
          },
          {
            id: 'choice-2',
            text: '谨慎考虑',
            effects: [
              { type: 'attribute', attribute: 'stress', value: -2 },
            ],
          },
        ],
        aiGenerated: false,
      },
    };

    return (
      fallbackEvents[eventType || 'opportunity'] ||
      fallbackEvents.opportunity
    );
  }
}

// 导出单例
export const aiService = new AIService();

