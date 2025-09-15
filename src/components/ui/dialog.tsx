'use client';

import { createContext, useContext, useEffect, useRef, useState, useCallback } from 'react'; // Import useCallback
import { cn } from '@/utils/cn_tw_merger';

type DialogState = Record<string, boolean>;
type DialogContextType = {
  dialogs: DialogState;
  openDialog: (id: string) => void;
  closeDialog: (id: string) => void;
};

const DialogContext = createContext<DialogContextType>({
  dialogs: {},
  openDialog: () => {},
  closeDialog: () => {}
});

export const useDialog = () => useContext(DialogContext);

interface DialogProviderProps {
  children: React.ReactNode;
}

export const DialogProvider = ({ children }: DialogProviderProps) => {
  const [dialogs, setDialogs] = useState<DialogState>({});

  const openDialog = (id: string) => {
    setDialogs(prev => ({ ...prev, [id]: true }));
  };

  const closeDialog = (id: string) => {
    setDialogs(prev => ({ ...prev, [id]: false }));
  };

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const trigger = target.closest<HTMLElement>('[data-dialog-trigger]');
      const closer = target.closest<HTMLElement>('[data-dialog-close]');

      if (trigger?.dataset.dialogId) {
        openDialog(trigger.dataset.dialogId);
      }
      if (closer?.dataset.dialogId) {
        closeDialog(closer.dataset.dialogId);
      }
    };

    document.addEventListener('click', handleClick);
    return () => {
      document.removeEventListener('click', handleClick);
    };
  }, []);

  return (
    <DialogContext.Provider value={{ dialogs, openDialog, closeDialog }}>
      {children}
    </DialogContext.Provider>
  );
};

interface DialogProps {
  children: React.ReactNode;
  id: string;
  className?: string;
  backdropClassName?: string;
  contentClassName?: string;
  position?: 'center' | 'top' | 'right' | 'bottom' | 'left';
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'full';
  showCloseButton?: boolean;
  closeOnEscape?: boolean;
  closeOnOutsideClick?: boolean;
  onOpen?: () => void;
  onClose?: () => void;
}

export const Dialog = ({
  children,
  id,
  className = '',
  backdropClassName = '',
  contentClassName = '',
  position = 'center',
  size = 'md',
  showCloseButton = true,
  closeOnEscape = true,
  closeOnOutsideClick = true,
  onOpen,
  onClose
}: DialogProps) => {
  const { dialogs, closeDialog } = useDialog();
  const isOpen = dialogs[id] || false;
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [isClosing, setIsClosing] = useState(false);

  // Handle opening and closing the dialog
  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (isOpen && !dialog.open) {
      dialog.showModal();
      onOpen?.();
    } else if (!isOpen && dialog.open) {
      dialog.close();
      onClose?.();
    }
  }, [isOpen, onOpen, onClose]);

  // Define handleClose before the useEffect that uses it
  const handleClose = useCallback(() => {
    if (!isOpen) return;
    
    setIsClosing(true);
    setTimeout(() => {
      onClose?.();
      closeDialog(id);
      setIsClosing(false);
    }, 300);
  }, [isOpen, closeDialog, id]); // Add dependencies for useCallback

  // Handle escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (closeOnEscape && e.key === 'Escape') {
        e.preventDefault(); // Prevent default dialog closing behavior
        handleClose();
      }
    };
    
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [closeOnEscape, handleClose]); // handleClose is now defined

  const handleBackdropClick = (e: React.MouseEvent) => {
    // Only close if clicking directly on the backdrop (dialog element)
    if (closeOnOutsideClick && e.target === dialogRef.current) {
      handleClose();
    }
  };

  // Size mapping
  const sizeClasses = {
    xs: 'max-w-xs',
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
    full: 'max-w-full w-[calc(100vw)] h-[calc(100vh)] ',
  };

  // Position mapping to CSS classes
  const positionClasses = {
    center: 'dialog-center',
    top: 'dialog-top',
    right: 'dialog-right',
    bottom: 'dialog-bottom',
    left: 'dialog-left',
  };

  // Don't render at all if not open and not closing
  if (!isOpen && !isClosing) {
    return null;
  }

  return (
    <dialog
      ref={dialogRef}
      className={cn(
        // Base styles
        'fixed z-50 p-0 m-0 bg-transparent w-full',
        // Position classes
        positionClasses[position],
        // Animation states
        isOpen && !isClosing ? 'opacity-100' : 'opacity-0',
        'transition-all duration-300',
        className
      )}
      onClick={handleBackdropClick}
    >
      {/* Custom backdrop styling */}
      <style jsx global>{`
        dialog::backdrop {
          background-color: rgba(0, 0, 0, 0.5);
          backdrop-filter: blur(2px);
          transition: opacity 0.3s ease;
          opacity: ${isOpen && !isClosing ? 1 : 0};
          ${backdropClassName}
        }
        
        /* Dialog positioning classes */
        .dialog-center {
          inset: auto !important;
          top: 50% !important;
          left: 50% !important;
          transform: translate(-50%, -50%) !important;
        }
        
        .dialog-top {
          inset: auto !important;
          top: 1rem !important;
          left: 50% !important;
          transform: translateX(-50%) !important;
        }
        
        .dialog-right {
          inset: auto !important;
          top: 50% !important;
          right: 1rem !important;
          left: auto !important;
          transform: translateY(-50%) !important;
        }
        
        .dialog-bottom {
          inset: auto !important;
          top: auto !important;
          bottom: 1rem !important;
          left: 50% !important;
          transform: translateX(-50%) !important;
        }
        
        .dialog-left {
          inset: auto !important;
          top: 50% !important;
          left: 1rem !important;
          right: auto !important;
          transform: translateY(-50%) !important;
        }
      `}</style>

      <div 
        className={cn(
          'relative bg-neutral-100 rounded-lg shadow-xl overflow-hidden',
          'flex flex-col transform transition-all duration-300',
          sizeClasses[size],
          isOpen && !isClosing ? 'scale-100' : 'scale-95',
          contentClassName
        )}
        onClick={(e) => e.stopPropagation()}
      >
        {showCloseButton && (
          <button
            data-dialog-close
            data-dialog-id={id}
            className="absolute top-2 right-2 p-2 rounded-full bg-neutral hover:bg-base-100 text-base-500 z-[55]"
            aria-label="Close dialog"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M18 6 6 18" />
              <path d="m6 6 12 12" />
            </svg>
          </button>
        )}
        {/* Wrap children in the portal target div */}
        <div id="dialog-portal-target" className="relative z-10 h-full">
          {children}
        </div>
      </div>
    </dialog>
  );
}; 