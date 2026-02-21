import { LifeStage, EducationLevel, CareerCategory, Career, CareerLevel } from './types';

// 阶段年龄范围
export const STAGE_AGE_RANGES: Record<LifeStage, { min: number; max: number }> = {
  [LifeStage.CHILDHOOD]: { min: 0, max: 6 },
  [LifeStage.STUDENT]: { min: 7, max: 18 },
  [LifeStage.YOUNG_ADULT]: { min: 19, max: 25 },
  [LifeStage.ADULT]: { min: 26, max: 40 },
  [LifeStage.MIDDLE_AGE]: { min: 41, max: 60 },
  [LifeStage.ELDERLY]: { min: 61, max: 120 },
};

// 阶段名称
export const STAGE_NAMES: Record<LifeStage, string> = {
  [LifeStage.CHILDHOOD]: '童年期',
  [LifeStage.STUDENT]: '学生期',
  [LifeStage.YOUNG_ADULT]: '青年期',
  [LifeStage.ADULT]: '成年期',
  [LifeStage.MIDDLE_AGE]: '中年期',
  [LifeStage.ELDERLY]: '老年期',
};

// 教育水平名称
export const EDUCATION_NAMES: Record<EducationLevel, string> = {
  [EducationLevel.NONE]: '学前',
  [EducationLevel.PRIMARY]: '小学',
  [EducationLevel.MIDDLE]: '初中',
  [EducationLevel.HIGH]: '高中',
  [EducationLevel.COLLEGE]: '大专',
  [EducationLevel.BACHELOR]: '本科',
  [EducationLevel.MASTER]: '研究生',
  [EducationLevel.DOCTOR]: '博士',
};

// 教育水平年龄范围
export const EDUCATION_AGE_RANGES: Record<EducationLevel, { minAge: number; maxAge: number }> = {
  [EducationLevel.NONE]: { minAge: 0, maxAge: 6 },
  [EducationLevel.PRIMARY]: { minAge: 7, maxAge: 12 },
  [EducationLevel.MIDDLE]: { minAge: 12, maxAge: 15 },
  [EducationLevel.HIGH]: { minAge: 15, maxAge: 18 },
  [EducationLevel.COLLEGE]: { minAge: 18, maxAge: 21 },
  [EducationLevel.BACHELOR]: { minAge: 18, maxAge: 22 },
  [EducationLevel.MASTER]: { minAge: 22, maxAge: 25 },
  [EducationLevel.DOCTOR]: { minAge: 25, maxAge: 30 },
};

// 职业等级名称
export const CAREER_LEVEL_NAMES: Record<CareerLevel, string> = {
  [CareerLevel.ENTRY]: '入门',
  [CareerLevel.JUNIOR]: '初级',
  [CareerLevel.MIDDLE]: '中级',
  [CareerLevel.SENIOR]: '高级',
  [CareerLevel.EXPERT]: '专家',
  [CareerLevel.MASTER]: '大师',
};

// 职业等级倍数
export const CAREER_LEVEL_MULTIPLIERS: Record<CareerLevel, number> = {
  [CareerLevel.ENTRY]: 1.0,
  [CareerLevel.JUNIOR]: 1.5,
  [CareerLevel.MIDDLE]: 2.0,
  [CareerLevel.SENIOR]: 3.0,
  [CareerLevel.EXPERT]: 4.5,
  [CareerLevel.MASTER]: 6.0,
};

// 职业列表
export const CAREERS: Career[] = [
  // 蓝领职业
  {
    id: 'worker',
    name: '工人',
    category: CareerCategory.BLUE_COLLAR,
    educationRequired: EducationLevel.PRIMARY,
    baseSalary: 3000,
    maxLevel: 3,
    description: '体力劳动，收入稳定但上限较低',
  },
  {
    id: 'waiter',
    name: '服务员',
    category: CareerCategory.BLUE_COLLAR,
    educationRequired: EducationLevel.MIDDLE,
    baseSalary: 3500,
    maxLevel: 3,
    description: '服务行业，需要良好的沟通能力',
  },
  // 白领职业
  {
    id: 'programmer',
    name: '程序员',
    category: CareerCategory.WHITE_COLLAR,
    educationRequired: EducationLevel.BACHELOR,
    baseSalary: 8000,
    maxLevel: 5,
    description: '软件开发，需要较强的逻辑思维能力',
  },
  {
    id: 'doctor',
    name: '医生',
    category: CareerCategory.WHITE_COLLAR,
    educationRequired: EducationLevel.BACHELOR,
    baseSalary: 10000,
    maxLevel: 6,
    description: '医疗行业，需要高学历和专业技能',
  },
  {
    id: 'lawyer',
    name: '律师',
    category: CareerCategory.WHITE_COLLAR,
    educationRequired: EducationLevel.BACHELOR,
    baseSalary: 12000,
    maxLevel: 6,
    description: '法律服务，需要良好的口才和逻辑',
  },
  {
    id: 'teacher',
    name: '教师',
    category: CareerCategory.WHITE_COLLAR,
    educationRequired: EducationLevel.BACHELOR,
    baseSalary: 6000,
    maxLevel: 5,
    description: '教育事业，稳定但收入中等',
  },
  // 创业
  {
    id: 'entrepreneur',
    name: '创业者',
    category: CareerCategory.ENTREPRENEUR,
    educationRequired: EducationLevel.HIGH,
    baseSalary: 0,
    maxLevel: 6,
    description: '自主创业，高风险高回报',
  },
  // 自由职业
  {
    id: 'freelancer',
    name: '自由职业者',
    category: CareerCategory.FREELANCE,
    educationRequired: EducationLevel.HIGH,
    baseSalary: 5000,
    maxLevel: 5,
    description: '灵活工作，收入不稳定',
  },
];

// 属性初始值范围
export const INITIAL_ATTRIBUTE_RANGE = {
  health: { min: 50, max: 100 },
  intelligence: { min: 30, max: 80 },
  charm: { min: 30, max: 80 },
  wealth: { min: 0, max: 10000 },
  happiness: { min: 50, max: 100 },
  stress: { min: 0, max: 30 },
};

// 存档键名
export const STORAGE_KEYS = {
  SAVE: 'life-simulator-save',
  SETTINGS: 'life-simulator-settings',
  CACHE_PREFIX: 'life-simulator-cache-',
} as const;

// 缓存配置
export const CACHE_CONFIG = {
  // AI 配置缓存时间（24小时）
  AI_CONFIG_TTL: 24 * 60 * 60 * 1000,
  // AI 事件缓存时间（1小时）
  AI_EVENT_TTL: 60 * 60 * 1000,
  // 事件缓存时间（30分钟）
  EVENT_TTL: 30 * 60 * 1000,
  // 其他数据缓存时间（24小时）
  DATA_TTL: 24 * 60 * 60 * 1000,
  // 游戏状态缓存（永不过期）
  GAME_STATE_TTL: 0,
  // 设置缓存（永不过期）
  SETTINGS_TTL: 0,
} as const;

// 游戏版本
export const GAME_VERSION = '1.0.0';

// 默认设置
export const DEFAULT_SETTINGS = {
  soundEnabled: true,
  musicEnabled: true,
  autoSave: true,
  aiProvider: 'siliconflow',
} as const;

