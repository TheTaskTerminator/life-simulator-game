/**
 * 学术之路 - 毕业条件配置
 *
 * 定义不同学历层次的毕业要求和检查机制
 */

import { DegreeType, degreeConfigs } from './time.config';

// ============================================================================
// 毕业条件定义
// ============================================================================

/**
 * 毕业条件类型
 */
export type GraduationRequirementType =
  | 'credits'           // 学分
  | 'papers'            // 论文
  | 'proposal_defense'  // 开题答辩
  | 'midterm_check'     // 中期考核（博士）
  | 'pre_defense'       // 预答辩
  | 'blind_review'      // 盲审
  | 'final_defense';    // 正式答辩

/**
 * 毕业条件配置
 */
export interface GraduationRequirement {
  type: GraduationRequirementType;
  name: string;
  description: string;
  required: boolean;          // 是否必须
  deadline?: number;          // 截止周数（相对入学）
  minWeeksBeforeGrad?: number; // 毕业前最少周数
}

/**
 * 学历毕业要求配置
 */
export interface DegreeGraduationConfig {
  degreeType: DegreeType;
  requirements: GraduationRequirement[];
  totalWeeks: number;
  maxExtendWeeks: number;
}

// ============================================================================
// 各学历毕业配置
// ============================================================================

/**
 * 硕士毕业要求
 */
export const masterGraduationConfig: DegreeGraduationConfig = {
  degreeType: 'master_academic',
  totalWeeks: 108,
  maxExtendWeeks: 18,
  requirements: [
    {
      type: 'credits',
      name: '学分要求',
      description: '完成培养方案规定的课程学分',
      required: true,
      deadline: 72, // 研二结束前
    },
    {
      type: 'papers',
      name: '论文要求',
      description: '发表至少1篇学术论文（中文核心/SCI/EI）',
      required: true,
      deadline: 96, // 研三下学期
    },
    {
      type: 'proposal_defense',
      name: '开题答辩',
      description: '通过学位论文开题答辩',
      required: true,
      deadline: 54, // 研二上学期
    },
    {
      type: 'pre_defense',
      name: '预答辩',
      description: '通过学位论文预答辩',
      required: true,
      minWeeksBeforeGrad: 6,
    },
    {
      type: 'blind_review',
      name: '盲审',
      description: '学位论文通过盲审',
      required: true,
      minWeeksBeforeGrad: 4,
    },
    {
      type: 'final_defense',
      name: '正式答辩',
      description: '通过学位论文正式答辩',
      required: true,
      minWeeksBeforeGrad: 0,
    },
  ],
};

/**
 * 博士毕业要求
 */
export const doctorGraduationConfig: DegreeGraduationConfig = {
  degreeType: 'doctor',
  totalWeeks: 144,
  maxExtendWeeks: 72,
  requirements: [
    {
      type: 'credits',
      name: '学分要求',
      description: '完成培养方案规定的课程学分',
      required: true,
      deadline: 72, // 博二结束前
    },
    {
      type: 'papers',
      name: '论文要求',
      description: '发表至少2篇SCI/EI论文（其中1篇一区）',
      required: true,
      deadline: 132, // 博四上学期
    },
    {
      type: 'proposal_defense',
      name: '开题答辩',
      description: '通过学位论文开题答辩',
      required: true,
      deadline: 54, // 博二上学期
    },
    {
      type: 'midterm_check',
      name: '中期考核',
      description: '通过博士生中期考核',
      required: true,
      deadline: 108, // 博三结束前
    },
    {
      type: 'pre_defense',
      name: '预答辩',
      description: '通过学位论文预答辩',
      required: true,
      minWeeksBeforeGrad: 8,
    },
    {
      type: 'blind_review',
      name: '盲审',
      description: '学位论文通过盲审',
      required: true,
      minWeeksBeforeGrad: 4,
    },
    {
      type: 'final_defense',
      name: '正式答辩',
      description: '通过学位论文正式答辩',
      required: true,
      minWeeksBeforeGrad: 0,
    },
  ],
};

/**
 * 专业硕士毕业要求（可能不要求论文）
 */
export const professionalMasterGraduationConfig: DegreeGraduationConfig = {
  degreeType: 'master_professional',
  totalWeeks: 72,
  maxExtendWeeks: 18,
  requirements: [
    {
      type: 'credits',
      name: '学分要求',
      description: '完成培养方案规定的课程学分',
      required: true,
      deadline: 54,
    },
    {
      type: 'proposal_defense',
      name: '开题答辩',
      description: '通过学位论文/毕业设计开题答辩',
      required: true,
      deadline: 36,
    },
    {
      type: 'pre_defense',
      name: '预答辩',
      description: '通过毕业设计预答辩',
      required: true,
      minWeeksBeforeGrad: 4,
    },
    {
      type: 'final_defense',
      name: '正式答辩',
      description: '通过毕业设计正式答辩',
      required: true,
      minWeeksBeforeGrad: 0,
    },
  ],
};

// ============================================================================
// 毕业条件映射
// ============================================================================

/**
 * 学历毕业配置映射
 */
