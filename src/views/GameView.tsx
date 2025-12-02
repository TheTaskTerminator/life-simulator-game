import { useState, useCallback } from 'react';
import { Player, Event, Choice, LogEntry } from '../types';
import { useGameState } from '../hooks/useGameState';
import { useGameEffects } from '../hooks/useGameEffects';
import { eventService } from '../services/eventService';
import { stageService } from '../services/stageService';
import { useEventHandlers } from './event';
import { useCareerHandlers } from './career';
import { useEducationHandlers } from './education';
import { useRelationshipHandlers } from './relationship';
import { useModalState } from '../features/modal';
import StatsPanel from '../components/StatsPanel';
import EventModal from '../components/EventModal';
import LogPanel from '../components/LogPanel';
import CharacterModal from '../components/CharacterModal';
import CareerModal from '../components/CareerModal';
import EducationModal from '../components/EducationModal';
import RelationshipModal from '../components/RelationshipModal';
import PropertyModal from '../components/PropertyModal';
import AchievementModal from '../components/AchievementModal';
import SettingsModal from '../components/SettingsModal';

export default function GameView() {
  const {
    player,
    setPlayer,
    logs,
    addLog,
    ageUp,
  } = useGameState();

  const [currentEvent, setCurrentEvent] = useState<Event | null>(null);
  const [isEventModalOpen, setIsEventModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // 模态框状态
  const characterModal = useModalState();
  const careerModal = useModalState();
  const educationModal = useModalState();
  const relationshipModal = useModalState();
  const propertyModal = useModalState();
  const achievementModal = useModalState();
  const settingsModal = useModalState();

  // 应用游戏副作用
  useGameEffects(player, setPlayer);

  // 使用各个模块的Handlers
  const eventHandlers = useEventHandlers({
    player,
    setPlayer,
    addLog,
  });

  const careerHandlers = useCareerHandlers({
    player,
    setPlayer,
    addLog,
  });

  const educationHandlers = useEducationHandlers({
    player,
    setPlayer,
    addLog,
  });

  const relationshipHandlers = useRelationshipHandlers({
    player,
    setPlayer,
    addLog,
  });

  // 触发事件
  const handleTriggerEvent = useCallback(async () => {
    if (!player || isLoading) return;

    setIsLoading(true);
    try {
      const event = await eventHandlers.handleTriggerEvent();
      if (event) {
        setCurrentEvent(event);
        setIsEventModalOpen(true);
      }
    } catch (error) {
      console.error('生成事件失败:', error);
      addLog('system', '生成事件失败，请重试');
    } finally {
      setIsLoading(false);
    }
  }, [player, isLoading, eventHandlers, addLog]);

  // 处理选择
  const handleChoice = useCallback(
    async (choice: Choice) => {
      if (!player || !currentEvent || isLoading) return;

      setIsLoading(true);
      setIsEventModalOpen(false);
      try {
        await eventHandlers.handleChoice(currentEvent, choice);
      } catch (error) {
        console.error('处理选择失败:', error);
        addLog('system', '处理选择时发生错误，请重试');
      } finally {
        setIsLoading(false);
      }
    },
    [player, currentEvent, eventHandlers, isLoading, addLog]
  );

  // 处理年龄增长
  const handleAgeUp = useCallback(async () => {
    if (!player || isLoading) return;

    setIsLoading(true);
    try {
      const newAge = player.age + 1;
      const { newStage, stageEvent } = await stageService.handleStageTransition(
        player,
        newAge
      );

      // 更新年龄
      ageUp();

      // 如果有阶段转换事件，显示它
      if (newStage && stageEvent) {
        setCurrentEvent(stageEvent);
        setIsEventModalOpen(true);
        addLog('stage', `进入新阶段：${newStage}`);
      }
    } catch (error) {
      console.error('处理年龄增长失败:', error);
    } finally {
      setIsLoading(false);
    }
  }, [player, isLoading, ageUp, addLog]);

  if (!player) {
    return null;
  }

  return (
    <div className="game-view">
      <div className="game-container">
        <div className="game-header">
          <h1>🌟 人生模拟器 🌟</h1>
          <div className="game-actions">
            <button
              onClick={handleTriggerEvent}
              disabled={isLoading}
              className="btn-primary"
            >
              {isLoading ? '生成中...' : '触发事件'}
            </button>
            <button
              onClick={handleAgeUp}
              disabled={isLoading}
              className="btn-secondary"
            >
              年龄 +1
            </button>
            <button
              onClick={characterModal.open}
              className="btn-icon"
              title="角色信息"
            >
              👤
            </button>
            <button
              onClick={careerModal.open}
              className="btn-icon"
              title="职业"
            >
              💼
            </button>
            <button
              onClick={educationModal.open}
              className="btn-icon"
              title="教育"
            >
              🎓
            </button>
            <button
              onClick={relationshipModal.open}
              className="btn-icon"
              title="人际关系"
            >
              💑
            </button>
            <button
              onClick={propertyModal.open}
              className="btn-icon"
              title="房产"
            >
              🏠
            </button>
            <button
              onClick={achievementModal.open}
              className="btn-icon"
              title="成就"
            >
              🏆
            </button>
            <button
              onClick={settingsModal.open}
              className="btn-icon"
              title="设置"
            >
              ⚙️
            </button>
          </div>
        </div>

        <div className="game-content">
          <div className="game-main">
            <StatsPanel player={player} />
          </div>
          <div className="game-sidebar">
            <LogPanel logs={logs} />
          </div>
        </div>
      </div>

      <EventModal
        event={currentEvent}
        isOpen={isEventModalOpen}
        onChoice={handleChoice}
        onClose={() => setIsEventModalOpen(false)}
      />

      <CharacterModal
        player={player}
        isOpen={characterModal.isOpen}
        onClose={characterModal.close}
      />

      <CareerModal
        player={player}
        availableCareers={careerHandlers.getAvailableCareers()}
        isOpen={careerModal.isOpen}
        onSelect={careerHandlers.handleSelectCareer}
        onClose={careerModal.close}
      />

      <EducationModal
        player={player}
        availableLevels={educationHandlers.getAvailableEducationLevels()}
        isOpen={educationModal.isOpen}
        onSelect={educationHandlers.handleSelectEducation}
        onClose={educationModal.close}
      />

      <RelationshipModal
        player={player}
        isOpen={relationshipModal.isOpen}
        onClose={relationshipModal.close}
      />

      <PropertyModal
        player={player}
        isOpen={propertyModal.isOpen}
        onClose={propertyModal.close}
      />

      <AchievementModal
        player={player}
        isOpen={achievementModal.isOpen}
        onClose={achievementModal.close}
      />

      <SettingsModal
        settings={{
          soundEnabled: true,
          musicEnabled: true,
          autoSave: true,
          aiProvider: 'siliconflow',
        }}
        onUpdate={() => {}}
        isOpen={settingsModal.isOpen}
        onClose={settingsModal.close}
      />

      <style>{`
        .game-view {
          min-height: 100vh;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          padding: 20px;
        }

        .game-container {
          max-width: 1200px;
          margin: 0 auto;
        }

        .game-header {
          background: white;
          border-radius: 12px;
          padding: 20px;
          margin-bottom: 20px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }

        .game-header h1 {
          margin: 0;
          font-size: 1.8em;
          color: #333;
        }

        .game-actions {
          display: flex;
          gap: 12px;
        }

        .btn-primary,
        .btn-secondary {
          padding: 12px 24px;
          border: none;
          border-radius: 8px;
          font-size: 16px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s;
        }

        .btn-primary {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
        }

        .btn-primary:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
        }

        .btn-secondary {
          background: #f0f0f0;
          color: #333;
        }

        .btn-secondary:hover:not(:disabled) {
          background: #e0e0e0;
        }

        .btn-primary:disabled,
        .btn-secondary:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .btn-icon {
          padding: 12px;
          border: none;
          border-radius: 8px;
          font-size: 20px;
          background: #f0f0f0;
          color: #333;
          cursor: pointer;
          transition: all 0.3s;
          min-width: 48px;
        }

        .btn-icon:hover {
          background: #e0e0e0;
          transform: translateY(-2px);
        }

        .game-content {
          display: grid;
          grid-template-columns: 1fr 400px;
          gap: 20px;
        }

        @media (max-width: 968px) {
          .game-content {
            grid-template-columns: 1fr;
          }
        }

        .game-main {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        .game-sidebar {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }
      `}</style>
    </div>
  );
}

