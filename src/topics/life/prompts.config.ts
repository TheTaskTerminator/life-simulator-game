import { PromptsConfig, PromptContext } from '../../core/types/base';
import { getStageNames } from './stages.config';
import { educationLevelTexts, maritalStatusTexts } from './texts.config';

/**
 * 构建玩家状态描述
 */
function buildPlayerStatusDescription(context: PromptContext): string {
  const { player } = context;
  const stageNames = getStageNames();

  // 安全获取属性
  const attributes = player.attributes as Record<string, number> || {};
  const health = attributes.health ?? 50;
  const intelligence = attributes.intelligence ?? 50;
  const charm = attributes.charm ?? 50;
  const wealth = attributes.wealth ?? 0;
  const happiness = attributes.happiness ?? 50;
  const stress = attributes.stress ?? 0;

  // 状态标签
  const healthStatus = health < 30 ? '(健康堪忧)' : health > 80 ? '(非常健康)' : '';
  const intelligenceStatus = intelligence < 30 ? '(智力较低)' : intelligence > 80 ? '(智力超群)' : '';
  const charmStatus = charm < 30 ? '(魅力不足)' : charm > 80 ? '(魅力出众)' : '';
  const happinessStatus = happiness < 30 ? '(心情低落)' : happiness > 80 ? '(非常快乐)' : '';
  const stressStatus = stress > 70 ? '(压力很大)' : stress < 20 ? '(压力很小)' : '';

  // 财富格式化
  const wealthDisplay = wealth >= 10000 ? `${(wealth / 10000).toFixed(1)}万` : wealth;

  // 教育水平
  const education = player.education as string || 'none';
  const educationDisplay = educationLevelTexts[education] || education;

  // 婚姻状态
  const maritalStatus = player.maritalStatus as string || 'single';
  const maritalDisplay = maritalStatusTexts[maritalStatus] || maritalStatus;

  // 阶段
  const stage = player.stage as string || 'childhood';
  const stageDisplay = stageNames[stage] || stage;

  let status = `## 玩家当前状态
- **姓名**: ${player.name || '未知'}
- **年龄**: ${player.age ?? 0}岁
- **人生阶段**: ${stageDisplay}
- **健康值**: ${health}/100 ${healthStatus}
- **智力值**: ${intelligence}/100 ${intelligenceStatus}
- **魅力值**: ${charm}/100 ${charmStatus}
- **财富值**: ${wealthDisplay}元
- **幸福度**: ${happiness}/100 ${happinessStatus}
- **压力值**: ${stress}/100 ${stressStatus}
- **教育水平**: ${educationDisplay}
- **职业**: ${player.career && typeof player.career === 'object' && 'name' in player.career ? (player.career as { name?: string }).name || '无业' : '无业'}
- **婚姻状况**: ${maritalDisplay}`;

  // 伴侣信息
  if (player.partner) {
    const partner = player.partner as { name?: string };
    status += `\n- **伴侣**: ${partner.name || '未知'}`;
  }

  // 子女信息
  const children = player.children as unknown[];
  if (children && children.length > 0) {
    status += `\n- **子女数量**: ${children.length}个`;
  }

  return status;
}

/**
 * 构建事件类型描述
 */
function buildEventTypeDescription(eventType?: string, availableTypes?: string[], cooldownInfo?: string): string {
  const typeDescriptions: Record<string, string> = {
    opportunity: '机遇事件（积极正面，可能带来收益）',
    challenge: '挑战事件（需要应对困难）',
    daily: '日常事件（普通生活场景）',
    special: '特殊事件（罕见且重要）',
    stage: '阶段事件（人生重要节点）',
  };

  let description = `## 事件类型要求
**重要约束**：`;

  if (availableTypes && availableTypes.length > 0) {
    description += `
- 本次事件类型必须是以下之一：${availableTypes.join('/')}`;
  }

  if (cooldownInfo) {
    description += `
- 其他类型处于冷却中，不能生成${cooldownInfo}`;
  }

  description += '\n\n';

  if (eventType) {
    description += `- 指定类型: ${typeDescriptions[eventType] || eventType}`;
  } else {
    description += `- 类型: 从可用类型中选择一个合适的类型`;
  }

  return description;
}