export const graduationConfigs: Record<DegreeType, DegreeGraduationConfig> = {
  master_academic: masterGraduationConfig,
  master_professional: professionalMasterGraduationConfig,
  doctor: doctorGraduationConfig,
};

// ============================================================================
// 毕业状态
// ============================================================================

/**
 * 毕业条件完成状态
 */
export interface GraduationProgress {
  requirement: GraduationRequirement;
  completed: boolean;
  completedWeek?: number;  // 完成时的周数
  deadlineWeek: number;    // 截止周数
  overdue: boolean;        // 是否已超期
}

/**
 * 毕业状态
 */
export interface GraduationStatus {
  degreeType: DegreeType;
  currentWeek: number;
  totalWeeks: number;
  remainingWeeks: number;
  isOverdue: boolean;              // 是否超过正常学制
  canExtend: boolean;              // 是否可以延毕
  extendWeeksUsed: number;         // 已延期周数
  maxExtendWeeks: number;          // 最大延期周数
  progress: GraduationProgress[];  // 各项条件完成情况
  overallProgress: number;         // 总体完成度 (0-100)
  canGraduate: boolean;            // 是否可以毕业
  blockedBy: GraduationRequirementType[]; // 未完成的必须条件
}

// ============================================================================
// 工具函数
// ============================================================================

/**
 * 获取学历毕业配置
 */
export function getGraduationConfig(degreeType: DegreeType): DegreeGraduationConfig {
  return graduationConfigs[degreeType];
}

/**
 * 计算毕业状态
 */
export function calculateGraduationStatus(
  degreeType: DegreeType,
  currentWeek: number,
  completedRequirements: Partial<Record<GraduationRequirementType, { completed: boolean; week?: number }>>
): GraduationStatus {
  const config = graduationConfigs[degreeType];

  // 计算各项条件进度
  const progress: GraduationProgress[] = config.requirements.map(req => {
    const completed = completedRequirements[req.type]?.completed ?? false;
    const completedWeek = completedRequirements[req.type]?.week;
    const deadlineWeek = req.deadline ?? config.totalWeeks;

    return {
      requirement: req,
      completed,
      completedWeek,
      deadlineWeek,
      overdue: !completed && currentWeek > deadlineWeek,
    };
  });

  // 计算总体完成度
  const requiredCount = config.requirements.filter(r => r.required).length;
  const completedCount = progress.filter(p => p.completed && p.requirement.required).length;
  const overallProgress = Math.round((completedCount / requiredCount) * 100);

  // 检查是否超期
  const isOverdue = currentWeek > config.totalWeeks;
  const extendWeeksUsed = isOverdue ? currentWeek - config.totalWeeks : 0;
  const canExtend = extendWeeksUsed < config.maxExtendWeeks;

  // 检查是否可以毕业
  const blockedBy = progress
    .filter(p => !p.completed && p.requirement.required)
    .map(p => p.requirement.type);

  const canGraduate = blockedBy.length === 0;

  return {
    degreeType,
    currentWeek,
    totalWeeks: config.totalWeeks,
    remainingWeeks: Math.max(0, config.totalWeeks + config.maxExtendWeeks - currentWeek),
    isOverdue,
    canExtend,
    extendWeeksUsed,
    maxExtendWeeks: config.maxExtendWeeks,
    progress,
    overallProgress,
    canGraduate,
    blockedBy,
  };
}

/**
 * 获取下一项待完成的毕业条件
 */
export function getNextRequirement(
  status: GraduationStatus
): GraduationProgress | null {
  const incomplete = status.progress.filter(p => !p.completed && p.requirement.required);
  if (incomplete.length === 0) return null;

  // 按截止日期排序，返回最近的
  return incomplete.sort((a, b) => a.deadlineWeek - b.deadlineWeek)[0];
}

/**
 * 格式化毕业状态显示
 */
export function formatGraduationStatus(status: GraduationStatus): {
  timeStatus: string;      // 时间状态
  progressStatus: string;  // 进度状态
  warningLevel: 'normal' | 'warning' | 'danger';
} {
  const degreeName = degreeConfigs[status.degreeType].name;

  let timeStatus: string;
  let warningLevel: 'normal' | 'warning' | 'danger';

  if (status.isOverdue) {
    const extendSemesters = Math.ceil(status.extendWeeksUsed / 18);
    timeStatus = `${degreeName} · 已延${extendSemesters}学期`;
    warningLevel = status.canExtend ? 'warning' : 'danger';
  } else {
    const semestersRemaining = Math.ceil(status.remainingWeeks / 18);
    timeStatus = `${degreeName} · 剩余${semestersRemaining}学期`;
    warningLevel = status.remainingWeeks < 18 ? 'warning' : 'normal';
  }

  const progressStatus = `毕业条件完成度 ${status.overallProgress}%`;

  return {
    timeStatus,
    progressStatus,
    warningLevel,
  };
}

export default {
  graduationConfigs,
  masterGraduationConfig,
  doctorGraduationConfig,
  professionalMasterGraduationConfig,
  getGraduationConfig,
  calculateGraduationStatus,
  getNextRequirement,
  formatGraduationStatus,
};
