// 人生阶段
export enum LifeStage {
  CHILDHOOD = 'childhood',      // 0-6岁
  STUDENT = 'student',           // 7-18岁
  YOUNG_ADULT = 'young_adult',  // 19-25岁
  ADULT = 'adult',              // 26-40岁
  MIDDLE_AGE = 'middle_age',    // 41-60岁
  ELDERLY = 'elderly'           // 61+岁
}

// 教育水平
export enum EducationLevel {
  NONE = 'none',                // 学前
  PRIMARY = 'primary',          // 小学
  MIDDLE = 'middle',            // 初中
  HIGH = 'high',                // 高中
  COLLEGE = 'college',          // 大专
  BACHELOR = 'bachelor',        // 本科
  MASTER = 'master',            // 研究生
  DOCTOR = 'doctor'             // 博士
}

// 职业类别
export enum CareerCategory {
  BLUE_COLLAR = 'blue_collar',  // 蓝领
  WHITE_COLLAR = 'white_collar', // 白领
  ENTREPRENEUR = 'entrepreneur', // 创业
  FREELANCE = 'freelance'       // 自由职业
}

// 事件类型
export enum EventType {
  OPPORTUNITY = 'opportunity',  // 机遇
  CHALLENGE = 'challenge',      // 挑战
  DAILY = 'daily',              // 日常
  SPECIAL = 'special',           // 特殊
  STAGE = 'stage'               // 阶段事件
}

// 人物类型
export enum PersonType {
  PARENT = 'parent',
  SIBLING = 'sibling',
  FRIEND = 'friend',
  PARTNER = 'partner',
  CHILD = 'child',
  COLLEAGUE = 'colleague'
}

// 婚姻状态
export enum MaritalStatus {
  SINGLE = 'single',
  DATING = 'dating',
  MARRIED = 'married',
  DIVORCED = 'divorced',
  WIDOWED = 'widowed'
}

// 职业等级
export enum CareerLevel {
  ENTRY = 'entry',
  JUNIOR = 'junior',
  MIDDLE = 'middle',
  SENIOR = 'senior',
  EXPERT = 'expert',
  MASTER = 'master'
}

// 玩家属性
export interface PlayerAttributes {
  health: number;        // 健康 0-100
  intelligence: number;  // 智力 0-100
  charm: number;         // 魅力 0-100
  wealth: number;       // 财富（无上限）
  happiness: number;     // 幸福度 0-100
  stress: number;        // 压力 0-100
}

// 职业
export interface Career {
  id: string;
  name: string;
  category: CareerCategory;
  educationRequired: EducationLevel;
  baseSalary: number;
  maxLevel: number;
  description: string;
}

// 人物
export interface Person {
  id: string;
  name: string;
  type: PersonType;
  relationship: string;
  attributes: {
    intelligence: number;
    charm: number;
    wealth: number;
  };
}

// 事件效果
export interface EventEffect {
  type: 'attribute' | 'wealth' | 'event' | 'relationship';
  attribute?: keyof PlayerAttributes;
  value: number;
  target?: string;
}

// 选择
export interface Choice {
  id: string;
  text: string;
  effects: EventEffect[];
  requirements?: {
    attribute?: keyof PlayerAttributes;
    minValue?: number;
    maxValue?: number;
  }[];
}

// 事件
export interface Event {
  id: string;
  type: EventType;
  title: string;
  description: string;
  choices: Choice[];
  conditions?: {
    age?: { min?: number; max?: number };
    stage?: LifeStage[];
    attribute?: { key: keyof PlayerAttributes; min?: number; max?: number };
  }[];
  effects?: EventEffect[];
  aiGenerated: boolean;
}

// 房产
export interface Property {
  id: string;
  name: string;
  price: number;
  value: number;
  purchaseDate: number;
}

// 车辆
export interface Vehicle {
  id: string;
  name: string;
  price: number;
  value: number;
  purchaseDate: number;
}

// 投资
export interface Investment {
  id: string;
  name: string;
  type: string;
  amount: number;
  returnRate: number;
  purchaseDate: number;
}

// 成就
export interface Achievement {
  id: string;
  name: string;
  description: string;
  unlockedAt: number;
  category: string;
}

// 日志条目
export interface LogEntry {
  id: string;
  timestamp: number;
  type: 'event' | 'choice' | 'stage' | 'achievement' | 'system';
  message: string;
  data?: unknown;
}

// 玩家数据
export interface Player {
  name: string;
  age: number;
  stage: LifeStage;

  // 核心属性
  attributes: PlayerAttributes;

  // 状态信息
  education: EducationLevel;
  career: Career | null;
  careerLevel: CareerLevel;
  maritalStatus: MaritalStatus;
  partner: Person | null;
  children: Person[];
  parents: Person[];
  friends: Person[];

  // 资产
  properties: Property[];
  vehicles: Vehicle[];
  investments: Investment[];

  // 游戏状态
  achievements: Achievement[];
  currentEvent: Event | null;
  eventHistory: Event[];
  choices: Choice[];

  // 回合系统
  turn?: number;  // 当前回合
  tagCooldowns?: Record<EventType, number>;  // 标签冷却
  manualEventTriggersThisYear?: number;  // 本年已手动触发事件次数

  // 元数据
  startDate: number;
  lastSaveDate: number;
}

// 游戏存档
export interface GameSave {
  player: Player;
  logs: LogEntry[];
  timestamp: number;
  version: string;
}

// 游戏设置
export interface GameSettings {
  soundEnabled: boolean;
  musicEnabled: boolean;
  autoSave: boolean;
  aiProvider: string;
}

