import { TextsConfig } from '../../core/types/base';

/**
 * 学术之路 - 研究生模拟器文案配置
 */
export const textsConfig: TextsConfig = {
  gameTitle: '学术之路',
  gameSubtitle: '研究生生涯模拟器',
  startButton: '开始研途',
  continueButton: '继续学业',
  restartButton: '重新开始',
  confirmButton: '确认',
  cancelButton: '取消',

  statsPanelTitle: '状态面板',
  logPanelTitle: '研究生涯',

  ageLabel: '学术年限',
  stageLabel: '年级',
  turnLabel: '周',

  events: {
    opportunityLabel: '机遇',
    challengeLabel: '挑战',
    dailyLabel: '日常',
    specialLabel: '重要',
    stageLabel: '里程碑',
    choicePrefix: '选择',
    effectPrefix: '影响',
  },

  endings: {
    gameOverTitle: '研途终点',
    scoreLabel: '综合评价',
    summaryLabel: '生涯总结',
  },

  messages: {
    loading: '加载中...',
    saving: '保存中...',
    error: '发生错误',
    confirmQuit: '确定要退学吗？',
    newGame: '开启新的研途',
  },

  custom: {
    // === 时间系统 ===
    weekLabel: '周',
    semesterLabel: '学期',
    fallSemester: '秋季学期',
    springSemester: '春季学期',
    winterBreak: '寒假',
    summerBreak: '暑假',

    // === 学历系统 ===
    degreeTitle: '学历',
    masterAcademic: '学术硕士',
    masterProfessional: '专业硕士',
    doctor: '博士研究生',

    // === 毕业条件 ===
    graduationTitle: '毕业条件',
    creditsLabel: '已修学分',
    creditsRequired: '要求学分',
    papersLabel: '发表论文',
    papersRequired: '要求论文',
    proposalLabel: '开题答辩',
    midtermLabel: '中期考核',
    preDefenseLabel: '预答辩',
    blindReviewLabel: '盲审',
    finalDefenseLabel: '正式答辩',
    weeksRemaining: '距离毕业',

    // === 属性 ===
    researchAbility: '科研能力',
    academicPassion: '学术热情',
    advisorFavor: '导师好感',
    peerRelation: '同门关系',
    health: '身心健康',
    finance: '经济状况',
    pressure: '压力值',

    // === 行动点 ===
    actionPointsLabel: '行动点',
    actionPointsRemaining: '剩余行动点',

    // === 导师系统 ===
    advisorTitle: '导师',
    advisorFavorLevel: '好感度',
    advisorTypeBigShot: '大牛型',
    advisorTypeYoungStar: '青千型',
    advisorTypeHandsOff: '放养型',
    advisorTypeDemanding: '压榨型',

    // === 同门系统 ===
    peersTitle: '同门',
    seniorBrother: '师兄',
    seniorSister: '师姐',
    juniorBrother: '师弟',
    juniorSister: '师妹',

    // === 研究系统 ===
    researchTitle: '研究方向',
    papersSubmitted: '在投论文',
    papersPublished: '已发论文',
    hIndex: 'H-index',
    totalCitations: '总引用',

    // === 学术热点 ===
    hotspotTitle: '学术热点',
    hotspotRising: '上升期',
    hotspotPeak: '巅峰期',
    hotspotDeclining: '衰退期',
    hotspotStable: '稳定期',
    strategyChaseHotspot: '追热点',
    strategySteadyResearch: '稳健研究',
    strategyNicheField: '深耕冷门',

    // === 游戏操作 ===
    nextWeekButton: '下一周',
    triggerEventButton: '触发事件',
    settingsButton: '设置',
    achievementsButton: '成就',

    // === 毕业状态 ===
    graduationOnTrack: '按时毕业',
    graduationDelayed: '延期毕业',
    graduationAtRisk: '毕业风险',
  },
};

export default textsConfig;

/**
 * 学历文案映射
 */
export const degreeTexts: Record<string, string> = {
  master_academic: '学术硕士',
  master_professional: '专业硕士',
  doctor: '博士研究生',
};

/**
 * 年级文案映射
 */
export const yearTexts: Record<string, string> = {
  master_year1: '研一',
  master_year2: '研二',
  master_year3: '研三',
  doctor_year1: '博一',
  doctor_year2: '博二',
  doctor_year3: '博三',
  doctor_year4: '博四',
};

/**
 * 学期文案映射
 */
export const semesterTexts: Record<string, string> = {
  fall: '秋季学期',
  spring: '春季学期',
  winter_break: '寒假',
  summer_break: '暑假',
};

/**
 * 学术职位文案映射
 */
export const academicPositionTexts: Record<string, string> = {
  master_student: '硕士生',
  doctoral_student: '博士生',
  postdoc: '博士后',
  assistant_prof: '助理教授',
  associate_prof: '副教授',
  full_prof: '正教授',
  chair_prof: '讲座教授',
};

/**
 * 学术领域文案映射
 */
export const researchFieldTexts: Record<string, string> = {
  ai: '人工智能',
  big_data: '大数据',
  biotech: '生物技术',
  new_material: '新材料',
  new_energy: '新能源',
  quantum: '量子计算',
  traditional: '传统方向',
  interdisciplinary: '交叉学科',
};

/**
 * 导师好感度文案映射
 */
export const favorLevelTexts: Record<string, string> = {
  terrible: '极差',
  poor: '较差',
  neutral: '一般',
  good: '良好',
  excellent: '极好',
};

/**
 * 毕业条件文案映射
 */
export const graduationRequirementTexts: Record<string, string> = {
  credits: '学分要求',
  papers: '论文要求',
  proposal_defense: '开题答辩',
  midterm_check: '中期考核',
  pre_defense: '预答辩',
  blind_review: '盲审',
  final_defense: '正式答辩',
};

/**
 * 事件类型文案映射
 */
export const eventTypeTexts: Record<string, string> = {
  daily: '日常',
  semester: '学期事件',
  random: '随机事件',
  hotspot: '学术热点',
  ethics: '学术伦理',
  relationship: '人际关系',
  milestone: '里程碑',
  pressure: '压力事件',
};
