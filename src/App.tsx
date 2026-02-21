import { useState, useEffect, useCallback } from 'react';
import { useGameState } from './hooks/useGameState';
import { TopicProvider, getTopic, useTexts } from './core';
import StartScreen from './components/StartScreen';
import ResearchStartScreen from './components/ResearchStartScreen';
import GameView from './views/GameView';
import TopicSelector from './components/TopicSelector';
import GameEntry from './components/GameEntry';
import { TopicPackage } from './core/types/base';
import { Player } from './types';

// 存储选中的话题 ID
const TOPIC_STORAGE_KEY = 'life-simulator-topic';

// 游戏内容包装器 - 用于在 TopicProvider 内部访问 context
function GameContent({
  topicPackage,
  onChangeTopic,
}: {
  topicPackage: TopicPackage;
  onChangeTopic: () => void;
}) {
  const texts = useTexts();
  const {
    player,
    gameStarted,
    createNewGame,
    resetGame,
    hasSavedGame,
    loadSavedGame,
    addLog,
  } = useGameState(topicPackage.config.id);

  const [showGameEntry, setShowGameEntry] = useState(false);
  const [hasSave, setHasSave] = useState(false);

  // 初始化检测存档
  useEffect(() => {
    const saveExists = hasSavedGame(topicPackage.config.id);
    setHasSave(saveExists);
    setShowGameEntry(saveExists);
  }, [hasSavedGame, topicPackage.config.id]);

  // 切换话题
  const handleChangeTopic = useCallback(() => {
    setShowGameEntry(false);
    setHasSave(false);
    localStorage.removeItem(TOPIC_STORAGE_KEY);
    resetGame();
    onChangeTopic();
  }, [resetGame, onChangeTopic]);

  // 新游戏
  const handleNewGame = useCallback(() => {
    resetGame();
    setShowGameEntry(false);
  }, [resetGame]);

  // 继续游戏
  const handleContinueGame = useCallback(() => {
    loadSavedGame(topicPackage.config.id);
    setShowGameEntry(false);
  }, [loadSavedGame, topicPackage.config.id]);

  // 创建游戏
  const handleCreateGame = useCallback((
    name: string,
    attributes: Player['attributes'] | Record<string, number>,
    options?: { degreeType?: string; mentorType?: string }
  ) => {
    // 使用传入的属性或默认属性
    const gameAttributes = attributes as Player['attributes'];
    createNewGame(name, gameAttributes);
    setShowGameEntry(false);
    // 添加正确的话题欢迎消息
    addLog('system', `欢迎来到${texts.gameTitle}，${name}！`);

    // TODO: 如果需要，可以在这里处理 degreeType 和 mentorType
    // 目前先记录到 player 状态中
    console.log('Game options:', options);
  }, [createNewGame, addLog, texts.gameTitle]);

  // 重置当前游戏
  const handleReset = useCallback(() => {
    resetGame();
    setShowGameEntry(true);
    setHasSave(false);
  }, [resetGame]);

  return (
    <>
      {player && gameStarted ? (
        <>
          <GameView />
          <div style={{ position: 'fixed', bottom: 20, right: 20, display: 'flex', gap: '10px' }}>
            <button
              onClick={handleChangeTopic}
              style={{
                padding: '10px 20px',
                background: '#2196f3',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                fontSize: '14px',
              }}
            >
              切换模拟器
            </button>
            <button
              onClick={handleReset}
              style={{
                padding: '10px 20px',
                background: '#f44336',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                fontSize: '14px',
              }}
            >
              重置游戏
            </button>
          </div>
        </>
      ) : (
        <>
          {showGameEntry && hasSave ? (
            <GameEntry
              topicName={topicPackage.config.name}
              topicDescription={topicPackage.config.description || ''}
              topicIcon={topicPackage.config.id === 'life-simulator' ? '🎮' : '🔬'}
              hasSave={hasSave}
              onNewGame={handleNewGame}
              onContinue={handleContinueGame}
              onBack={handleChangeTopic}
            />
          ) : topicPackage.config.id === 'research-simulator' ? (
            <ResearchStartScreen onCreateGame={handleCreateGame} onBack={handleChangeTopic} />
          ) : (
            <StartScreen onCreateGame={handleCreateGame} onBack={handleChangeTopic} />
          )}
        </>
      )}
    </>
  );
}

function App() {
  const [isInitialized, setIsInitialized] = useState(false);
  const [selectedTopicId, setSelectedTopicId] = useState<string | null>(null);
  const [topicPackage, setTopicPackage] = useState<TopicPackage | null>(null);

  // 初始化：从 localStorage 恢复话题选择
  useEffect(() => {
    const savedTopicId = localStorage.getItem(TOPIC_STORAGE_KEY);
    if (savedTopicId) {
      try {
        const topic = getTopic(savedTopicId);
        setSelectedTopicId(savedTopicId);
        setTopicPackage(topic);
      } catch {
        // 话题不存在，忽略
      }
    }
    setIsInitialized(true);
  }, []);

  // 选择话题后的回调
  const handleTopicSelected = useCallback((topicId: string) => {
    const topic = getTopic(topicId);
    setSelectedTopicId(topicId);
    setTopicPackage(topic);
    localStorage.setItem(TOPIC_STORAGE_KEY, topicId);
  }, []);

  // 切换话题（返回选择界面）
  const handleChangeTopic = useCallback(() => {
    setSelectedTopicId(null);
    setTopicPackage(null);
  }, []);

  // 加载中
  if (!isInitialized) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        fontSize: '18px',
        color: '#666'
      }}>
        加载中...
      </div>
    );
  }

  // 显示话题选择界面
  if (!selectedTopicId || !topicPackage) {
    return <TopicSelector onSelectTopic={handleTopicSelected} />;
  }

  // 使用 TopicProvider 包裹游戏内容
  return (
    <TopicProvider topic={topicPackage}>
      <GameContent
        topicPackage={topicPackage}
        onChangeTopic={handleChangeTopic}
      />
    </TopicProvider>
  );
}

export default App;
