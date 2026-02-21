import { TopicPackage } from '../../core/types/base';
import { topicConfig } from './topic.config';
import { metricsConfig } from './metrics.config';
import { stagesConfig } from './stages.config';
import { endingsConfig } from './endings.config';
import { themeConfig } from './theme.config';
import { textsConfig } from './texts.config';
import { promptsConfig } from './prompts.config';

/**
 * 科研模拟器话题包
 *
 * 这是扩展话题包示例，展示如何创建新的模拟器话题。
 * 包含学术生涯的属性、阶段、结局、主题、文案和 AI Prompt 配置。
 */
export const researchTopicPackage: TopicPackage = {
  config: topicConfig,
  metrics: metricsConfig,
  stages: stagesConfig,
  endings: endingsConfig,
  theme: themeConfig,
  texts: textsConfig,
  prompts: promptsConfig,
};

export default researchTopicPackage;

// 导出各配置模块
export { topicConfig } from './topic.config';
export { metricsConfig } from './metrics.config';
export type { ResearchMetricKey } from './metrics.config';
export {
  stagesConfig,
  masterStages,
  doctorStages,
  getStageNames,
  getStageByWeek,
  getStageInfo,
  getYearInSchool,
  formatYearInSchool,
} from './stages.config';
export type { ResearchStageKey } from './stages.config';
export { themeConfig } from './theme.config';
export {
  textsConfig,
  academicPositionTexts,
  researchFieldTexts,
} from './texts.config';
export { promptsConfig } from './prompts.config';

// 时间系统
export {
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
} from './time.config';
export type {
  SemesterType,
  SemesterConfig,
  DegreeType,
  DegreeConfig,
  WeekDay,
  WeekDayConfig,
  SpecialWeekType,
  SpecialWeekConfig,
  GameTime,
} from './time.config';

// 毕业条件系统
export {
  graduationConfigs,
  masterGraduationConfig,
  doctorGraduationConfig,
  professionalMasterGraduationConfig,
  getGraduationConfig,
  calculateGraduationStatus,
  getNextRequirement,
  formatGraduationStatus,
} from './graduation.config';
export type {
  GraduationRequirementType,
  GraduationRequirement,
  DegreeGraduationConfig,
  GraduationProgress,
  GraduationStatus,
} from './graduation.config';

// 事件系统
export {
  dailyEvents,
  ethicsEvents,
  relationshipEvents,
  pressureEvents,
  milestoneEvents,
  allEvents,
  getEventsByType,
  getAvailableEvents,
  selectRandomEvent,
} from './events.config';
export type {
  ResearchEventType,
  PredefinedEvent,
  EventChoice,
} from './events.config';

// 导师系统
export {
  mentorTypes,
  favorLevels,
  favorModifiers,
  commonMentorEvents,
  allMentorEvents,
  getFavorLevel,
  getFavorEffects,
} from './mentors.config';
export type {
  MentorType,
  MentorPersonality,
  MentorTypeConfig,
  FavorLevel,
  MentorEvent,
} from './mentors.config';

// 学术热点系统
export {
  hotspotStatusEffects,
  predefinedHotspots,
  hotspotGenerationConfig,
  strategyConfigs,
  hotspotEvents,
  getHotspotEffects,
  calculateHotspotSuccessRate,
  updateHotspotStatus,
} from './hotspots.config';
export type {
  HotspotStatus,
  ResearchField,
  HotspotConfig,
  HotspotState,
  PlayerResearchFocus,
  StrategyType,
  HotspotEvent,
} from './hotspots.config';

// 结局系统
export {
  endingsConfig,
  graduationEndings,
  developmentEndings,
  specialEndings,
  allDetailedEndings,
  endingScoreFactors,
  calculateEndingScore,
  getEndingByScore,
} from './endings.config';
export type {
  EndingCategory,
  DetailedEnding,
} from './endings.config';
