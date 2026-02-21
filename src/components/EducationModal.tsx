import { Player, EducationLevel } from '../types';
import { EDUCATION_NAMES } from '../constants';

interface EducationModalProps {
  player: Player;
  availableLevels: EducationLevel[];
  isOpen: boolean;
  onSelect: (level: EducationLevel) => void;
  onClose: () => void;
}

export default function EducationModal({
  player,
  availableLevels,
  isOpen,
  onSelect,
  onClose,
}: EducationModalProps) {
  if (!isOpen) return null;

  const handleSelect = (level: EducationLevel) => {
    onSelect(level);
    onClose();
  };

  const getEducationDescription = (level: EducationLevel) => {
    const descriptions: Record<EducationLevel, string> = {
      [EducationLevel.NONE]: '学前教育阶段，探索世界的开始',
      [EducationLevel.PRIMARY]: '基础教育阶段，学习基础知识和技能',
      [EducationLevel.MIDDLE]: '中等教育阶段，深入学习各学科',
      [EducationLevel.HIGH]: '高中教育，为大学做准备',
      [EducationLevel.COLLEGE]: '大专教育，职业技能培养',
      [EducationLevel.BACHELOR]: '大学本科，专业教育',
      [EducationLevel.MASTER]: '研究生教育，深入专业领域',
      [EducationLevel.DOCTOR]: '博士教育，最高学历',
    };
    return descriptions[level] || '';
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>选择教育水平</h2>
          <button className="modal-close" onClick={onClose}>
            ×
          </button>
        </div>

        <div className="modal-body">
          {availableLevels.length === 0 ? (
            <p className="empty-message">暂无可用教育选择</p>
          ) : (
            <div className="education-list">
              {availableLevels.map((level) => (
                <div key={level} className="education-item">
                  <div className="education-header">
                    <h3>{EDUCATION_NAMES[level]}</h3>
                    {player.education === level && (
                      <span className="current-badge">当前</span>
                    )}
                  </div>
                  <p className="education-description">
                    {getEducationDescription(level)}
                  </p>
                  <button
                    className="select-button"
                    onClick={() => handleSelect(level)}
                    disabled={player.education === level}
                  >
                    {player.education === level ? '当前教育水平' : '选择此教育水平'}
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <style>{`
        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.5);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
          padding: 20px;
        }

        .modal-content {
          background: white;
          border-radius: 16px;
          max-width: 600px;
          width: 100%;
          max-height: 90vh;
          overflow-y: auto;
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
        }

        .modal-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 20px;
          border-bottom: 2px solid #f0f0f0;
        }

        .modal-header h2 {
          margin: 0;
          font-size: 1.5em;
          color: #333;
        }

        .modal-close {
          background: none;
          border: none;
          font-size: 32px;
          color: #999;
          cursor: pointer;
          line-height: 1;
          padding: 0;
          width: 32px;
          height: 32px;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: color 0.3s;
        }

        .modal-close:hover {
          color: #333;
        }

        .modal-body {
          padding: 20px;
        }

        .empty-message {
          text-align: center;
          color: #999;
          padding: 40px 20px;
        }

        .education-list {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .education-item {
          border: 2px solid #e0e0e0;
          border-radius: 12px;
          padding: 20px;
          transition: all 0.3s;
        }

        .education-item:hover {
          border-color: #667eea;
          box-shadow: 0 4px 12px rgba(102, 126, 234, 0.2);
        }

        .education-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 12px;
        }

        .education-header h3 {
          margin: 0;
          font-size: 1.3em;
          color: #333;
        }

        .current-badge {
          background: #4caf50;
          color: white;
          padding: 4px 12px;
          border-radius: 12px;
          font-size: 12px;
          font-weight: 600;
        }

        .education-description {
          margin: 0 0 16px 0;
          color: #666;
          line-height: 1.6;
        }

        .select-button {
          width: 100%;
          padding: 12px;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          border: none;
          border-radius: 8px;
          font-size: 16px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s;
        }

        .select-button:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
        }

        .select-button:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }
      `}</style>
    </div>
  );
}

