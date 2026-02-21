/**
 * 学术之路 - 时间系统配置
 *
 * 核心时间单位: 周（Week）
 * 配合真实日期显示，增强代入感
 */

// ============================================================================
// 学期类型
// ============================================================================

/**
 * 学期类型
 */
export type SemesterType = 'fall' | 'spring' | 'winter_break' | 'summer_break';

/**
 * 学期配置
 */
export interface SemesterConfig {
  type: SemesterType;
  name: string;
  shortName: string;
  startMonth: number; // 开始月份 (1-12)
  startWeek: number;  // 学年内第几周开始
  totalWeeks: number; // 总周数
  isAcademic: boolean; // 是否是教学学期
}

/**
 * 学年历配置
 */
export const academicCalendar = {
  // 秋季学期 (9月-1月)
  fall: {
    type: 'fall' as SemesterType,
    name: '秋季学期',
    shortName: '秋',
    startMonth: 9,
    startWeek: 1,
    totalWeeks: 18,
    isAcademic: true,
  },

  // 寒假 (1月底-2月)
  winterBreak: {
    type: 'winter_break' as SemesterType,
    name: '寒假',
    shortName: '寒',
    startMonth: 1,
    startWeek: 19,
    totalWeeks: 4,
    isAcademic: false,
  },

  // 春季学期 (2月-6月)
  spring: {
    type: 'spring' as SemesterType,
    name: '春季学期',
    shortName: '春',
    startMonth: 2,
    startWeek: 23,
    totalWeeks: 18,
    isAcademic: true,
  },

  // 暑假 (7月-8月)
  summerBreak: {
    type: 'summer_break' as SemesterType,
    name: '暑假',
    shortName: '暑',
    startMonth: 7,
    startWeek: 41,
    totalWeeks: 8,
    isAcademic: false,
  },
};

// ============================================================================
// 学历层次配置
// ============================================================================

/**
 * 学历层次
 */
export type DegreeType = 'master_academic' | 'master_professional' | 'doctor';

/**
 * 学历配置
 */
export interface DegreeConfig {
  type: DegreeType;
  name: string;
  shortName: string;
  totalYears: number;    // 学制年数
  totalWeeks: number;    // 总周数
  requiredPapers: number; // 要求论文数
  requiredCredits: number; // 要求学分
  canExtend: boolean;    // 是否可以延毕
  maxExtendWeeks: number; // 最多延期周数
}

/**
 * 学历配置映射
 */
export const degreeConfigs: Record<DegreeType, DegreeConfig> = {
  // 学术硕士 (3年制)
  master_academic: {
    type: 'master_academic',
    name: '学术硕士',
    shortName: '学硕',
    totalYears: 3,
    totalWeeks: 108, // 3年 * 36周
    requiredPapers: 1,
    requiredCredits: 30,
    canExtend: true,
    maxExtendWeeks: 18, // 最多延期半年
  },

  // 专业硕士 (2-3年制)
  master_professional: {
    type: 'master_professional',
    name: '专业硕士',
    shortName: '专硕',
    totalYears: 2,
    totalWeeks: 72, // 2年 * 36周
    requiredPapers: 0, // 专硕可能不要求论文
    requiredCredits: 36,
    canExtend: true,
    maxExtendWeeks: 18,
  },

  // 博士 (4年制)
  doctor: {
    type: 'doctor',
    name: '博士研究生',
    shortName: '博士',
    totalYears: 4,
    totalWeeks: 144, // 4年 * 36周
    requiredPapers: 2,
    requiredCredits: 20,
    canExtend: true,
    maxExtendWeeks: 72, // 最多延期2年
  },
};

// ============================================================================
// 周内节奏配置
// ============================================================================

/**
 * 星期几
 */
export type WeekDay = 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday';

/**
 * 周内每日配置
 */
export interface WeekDayConfig {
  day: WeekDay;
  name: string;
  shortName: string;
  isWeekend: boolean;
  eventWeight: number; // 事件发生权重
}

