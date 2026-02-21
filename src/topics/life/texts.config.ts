import { TextsConfig } from '../../core/types/base';

/**
 * 人生模拟器 - 文案配置
 */
export const textsConfig: TextsConfig = {
  gameTitle: '人生模拟器',
  gameSubtitle: '体验一段虚拟人生，做出选择，塑造命运',
  startButton: '开始新人生',
  continueButton: '继续游戏',
  restartButton: '重新开始',
  confirmButton: '确认',
  cancelButton: '取消',

  statsPanelTitle: '属性',
  logPanelTitle: '人生日志',

  ageLabel: '年龄',
  stageLabel: '阶段',
  turnLabel: '回合',

  events: {
    opportunityLabel: '机遇',
    challengeLabel: '挑战',
    dailyLabel: '日常',
    specialLabel: '特殊',
    stageLabel: '阶段',
    choicePrefix: '选择',
    effectPrefix: '效果',
  },

  endings: {
    gameOverTitle: '人生落幕',
    scoreLabel: '人生评分',
    summaryLabel: '人生总结',
  },

  messages: {
    loading: '加载中...',
    saving: '保存中...',
    error: '发生错误',
    confirmQuit: '确定要退出吗？',
    newGame: '开始新游戏',
  },

  custom: {
    // 职业相关
    careerTitle: '职业',
    careerNone: '无业',
    careerLevelLabel: '职级',
    salaryLabel: '月薪',

    // 教育相关
    educationTitle: '学历',
    educationNone: '无',

    // 关系相关
    relationshipTitle: '人际关系',
    maritalStatusLabel: '婚姻状态',
    singleLabel: '单身',
    datingLabel: '恋爱中',
    marriedLabel: '已婚',
    divorcedLabel: '离异',
    widowedLabel: '丧偶',

    // 资产相关
    assetTitle: '资产',
    propertyLabel: '房产',
    vehicleLabel: '车辆',
    investmentLabel: '投资',

    // 游戏操作
    nextTurnButton: '下一年',
    triggerEventButton: '触发事件',
    settingsButton: '设置',
    achievementsButton: '成就',
  },
};

export default textsConfig;

/**
 * 婚姻状态文案映射
 */
export const maritalStatusTexts: Record<string, string> = {
  single: '单身',
  dating: '恋爱中',
  married: '已婚',
  divorced: '离异',
  widowed: '丧偶',
};

/**
 * 教育水平文案映射
 */
export const educationLevelTexts: Record<string, string> = {
  none: '学前',
  primary: '小学',
  middle: '初中',
  high: '高中',
  college: '大专',
  bachelor: '本科',
  master: '研究生',
  doctor: '博士',
};

/**
 * 职业等级文案映射
 */
export const careerLevelTexts: Record<string, string> = {
  entry: '入门',
  junior: '初级',
  middle: '中级',
  senior: '高级',
  expert: '专家',
  master: '大师',
};

/**
 * 职业类别文案映射
 */
export const careerCategoryTexts: Record<string, string> = {
  blue_collar: '蓝领',
  white_collar: '白领',
  entrepreneur: '创业',
  freelance: '自由职业',
};

/**
 * 人物类型文案映射
 */
export const personTypeTexts: Record<string, string> = {
  parent: '父母',
  sibling: '兄弟姐妹',
  friend: '朋友',
  partner: '伴侣',
  child: '子女',
  colleague: '同事',
};
