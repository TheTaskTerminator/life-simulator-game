import { useState, useEffect, useCallback } from 'react';
import { useGameState } from './hooks/useGameState';
import { TopicProvider, getTopic, getDefaultTopic } from './core';
import StartScreen from './components/StartScreen';
import GameView from './views/GameView';
import TopicSelector from './components/TopicSelector';
import { TopicPackage } from './core/types/base';

// 存储选中的话题 ID
const TOPIC_STORAGE_KEY = 'life-simulator-topic';

function App() {
  const { player, gameStarted, createNewGame, resetGame } = useGameState();
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
        // 如果保存的话题不存在，使用默认话题
        const defaultTopic = getDefaultTopic();
        setSelectedTopicId(defaultTopic.config.id);
        setTopicPackage(defaultTopic);
      }
    }
    setIsInitialized(true);
  }, []);

  // 选择话题
  const handleSelectTopic = useCallback((topicId: string) => {
    const topic = getTopic(topicId);
    setSelectedTopicId(topicId);
    setTopicPackage(topic);
    localStorage.setItem(TOPIC_STORAGE_KEY, topicId);
  }, []);

  // 切换话题（返回选择界面）
  const handleChangeTopic = useCallback(() => {
    setSelectedTopicId(null);
    setTopicPackage(null);
    localStorage.removeItem(TOPIC_STORAGE_KEY);
    resetGame();
  }, [resetGame]);

  const handleCreateGame = (name: string, attributes: any) => {
    createNewGame(name, attributes);
  };

  const handleReset = () => {
    resetGame();
  };

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
    return <TopicSelector onSelectTopic={handleSelectTopic} />;
  }

  // 使用 TopicProvider 包裹游戏内容
  return (
    <TopicProvider topic={topicPackage}>
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
        <StartScreen onCreateGame={handleCreateGame} />
      )}
    </TopicProvider>
  );
}

export default App;
