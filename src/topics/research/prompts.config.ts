import { PromptsConfig, PromptContext } from '../../core/types/base';
import { getStageNames, formatYearInSchool } from './stages.config';

/**
 * 构建研究生状态描述
 */
function buildStudentStatusDescription(context: PromptContext): string {
  const { player } = context;
  const stageNames = getStageNames();

  const attributes = player.attributes as Record<string, number> || {};
  const researchAbility = attributes.research_ability ?? 50;
  const academicPassion = attributes.academic_passion ?? 70;
  const advisorFavor = attributes.advisor_favor ?? 50;
  const peerRelation = attributes.peer_relation ?? 60;
  const health = attributes.health ?? 80;
  const finance = attributes.finance ?? 50;
  const pressure = attributes.pressure ?? 30;

  const stage = player.stage as string || 'master_year1';
  const stageDisplay = stageNames[stage] || formatYearInSchool(Number(player.age) || 0, stage.includes('doctor'));

  // 累积指标
  const cumulative = player.cumulative as Record<string, number> || {};
  const credits = cumulative.credits ?? 0;
  const papersSubmitted = cumulative.papers_submitted ?? 0;
  const papersPublished = cumulative.papers_published ?? 0;

  return `## 研究生当前状态
- **姓名**: ${player.name || '未知'}
- **当前阶段**: ${stageDisplay}
- **已修学分**: ${credits}
- **论文**: 已发表${papersPublished}篇 / 在投${papersSubmitted}篇

- **科研能力**: ${researchAbility}/100 ${researchAbility < 30 ? '(基础薄弱)' : researchAbility > 70 ? '(能力突出)' : ''}
- **学术热情**: ${academicPassion}/100 ${academicPassion < 30 ? '(热情消退)' : academicPassion > 80 ? '(热情满满)' : ''}
- **导师好感**: ${advisorFavor}/100 ${advisorFavor < 30 ? '(印象不佳)' : advisorFavor > 70 ? '(颇为赏识)' : ''}
- **同门关系**: ${peerRelation}/100 ${peerRelation < 30 ? '(关系紧张)' : peerRelation > 70 ? '(关系融洽)' : ''}
- **身心健康**: ${health}/100 ${health < 30 ? '(状态不佳)' : health > 80 ? '(状态良好)' : ''}
- **经济状况**: ${finance}/100 ${finance < 30 ? '(手头拮据)' : finance > 70 ? '(宽裕)' : ''}
- **压力值**: ${pressure}/100 ${pressure > 70 ? '(压力山大)' : pressure < 30 ? '(压力较小)' : ''}`;
}

/**
 * 获取学期描述
 */
function getSemesterDescription(weekInSemester: number, semesterType: string): string {
  const semesterNames: Record<string, string> = {
    fall: '秋季学期',
    spring: '春季学期',
    winter_break: '寒假',
    summer_break: '暑假',
  };

  if (semesterType === 'winter_break' || semesterType === 'summer_break') {
    return `当前是${semesterNames[semesterType]}，可以休息或继续科研。`;
  }

  let period = '';
  if (weekInSemester <= 2) {
    period = '开学初期，选课、制定计划';
  } else if (weekInSemester <= 8) {
    period = '学期中期，课程学习、开展研究';
  } else if (weekInSemester <= 14) {
    period = '学期后期，期中已过，准备期末';
  } else {
    period = '期末冲刺阶段，考试、论文截止';
  }

  return `当前是${semesterNames[semesterType]}第${weekInSemester}周，${period}`;
}

/**
 * 生成事件 Prompt 模板
 */
