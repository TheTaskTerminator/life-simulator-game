import React, { useState, useCallback, useMemo } from 'react';
import { Event, Choice, Player } from '../types';
import { useGameStateContext } from '../hooks/GameStateContext';
import { useGameEffects } from '../hooks/useGameEffects';
import { useTheme, useTexts } from '../core/context/TopicContext';
import { useEventHandlers } from './event';
import { useModalState } from '../features/modal';
import { DynamicStatsPanel } from '../core/components/base/DynamicStatsPanel';
import EventModal from '../components/EventModal';
import LogPanel from '../components/LogPanel';
import AchievementModal from '../components/AchievementModal';
import SettingsModal from '../components/SettingsModal';
import EndingScreen from '../components/EndingScreen';
import { calculateGameTime } from '../topics/research/time.config';
import { masterStages, doctorStages } from '../topics/research/stages.config';

// ============================================================================
// 辅助函数
// ============================================================================

function getSemesterLabel(week: number): string {
  const gameTime = calculateGameTime(2024, week, 'master_academic');
  const names: Record<string, string> = {
    fall: '🍂 秋季学期',
    spring: '🌸 春季学期',
    winter_break: '❄️ 寒假',
    summer_break: '☀️ 暑假',
  };
  return names[gameTime.semesterType] || '秋季学期';
}

function getStageLabel(week: number, isDoctor: boolean): string {
  const stages = isDoctor ? doctorStages.stages : masterStages.stages;
  const stage = stages.find(s => week >= s.ageRange.min && week <= s.ageRange.max);
  return stage ? `${stage.icon} ${stage.label}` : (isDoctor ? '📚 博一' : '📚 研一');
}

function getTotalWeeks(isDoctor: boolean): number {
  return isDoctor ? 144 : 108;
}

// ============================================================================
// 毕业进度卡片
// ============================================================================

interface GraduationCardProps {
  week: number;
  isDoctor: boolean;
  theme: ReturnType<typeof useTheme>;
}

