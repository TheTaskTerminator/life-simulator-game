import { LogEntry } from '../types';

interface LogPanelProps {
  logs: LogEntry[];
}

// 日志类型配置
const logTypeConfig: Record<LogEntry['type'], { icon: string; color: string }> = {
  event: { icon: '✧', color: '#2196F3' },
  choice: { icon: '◈', color: '#4CAF50' },
  stage: { icon: '❖', color: '#9C27B0' },
  achievement: { icon: '★', color: '#FFD700' },
  system: { icon: '○', color: '#607D8B' },
};

export default function LogPanel({ logs }: LogPanelProps) {
  const recentLogs = logs.slice(-15).reverse();

  return (
    <div className="log-panel">
      <div className="log-header">
        <h3>命运轨迹</h3>
        <div className="header-decoration">
          <span className="deco-line" />
          <span className="deco-symbol">☽</span>
          <span className="deco-line" />
        </div>
      </div>

      <div className="log-list">
        {recentLogs.length === 0 ? (
          <div className="log-empty">
            <span className="empty-icon">☆</span>
            <span className="empty-text">命运的篇章尚未书写...</span>
          </div>
        ) : (
          recentLogs.map((log, index) => {
            const config = logTypeConfig[log.type] || logTypeConfig.system;
            return (
              <div
                key={log.id}
                className={`log-item log-${log.type}`}
                style={{ animationDelay: `${index * 0.05}s` }}
              >
                <div className="log-timeline">
                  <div className="timeline-dot" style={{ background: config.color }}>
                    <span className="dot-icon">{config.icon}</span>
                  </div>
                  {index < recentLogs.length - 1 && <div className="timeline-line" />}
                </div>

                <div className="log-content">
                  <div className="log-time">
                    {new Date(log.timestamp).toLocaleTimeString('zh-CN', {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </div>
                  <div className="log-message">{log.message}</div>
                </div>
              </div>
            );
          })
        )}
      </div>

      <style>{`
        .log-panel {
          background: linear-gradient(160deg, rgba(20, 20, 35, 0.95) 0%, rgba(15, 15, 28, 0.98) 100%);
          border: 1px solid rgba(212, 175, 55, 0.2);
          border-radius: 16px;
          padding: 0;
          box-shadow:
            0 8px 32px rgba(0, 0, 0, 0.4),
            inset 0 1px 0 rgba(212, 175, 55, 0.1);
          max-height: 450px;
          display: flex;
          flex-direction: column;
          font-family: 'Noto Sans SC', sans-serif;
          overflow: hidden;
        }

        /* 头部 */
        .log-header {
          padding: 20px 24px 16px;
          border-bottom: 1px solid rgba(212, 175, 55, 0.15);
        }

        .log-header h3 {
          margin: 0 0 12px 0;
          font-family: 'Cinzel', serif;
          font-size: 1.1em;
          text-align: center;
          background: linear-gradient(180deg, #d4af37 0%, #f5d47e 50%, #d4af37 100%);
          -webkit-background-clip: text;
          background-clip: text;
          color: transparent;
          letter-spacing: 4px;
        }

        .header-decoration {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 12px;
        }

        .header-decoration .deco-line {
          height: 1px;
          flex: 1;
          background: linear-gradient(90deg, transparent, rgba(212, 175, 55, 0.3), transparent);
        }

        .header-decoration .deco-symbol {
          color: #d4af37;
          font-size: 14px;
          opacity: 0.7;
        }

        /* 日志列表 */
        .log-list {
          flex: 1;
          overflow-y: auto;
          padding: 16px 20px;
          display: flex;
          flex-direction: column;
          gap: 0;
        }

        .log-list::-webkit-scrollbar {
          width: 4px;
        }

        .log-list::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.02);
        }

        .log-list::-webkit-scrollbar-thumb {
          background: rgba(212, 175, 55, 0.3);
          border-radius: 2px;
        }

        /* 空状态 */
        .log-empty {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 40px 20px;
          color: #555;
        }

        .empty-icon {
          font-size: 32px;
          color: rgba(212, 175, 55, 0.3);
          margin-bottom: 12px;
          animation: twinkle 2s ease-in-out infinite;
        }

        @keyframes twinkle {
          0%, 100% { opacity: 0.3; transform: scale(1); }
          50% { opacity: 0.6; transform: scale(1.1); }
        }

        .empty-text {
          font-size: 13px;
          color: #555;
          letter-spacing: 2px;
        }

        /* 日志项 */
        .log-item {
          display: flex;
          gap: 16px;
          padding: 12px 0;
          position: relative;
          animation: fadeInUp 0.4s ease-out;
        }

        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        /* 时间轴 */
        .log-timeline {
          display: flex;
          flex-direction: column;
          align-items: center;
          flex-shrink: 0;
          width: 24px;
        }

        .timeline-dot {
          width: 20px;
          height: 20px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 0 10px currentColor;
          flex-shrink: 0;
        }

        .dot-icon {
          font-size: 10px;
          color: white;
        }

        .timeline-line {
          width: 1px;
          flex: 1;
          background: linear-gradient(180deg, rgba(212, 175, 55, 0.3), rgba(212, 175, 55, 0.05));
          min-height: 12px;
        }

        /* 内容 */
        .log-content {
          flex: 1;
          min-width: 0;
          padding-bottom: 4px;
        }

        .log-time {
          font-size: 11px;
          color: #555;
          margin-bottom: 4px;
          letter-spacing: 1px;
        }

        .log-message {
          color: #c0c0d0;
          font-size: 13px;
          line-height: 1.6;
          word-break: break-word;
        }

        /* 日志类型样式 */
        .log-item.log-event .log-message {
          border-left: 2px solid rgba(33, 150, 243, 0.5);
          padding-left: 10px;
        }

        .log-item.log-choice .log-message {
          border-left: 2px solid rgba(76, 175, 80, 0.5);
          padding-left: 10px;
        }

        .log-item.log-stage .log-message {
          border-left: 2px solid rgba(156, 39, 176, 0.5);
          padding-left: 10px;
          color: #d4af37;
        }

        .log-item.log-achievement .log-message {
          border-left: 2px solid rgba(255, 215, 0, 0.5);
          padding-left: 10px;
          color: #FFD700;
        }

        .log-item.log-system .log-message {
          border-left: 2px solid rgba(96, 125, 139, 0.5);
          padding-left: 10px;
          color: #8b8ba3;
          font-style: italic;
        }

        /* 悬停效果 */
        .log-item:hover .log-message {
          background: rgba(212, 175, 55, 0.05);
          border-radius: 4px;
        }

        /* 响应式 */
        @media (max-width: 500px) {
          .log-header {
            padding: 16px;
          }

          .log-list {
            padding: 12px 16px;
          }

          .log-content {
            min-width: 0;
          }
        }
      `}</style>
    </div>
  );
}
