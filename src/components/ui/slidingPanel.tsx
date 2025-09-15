'use client';

import { useEffect, useState, createContext, useContext, useCallback } from 'react'; // Import useCallback
import { cn } from '@/utils/cn_tw_merger';
import { useRouter, useSearchParams } from 'next/navigation';
import { Icon } from 'judix-icon';

type SlidePanelState = Record<string, boolean>;
type SlidePanelContextType = {
  panels: SlidePanelState;
  openPanel: (id: string) => void;
  closePanel: (id: string) => void;
};

const SlidePanelContext = createContext<SlidePanelContextType>({
  panels: {},
  openPanel: () => {},
  closePanel: () => {}
});

export const useSlidePanel = () => useContext(SlidePanelContext);

interface SlidePanelProps {
  children: React.ReactNode;
  direction?: 'left' | 'right' | 'top' | 'bottom';
  width?: string;
  height?: string;
  className?: string;
  backdropClassName?: string;
  contentClassName?: string;
}

// const getTransform = (direction: string, targetState: boolean) => {
//   if (!targetState) {
//     switch(direction) {
//       case 'left': return '-translate-x-full';
//       case 'right': return 'translate-x-full';
//       case 'top': return '-translate-y-full';
//       case 'bottom': return 'translate-y-full';
//       default: return '';
//     }
//   }
//   return '';
// };

export const SlidePanelProvider = ({ children }: { children: React.ReactNode }) => {
  const [panels, setPanels] = useState<SlidePanelState>({});
  const router = useRouter();
  const searchParams = useSearchParams();

  const openPanel = useCallback((id: string) => {
    setPanels(prev => ({ ...prev, [id]: true }));
    // const params = new URLSearchParams(searchParams.toString());
    // params.set('panel', id);
    // router.push(`?${params.toString()}`);
  }, [searchParams, router]); // Add dependencies

  const closePanel = useCallback((id: string) => {
    setPanels(prev => ({ ...prev, [id]: false }));
    // const params = new URLSearchParams(searchParams.toString());
    // params.delete('panel');
    // router.push(`?${params.toString()}`);
  }, [searchParams, router]); // Add dependencies

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const trigger = target.closest<HTMLElement>('[data-panel-trigger]');
      const closer = target.closest<HTMLElement>('[data-panel-close]');

      if (trigger?.dataset.panelId) {
        openPanel(trigger.dataset.panelId);
      }
      if (closer?.dataset.panelId) {
        closePanel(closer.dataset.panelId);
      }
    };

    // const handlePopState = () => {
    //   const params = new URLSearchParams(window.location.search);
    //   const currentPanel = params.get('panel');
      
    //   // Close all panels if no panel is specified in URL
    //   if (!currentPanel) {
    //     setPanels({});
    //   } else {
    //     // Only keep the panel specified in URL open
    //     setPanels({ [currentPanel]: true });
    //   }
    // };

    // // Handle initial URL state
    // handlePopState();

    // // Listen for URL changes
    // window.addEventListener('popstate', handlePopState);
    document.addEventListener('click', handleClick);

    return () => {
      // window.removeEventListener('popstate', handlePopState);
      document.removeEventListener('click', handleClick);
    };
  }, [openPanel, closePanel]); // Add openPanel and closePanel

  return (
    <SlidePanelContext.Provider value={{ panels, openPanel, closePanel }}>
      {children}
    </SlidePanelContext.Provider>
  );
};


//* 
// Slide Panel
// Set width variable to set the width or use tailwind css in classname with 'max-w-[]' for setting the width
// */
export const SlidePanel = ({
  children,
  direction = 'right',
  width = '100%',
  height = '100%',
  className = '',
  backdropClassName = '',
  contentClassName = '',
  id
}: SlidePanelProps & { id: string }) => {
  const { panels, closePanel } = useSlidePanel();
  const isOpen = panels[id] || false;
  const [isClosing, setIsClosing] = useState(false);

  // Define handleClose before useEffect
  const handleClose = useCallback(() => {
    setIsClosing(true);
    setTimeout(() => {
      closePanel(id);
      setIsClosing(false);
    }, 300);
  }, [closePanel, id]); // Add dependencies

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') handleClose();
    };
    
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [handleClose]); // Add handleClose dependency

  // handleClose is now defined above

  const handleTouch = (e: React.TouchEvent) => {
    if (direction !== 'bottom') return;
    
    const touch = e.touches[0];
    const startY = touch.clientY;
    
    const handleMove = (moveEvent: TouchEvent) => {
      const currentY = moveEvent.touches[0].clientY;
      if (currentY - startY > 100) handleClose();
    };

    document.addEventListener('touchmove', handleMove);
    document.addEventListener('touchend', () => {
      document.removeEventListener('touchmove', handleMove);
    }, { once: true });
  };

  const getPanelStyles = () => {
    const baseStyles = "fixed z-50 bg-neutral transition-all duration-300 transform";
    
    switch(direction) {
      case 'left':
        return cn(
          baseStyles, 
          'top-0 left-0 h-full w-full md:w-auto', 
          isOpen && !isClosing ? 'translate-x-0' : '-translate-x-full',
          className
        );
      case 'right':
        return cn(
          baseStyles, 
          'top-0 right-0 h-full w-full md:w-auto', 
          isOpen && !isClosing ? 'translate-x-0' : 'translate-x-full',
          className
        );
      case 'top':
        return cn(
          baseStyles, 
          'top-0 left-0 w-full h-full md:h-auto', 
          isOpen && !isClosing ? 'translate-y-0' : '-translate-y-full',
          className
        );
      case 'bottom':
        return cn(
          baseStyles, 
          'bottom-0 left-0 w-full h-full md:h-auto', 
          isOpen && !isClosing ? 'translate-y-0' : 'translate-y-full',
          className
        );
      default:
        return cn(baseStyles, className);
    }
  };

  return (
    <>
      {/* Backdrop */}
      <div 
        className={cn(
          "fixed inset-0 z-40 bg-black/50 backdrop-blur-sm transition-opacity duration-300",
          (isOpen || isClosing) ? 'opacity-100' : 'opacity-0 pointer-events-none',
          backdropClassName
        )}
        onClick={handleClose}
      />

      {/* Sliding Panel */}
      <div
        className={getPanelStyles()}
        style={{
          width: ['top', 'bottom'].includes(direction) ? '100%' : `min(100%, ${width})`,
          height: ['left', 'right'].includes(direction) ? '100%' : `min(100%, ${height})`
        }}
        onClick={(e) => e.stopPropagation()}
        onTouchStart={direction === 'bottom' ? handleTouch : undefined}
      >
        {isOpen && (
          <div
            data-panel-close
            data-panel-id={id}
            className='fixed top-1.5 -right-13 hidden xl:block p-3 rounded-full bg-base-100 cursor-pointer text-neutral-500'
          >
            <Icon size={24} name='Cross' />
          </div>
        )}
        <div className={cn("relative w-full h-full p-6 overflow-auto", contentClassName)}>
          {children}
        </div>
        {direction === 'bottom' && (
          <div className="absolute top-2 left-1/2 -translate-x-1/2 w-12 h-1 bg-base-300 rounded-full" />
        )}
      </div>
    </>
  );
};


// export const ModalProvider = SlidePanelProvider;
// export const Modal = SlidePanel;
// export const useModal = useSlidePanel;
