import { useCallback } from 'react';
import { Player, EducationLevel, LogEntry } from '../../types';
import { educationService } from '../../services/educationService';
import { EDUCATION_NAMES } from '../../constants';

export interface EducationHandlerProps {
  player: Player;
  setPlayer: (player: Player | ((prev: Player) => Player)) => void;
  addLog: (type: LogEntry['type'], message: string, data?: unknown) => void;
}

export function useEducationHandlers({
  player,
  setPlayer,
  addLog,
}: EducationHandlerProps) {
  /**
   * 获取可用教育水平
   * 使用 educationService 来获取可用选项
   */
  const getAvailableEducationLevels = useCallback((): EducationLevel[] => {
    return educationService.getAvailableEducationLevels(player);
  }, [player]);

  /**
   * 选择教育水平
   */
  const handleSelectEducation = useCallback(
    (level: EducationLevel) => {
      // 使用 educationService 验证
      const result = educationService.canUpgradeTo(player, level);

      if (!result.canUpgrade) {
        addLog('system', result.reason || '无法选择此教育水平');
        return;
      }

      setPlayer((prevPlayer) => ({
        ...prevPlayer,
        education: level,
      }));

      addLog('system', `🎓 教育水平提升：${EDUCATION_NAMES[level]}`);
    },
    [player, setPlayer, addLog]
  );

  return {
    getAvailableEducationLevels,
    handleSelectEducation,
  };
}

