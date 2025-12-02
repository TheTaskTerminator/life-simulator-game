import { getAIConfig, validateAIConfig } from '../config/aiConfig';
import { getPromptConfig } from '../config/aiConfigLoader';
import { Player, Event, EventType, Choice, EventEffect } from '../types';

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
   */
  private buildEventPrompt(player: Player, eventType?: EventType): string {
    const stageNames: Record<string, string> = {
      childhood: '童年期（0-6岁）',
      student: '学生期（7-18岁）',
      young_adult: '青年期（19-25岁）',
      adult: '成年期（26-40岁）',
      middle_age: '中年期（41-60岁）',
      elderly: '老年期（61+岁）',
    };

    const educationNames: Record<string, string> = {
      primary: '小学',
      middle: '初中',
      high: '高中',
      bachelor: '大学',
      master: '研究生',
      doctor: '博士',
    };

    const maritalStatusNames: Record<string, string> = {
      single: '单身',
      dating: '恋爱中',
      married: '已婚',
      divorced: '离异',
      widowed: '丧偶',
    };

    return `你是一个专业的人生模拟游戏AI事件生成器。请根据玩家的当前状态，生成一个真实、有趣、有代入感的人生事件。

## 玩家当前状态
- **姓名**: ${player.name}
- **年龄**: ${player.age}岁
- **人生阶段**: ${stageNames[player.stage] || player.stage}
- **健康值**: ${player.attributes.health}/100 ${player.attributes.health < 30 ? '(健康堪忧)' : player.attributes.health > 80 ? '(非常健康)' : ''}
- **智力值**: ${player.attributes.intelligence}/100 ${player.attributes.intelligence < 30 ? '(智力较低)' : player.attributes.intelligence > 80 ? '(智力超群)' : ''}
- **魅力值**: ${player.attributes.charm}/100 ${player.attributes.charm < 30 ? '(魅力不足)' : player.attributes.charm > 80 ? '(魅力出众)' : ''}
- **财富值**: ${player.attributes.wealth >= 10000 ? `${(player.attributes.wealth / 10000).toFixed(1)}万` : player.attributes.wealth}元
- **幸福度**: ${player.attributes.happiness}/100 ${player.attributes.happiness < 30 ? '(心情低落)' : player.attributes.happiness > 80 ? '(非常快乐)' : ''}
- **压力值**: ${player.attributes.stress}/100 ${player.attributes.stress > 70 ? '(压力很大)' : player.attributes.stress < 20 ? '(压力很小)' : ''}
- **教育水平**: ${educationNames[player.education] || player.education}
- **职业**: ${player.career?.name || '无业'}
- **婚姻状况**: ${maritalStatusNames[player.maritalStatus] || player.maritalStatus}
${player.partner ? `- **伴侣**: ${player.partner.name}` : ''}
${player.children.length > 0 ? `- **子女数量**: ${player.children.length}个` : ''}

## 事件类型要求
${eventType ? `- 指定类型: ${eventType === 'opportunity' ? '机遇事件（积极正面，可能带来收益）' : eventType === 'challenge' ? '挑战事件（需要应对困难）' : eventType === 'daily' ? '日常事件（普通生活场景）' : eventType === 'special' ? '特殊事件（罕见且重要）' : eventType === 'stage' ? '阶段事件（人生重要节点）' : eventType}` : '- 类型: 随机（根据玩家状态选择合适的类型）'}

## 生成要求
1. **年龄关联性**: 
   - 事件必须与玩家的**精确年龄**高度相关
   - 0-6岁：童年事件（学走路、上幼儿园、交朋友等）
   - 7-18岁：学生时代（考试、校园生活、青春期等）
   - 19-25岁：青年期（找工作、恋爱、独立生活等）
   - 26-40岁：成年期（事业发展、结婚生子、买房等）
   - 41-60岁：中年期（事业巅峰、子女教育、健康关注等）
   - 61+岁：老年期（退休、健康管理、含饴弄孙等）
   - **每次生成的事件必须反映当前年龄段的典型生活场景**

2. **属性关联性**:
   - **健康值低**（<30）：健康相关事件（生病、体检、运动等）
   - **智力值高**（>80）：智力相关事件（学术机会、创新项目等）
   - **魅力值高**（>80）：社交相关事件（聚会、约会、社交活动等）
   - **幸福度低**（<30）：改善心情的事件（旅行、爱好、朋友聚会等）
   - **压力值高**（>70）：减压相关事件（休息、度假、心理咨询等）
   - **财富值高**（>50000）：投资、消费相关事件
   - **财富值低**（<1000）：省钱、赚钱相关事件
   - **事件内容必须与当前属性状态密切相关**

3. **唯一性**: 
   - 每次生成的事件必须**完全不同**，不能重复之前的事件
   - 即使年龄和属性相同，也要生成不同的事件
   - 可以改变场景、人物、具体情节等

4. **真实性**: 事件必须符合玩家的年龄、阶段、职业、教育背景等实际情况

5. **故事性**: 事件描述要生动有趣，至少150字，有具体场景和细节

6. **选择多样性**: 提供2-4个选择，每个选择要有不同的后果和影响

7. **影响合理性**: 
   - 每个选择对属性的影响范围：-20 到 +20
   - 正面选择通常增加幸福度、健康等，但可能增加压力或减少财富
   - 负面选择可能增加压力、减少健康，但可能获得财富或其他收益
   - 高风险高回报的选择应该体现明显的权衡

8. **逻辑性**: 选择的影响必须符合常理，例如：
   - 努力工作 → 可能增加财富和压力，减少健康
   - 休息放松 → 增加健康和幸福度，减少压力
   - 学习进修 → 增加智力，可能增加压力，减少财富
   - 社交活动 → 增加魅力和幸福度，可能增加压力

## 输出格式
请严格按照以下 JSON 格式返回（只返回 JSON，不要其他内容）：

{
  "title": "事件标题（10-20字，吸引人）",
  "description": "详细的事件描述（至少150字，包含具体场景、人物、对话等细节，让玩家有代入感）",
  "type": "${eventType || 'daily'}",
  "choices": [
    {
      "text": "选择1的文本（10-30字，清晰明确）",
      "effects": {
        "health": 数值（-20到+20，整数）,
        "intelligence": 数值（-20到+20，整数）,
        "charm": 数值（-20到+20，整数）,
        "wealth": 数值（-5000到+5000，整数，根据玩家财富水平调整）,
        "happiness": 数值（-20到+20，整数）,
        "stress": 数值（-20到+20，整数）
      }
    },
    {
      "text": "选择2的文本",
      "effects": {
        "health": 数值,
        "intelligence": 数值,
        "charm": 数值,
        "wealth": 数值,
        "happiness": 数值,
        "stress": 数值
      }
    }
  ]
}

## 注意事项
- 所有数值必须是整数
- effects 中每个属性都要有值，即使为0也要写出来
- 描述要具体生动，避免空洞的叙述
- 选择要有明显的区别和不同的后果
- 确保事件符合玩家的当前状态和人生阶段`;
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
   */
  private buildConsequencePrompt(player: Player, event: Event, choice: Choice): string {
    const stageNames: Record<string, string> = {
      childhood: '童年期（0-6岁）',
      student: '学生期（7-18岁）',
      young_adult: '青年期（19-25岁）',
      adult: '成年期（26-40岁）',
      middle_age: '中年期（41-60岁）',
      elderly: '老年期（61+岁）',
    };

    const effectDescriptions: string[] = [];
    choice.effects.forEach((effect) => {
      if (effect.type === 'attribute' && effect.attribute) {
        const attrNames: Record<string, string> = {
          health: '健康',
          intelligence: '智力',
          charm: '魅力',
          happiness: '幸福度',
          stress: '压力',
        };
        const attrName = attrNames[effect.attribute] || effect.attribute;
        const change = effect.value > 0 ? `+${effect.value}` : `${effect.value}`;
        effectDescriptions.push(`${attrName}${change}`);
      } else if (effect.type === 'wealth') {
        const change = effect.value > 0 ? `+${effect.value}` : `${effect.value}`;
        effectDescriptions.push(`财富${change}元`);
      }
    });

    return `你是一个人生模拟游戏的AI助手。玩家刚刚做出了一个选择，现在需要生成这个选择带来的完整后果和所有属性变化。

## 事件信息
- **事件标题**: ${event.title}
- **事件描述**: ${event.description}
- **事件类型**: ${event.type}

## 玩家选择
- **选择的选项**: ${choice.text}
- **参考效果**（仅供参考，你需要根据实际情况决定最终效果）: ${effectDescriptions.join('，') || '无明显变化'}

## 玩家当前状态
- **姓名**: ${player.name}
- **年龄**: ${player.age}岁
- **人生阶段**: ${stageNames[player.stage] || player.stage}
- **健康**: ${player.attributes.health}/100
- **智力**: ${player.attributes.intelligence}/100
- **魅力**: ${player.attributes.charm}/100
- **财富**: ${player.attributes.wealth >= 10000 ? `${(player.attributes.wealth / 10000).toFixed(1)}万` : player.attributes.wealth}元
- **幸福度**: ${player.attributes.happiness}/100
- **压力**: ${player.attributes.stress}/100
- **职业**: ${player.career?.name || '无业'}

## 任务要求
根据玩家的选择和当前状态，生成一个**真实、有趣、有戏剧性**的后果描述，并决定**所有属性变化**。

这个后果可以是：
1. **好的后果**：选择带来了意外的惊喜或额外的收益
2. **坏的后果**：选择带来了意外的困难或额外的损失
3. **中性后果**：选择产生了连锁反应，有得有失

## 后果要求
1. **描述长度**: 80-150字，生动具体，有故事性
2. **真实性**: 符合玩家的年龄、阶段、职业等实际情况
3. **戏剧性**: 可以有好有坏，增加游戏的趣味性
4. **效果决定**: 你需要决定这个选择对玩家属性的影响
   - 通常只影响1个主要属性，偶尔可以影响2个相关属性（例如：健康+幸福度，压力+健康等）
   - 效果范围：-20 到 +20（属性），-5000 到 +5000（财富）
   - 必须包含1-2个属性变化，不能为空
   - 效果要符合选择的逻辑和后果描述
   - 优先选择最符合选择逻辑的单个属性

## 输出格式
请严格按照以下 JSON 格式返回（只返回 JSON，不要其他内容）：

{
  "description": "后果描述（80-150字，具体生动，描述发生了什么，为什么发生，产生了什么影响）",
  "effects": [
    {
      "type": "attribute",
      "attribute": "health|intelligence|charm|happiness|stress",
      "value": 数值（-20到+20，整数）
    },
    {
      "type": "wealth",
      "value": 数值（-5000到+5000，整数，可选）
    }
  ]
}

## 注意事项
- 后果要符合逻辑，不能太离谱
- 效果要合理，不能过于极端
- 描述要有代入感，让玩家感受到选择的后果
- 可以有一些意外和惊喜，增加游戏趣味性
- **重要**：effects数组必须包含至少1个效果，不能为空`;
  }

  /**
   * 解析后果响应
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