/**
 * 周内配置
 */
export const weekDays: WeekDayConfig[] = [
  { day: 'monday', name: '周一', shortName: '一', isWeekend: false, eventWeight: 1.0 },
  { day: 'tuesday', name: '周二', shortName: '二', isWeekend: false, eventWeight: 1.0 },
  { day: 'wednesday', name: '周三', shortName: '三', isWeekend: false, eventWeight: 1.0 },
  { day: 'thursday', name: '周四', shortName: '四', isWeekend: false, eventWeight: 1.0 },
  { day: 'friday', name: '周五', shortName: '五', isWeekend: false, eventWeight: 1.5 }, // 组会日
  { day: 'saturday', name: '周六', shortName: '六', isWeekend: true, eventWeight: 0.5 },
  { day: 'sunday', name: '周日', shortName: '日', isWeekend: true, eventWeight: 0.3 },
];

// ============================================================================
// 特殊周配置
// ============================================================================

/**
 * 特殊周类型
 */
export type SpecialWeekType =
  | 'opening'        // 开学周
  | 'exam'           // 考试周
  | 'holiday'        // 假期周（国庆等）
  | 'defense'        // 答辩周
  | 'proposal'       // 开题周
  | 'midterm_check'  // 中期考核
  | 'winter_vacation' // 寒假
  | 'summer_vacation' // 暑假
  | 'graduation';    // 毕业周

/**
 * 特殊周配置
 */
export interface SpecialWeekConfig {
  type: SpecialWeekType;
  name: string;
  description: string;
  effects: {
    actionPointModifier: number; // 行动点修正
    stressModifier: number;      // 压力修正
    eventPoolOverride?: string;  // 覆盖事件池
  };
}

/**
 * 学期内特殊周映射（相对于学期开始的周数）
 */
export const semesterSpecialWeeks: Record<number, SpecialWeekType> = {
  1: 'opening',      // 第1周：开学
  5: 'holiday',      // 第5周：国庆（秋季学期）
  17: 'exam',        // 第17周：考试周
  18: 'exam',        // 第18周：考试周
};

// ============================================================================
// 行动点系统
// ============================================================================

/**
 * 行动点配置
 */
export const actionPointConfig = {
  maxPoints: 10,           // 每周最大行动点
  restRecovery: 1,         // 休息恢复点数
  minHealthReduction: 3,   // 健康低于此值时减少最大行动点
};

/**
 * 行动消耗配置
 */
export const actionCosts = {
  attendClass: 2,          // 上课
  doExperiment: 2,         // 做实验
  writePaper: 2,           // 写论文
  readLiterature: 1,       // 读文献
  attendMeeting: 2,        // 开组会
  socialActivity: 1,       // 社交
  rest: -1,                // 休息（恢复1点）
  partTimeJob: 3,          // 兼职打工
  prepareExam: 2,          // 备考
  revisePaper: 2,          // 改论文
  submitPaper: 1,          // 投稿
  attendConference: 3,     // 参加会议
};

// ============================================================================
// 时间工具函数
// ============================================================================

/**
 * 游戏时间状态
 */
export interface GameTime {
  startYear: number;       // 入学年份
  totalWeeks: number;      // 游戏开始以来经过的总周数
  currentYear: number;     // 当前年份
  currentMonth: number;    // 当前月份
  currentWeekInYear: number; // 年内第几周
  semesterType: SemesterType; // 当前学期类型
  weekInSemester: number;  // 学期内第几周
  yearInSchool: number;    // 研几/博几
  weekInDegree: number;    // 学历层次内第几周
}

/**
 * 根据总周数计算游戏时间
 */
