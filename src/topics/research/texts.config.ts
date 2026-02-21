import { TextsConfig } from '../../core/types/base';

/**
 * 科研模拟器 - 文案配置
 */
export const textsConfig: TextsConfig = {
  gameTitle: '学术之路',
  gameSubtitle: '从博士生到学术大牛的科研人生',
  startButton: '开始学术生涯',
  continueButton: '继续研究',
  restartButton: '重新开始',
  confirmButton: '确认',
  cancelButton: '取消',

  statsPanelTitle: '学术状态',
  logPanelTitle: '学术历程',

  ageLabel: '学术年限',
  stageLabel: '学术阶段',
  turnLabel: '第几年',

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
    gameOverTitle: '学术生涯结束',
    scoreLabel: '学术评分',
    summaryLabel: '学术总结',
  },

  messages: {
    loading: '加载中...',
    saving: '保存中...',
    error: '发生错误',
    confirmQuit: '确定要退出学术生涯吗？',
    newGame: '开始新的学术旅程',
  },

  custom: {
    // 学术职位
    careerTitle: '职位',
    careerNone: '待就业',
    careerLevelLabel: '职级',
    salaryLabel: '年薪',

    // 学历
    educationTitle: '学位',
    educationNone: '无',

    // 学术关系
    relationshipTitle: '学术关系',
    maritalStatusLabel: '合作状态',

    // 研究相关
    publicationsLabel: '发表论文',
    citationsLabel: '引用次数',
    grantsLabel: '获得基金',
    studentsLabel: '培养学生',

    // 游戏操作
    nextTurnButton: '下一年',
    triggerEventButton: '触发事件',
    settingsButton: '设置',
    achievementsButton: '成就',
  },
};

export default textsConfig;

/**
 * 学术职位文案映射
 */
export const academicPositionTexts: Record<string, string> = {
  phd_student: '博士生',
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
  cs: '计算机科学',
  physics: '物理学',
  biology: '生物学',
  chemistry: '化学',
  mathematics: '数学',
  engineering: '工程学',
};
