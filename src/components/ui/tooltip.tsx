"use client";
import React, { useCallback, useEffect, useId, useLayoutEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { cn } from "../../utils/cn_tw_merger";

/**
 * Positions the tooltip relative to its trigger.
 * Sides: top | bottom | left | right
 * Each side also supports -start / -end alignment (similar to Radix / Floating UI)
 * Example: "top", "top-start", "right-end".
 */
export type TooltipPlacement =
  | "top"
  | "top-start"
  | "top-end"
  | "bottom"
  | "bottom-start"
  | "bottom-end"
  | "left"
  | "left-start"
  | "left-end"
  | "right"
  | "right-start"
  | "right-end";

/**
 * Accessible, lightweight tooltip component.
 *
 * Features:
 * - 12 placements with start / end alignment (e.g. "top-start")
 * - Delayed show / hide with separate timings
 * - Keyboard support (focus + Enter / Space toggle, Esc to close)
 * - Optional arrow
 * - Portal rendering to body to avoid clipping
 * - Controlled & uncontrolled modes
 * - Hoverable content region (keep open while moving cursor over tooltip)
 * - Basic viewport collision handling (clamps inside viewport)
 *
 * Usage examples:
 *
 * <Tooltip content="Save" placement="bottom">
 *   <Button prefixIcon="Save">Save</Button>
 * </Tooltip>
 *
 * <Tooltip content={<span>Custom <strong>rich</strong> text</span>} placement="right-start" delay={400}>
 *   <span className="underline cursor-help">What is this?</span>
 * </Tooltip>
 *
 * Controlled:
 * const [open, setOpen] = useState(false);
 * <Tooltip content="Info" open={open} onOpenChange={setOpen}>
 *   <Icon name="Info" />
 * </Tooltip>
 */
export interface TooltipProps {
  /** The trigger element. Must be a single React element. */
  children: React.ReactElement;
  /** Tooltip content (string or any React node). */
  content: React.ReactNode;
  /** Placement of tooltip relative to trigger. */
  placement?: TooltipPlacement;
  /** Show delay in ms (for mouseenter / focus). */
  delay?: number;
  /** Hide delay in ms (for mouseleave / blur). */
  hideDelay?: number;
  /** Distance in pixels between trigger and tooltip. */
  offset?: number;
  /** Class applied to the outer tooltip container. */
  className?: string;
  /** Class applied to the tooltip content bubble. */
  contentClassName?: string;
  /** Force open (controlled). */
  open?: boolean;
  /** Default open (uncontrolled). */
  defaultOpen?: boolean;
  /** Callback when open state changes. */
  onOpenChange?: (open: boolean) => void;
  /** Disable hover interactions (still allows focus). */
  disableHover?: boolean;
  /** Disable closing on escape key. */
  disableEscapeKey?: boolean;
  /** If true, keep tooltip open when hovering the tooltip content. */
  hoverableContent?: boolean;
  /** Mount into a portal (defaults true). */
  portal?: boolean;
  /** z-index for portal container. */
  zIndex?: number;
  /** Id for accessibility. Auto generated if omitted. */
  id?: string;
  /** Provide a custom container element for portal (defaults document.body). */
  portalContainer?: HTMLElement | null;
  /** CSS selector to find portal container (overridden by portalContainer prop). */
  portalTargetSelector?: string;
  /** Allow pointer interactions with tooltip content (keeps pointer-events). Default false so trigger clicks pass through. */
  interactive?: boolean;
}

/** Internal positioning calculation */
function computePosition(
  triggerRect: DOMRect,
  tooltipEl: HTMLElement,
  placement: TooltipPlacement,
  offset: number
) {
  const { innerWidth, innerHeight } = window;
  const ttRect = tooltipEl.getBoundingClientRect();
  let top = 0;
  let left = 0;
  const [side, align] = placement.split("-") as [string, string | undefined];

  const main = () => {
    switch (side) {
      case "top":
        top = triggerRect.top - ttRect.height - offset; break;
      case "bottom":
        top = triggerRect.bottom + offset; break;
      case "left":
        left = triggerRect.left - ttRect.width - offset; break;
      case "right":
        left = triggerRect.right + offset; break;
    }
  };
  const cross = () => {
    switch (side) {
      case "top":
      case "bottom": {
        // horizontal alignment
        if (align === "start") left = triggerRect.left;
        else if (align === "end") left = triggerRect.right - ttRect.width;
        else left = triggerRect.left + (triggerRect.width - ttRect.width) / 2;
        break;
      }
      case "left":
      case "right": {
        // vertical alignment
        if (align === "start") top = triggerRect.top;
        else if (align === "end") top = triggerRect.bottom - ttRect.height;
        else top = triggerRect.top + (triggerRect.height - ttRect.height) / 2;
        break;
      }
    }
  };
  main();
  cross();

  // basic viewport clamping & simple flipping if outside
  if (top < 0) top = Math.max(4, top);
  if (left < 0) left = Math.max(4, left);
  if (left + ttRect.width > innerWidth)
    left = Math.max(4, innerWidth - ttRect.width - 4);
  if (top + ttRect.height > innerHeight)
    top = Math.max(4, innerHeight - ttRect.height - 4);

  return { top, left };
}

export const Tooltip: React.FC<TooltipProps> = ({
  children,
  content,
  placement = "top",
  delay = 150,
  hideDelay = 0,
  offset = 6,
  // arrow removed per design update (kept variable for backward compatibility if needed in future)
  className,
  contentClassName,
  open: openProp,
  defaultOpen,
  onOpenChange,
  disableHover,
  disableEscapeKey,
  hoverableContent,
  portal = true,
  zIndex = 80,
  id,
  portalContainer,
  portalTargetSelector,
  interactive = false,
}) => {
  const triggerRef = useRef<HTMLElement | null>(null);
  const tooltipRef = useRef<HTMLDivElement | null>(null);
  // arrow removed
  const [mounted, setMounted] = useState(false);
  const generatedId = useId();
  const tooltipId = id || `tooltip-${generatedId}`;

  const isControlled = openProp !== undefined;
  const [uncontrolledOpen, setUncontrolledOpen] = useState(!!defaultOpen);
  const open = isControlled ? !!openProp : uncontrolledOpen;
  const openTimeoutRef = useRef<number | null>(null);
  const hideTimeoutRef = useRef<number | null>(null);

  const clearTimers = () => {
    if (openTimeoutRef.current) window.clearTimeout(openTimeoutRef.current);
    if (hideTimeoutRef.current) window.clearTimeout(hideTimeoutRef.current);
  };

  const setOpen = useCallback((next: boolean) => {
    if (!isControlled) setUncontrolledOpen(next);
    onOpenChange?.(next);
  }, [isControlled, onOpenChange]);

  const show = useCallback(() => {
    clearTimers();
    openTimeoutRef.current = window.setTimeout(() => setOpen(true), delay);
  }, [delay, setOpen]);

  const hide = useCallback(() => {
    clearTimers();
    hideTimeoutRef.current = window.setTimeout(() => setOpen(false), hideDelay);
  }, [hideDelay, setOpen]);

  // cleanup timers on unmount
  useEffect(() => () => clearTimers(), []);

  // ESC to close
  useEffect(() => {
    if (!open || disableEscapeKey) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [open, disableEscapeKey, setOpen]);

  // Position when open or content/placement changes
  useLayoutEffect(() => {
    if (!open) return;
    const trigger = triggerRef.current;
    const tooltip = tooltipRef.current;
    if (!trigger || !tooltip) return;

    const container: HTMLElement | null = portalContainer
      || (portalTargetSelector ? document.querySelector(portalTargetSelector) as HTMLElement | null : null)
      || (portal ? document.body : trigger.parentElement);

    const triggerRect = trigger.getBoundingClientRect();
    const { top, left } = computePosition(triggerRect, tooltip, placement, offset);

    if (!container || container === document.body) {
      // position absolute relative to page scroll
      tooltip.style.top = `${top + window.scrollY}px`;
      tooltip.style.left = `${left + window.scrollX}px`;
    } else {
      // position relative to container
      const containerRect = container.getBoundingClientRect();
      tooltip.style.top = `${top - containerRect.top}px`;
      tooltip.style.left = `${left - containerRect.left}px`;
    }
  }, [open, placement, offset, content, portal, portalContainer, portalTargetSelector]);

  useEffect(() => {
    setMounted(true);
  }, []);

  const childEl = children as React.ReactElement<React.HTMLAttributes<HTMLElement>>;
  type OrigProps = React.HTMLAttributes<HTMLElement> & { ref?: React.Ref<HTMLElement> };
  const origProps = (childEl.props || {}) as OrigProps;
  const triggerProps: React.HTMLAttributes<HTMLElement> = {
    "aria-describedby": open ? tooltipId : undefined,
    onFocus: (e) => { origProps.onFocus?.(e); show(); },
    onBlur: (e) => { origProps.onBlur?.(e); hide(); },
    onKeyDown: (e) => {
      origProps.onKeyDown?.(e);
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        setOpen(!open);
      }
    },
    onClick: (e) => {
      // Preserve original click (e.g., dropdown toggles) while still allowing tooltip to work
      origProps.onClick?.(e);
    }
  };
  if (!disableHover) {
    triggerProps.onMouseEnter = (e) => { origProps.onMouseEnter?.(e); show(); };
    triggerProps.onMouseLeave = (e) => { origProps.onMouseLeave?.(e); hide(); };
  }

  const mergedTabIndex = (origProps.tabIndex as number | undefined) ?? 0;

  const clonedTrigger = React.cloneElement(childEl, {
    ...triggerProps,
    tabIndex: mergedTabIndex,
    // We'll manage ref separately after rendering using a callback wrapper
    ref: (node: HTMLElement | null) => {
      triggerRef.current = node;
    }
  } as React.Attributes & OrigProps);

  const tooltipNode = open && (
    <div
      ref={tooltipRef}
      id={tooltipId}
      role="tooltip"
      className={cn(
        interactive ? "pointer-events-auto" : "pointer-events-none",
        "select-none absolute px-2 py-3 rounded-sm bg-primary-600 shadow z-[var(--z)] animate-in fade-in-0 data-[state=closed]:fade-out-0",
        className
      )}
      data-state={open ? "open" : "closed"}
  style={{ position: "absolute", top: 0, left: 0, zIndex }}
      onMouseEnter={(e: React.MouseEvent<HTMLDivElement>) => {
        if (hoverableContent) {
          clearTimers();
          origProps.onMouseEnter?.(e as unknown as React.MouseEvent<HTMLElement>);
        }
      }}
      onMouseLeave={(e: React.MouseEvent<HTMLDivElement>) => {
        if (hoverableContent) hide();
        origProps.onMouseLeave?.(e as unknown as React.MouseEvent<HTMLElement>);
      }}
    >
      <div className={cn("relative text-neutral-100 text-sm font-medium leading-[0.13em] font-satoshi tracking-[0.02em]", contentClassName)}>
        {content}
  {/* arrow removed */}
      </div>
    </div>
  );

  return (
    <>
      {clonedTrigger}
      {mounted && open && portal
        ? createPortal(
          tooltipNode,
          portalContainer
            || (portalTargetSelector ? document.querySelector(portalTargetSelector) as HTMLElement | null : null)
            || document.body)
        : tooltipNode}
    </>
  );
};

Tooltip.displayName = "Tooltip";

export default Tooltip;