function GraduationCard({ week, isDoctor, theme }: GraduationCardProps) {
  const totalWeeks = getTotalWeeks(isDoctor);
  const requirements = useMemo(() => {
    if (isDoctor) {
      return [
        { label: '课程学分', icon: '📖', dueWeek: 72, unit: '' },
        { label: '资格考试', icon: '📝', dueWeek: 36, unit: '' },
        { label: '开题答辩', icon: '🎙️', dueWeek: 54, unit: '' },
        { label: '中期考核', icon: '📊', dueWeek: 108, unit: '' },
        { label: '论文发表', icon: '📄', dueWeek: 132, unit: '' },
        { label: '预答辩',   icon: '🔍', dueWeek: 138, unit: '' },
        { label: '正式答辩', icon: '🎓', dueWeek: totalWeeks, unit: '' },
      ];
    }
    return [
      { label: '课程学分', icon: '📖', dueWeek: 72, unit: '' },
      { label: '开题答辩', icon: '🎙️', dueWeek: 54, unit: '' },
      { label: '论文发表', icon: '📄', dueWeek: 96, unit: '' },
      { label: '预答辩',   icon: '🔍', dueWeek: 102, unit: '' },
      { label: '正式答辩', icon: '🎓', dueWeek: totalWeeks, unit: '' },
    ];
  }, [isDoctor, totalWeeks]);

  const completed = requirements.filter(r => week >= r.dueWeek).length;
  const progress = Math.round((week / totalWeeks) * 100);

  const cardStyle: React.CSSProperties = {
    background: theme.colors.card,
    border: `1px solid ${theme.colors.border}`,
    borderRadius: `${theme.borderRadius.lg}px`,
    padding: `${theme.spacing.md}px`,
    marginTop: `${theme.spacing.md}px`,
  };

  const headerStyle: React.CSSProperties = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: `${theme.spacing.sm}px`,
  };

  const titleStyle: React.CSSProperties = {
    fontFamily: theme.fonts.heading,
    fontSize: '16px',
    fontWeight: 600,
    color: theme.colors.text,
  };

  const progressBarTrack: React.CSSProperties = {
    height: '6px',
    background: theme.colors.backgroundSecondary,
    borderRadius: '3px',
    overflow: 'hidden',
    marginBottom: `${theme.spacing.md}px`,
  };

  const progressBarFill: React.CSSProperties = {
    height: '100%',
    width: `${Math.min(100, progress)}%`,
    background: `linear-gradient(90deg, ${theme.colors.accent}, #22c55e)`,
    borderRadius: '3px',
    transition: 'width 0.5s ease',
  };

  return (
    <div style={cardStyle}>
      <div style={headerStyle}>
        <span style={titleStyle}>🎓 毕业进度</span>
        <span style={{ fontSize: '13px', color: theme.colors.accent, fontWeight: 600 }}>
          第 {week} / {totalWeeks} 周 · {progress}%
        </span>
      </div>

      <div style={progressBarTrack}>
        <div style={progressBarFill} />
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
        {requirements.map((req) => {
          const done = week >= req.dueWeek;
          const upcoming = !done && week >= req.dueWeek - 12;
          return (
            <div
              key={req.label}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '6px 8px',
                borderRadius: `${theme.borderRadius.sm}px`,
                background: done
                  ? `${theme.colors.success}15`
                  : upcoming
                    ? `${theme.colors.warning}15`
                    : 'transparent',
              }}
            >
              <span style={{ fontSize: '14px' }}>{req.icon}</span>
              <span style={{
                flex: 1,
                fontSize: '13px',
                color: done ? theme.colors.success : upcoming ? theme.colors.warning : theme.colors.textSecondary,
              }}>
                {req.label}
              </span>
              <span style={{ fontSize: '12px', color: theme.colors.textSecondary }}>
                {done ? '✅ 已完成' : upcoming ? `⚠️ 第${req.dueWeek}周` : `第${req.dueWeek}周`}
              </span>
            </div>
          );
        })}
      </div>

      <div style={{
        marginTop: `${theme.spacing.sm}px`,
        paddingTop: `${theme.spacing.sm}px`,
        borderTop: `1px solid ${theme.colors.border}`,
        fontSize: '12px',
        color: theme.colors.textSecondary,
        textAlign: 'center',
      }}>
        已完成 {completed} / {requirements.length} 项关键节点
      </div>
    </div>
  );
}

// ============================================================================
// 主组件
// ============================================================================

