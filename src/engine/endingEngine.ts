import { Player } from '../types';
import { GAME_CONFIG } from '../config/gameConfig';
import type { Ending, EndingResult, EndingEvaluation } from '../types/ending';

/**
 * 结局引擎
 * 负责检查游戏结束条件和评价玩家人生
 */
export class EndingEngine {
  private endings: Map<string, Ending>;

  constructor() {
    this.endings = new Map();
    this.initEndings();
  }

  /**
   * 初始化结局定义
   */
  private initEndings(): void {
    // 硬结局
    const hardEndings = Object.values(GAME_CONFIG.endings.hard);
    hardEndings.forEach((ending) => {
      this.endings.set(ending.id, ending as Ending);
    });

    // 软结局
    const softEndings = Object.values(GAME_CONFIG.endings.soft);
    softEndings.forEach((ending) => {
      this.endings.set(ending.id, ending as Ending);
    });
  }

  /**
   * 获取结局定义
   */
  getEnding(endingId: string): Ending | undefined {
    return this.endings.get(endingId);
  }

  /**
   * 检查硬结局条件
   * 每次状态变化后调用
   */
  checkHardEnding(player: Player): Ending | null {
    // 健康值归零
    if (player.attributes.health <= 0) {
      return this.getEnding('ending_health_death') || null;
    }

    // 年龄达到上限
    if (player.age >= GAME_CONFIG.parameters.max_age) {
      return this.getEnding('ending_age_limit') || null;
    }

    return null;
  }

  /**
   * 评价软结局
   * 根据玩家的综合表现给出结局
   */
  evaluateSoftEnding(player: Player): Ending {
    const evaluation = this.evaluatePlayer(player);
    const score = evaluation.totalScore;

    // 根据分数选择结局
    const softEndings = Object.values(GAME_CONFIG.endings.soft);

    // 按分数阈值降序排序
    const sortedEndings = softEndings.sort(
      (a, b) => (b.scoreThreshold ?? 0) - (a.scoreThreshold ?? 0)
    );

    for (const ending of sortedEndings) {
      if (score >= (ending.scoreThreshold ?? 0)) {
        return ending as Ending;
      }
    }

    // 默认返回最差的结局
    return this.getEnding('ending_regret') || sortedEndings[sortedEndings.length - 1] as Ending;
  }

  /**
   * 评价玩家人生
   */
  evaluatePlayer(player: Player): EndingEvaluation {
    const { health, wealth, happiness } = player.attributes;

    // 计算各项得分（0-1 范围）
    const healthScore = health / 100;
    const wealthScore = Math.min(wealth / 500000, 1); // 50万为满分基准
    const happinessScore = happiness / 100;

    // 加权总分（健康40%、财富30%、幸福30%）
    const totalScore = healthScore * 0.4 + wealthScore * 0.3 + happinessScore * 0.3;

    // 计算等级
    let grade: EndingEvaluation['grade'];
    if (totalScore >= 0.9) grade = 'S';
    else if (totalScore >= 0.8) grade = 'A';
    else if (totalScore >= 0.6) grade = 'B';
    else if (totalScore >= 0.4) grade = 'C';
    else if (totalScore >= 0.2) grade = 'D';
    else grade = 'F';

    return {
      healthScore,
      wealthScore,
      happinessScore,
      totalScore,
      grade,
    };
  }

  /**
   * 生成结局结果
   */
  generateEndingResult(player: Player, ending: Ending): EndingResult {
    const evaluation = this.evaluatePlayer(player);

    return {
      ending,
      score: evaluation.totalScore,
      stats: {
        finalAge: player.age,
        totalEvents: player.eventHistory.length,
        totalChoices: player.choices.length,
        achievements: player.achievements.length,
        finalWealth: player.attributes.wealth,
        avgHappiness: this.calculateAvgHappiness(player),
      },
    };
  }

  /**
   * 计算平均幸福度（基于事件历史估算）
   */
  private calculateAvgHappiness(player: Player): number {
    // 简单估算：当前幸福度作为平均值的参考
    // 未来可以基于事件历史计算更准确的平均值
    return player.attributes.happiness;
  }

  /**
   * 获取结局描述（含动态内容）
   */
  getEndingDescription(player: Player, ending: Ending): string {
    const evaluation = this.evaluatePlayer(player);

    let description = ending.description;

    // 添加个性化内容
    const ageText = player.age >= 100 ? '百年人生' : `${player.age}岁`;
    const wealthText = player.attributes.wealth >= 500000
      ? '财富自由'
      : player.attributes.wealth >= 100000
        ? '小有积蓄'
        : '手头拮据';

    description += `\n\n你活到了${ageText}，最终${wealthText}。`;
    description += `\n综合评价：${evaluation.grade} 级`;

    return description;
  }
}

// 导出单例
export const endingEngine = new EndingEngine();
