import { PromptsConfig, PromptContext } from '../../core/types/base';
import { getStageNames } from './stages.config';

/**
 * 构建学者状态描述
 */
function buildResearcherStatusDescription(context: PromptContext): string {
  const { player } = context;
  const stageNames = getStageNames();

  const attributes = player.attributes as Record<string, number> || {};
  const motivation = attributes.motivation ?? 50;
  const creativity = attributes.creativity ?? 50;
  const reputation = attributes.reputation ?? 0;
  const funding = attributes.funding ?? 0;
  const stress = attributes.stress ?? 30;
  const health = attributes.health ?? 80;

  const stage = player.stage as string || 'phd';
  const stageDisplay = stageNames[stage] || stage;

  // 安全访问 career
  const careerName = player.career && typeof player.career === 'object' && 'name' in player.career
    ? (player.career as { name?: string }).name || '学生'
    : '学生';

  return `## 学者当前状态
- **姓名**: ${player.name || '未知'}
- **学术年限**: 第 ${player.age ?? 0} 年
- **学术阶段**: ${stageDisplay}
- **学术热情**: ${motivation}/100 ${motivation < 30 ? '(热情消退)' : motivation > 80 ? '(热情满满)' : ''}
- **创造力**: ${creativity}/100 ${creativity < 30 ? '(灵感枯竭)' : creativity > 80 ? '(灵感迸发)' : ''}
- **学术声誉**: ${reputation}/100 ${reputation < 20 ? '(默默无闻)' : reputation > 60 ? '(小有名气)' : ''}
- **科研经费**: ${funding}万元 ${funding < 5 ? '(经费紧张)' : funding > 50 ? '(经费充足)' : ''}
- **压力值**: ${stress}/100 ${stress > 70 ? '(压力山大)' : stress < 30 ? '(压力适中)' : ''}
- **健康值**: ${health}/100 ${health < 30 ? '(身体堪忧)' : health > 80 ? '(精力充沛)' : ''}
- **职业**: ${careerName}`;
}

/**
 * 生成事件 Prompt 模板
 */
function buildEventPromptTemplate(context: PromptContext): string {
  const { eventType, availableTypes, cooldownInfo } = context;
  const playerStatus = buildResearcherStatusDescription(context);

  const typeDescriptions: Record<string, string> = {
    opportunity: '机遇事件（有利的学术机会）',
    challenge: '挑战事件（需要克服的学术困难）',
    daily: '日常事件（学术生活场景）',
    special: '特殊事件（重要的学术里程碑）',
    stage: '阶段事件（学术生涯转折点）',
  };

  let eventTypeDesc = `## 事件类型要求
**重要约束**：`;

  if (availableTypes && Array.isArray(availableTypes) && availableTypes.length > 0) {
    eventTypeDesc += `
- 本次事件类型必须是以下之一：${(availableTypes as string[]).join('/')}`;
  }

  if (cooldownInfo) {
    eventTypeDesc += `
- 其他类型处于冷却中，不能生成${cooldownInfo}`;
  }

  eventTypeDesc += '\n\n';

  if (eventType) {
    eventTypeDesc += `- 指定类型: ${typeDescriptions[eventType as string] || eventType}`;
  } else {
    eventTypeDesc += `- 类型: 从可用类型中选择一个合适的类型`;
  }

  return `你是一个专业的学术模拟游戏AI事件生成器。请根据学者的当前状态，生成一个真实、有趣、有代入感的学术事件。

${playerStatus}

${eventTypeDesc}

## 生成要求
1. **阶段关联性**:
   - 事件必须与学者的**学术阶段**高度相关
   - 博士阶段：论文写作、导师指导、学术会议、毕业答辩等
   - 博后阶段：独立研究、项目申请、合作交流等
   - 助理教授：教学任务、科研启动、学生指导等
   - 副教授：晋升考核、团队建设、学术服务等
   - 正教授：学术领导、学科建设、培养学生等

2. **属性关联性**:
   - **热情低**（<30）：重新找回研究动力的事件
   - **创造力高**（>80）：创新性研究机会
   - **声誉高**（>60）：学术邀请、评审机会
   - **压力大**（>70）：需要减压或调整的事件
   - **经费少**（<5）：申请经费的机会或挑战
   - **健康差**（<30）：健康相关事件

3. **真实性**: 事件要符合学术圈的实际情况，包含真实的学术场景

4. **故事性**: 事件描述要生动有趣，至少100字

5. **选择多样性**: 提供2-4个选择，每个选择有不同的后果

## 输出格式
请严格按照以下 JSON 格式返回：

{
  "title": "事件标题",
  "description": "详细的事件描述（至少100字）",
  "type": "${eventType || 'daily'}",
  "choices": [
    {
      "text": "选择1的文本",
      "effects": {
        "motivation": 数值（-20到+20）,
        "creativity": 数值（-20到+20）,
        "reputation": 数值（-15到+15）,
        "funding": 数值（-20到+50）,
        "stress": 数值（-25到+25）,
        "health": 数值（-20到+20）
      }
    }
  ]
}`;
}

/**
 * 生成后果 Prompt 模板
 */
function buildConsequencePromptTemplate(context: PromptContext): string {
  const { player, event, choice } = context;
  const stageNames = getStageNames();

  const attributes = player.attributes as Record<string, number> || {};
  const stage = player.stage as string || 'phd';
  const eventData = event as { title?: string; description?: string; type?: string };
  const choiceData = choice as { text?: string };

  return `你是一个学术模拟游戏的AI助手。玩家做出了选择，需要生成后果。

## 事件信息
- **事件标题**: ${eventData.title || '未知事件'}
- **选择的选项**: ${choiceData.text || '未知选择'}

## 学者当前状态
- **学术阶段**: ${stageNames[stage] || stage}
- **学术热情**: ${attributes.motivation ?? 50}/100
- **创造力**: ${attributes.creativity ?? 50}/100
- **学术声誉**: ${attributes.reputation ?? 0}/100

## 输出格式
{
  "description": "后果描述（50-100字）",
  "effects": [
    {
      "type": "attribute",
      "attribute": "motivation|creativity|reputation|funding|stress|health",
      "value": 数值（-20到+20）
    }
  ]
}`;
}

/**
 * 科研模拟器 - Prompt 配置
 */
export const promptsConfig: PromptsConfig = {
  systemPrompt: '你是一个专业的学术模拟游戏AI助手，负责生成真实、有趣的学术事件和后果。你的回复必须是有效的JSON格式。',

  eventPromptTemplate: buildEventPromptTemplate,
  consequencePromptTemplate: buildConsequencePromptTemplate,
};

export default promptsConfig;