export default function ResearchGameView() {
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

  const theme = useTheme();
  const texts = useTexts();

  const [currentEvent, setCurrentEvent] = useState<Event | null>(null);
  const [isEventModalOpen, setIsEventModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const achievementModal = useModalState();
  const settingsModal = useModalState();

  useGameEffects(player, setPlayer);

  const eventHandlers = useEventHandlers({
    player: player!,
    setPlayer: setPlayerAndCheckEnding as (player: Player | ((prev: Player) => Player)) => void,
    addLog,
  });

  const handleNextWeek = useCallback(async () => {
    if (!player || isLoading) return;
    setIsLoading(true);
    try {
      ageUp();
      const event = await eventHandlers.handleTriggerEvent();
      if (event) {
        setCurrentEvent(event);
        setIsEventModalOpen(true);
      }
    } catch {
      addLog('system', '处理失败，请重试');
    } finally {
      setIsLoading(false);
    }
  }, [player, isLoading, ageUp, eventHandlers, addLog]);

  const handleTriggerEvent = useCallback(async () => {
    if (!player || isLoading) return;
    const currentCount = player.manualEventTriggersThisYear ?? 0;
    if (currentCount >= 3) {
      addLog('system', '本周已达到手动触发上限，请等待下周');
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
    } catch {
      addLog('system', '生成事件失败，请重试');
    } finally {
      setIsLoading(false);
    }
  }, [player, isLoading, eventHandlers, addLog, incrementManualTrigger]);

  const handleChoice = useCallback(async (choice: Choice) => {
    if (!player || !currentEvent || isLoading) return;
    setIsLoading(true);
    setIsEventModalOpen(false);
    try {
      await eventHandlers.handleChoice(currentEvent, choice);
    } catch {
      addLog('system', '处理选择时发生错误，请重试');
    } finally {
      setIsLoading(false);
    }
  }, [player, currentEvent, eventHandlers, isLoading, addLog]);

  // 条件返回放在所有 hooks 之后
  if (gamePhase === 'ended' && endingResult && endingEvaluation) {
    return (
      <EndingScreen
        result={endingResult}
        evaluation={endingEvaluation}
        onRestart={resetGame}
      />
    );
  }

  if (!player) return null;

  const week = player.age;
  const isDoctor = player.education?.toString().includes('doctor') ?? false;
  const totalWeeks = getTotalWeeks(isDoctor);
  const stageLabel = getStageLabel(week, isDoctor);
  const semesterLabel = getSemesterLabel(week);
  const remainingTriggers = 3 - (player.manualEventTriggersThisYear ?? 0);

  // 将 Player 标准属性映射到研究属性
  const researchAttributes: Record<string, number> = {
    research_ability: player.attributes.intelligence,
    academic_passion: player.attributes.happiness,
    advisor_favor: player.attributes.charm,
    peer_relation: player.attributes.charm,
    health: player.attributes.health,
    finance: Math.min(100, player.attributes.wealth),
    pressure: player.attributes.stress,
  };

  return (
    <div className="research-view">
      {/* 顶部信息栏 */}
      <header className="research-header">
        <div className="research-title">
          <span className="title-icon">🎓</span>
          <span className="title-text">{texts.gameTitle}</span>
        </div>

        <div className="research-info">
          <span className="info-badge">👤 {player.name}</span>
          <span className="info-badge accent">{stageLabel}</span>
          <span className="info-badge">📅 第 {week} / {totalWeeks} 周</span>
          <span className="info-badge">{semesterLabel}</span>
        </div>

        <div className="research-actions">
          <button
            className={`btn-primary ${isLoading ? 'loading' : ''}`}
            onClick={handleNextWeek}
            disabled={isLoading}
          >
            {isLoading ? (
              <><span className="spinner" />处理中...</>
            ) : (
              <>▶ 下一周</>
            )}
          </button>
          <button
            className="btn-secondary"
            onClick={handleTriggerEvent}
            disabled={isLoading || remainingTriggers <= 0}
            title={`本周剩余触发次数：${remainingTriggers}`}
          >
            ⚡ 触发事件 ({remainingTriggers})
          </button>
          <div className="divider" />
          <button className="btn-icon" onClick={achievementModal.open} title="成就">🏆</button>
          <button className="btn-icon" onClick={settingsModal.open} title="设置">⚙️</button>
        </div>
      </header>

      {/* 主内容区 */}
      <main className="research-content">
        <div className="research-left">
          <DynamicStatsPanel
            attributes={researchAttributes}
            extraInfo={{
              week,
              stageLabel: `${stageLabel} · ${player.name}`,
              semesterInfo: semesterLabel,
            }}
          />
          <GraduationCard week={week} isDoctor={isDoctor} theme={theme} />
        </div>
        <div className="research-right">
          <LogPanel logs={logs} />
        </div>
      </main>

      {/* 模态框 */}
      <EventModal
        event={currentEvent}
        isOpen={isEventModalOpen}
        onChoice={handleChoice}
        onClose={() => setIsEventModalOpen(false)}
      />
      <AchievementModal
        player={player}
        isOpen={achievementModal.isOpen}
        onClose={achievementModal.close}
      />
      <SettingsModal
        settings={{ soundEnabled: true, musicEnabled: true, autoSave: true, aiProvider: 'siliconflow' }}
        onUpdate={() => {}}
        isOpen={settingsModal.isOpen}
        onClose={settingsModal.close}
      />

      <style>{`
        .research-view {
          min-height: 100vh;
          background: linear-gradient(160deg, ${theme.colors.background} 0%, #0d1b2a 100%);
          padding: 20px;
          font-family: ${theme.fonts.body};
          color: ${theme.colors.text};
        }

        .research-header {
          display: flex;
          align-items: center;
          gap: 16px;
          background: ${theme.colors.card};
          border: 1px solid ${theme.colors.border};
          border-radius: ${theme.borderRadius.lg}px;
          padding: 14px 20px;
          margin-bottom: 20px;
          box-shadow: ${theme.shadows.md};
          flex-wrap: wrap;
        }

        .research-title {
          display: flex;
          align-items: center;
          gap: 8px;
          flex-shrink: 0;
        }

        .title-icon { font-size: 22px; }

        .title-text {
          font-family: ${theme.fonts.heading};
          font-size: 20px;
          font-weight: 700;
          color: ${theme.colors.accent};
          letter-spacing: 0.02em;
          white-space: nowrap;
        }

        .research-info {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
          flex: 1;
        }

        .info-badge {
          display: inline-flex;
          align-items: center;
          gap: 4px;
          padding: 4px 10px;
          background: ${theme.colors.backgroundSecondary};
          border: 1px solid ${theme.colors.border};
          border-radius: 20px;
          font-size: 13px;
          color: ${theme.colors.textSecondary};
          white-space: nowrap;
        }

        .info-badge.accent {
          border-color: ${theme.colors.accent}66;
          color: ${theme.colors.accent};
          background: ${theme.colors.accent}15;
        }

        .research-actions {
          display: flex;
          align-items: center;
          gap: 8px;
          flex-shrink: 0;
        }

        .btn-primary {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 9px 18px;
          background: ${theme.colors.accent};
          color: #0f172a;
          border: none;
          border-radius: ${theme.borderRadius.md}px;
          font-size: 14px;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.2s;
          font-family: ${theme.fonts.body};
          white-space: nowrap;
        }

        .btn-primary:hover:not(:disabled) {
          background: #7dd3fc;
          transform: translateY(-1px);
          box-shadow: 0 4px 12px ${theme.colors.accent}66;
        }

        .btn-primary:disabled { opacity: 0.6; cursor: not-allowed; transform: none; }

        .btn-secondary {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 9px 16px;
          background: transparent;
          color: ${theme.colors.textSecondary};
          border: 1px solid ${theme.colors.border};
          border-radius: ${theme.borderRadius.md}px;
          font-size: 13px;
          cursor: pointer;
          transition: all 0.2s;
          font-family: ${theme.fonts.body};
          white-space: nowrap;
        }

        .btn-secondary:hover:not(:disabled) {
          border-color: ${theme.colors.accent};
          color: ${theme.colors.accent};
        }

        .btn-secondary:disabled { opacity: 0.5; cursor: not-allowed; }

        .btn-icon {
          padding: 9px 10px;
          background: transparent;
          border: 1px solid ${theme.colors.border};
          border-radius: ${theme.borderRadius.md}px;
          font-size: 16px;
          cursor: pointer;
          color: ${theme.colors.textSecondary};
          transition: all 0.2s;
          min-width: 38px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .btn-icon:hover {
          border-color: ${theme.colors.accent};
          background: ${theme.colors.accent}15;
        }

        .divider {
          width: 1px;
          height: 28px;
          background: ${theme.colors.border};
        }

        .spinner {
          display: inline-block;
          width: 12px;
          height: 12px;
          border: 2px solid #0f172a44;
          border-top-color: #0f172a;
          border-radius: 50%;
          animation: spin 0.7s linear infinite;
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }

        .research-content {
          display: grid;
          grid-template-columns: 1fr 360px;
          gap: 20px;
          max-width: 1240px;
          margin: 0 auto;
        }

        .research-left {
          display: flex;
          flex-direction: column;
        }

        .research-right {
          display: flex;
          flex-direction: column;
        }

        @media (max-width: 900px) {
          .research-content {
            grid-template-columns: 1fr;
          }
        }

        @media (max-width: 600px) {
          .research-view { padding: 12px; }

          .research-header {
            flex-direction: column;
            align-items: flex-start;
            gap: 12px;
            padding: 12px 14px;
          }

          .research-actions { flex-wrap: wrap; }

          .title-text { font-size: 18px; }
        }
      `}</style>
    </div>
  );
}