export function calculateGameTime(startYear: number, totalWeeks: number, _degreeType: DegreeType): GameTime {
  // degreeType 参数保留用于未来扩展，当前版本统一计算

  // 计算年份和月份
  const yearsPassed = Math.floor(totalWeeks / 48);
  const currentYear = startYear + yearsPassed;

  // 计算年内周数
  const weekInCurrentYear = totalWeeks % 48;

  // 计算月份（简化：每4周约1个月）
  const yearStartMonth = 9; // 9月入学
  let currentMonth = yearStartMonth + Math.floor(weekInCurrentYear / 4);
  if (currentMonth > 12) currentMonth -= 12;

  // 确定学期类型
  const weekInAcademicYear = totalWeeks % 48;
  let semesterType: SemesterType;
  let weekInSemester: number;

  if (weekInAcademicYear < 18) {
    semesterType = 'fall';
    weekInSemester = weekInAcademicYear + 1;
  } else if (weekInAcademicYear < 22) {
    semesterType = 'winter_break';
    weekInSemester = weekInAcademicYear - 17;
  } else if (weekInAcademicYear < 40) {
    semesterType = 'spring';
    weekInSemester = weekInAcademicYear - 21;
  } else {
    semesterType = 'summer_break';
    weekInSemester = weekInAcademicYear - 39;
  }

  // 计算研几/博几
  const yearInSchool = Math.floor(totalWeeks / 48) + 1;

  return {
    startYear,
    totalWeeks,
    currentYear,
    currentMonth,
    currentWeekInYear: weekInCurrentYear,
    semesterType,
    weekInSemester,
    yearInSchool,
    weekInDegree: totalWeeks,
  };
}

/**
 * 格式化显示时间
 */
export function formatGameTime(gameTime: GameTime): {
  fullDate: string;     // 完整日期: "2024年9月第1周"
  semesterInfo: string; // 学期信息: "秋季学期 第1周"
  progress: string;     // 进度: "研一 · 距离毕业还有107周"
} {
  const semesterNames: Record<SemesterType, string> = {
    fall: '秋季学期',
    spring: '春季学期',
    winter_break: '寒假',
    summer_break: '暑假',
  };

  const degreeNames: Record<DegreeType, string> = {
    master_academic: '研',
    master_professional: '研',
    doctor: '博',
  };

  // 这里简化处理，实际应该传入 degreeType
  const yearLabel = `${degreeNames.master_academic}${gameTime.yearInSchool}`;

  return {
    fullDate: `${gameTime.currentYear}年${gameTime.currentMonth}月第${gameTime.weekInSemester}周`,
    semesterInfo: `${semesterNames[gameTime.semesterType]} 第${gameTime.weekInSemester}周`,
    progress: `${yearLabel} · 第${gameTime.weekInDegree}周`,
  };
}

/**
 * 获取当前学期的剩余周数
 */
export function getRemainingWeeksInSemester(gameTime: GameTime): number {
  const semesterConfig = Object.values(academicCalendar).find(
    s => s.type === gameTime.semesterType
  );
  return semesterConfig ? semesterConfig.totalWeeks - gameTime.weekInSemester : 0;
}

/**
 * 检查是否是特殊周
 */
export function getSpecialWeekType(gameTime: GameTime): SpecialWeekType | null {
  return semesterSpecialWeeks[gameTime.weekInSemester] || null;
}

/**
 * 检查是否是假期
 */
export function isHolidayWeek(gameTime: GameTime): boolean {
  return gameTime.semesterType === 'winter_break' || gameTime.semesterType === 'summer_break';
}

/**
 * 检查是否是考试周
 */
export function isExamWeek(gameTime: GameTime): boolean {
  return gameTime.weekInSemester >= 17 && gameTime.weekInSemester <= 18;
}

export default {
  academicCalendar,
  degreeConfigs,
  weekDays,
  actionPointConfig,
  actionCosts,
  semesterSpecialWeeks,
  calculateGameTime,
  formatGameTime,
  getRemainingWeeksInSemester,
  getSpecialWeekType,
  isHolidayWeek,
  isExamWeek,
};
