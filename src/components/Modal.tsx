import React, { ReactNode, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  /**
   * Optional custom class applied to the modal content container.
   */
  contentClassName?: string;
  children: ReactNode;
}

/**
 * Simple controlled modal rendered via React portal.
 * – Locks background scroll when open.
 * – Closes on backdrop click or Escape key.
 */
export const Modal: React.FC<ModalProps> = ({ isOpen, onClose, children, contentClassName }) => {
  // Close on Escape key
  useEffect(() => {
    if (!isOpen) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, [isOpen, onClose]);

  // Prevent background scroll when modal open
  useEffect(() => {
    if (!isOpen) return;
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return createPortal(
    <div
      className="fixed inset-0 z-[110] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
      onClick={onClose}
    >
      <div
        className={`relative bg-slate-800/90 rounded-xl shadow-2xl ring-1 ring-white/10 w-full max-h-full overflow-y-auto ${contentClassName ?? ''}`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          className="absolute top-3 right-3 text-gray-400 hover:text-white transition-colors"
          onClick={onClose}
          aria-label="Close modal"
        >
          <X size={22} />
        </button>
        {children}
      </div>
    </div>,
    document.body,
  );
}; 