/**
 * 生成事件 Prompt 模板
 */
function buildEventPromptTemplate(context: PromptContext): string {
  const { player, eventType, availableTypes, cooldownInfo } = context;

  const playerStatus = buildPlayerStatusDescription(context);
  const eventTypeDesc = buildEventTypeDescription(
    eventType as string,
    availableTypes as string[],
    cooldownInfo as string
  );

  const age = player.age ?? 0;

  // 年龄信息可以用于更精确的事件生成
  void age; // 暂时标记为已使用

  return `你是一个专业的人生模拟游戏AI事件生成器。请根据玩家的当前状态，生成一个真实、有趣、有代入感的人生事件。

${playerStatus}

${eventTypeDesc}

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
 * 生成后果 Prompt 模板
 */
function buildConsequencePromptTemplate(context: PromptContext): string {
  const { player, event, choice } = context;
  const stageNames = getStageNames();

  // 安全获取
  const attributes = player.attributes as Record<string, number> || {};
  const health = attributes.health ?? 50;
  const intelligence = attributes.intelligence ?? 50;
  const charm = attributes.charm ?? 50;
  const wealth = attributes.wealth ?? 0;
  const happiness = attributes.happiness ?? 50;
  const stress = attributes.stress ?? 0;
  const stage = player.stage as string || 'childhood';
  const wealthDisplay = wealth >= 10000 ? `${(wealth / 10000).toFixed(1)}万` : wealth;

  // 构建效果描述
  const effectDescriptions: string[] = [];
  const choiceEffects = (choice as { effects?: Array<{ type?: string; attribute?: string; value?: number }> }).effects || [];
  choiceEffects.forEach((effect) => {
    if (effect.type === 'attribute' && effect.attribute) {
      const attrNames: Record<string, string> = {
        health: '健康',
        intelligence: '智力',
        charm: '魅力',
        happiness: '幸福度',
        stress: '压力',
      };
      const attrName = attrNames[effect.attribute] || effect.attribute;
      const change = (effect.value ?? 0) > 0 ? `+${effect.value}` : `${effect.value}`;
      effectDescriptions.push(`${attrName}${change}`);
    } else if (effect.type === 'wealth') {
      const change = (effect.value ?? 0) > 0 ? `+${effect.value}` : `${effect.value}`;
      effectDescriptions.push(`财富${change}元`);
    }
  });

  const eventData = event as { title?: string; description?: string; type?: string };
  const choiceData = choice as { text?: string };

  // 确保 career 安全访问
  const careerName = player.career && typeof player.career === 'object' && 'name' in player.career
    ? (player.career as { name?: string }).name
    : '无业';

  return `你是一个人生模拟游戏的AI助手。玩家刚刚做出了一个选择，现在需要生成这个选择带来的完整后果和所有属性变化。

## 事件信息
- **事件标题**: ${eventData.title || '未知事件'}
- **事件描述**: ${eventData.description || ''}
- **事件类型**: ${eventData.type || 'daily'}

## 玩家选择
- **选择的选项**: ${choiceData.text || '未知选择'}
- **参考效果**（仅供参考，你需要根据实际情况决定最终效果）: ${effectDescriptions.join('，') || '无明显变化'}

## 玩家当前状态
- **姓名**: ${player.name || '未知'}
- **年龄**: ${player.age ?? 0}岁
- **人生阶段**: ${stageNames[stage] || stage}
- **健康**: ${health}/100
- **智力**: ${intelligence}/100
- **魅力**: ${charm}/100
- **财富**: ${wealthDisplay}元
- **幸福度**: ${happiness}/100
- **压力**: ${stress}/100
- **职业**: ${careerName}

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
 * 人生模拟器 - Prompt 配置
 */
export const promptsConfig: PromptsConfig = {
  systemPrompt: '你是一个专业的人生模拟游戏AI助手，负责生成真实、有趣、有代入感的人生事件和后果。你的回复必须是有效的JSON格式。',

  eventPromptTemplate: buildEventPromptTemplate,
  consequencePromptTemplate: buildConsequencePromptTemplate,
};

export default promptsConfig;