function buildEventPromptTemplate(context: PromptContext): string {
  const { player, eventType, availableTypes, cooldownInfo } = context;
  const playerStatus = buildStudentStatusDescription(context);

  // 获取学期信息
  const gameTime = player.gameTime as {
    semesterType?: string;
    weekInSemester?: number;
  } || {};
  const semesterDesc = getSemesterDescription(
    gameTime.weekInSemester ?? 1,
    gameTime.semesterType ?? 'fall'
  );

  const typeDescriptions: Record<string, string> = {
    daily: '日常事件（实验室生活、课程学习、导师组会）',
    semester: '学期事件（选课、考试、开题、答辩）',
    random: '随机事件（投稿结果、设备故障、身体健康）',
    hotspot: '学术热点（新研究方向、热点机会）',
    ethics: '学术伦理（数据异常、署名争议、抄袭发现）',
    relationship: '人际关系（导师谈话、同门互动、恋爱）',
    milestone: '里程碑（首篇论文、开题通过、毕业答辩）',
    pressure: '压力事件（论文被拒、毕业焦虑、经济困难）',
  };

  let eventTypeDesc = `## 事件类型要求`;
  if (availableTypes && Array.isArray(availableTypes) && availableTypes.length > 0) {
    eventTypeDesc += `\n- 本次事件类型必须是以下之一：${(availableTypes as string[]).join('/')}`;
  }
  if (cooldownInfo) {
    eventTypeDesc += `\n- 其他类型处于冷却中，不能生成${cooldownInfo}`;
  }
  eventTypeDesc += '\n';
  if (eventType) {
    eventTypeDesc += `- 指定类型: ${typeDescriptions[eventType as string] || eventType}`;
  }

  return `你是一个专业的研究生模拟游戏AI事件生成器。请根据研究生的当前状态，生成一个真实、有趣、有代入感的事件。

${playerStatus}

## 时间背景
${semesterDesc}

${eventTypeDesc}

## 生成要求

1. **真实性**: 事件要符合国内研究生生活的实际情况
   - 研一：课程学习、适应环境、确定研究方向
   - 研二：开题答辩、开展实验、发表论文
   - 研三：毕业论文、找工作、答辩

2. **情境相关**:
   - 考试周：课程考试、作业截止
   - 假期：休息调整、继续科研、回家
   - 组会日：汇报进展、导师点评
   - 投稿高峰：准备投稿、回复审稿

3. **属性关联**:
   - **压力高**（>70）：减压事件、崩溃边缘、需要帮助
   - **健康低**（<30）：身体不适、心理问题、需要休息
   - **导师好感低**（<30）：被批评、被冷落、签字困难
   - **经济差**（<30）：缺钱、兼职机会、省钱度日
   - **热情低**（<30）：怀疑人生、想退学、需要激励

4. **选择设计**:
   - 每个事件2-4个选择
   - 选择应有明显不同的后果
   - 可以包含风险/收益权衡
   - 有些选择需要满足条件才能选

5. **效果范围**:
   - 科研能力: -10 到 +15
   - 学术热情: -15 到 +15
   - 导师好感: -10 到 +10
   - 同门关系: -10 到 +10
   - 身心健康: -15 到 +15
   - 经济状况: -15 到 +20
   - 压力值: -20 到 +25（越高越不好）

## 输出格式
请严格按照以下 JSON 格式返回（只返回JSON，不要其他内容）：

{
  "title": "事件标题（10-20字）",
  "description": "详细的事件描述（100-200字，包含具体场景和细节）",
  "type": "${eventType || 'daily'}",
  "choices": [
    {
      "text": "选择1的文本（10-30字）",
      "effects": {
        "research_ability": 数值（-10到+15）,
        "academic_passion": 数值（-15到+15）,
        "advisor_favor": 数值（-10到+10）,
        "peer_relation": 数值（-10到+10）,
        "health": 数值（-15到+15）,
        "finance": 数值（-15到+20）,
        "pressure": 数值（-20到+25）
      },
      "requirements": {
        "min_attribute": "属性名:最小值（可选）"
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
  const stage = player.stage as string || 'master_year1';
  const eventData = event as { title?: string; description?: string; type?: string };
  const choiceData = choice as { text?: string };

  return `你是一个研究生模拟游戏的AI助手。玩家做出了选择，需要生成后果。

## 事件信息
- **事件标题**: ${eventData.title || '未知事件'}
- **选择的选项**: ${choiceData.text || '未知选择'}

## 研究生当前状态
- **当前阶段**: ${stageNames[stage] || stage}
- **科研能力**: ${attributes.research_ability ?? 50}/100
- **学术热情**: ${attributes.academic_passion ?? 70}/100
- **压力值**: ${attributes.pressure ?? 30}/100
- **健康**: ${attributes.health ?? 80}/100

## 输出格式
{
  "description": "后果描述（50-100字，生动具体，描述发生了什么）",
  "effects": [
    {
      "type": "attribute",
      "attribute": "research_ability|academic_passion|advisor_favor|peer_relation|health|finance|pressure",
      "value": 数值（-20到+20）
    }
  ]
}`;
}

/**
 * 学术之路 - Prompt 配置
 */
export const promptsConfig: PromptsConfig = {
  systemPrompt: `你是一个专业的研究生模拟游戏AI助手，负责生成真实、有趣的研究生生活事件和后果。
你的回复必须是有效的JSON格式。
事件要贴近国内研究生的真实生活，包含：
- 实验室日常（组会、实验、看文献）
- 导师关系（meeting、签字、被批评）
- 同门互动（合作、竞争、社交）
- 学术压力（论文、毕业、就业）
- 生活琐事（经济、恋爱、健康）
- 学术伦理（数据、署名、抄袭等灰色地带）`,

  eventPromptTemplate: buildEventPromptTemplate,
  consequencePromptTemplate: buildConsequencePromptTemplate,
};

export default promptsConfig;
