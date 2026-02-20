import { Player, PlayerAttributes, EventEffect } from '../types';
import { EducationLevel, CareerLevel } from '../types';
import { CAREER_LEVEL_MULTIPLIERS } from '../constants';
import { GAME_CONFIG } from '../config/gameConfig';

/**
 * 数值边界 clamp 工具函数
 */
function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}

/**
 * 计算教育加成
 */
function getEducationBonus(education: EducationLevel): Partial<PlayerAttributes> {
  const bonuses: Record<EducationLevel, Partial<PlayerAttributes>> = {
    [EducationLevel.PRIMARY]: { intelligence: 0 },
    [EducationLevel.MIDDLE]: { intelligence: 5 },
    [EducationLevel.HIGH]: { intelligence: 10 },
    [EducationLevel.BACHELOR]: { intelligence: 20 },
    [EducationLevel.MASTER]: { intelligence: 30 },
    [EducationLevel.DOCTOR]: { intelligence: 40 },
  };

  return bonuses[education] || {};
}

/**
 * 计算职业加成
 */
function getCareerBonus(
  career: { baseSalary: number } | null,
  level: CareerLevel
): Partial<PlayerAttributes> {
  if (!career) return {};

  const multiplier = CAREER_LEVEL_MULTIPLIERS[level] || 1;
  const incomeBonus = career.baseSalary * multiplier * 0.1; // 收入对幸福度的轻微影响

  return {
    happiness: Math.min(10, incomeBonus / 1000),
  };
}

/**
 * 计算属性（包含所有加成）
 */
export function calculateAttributes(player: Player): PlayerAttributes {
  const base = { ...player.attributes };

  // 教育加成
  const educationBonus = getEducationBonus(player.education);
  base.intelligence = Math.min(100, base.intelligence + (educationBonus.intelligence || 0));

  // 职业加成
  const careerBonus = getCareerBonus(player.career, player.careerLevel);
  base.happiness = Math.min(100, base.happiness + (careerBonus.happiness || 0));

  // 关系加成（伴侣和子女增加幸福度）
  if (player.partner) {
    base.happiness = Math.min(100, base.happiness + 5);
  }
  if (player.children.length > 0) {
    base.happiness = Math.min(100, base.happiness + player.children.length * 3);
  }

  return base;
}

/**
 * 应用事件效果
 * 使用 GameConfig 进行数值边界保护
 */
export function applyEventEffects(
  player: Player,
  effects: EventEffect[]
): Player {
  const updated = { ...player };
  updated.attributes = { ...updated.attributes };

  const bounds = GAME_CONFIG.parameters.metric_bounds;
  const maxEffect = GAME_CONFIG.parameters.max_effect_value;

  effects.forEach((effect) => {
    if (effect.type === 'attribute' && effect.attribute) {
      const attrKey = effect.attribute;

      // 1. 单次效果值 clamp（防止 AI 返回超大值）
      let clampedValue = clamp(
        effect.value,
        -maxEffect.attribute,
        maxEffect.attribute
      );

      // 2. 应用效果
      const currentValue = updated.attributes[attrKey];
      let newValue = currentValue + clampedValue;

      // 3. 应用后 clamp 到边界
      const bound = bounds[attrKey];
      if (bound) {
        newValue = clamp(newValue, bound.min, bound.max === Infinity ? Number.MAX_SAFE_INTEGER : bound.max);
      }

      updated.attributes[attrKey] = newValue;
    } else if (effect.type === 'wealth') {
      // 财富单独处理（无上限但有下限）
      let clampedWealthValue = clamp(
        effect.value,
        -maxEffect.wealth,
        maxEffect.wealth
      );

      const newWealth = updated.attributes.wealth + clampedWealthValue;
      updated.attributes.wealth = Math.max(bounds.wealth.min, newWealth);
    }
  });

  return updated;
}

/**
 * 应用年龄效果（自然变化）
 */
export function applyAgeEffects(attributes: PlayerAttributes, age: number): PlayerAttributes {
  const updated = { ...attributes };

  // 随着年龄增长，健康可能下降
  if (age > 40) {
    updated.health = Math.max(0, updated.health - 0.5);
  }
  if (age > 60) {
    updated.health = Math.max(0, updated.health - 1);
  }

  // 压力自然增加（工作压力）
  if (age > 18 && age < 60) {
    updated.stress = Math.min(100, updated.stress + 0.5);
  }

  return updated;
}

import { INITIAL_ATTRIBUTE_RANGE } from '../constants';

/**
 * 随机生成初始属性
 */
export function generateRandomAttributes(): PlayerAttributes {
  const randomInRange = (min: number, max: number) => {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  };

  return {
    health: randomInRange(
      INITIAL_ATTRIBUTE_RANGE.health.min,
      INITIAL_ATTRIBUTE_RANGE.health.max
    ),
    intelligence: randomInRange(
      INITIAL_ATTRIBUTE_RANGE.intelligence.min,
      INITIAL_ATTRIBUTE_RANGE.intelligence.max
    ),
    charm: randomInRange(
      INITIAL_ATTRIBUTE_RANGE.charm.min,
      INITIAL_ATTRIBUTE_RANGE.charm.max
    ),
    wealth: randomInRange(
      INITIAL_ATTRIBUTE_RANGE.wealth.min,
      INITIAL_ATTRIBUTE_RANGE.wealth.max
    ),
    happiness: randomInRange(
      INITIAL_ATTRIBUTE_RANGE.happiness.min,
      INITIAL_ATTRIBUTE_RANGE.happiness.max
    ),
    stress: randomInRange(
      INITIAL_ATTRIBUTE_RANGE.stress.min,
      INITIAL_ATTRIBUTE_RANGE.stress.max
    ),
  };
}

