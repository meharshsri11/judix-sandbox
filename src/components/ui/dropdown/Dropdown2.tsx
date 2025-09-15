import { cn } from "@/utils/cn_tw_merger";
import { ReactNode, useState, useRef, useEffect, ReactPortal } from "react";
import { createPortal } from "react-dom";

type Position = "top" | "bottom" | "left" | "right";
type Align = "start" | "center" | "end";

export interface DropdownProps {
  trigger: ReactNode;
  position?: Position;
  align?: Align;
  children: ReactNode;
  className?: string;
  portalTargetSelector?: string;
  offset?: number;
  isOpen?: boolean; // Optional: Controlled open state
  onOpenChange?: (open: boolean) => void; // Optional: Callback for state changes
}

const getPositionStyles = (
  triggerRect: DOMRect,
  position: Position,
  align: Align,
  offset: number,
  portalElement: Element | null // Add portalElement argument
) => {
  const isBodyPortal = !portalElement || portalElement === document.body;
  const portalRect = portalElement && !isBodyPortal ? portalElement.getBoundingClientRect() : null;

  const styles = {
    position: isBodyPortal ? "fixed" : "absolute", // Conditional position
    zIndex: 60,
    minWidth: `${triggerRect.width}px`,
  } as React.CSSProperties;

  // Track transforms to combine them properly
  const transforms: string[] = [];

  // Calculate base position relative to portal or viewport
  switch (position) {
    case "top":
      styles.top = isBodyPortal
        ? `${triggerRect.top - offset}px` // Viewport relative
        : `${triggerRect.top - (portalRect?.top ?? 0) - offset}px`; // Portal relative
      transforms.push('translateY(-100%)'); // Position above trigger
      break;
    case "bottom":
      styles.top = isBodyPortal
        ? `${triggerRect.bottom + offset}px` // Viewport relative
        : `${triggerRect.bottom - (portalRect?.top ?? 0) + offset}px`; // Portal relative
      break;
    case "left":
      styles.left = isBodyPortal
        ? `${triggerRect.left - offset}px` // Viewport relative
        : `${triggerRect.left - (portalRect?.left ?? 0) - offset}px`; // Portal relative
      transforms.push('translateX(-100%)'); // Position left of trigger
      break;
    case "right":
      styles.left = isBodyPortal
        ? `${triggerRect.right + offset}px` // Viewport relative
        : `${triggerRect.right - (portalRect?.left ?? 0) + offset}px`; // Portal relative
      break;
  }

  // Calculate alignment relative to portal or viewport
  const isVertical = position === "top" || position === "bottom";
  if (isVertical) {
    switch (align) {
      case "start":
        styles.left = isBodyPortal ? triggerRect.left : triggerRect.left - (portalRect?.left ?? 0);
        break;
      case "center":
        styles.left = isBodyPortal
          ? triggerRect.left + triggerRect.width / 2
          : triggerRect.left - (portalRect?.left ?? 0) + triggerRect.width / 2;
        transforms.push("translateX(-50%)");
        break;
      case "end":
        styles.left = isBodyPortal ? triggerRect.right : triggerRect.right - (portalRect?.left ?? 0);
        // For end alignment, we need to move the dropdown to start from the right edge
        // This is different from centering, we want the right edge of dropdown to align with right edge of trigger
        transforms.push("translateX(-100%)");
        break;
    }
  } else { // Horizontal alignment (for left/right position)
    switch (align) {
      case "start":
        styles.top = isBodyPortal ? triggerRect.top : triggerRect.top - (portalRect?.top ?? 0);
        break;
      case "center":
        styles.top = isBodyPortal ? triggerRect.top + triggerRect.height / 2 : triggerRect.top - (portalRect?.top ?? 0) + triggerRect.height / 2;
        transforms.push("translateY(-50%)");
        break;
      case "end":
        styles.top = isBodyPortal ? triggerRect.bottom : triggerRect.bottom - (portalRect?.top ?? 0);
        // For end alignment on horizontal positioning, align bottom edges
        transforms.push("translateY(-100%)");
        break;
    }
  }

  // Combine all transforms
  if (transforms.length > 0) {
    styles.transform = transforms.join(' ');
  }

  return styles;
};

export const Dropdown_2 = ({
  trigger,
  position = "bottom",
  align = "start",
  children,
  className,
  offset = 8,
  portalTargetSelector,
  isOpen: controlledIsOpen, // Rename prop to avoid conflict
  onOpenChange,
}: DropdownProps) => {
  const [internalIsOpen, setInternalIsOpen] = useState(false);
  const triggerRef = useRef<HTMLDivElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Determine if the component is controlled or uncontrolled
  const isControlled = controlledIsOpen !== undefined;
  const isOpen = isControlled ? controlledIsOpen : internalIsOpen;

  // Helper to manage state updates and notify parent if controlled
  const setIsOpen = (open: boolean) => {
    if (!isControlled) {
      setInternalIsOpen(open);
    }
    onOpenChange?.(open);
  };

  useEffect(() => {
    if (!isOpen) return; // Only add listeners if open

    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node) &&
        triggerRef.current && !triggerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsOpen(false);
        triggerRef.current?.focus(); // Return focus to trigger on escape
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [isOpen, isControlled, onOpenChange]); // Add dependencies

  const toggleDropdown = (event?: React.MouseEvent) => {
      // Prevent click on input from closing if already open
      if (isOpen && event?.target && triggerRef.current?.contains(event.target as Node)) {
          // If clicking the trigger while open, let the input focus handle it
          // Or decide if trigger click should always toggle
          // For combobox, maybe trigger click should just ensure focus?
          // Let's toggle for now, can refine if needed.
      }
      setIsOpen(!isOpen);
  };

  const triggerElement = (
    <div
      ref={triggerRef}
      onClick={toggleDropdown}
      role="button"
      tabIndex={0}
      aria-haspopup="true"
      aria-expanded={isOpen}
    >
      {trigger}
    </div>
  );

  let dropdownContent: ReactPortal | null = null;
  if (isOpen && triggerRef.current) {
    const triggerRect = triggerRef.current.getBoundingClientRect();

    // Determine portal target
    const portalElement = portalTargetSelector
      ? document.querySelector(portalTargetSelector)
      : document.body;

    // Pass portalElement to getPositionStyles
    const positionStyles = getPositionStyles(triggerRect, position, align, offset, portalElement);

    dropdownContent = createPortal(
      <div
        ref={dropdownRef}
        className={cn(
  "w-40 py-2 bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden",
  "animate-in fade-in-50 zoom-in-95",
  className
)}
        style={{
          ...positionStyles, 
          scrollbarColor: "var(--color-primary-400)",
          scrollbarWidth: "thin"
        }}
        role="menu"
        aria-orientation="vertical"
      >
        {children}
      </div>,
      portalElement || document.body // Use determined target, fallback to body
    );
  }

  return (
    <div className="inline-block w-full text-sm">
      {triggerElement}
      {dropdownContent}
    </div>
  );
};