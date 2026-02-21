import { EducationLevel, Player } from '../types';
import { EDUCATION_AGE_RANGES, EDUCATION_NAMES } from '../constants';

/**
 * 自动升学信息
 */
export interface AutoEducationResult {
  upgraded: boolean;
  newLevel: EducationLevel | null;
  message: string;
}

/**
 * 教育服务
 * 处理教育自动升学和手动升学逻辑
 */
export class EducationService {
  /**
   * 根据年龄获取应强制达到的教育等级
   * 规则：
   * - 0-6岁：NONE（学前）
   * - 7岁+：自动升入小学
   * - 12岁+：自动升入初中
   * - 15岁+：自动升入高中
   * - 18岁+：不强制升学，可选择大专/本科/不升学
   */
  getAutoEducationLevel(age: number): EducationLevel {
    if (age >= 18) {
      // 18岁及以后不强制升学
      return EducationLevel.HIGH;
    } else if (age >= 15) {
      return EducationLevel.HIGH;
    } else if (age >= 12) {
      return EducationLevel.MIDDLE;
    } else if (age >= 7) {
      return EducationLevel.PRIMARY;
    } else {
      return EducationLevel.NONE;
    }
  }

  /**
   * 检查是否需要自动升学
   * @returns 如果需要升学，返回升级结果；否则返回 null
   */
  checkAutoEducationUpgrade(player: Player): AutoEducationResult | null {
    const targetLevel = this.getAutoEducationLevel(player.age);
    const currentLevelIndex = this.getEducationIndex(player.education);
    const targetLevelIndex = this.getEducationIndex(targetLevel);

    // 18岁及以后不强制升学
    if (player.age >= 18) {
      return null;
    }

    // 如果当前等级已达到或超过目标等级，不需要升级
    if (currentLevelIndex >= targetLevelIndex) {
      return null;
    }

    // 需要自动升级
    return {
      upgraded: true,
      newLevel: targetLevel,
      message: `📚 自动升学：${EDUCATION_NAMES[targetLevel]}`,
    };
  }

  /**
   * 获取教育等级的索引（用于比较）
   */
  getEducationIndex(level: EducationLevel): number {
    const order: EducationLevel[] = [
      EducationLevel.NONE,
      EducationLevel.PRIMARY,
      EducationLevel.MIDDLE,
      EducationLevel.HIGH,
      EducationLevel.COLLEGE,
      EducationLevel.BACHELOR,
      EducationLevel.MASTER,
      EducationLevel.DOCTOR,
    ];
    return order.indexOf(level);
  }

  /**
   * 获取教育等级的年龄范围
   */
  getEducationAgeRange(level: EducationLevel): { minAge: number; maxAge: number } {
    return EDUCATION_AGE_RANGES[level];
  }

  /**
   * 验证是否可以手动升学到指定等级
   * @returns { canUpgrade: boolean, reason: string }
   */
  canUpgradeTo(
    player: Player,
    targetLevel: EducationLevel
  ): { canUpgrade: boolean; reason: string } {
    const currentIndex = this.getEducationIndex(player.education);
    const targetIndex = this.getEducationIndex(targetLevel);

    // 不能降级
    if (targetIndex <= currentIndex) {
      return { canUpgrade: false, reason: '不能选择更低的教育水平' };
    }

    // 高中毕业后可以选择大专或本科（允许跳过某些等级）
    if (player.education === EducationLevel.HIGH) {
      if (targetLevel !== EducationLevel.COLLEGE && targetLevel !== EducationLevel.BACHELOR) {
        return { canUpgrade: false, reason: '高中毕业后只能选择大专或本科' };
      }
      return { canUpgrade: true, reason: '' };
    }

    // 大专毕业后可以专升本（升本科）
    if (player.education === EducationLevel.COLLEGE) {
      if (targetLevel === EducationLevel.BACHELOR) {
        return { canUpgrade: true, reason: '' };
      }
      if (targetLevel === EducationLevel.MASTER || targetLevel === EducationLevel.DOCTOR) {
        return { canUpgrade: false, reason: '大专毕业后需要先专升本才能继续深造' };
      }
    }

    // 本科毕业后可以读研
    if (player.education === EducationLevel.BACHELOR) {
      if (targetLevel === EducationLevel.MASTER || targetLevel === EducationLevel.DOCTOR) {
        return { canUpgrade: true, reason: '' };
      }
    }

    // 研究生毕业后可以读博
    if (player.education === EducationLevel.MASTER) {
      if (targetLevel === EducationLevel.DOCTOR) {
        return { canUpgrade: true, reason: '' };
      }
    }

    // 只能逐级升学（对于高中以下的等级）
    if (targetIndex > currentIndex + 1 && player.age < 18) {
      return { canUpgrade: false, reason: '只能逐级升学' };
    }

    return { canUpgrade: true, reason: '' };
  }

  /**
   * 获取可用的教育升级选项
   */
  getAvailableEducationLevels(player: Player): EducationLevel[] {
    const allLevels: EducationLevel[] = [
      EducationLevel.COLLEGE,
      EducationLevel.BACHELOR,
      EducationLevel.MASTER,
      EducationLevel.DOCTOR,
    ];

    return allLevels.filter((level) => {
      const result = this.canUpgradeTo(player, level);
      return result.canUpgrade;
    });
  }

  /**
   * 获取学前阶段（18岁以下）应该达到的最低教育等级
   */
  getMinEducationForAge(age: number): EducationLevel {
    return this.getAutoEducationLevel(age);
  }
}

// 导出单例
export const educationService = new EducationService();
