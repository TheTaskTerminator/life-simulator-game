import { useCallback } from 'react';
import { Player, Event, Choice, LogEntry } from '../../types';
import { eventService } from '../../services/eventService';
import { aiService } from '../../services/aiService';
import { applyEventEffects } from '../../utils/attributeUtils';
import { checkEventConditions, getAvailableChoices } from '../../utils/eventUtils';

export interface EventHandlerProps {
  player: Player;
  setPlayer: (player: Player | ((prev: Player) => Player)) => void;
  addLog: (type: LogEntry['type'], message: string, data?: unknown) => void;
}

export function useEventHandlers({
  player,
  setPlayer,
  addLog,
}: EventHandlerProps) {
  /**
   * 触发事件
   */
  const handleTriggerEvent = useCallback(async () => {
    try {
      const event = await eventService.generateEvent(player);
      
      // 检查事件条件
      if (!checkEventConditions(event, player)) {
        addLog('system', '当前条件不满足该事件');
        return null;
      }

      addLog('event', `遇到了事件：${event.title}`);
      return event;
    } catch (error) {
      console.error('生成事件失败:', error);
      addLog('system', '生成事件失败，请重试');
      return null;
    }
  }, [player, addLog]);

  /**
   * 处理选择
   * 数据完全由AI返回的结果决定，不应用choice.effects
   */
  const handleChoice = useCallback(
    async (event: Event, choice: Choice) => {
      addLog('choice', `选择了：${choice.text}`);

      // 更新事件历史（不更新属性，等AI返回后再更新）
      let updatedPlayer = { ...player };
        updatedPlayer.eventHistory = [...updatedPlayer.eventHistory, event];
        updatedPlayer.choices = [...updatedPlayer.choices, choice];
        updatedPlayer.currentEvent = null;

      // 调用 AI 生成选择后的后果（AI决定所有属性变化）
      try {
        const consequence = await aiService.generateChoiceConsequence(
          player,
          event,
          choice
        );

        // 生成效果描述
        const effectDescriptions: string[] = [];
        if (consequence.effects && consequence.effects.length > 0) {
          consequence.effects.forEach((effect) => {
            if (effect.type === 'attribute' && effect.attribute) {
              const attrNames: Record<string, string> = {
                health: '健康',
                intelligence: '智力',
                charm: '魅力',
                happiness: '幸福度',
                stress: '压力',
              };
              const attrName = attrNames[effect.attribute] || effect.attribute;
              const change = effect.value > 0 ? `+${effect.value}` : `${effect.value}`;
              effectDescriptions.push(`${attrName}${change}`);
            } else if (effect.type === 'wealth') {
              const change = effect.value > 0 ? `+${effect.value}` : `${effect.value}`;
              effectDescriptions.push(`财富${change}元`);
            }
          });
        }

        // 添加后果日志
        if (effectDescriptions.length > 0) {
          addLog(
            'system',
            `📖 ${consequence.description}（${effectDescriptions.join('，')}）`,
            { type: 'consequence', effects: consequence.effects }
          );
        } else {
          addLog('system', `📖 ${consequence.description}`, {
            type: 'consequence',
          });
        }

        // 应用 AI 返回的所有效果（这是唯一的数据来源）
        if (consequence.effects && consequence.effects.length > 0) {
          updatedPlayer = applyEventEffects(updatedPlayer, consequence.effects);
        }

        // 更新玩家状态
        setPlayer(updatedPlayer);

      // 触发随机属性变化事件（30%概率）
        const randomEffects = eventService.generateRandomAttributeEvent(updatedPlayer);
        if (randomEffects && randomEffects.length > 0) {
          updatedPlayer = applyEventEffects(updatedPlayer, randomEffects);

          // 生成随机事件的描述
          const effectDescriptions: string[] = [];
          randomEffects.forEach((effect) => {
            if (effect.type === 'attribute' && effect.attribute) {
              const attrNames: Record<string, string> = {
                health: '健康',
                intelligence: '智力',
                charm: '魅力',
                happiness: '幸福度',
                stress: '压力',
              };
              const attrName = attrNames[effect.attribute] || effect.attribute;
              const change = effect.value > 0 ? `+${effect.value}` : `${effect.value}`;
              effectDescriptions.push(`${attrName}${change}`);
            } else if (effect.type === 'wealth') {
              const change = effect.value > 0 ? `+${effect.value}` : `${effect.value}`;
              effectDescriptions.push(`财富${change}元`);
            }
          });

          if (effectDescriptions.length > 0) {
            addLog(
              'system',
              `💫 生活小插曲：${effectDescriptions.join('，')}`,
              { type: 'random_event', effects: randomEffects }
            );
          }

          // 更新玩家状态
          setPlayer(updatedPlayer);
        }
      } catch (error) {
        console.error('生成选择后果失败:', error);
        addLog('system', '生成选择后果时发生错误', {
          type: 'consequence',
      });
        // 如果 AI 生成失败，仍然更新事件历史
        setPlayer(updatedPlayer);
      }
    },
    [setPlayer, addLog, player]
  );

  /**
   * 获取可用选择
   */
  const getAvailableChoicesForEvent = useCallback(
    (event: Event) => {
      return getAvailableChoices(event, player);
    },
    [player]
  );

  return {
    handleTriggerEvent,
    handleChoice,
    getAvailableChoicesForEvent,
  };
}

