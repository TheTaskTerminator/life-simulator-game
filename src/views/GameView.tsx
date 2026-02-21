import { useState, useCallback } from 'react';
import { Event, Choice, Player } from '../types';
import { useGameStateContext } from '../hooks/GameStateContext';
import { useGameEffects } from '../hooks/useGameEffects';
import { stageService } from '../services/stageService';
import { useEventHandlers } from './event';
import { useCareerHandlers } from './career';
import { useEducationHandlers } from './education';
import { useRelationshipHandlers } from './relationship';
import { useModalState } from '../features/modal';
import { GAME_CONFIG } from '../config/gameConfig';
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
import EndingScreen from '../components/EndingScreen';

export default function GameView() {
  const {
    player,
    setPlayer,
    setPlayerAndCheckEnding,
    logs,
    addLog,
    ageUp,
    incrementManualTrigger,
    gamePhase,
    endingResult,
    endingEvaluation,
    resetGame,
  } = useGameStateContext();

  // 所有 hooks 必须在条件返回之前调用
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

  // 应用游戏副作用 - 需要在条件返回之前调用
  useGameEffects(player, setPlayer);

  // 使用各个模块的Handlers - 需要在条件返回之前调用
  const eventHandlers = useEventHandlers({
    player: player!,
    setPlayer: setPlayerAndCheckEnding as (player: Player | ((prev: Player) => Player)) => void,
    addLog,
  });

  const careerHandlers = useCareerHandlers({
    player: player!,
    setPlayer: setPlayer as (player: Player | ((prev: Player) => Player)) => void,
    addLog,
  });

  const educationHandlers = useEducationHandlers({
    player: player!,
    setPlayer: setPlayer as (player: Player | ((prev: Player) => Player)) => void,
    addLog,
  });

  const _relationshipHandlers = useRelationshipHandlers({
    player: player!,
    setPlayer: setPlayer as (player: Player | ((prev: Player) => Player)) => void,
    addLog,
  });

  // 触发事件
  const handleTriggerEvent = useCallback(async () => {
    if (!player || isLoading) return;

    // 检查手动触发次数限制
    const currentCount = player.manualEventTriggersThisYear ?? 0;
    const maxTriggers = GAME_CONFIG.parameters.max_manual_triggers_per_year;
    if (currentCount >= maxTriggers) {
      addLog('system', `今年已达到手动触发上限（${maxTriggers}次），请等待明年`);
      return;
    }

    setIsLoading(true);
    try {
      const event = await eventHandlers.handleTriggerEvent();
      if (event) {
        setCurrentEvent(event);
        setIsEventModalOpen(true);
        incrementManualTrigger();
      }
    } catch (error) {
      console.error('生成事件失败:', error);
      addLog('system', '生成事件失败，请重试');
    } finally {
      setIsLoading(false);
    }
  }, [player, isLoading, eventHandlers, addLog, incrementManualTrigger]);

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

      // 更新年龄（包含自动升学检查）
      ageUp();

      // 如果有阶段转换事件，显示它
      if (newStage && stageEvent) {
        setCurrentEvent(stageEvent);
        setIsEventModalOpen(true);
        addLog('stage', `进入新阶段：${newStage}`);
      } else {
        // 没有阶段转换事件时，自动触发普通事件
        const event = await eventHandlers.handleTriggerEvent();
        if (event) {
          setCurrentEvent(event);
          setIsEventModalOpen(true);
        }
      }
    } catch (error) {
      console.error('处理年龄增长失败:', error);
      addLog('system', '处理年龄增长时发生错误');
    } finally {
      setIsLoading(false);
    }
  }, [player, isLoading, ageUp, addLog, eventHandlers]);

  // 条件返回放在所有 hooks 之后
  // 如果游戏结束，显示结局界面
  if (gamePhase === 'ended' && endingResult && endingEvaluation) {
    return (
      <EndingScreen
        result={endingResult}
        evaluation={endingEvaluation}
        onRestart={resetGame}
      />
    );
  }

  // 如果没有玩家数据，返回 null
  if (!player) {
    return null;
  }

  return (
    <div className="game-view">
      {/* 星空背景 */}
      <div className="starfield">
        {[...Array(60)].map((_, i) => (
          <div
            key={i}
            className="star"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${2 + Math.random() * 3}s`,
            }}
          />
        ))}
      </div>

      <div className="game-container">
        {/* 头部 */}
        <div className="game-header">
          <div className="header-title">
            <span className="title-icon">☽</span>
            <h1>命运之轮</h1>
          </div>
          <div className="game-actions">
            <button
              onClick={handleAgeUp}
              disabled={isLoading}
              className="btn-primary"
            >
              {isLoading ? '命运转动中...' : '长一岁'}
            </button>
            <button
              onClick={handleTriggerEvent}
              disabled={isLoading}
              className="btn-secondary"
              title={`本年剩余次数：${GAME_CONFIG.parameters.max_manual_triggers_per_year - (player?.manualEventTriggersThisYear ?? 0)}`}
            >
              触发事件 ({GAME_CONFIG.parameters.max_manual_triggers_per_year - (player?.manualEventTriggersThisYear ?? 0)})
            </button>
            <div className="action-divider" />
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

        {/* 主内容区 */}
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
          background: linear-gradient(135deg, #0a0a1a 0%, #1a1a3e 50%, #0f0f2a 100%);
          padding: 20px;
          position: relative;
          font-family: 'Noto Sans SC', sans-serif;
        }

        /* 星空背景 */
        .starfield {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          pointer-events: none;
          z-index: 0;
        }

        .star {
          position: absolute;
          width: 2px;
          height: 2px;
          background: white;
          border-radius: 50%;
          animation: twinkle 2s infinite ease-in-out;
        }

        @keyframes twinkle {
          0%, 100% { opacity: 0.3; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.5); }
        }

        .game-container {
          position: relative;
          z-index: 1;
          max-width: 1200px;
          margin: 0 auto;
        }

        /* 头部 */
        .game-header {
          background: linear-gradient(160deg, rgba(20, 20, 35, 0.9) 0%, rgba(15, 15, 28, 0.95) 100%);
          border: 1px solid rgba(212, 175, 55, 0.2);
          border-radius: 12px;
          padding: 16px 24px;
          margin-bottom: 20px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          box-shadow:
            0 4px 20px rgba(0, 0, 0, 0.4),
            inset 0 1px 0 rgba(212, 175, 55, 0.1);
        }

        .header-title {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .title-icon {
          font-size: 24px;
          color: #d4af37;
          animation: pulse 2s ease-in-out infinite;
        }

        @keyframes pulse {
          0%, 100% { opacity: 0.7; }
          50% { opacity: 1; }
        }

        .header-title h1 {
          margin: 0;
          font-family: 'Cinzel', serif;
          font-size: 1.5em;
          background: linear-gradient(180deg, #d4af37 0%, #f5d47e 50%, #d4af37 100%);
          -webkit-background-clip: text;
          background-clip: text;
          color: transparent;
          letter-spacing: 4px;
        }

        .game-actions {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .action-divider {
          width: 1px;
          height: 32px;
          background: rgba(212, 175, 55, 0.2);
          margin: 0 4px;
        }

        .btn-primary,
        .btn-secondary {
          padding: 10px 20px;
          border: 1px solid rgba(212, 175, 55, 0.4);
          border-radius: 8px;
          font-size: 14px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.3s ease;
          font-family: 'Noto Sans SC', sans-serif;
        }

        .btn-primary {
          background: linear-gradient(135deg, rgba(212, 175, 55, 0.2) 0%, rgba(180, 140, 40, 0.15) 100%);
          color: #d4af37;
        }

        .btn-primary:hover:not(:disabled) {
          background: linear-gradient(135deg, rgba(212, 175, 55, 0.3) 0%, rgba(180, 140, 40, 0.25) 100%);
          border-color: #d4af37;
          box-shadow: 0 0 20px rgba(212, 175, 55, 0.3);
          transform: translateY(-2px);
        }

        .btn-secondary {
          background: rgba(255, 255, 255, 0.05);
          color: #c0c0d0;
        }

        .btn-secondary:hover:not(:disabled) {
          background: rgba(255, 255, 255, 0.1);
          border-color: rgba(255, 255, 255, 0.3);
        }

        .btn-primary:disabled,
        .btn-secondary:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .btn-icon {
          padding: 10px;
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 8px;
          font-size: 18px;
          background: rgba(255, 255, 255, 0.03);
          color: #c0c0d0;
          cursor: pointer;
          transition: all 0.3s ease;
          min-width: 44px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .btn-icon:hover {
          background: rgba(212, 175, 55, 0.1);
          border-color: rgba(212, 175, 55, 0.4);
          color: #d4af37;
          transform: translateY(-2px);
        }

        /* 内容区 */
        .game-content {
          display: grid;
          grid-template-columns: 1fr 380px;
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

        /* 响应式 */
        @media (max-width: 768px) {
          .game-header {
            flex-direction: column;
            gap: 16px;
            padding: 16px;
          }

          .game-actions {
            flex-wrap: wrap;
            justify-content: center;
          }

          .action-divider {
            display: none;
          }

          .header-title h1 {
            font-size: 1.2em;
          }
        }

        @media (max-width: 500px) {
          .game-view {
            padding: 12px;
          }

          .btn-primary,
          .btn-secondary {
            padding: 8px 16px;
            font-size: 13px;
          }

          .btn-icon {
            padding: 8px;
            min-width: 40px;
            font-size: 16px;
          }
        }
      `}</style>
    </div>
  );
}
