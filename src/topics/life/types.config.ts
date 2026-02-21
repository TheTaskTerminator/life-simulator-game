/**
 * 人生模拟器 - 特定类型定义
 *
 * 这些类型是人生模拟器特有的，不属于核心框架。
 * 保持与 src/types.ts 的兼容性。
 */

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

// 职业等级
export enum CareerLevel {
  ENTRY = 'entry',
  JUNIOR = 'junior',
  MIDDLE = 'middle',
  SENIOR = 'senior',
  EXPERT = 'expert',
  MASTER = 'master'
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
