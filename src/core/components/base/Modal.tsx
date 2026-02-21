import React, { ReactNode, useEffect, useCallback } from 'react';
import { useTheme } from '../../context/TopicContext';

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showCloseButton?: boolean;
}

/**
 * 主题化模态框组件
 */
export function Modal({
  isOpen,
  onClose,
  title,
  children,
  size = 'md',
  showCloseButton = true,
}: ModalProps): React.ReactElement | null {
  const theme = useTheme();

  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    },
    [onClose]
  );

  useEffect(() => {
    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [isOpen, handleKeyDown]);

  if (!isOpen) return null;

  const sizeStyles: Record<string, React.CSSProperties> = {
    sm: { maxWidth: '400px' },
    md: { maxWidth: '600px' },
    lg: { maxWidth: '800px' },
    xl: { maxWidth: '1000px' },
  };

  const overlayStyles: React.CSSProperties = {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
    padding: theme.spacing.md,
    animation: 'fadeIn 0.2s ease',
  };

  const modalStyles: React.CSSProperties = {
    background: theme.colors.modal,
    borderRadius: `${theme.borderRadius.lg}px`,
    boxShadow: theme.shadows.lg,
    width: '100%',
    ...sizeStyles[size],
    maxHeight: '90vh',
    overflow: 'hidden',
    display: 'flex',
    flexDirection: 'column',
    animation: 'slideUp 0.3s ease',
  };

  const headerStyles: React.CSSProperties = {
    padding: theme.spacing.lg,
    borderBottom: `1px solid ${theme.colors.border}`,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  };

  const titleStyles: React.CSSProperties = {
    fontFamily: theme.fonts.heading,
    fontSize: '24px',
    fontWeight: 600,
    color: theme.colors.accent,
    margin: 0,
  };

  const closeButtonStyles: React.CSSProperties = {
    background: 'transparent',
    border: 'none',
    color: theme.colors.textSecondary,
    fontSize: '28px',
    cursor: 'pointer',
    padding: 0,
    lineHeight: 1,
    transition: 'color 0.2s',
  };

  const contentStyles: React.CSSProperties = {
    padding: theme.spacing.lg,
    overflowY: 'auto',
    flex: 1,
  };

  return (
    <div style={overlayStyles} onClick={onClose}>
      <div style={modalStyles} onClick={(e) => e.stopPropagation()}>
        {(title || showCloseButton) && (
          <div style={headerStyles}>
            {title && <h2 style={titleStyles}>{title}</h2>}
            {showCloseButton && (
              <button
                style={closeButtonStyles}
                onClick={onClose}
                onMouseEnter={(e) => (e.currentTarget.style.color = theme.colors.accent)}
                onMouseLeave={(e) => (e.currentTarget.style.color = theme.colors.textSecondary)}
              >
                ×
              </button>
            )}
          </div>
        )}
        <div style={contentStyles}>{children}</div>
      </div>
    </div>
  );
}

export default Modal;
