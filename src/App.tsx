import { useState, useEffect } from 'react';
import { useGameState } from './hooks/useGameState';
import StartScreen from './components/StartScreen';
import GameView from './views/GameView';

function App() {
  const { player, gameStarted, createNewGame, resetGame } = useGameState();
  const [isInitialized, setIsInitialized] = useState(false);

  // 等待初始状态加载完成
  // 由于 loadGame 是同步的，但为了确保 React 状态更新完成，使用 useEffect
  useEffect(() => {
    // 标记已初始化，允许根据实际状态决定显示什么
    setIsInitialized(true);
  }, []);

  const handleCreateGame = (name: string, attributes: any) => {
    createNewGame(name, attributes);
  };

  const handleReset = () => {
    resetGame();
  };

  // 如果还没有初始化完成，显示加载提示
  // 这样可以避免在加载缓存时闪烁显示开始界面
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

  // 如果有玩家数据且游戏已开始，直接进入游戏
  // 否则显示开始界面
  if (player && gameStarted) {
  return (
    <>
      <GameView />
      <div style={{ position: 'fixed', bottom: 20, right: 20 }}>
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
  );
  }

  return <StartScreen onCreateGame={handleCreateGame} />;
}

export default App;

