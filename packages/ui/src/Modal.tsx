import React, { useEffect } from 'react';
import './Modal.css';
import Card from './Card';

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
}

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
}) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="hp-modal-overlay" onClick={onClose}>
      <Card variant="glass" padding="none" className="hp-modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="hp-modal-header">
          {title && <h3 className="hp-modal-title">{title}</h3>}
          <button className="hp-modal-close-btn" onClick={onClose} aria-label="Close">
            &times;
          </button>
        </div>
        <div className="hp-modal-body">
          {children}
        </div>
      </Card>
    </div>
  );
};

export default Modal;
