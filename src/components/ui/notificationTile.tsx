import React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/utils/cn_tw_merger';
import { Icon } from 'judix-icon';

// Define CVA variants for the notification tile root element
const notificationTileVariants = cva(
  'w-96 p-5 rounded-lg shadow-sm inline-flex justify-start items-start gap-2', // Base classes
  {
    variants: {
      variant: {
        info: 'bg-base-100',
        success: 'bg-green-000', // Assuming green-000 is a valid color in your config
        warning: 'bg-yellow-000', // Assuming yellow-000 is a valid color in your config
        error: 'bg-red-000', // Assuming red-000 is a valid color in your config
      },
    },
    defaultVariants: {
      variant: 'info',
    },
  }
);

// Define styles for inner elements based on variant
// Using simple objects for clarity, could also use cva if more complex variants were needed
const innerElementStyles = {
  info: {
    title: 'text-neutral-800',
    description: 'text-neutral-800',
    timestamp: 'text-neutral-500',
    icon: 'text-neutral-600',
    closeButton: 'text-neutral-500 hover:text-neutral-700',
  },
  success: {
    title: 'text-green-800',
    description: 'text-green-700',
    timestamp: 'text-green-600',
    icon: 'text-green-500',
    closeButton: 'text-green-600 hover:text-green-800',
  },
  warning: {
    title: 'text-yellow-800',
    description: 'text-yellow-700',
    timestamp: 'text-yellow-600',
    icon: 'text-yellow-500',
    closeButton: 'text-yellow-600 hover:text-yellow-800',
  },
  error: {
    title: 'text-red-800',
    description: 'text-red-700',
    timestamp: 'text-red-600',
    icon: 'text-red-500',
    closeButton: 'text-red-600 hover:text-red-800',
  },
};

// Define the props interface, extending CVA variants
export interface NotificationTileProps
  extends React.HTMLAttributes<HTMLDivElement>, // Include standard div attributes
    VariantProps<typeof notificationTileVariants> {
  /**
   * The icon element to display.
   */
  icon: React.ReactNode;
  /**
   * The main title of the notification.
   */
  title: string;
  /**
   * The timestamp for the notification.
   */
  timestamp: string;
  /**
   * The detailed description or message of the notification.
   */
  description: string;
  /**
   * Optional callback function to handle the close action.
   * If provided, a close button will be displayed.
   */
  onClose?: () => void;
  /**
   * Optional additional CSS class names to apply to the root element.
   */
  className?: string; // className is already handled by extending HTMLAttributes and cn
}

/**
 * A component to display notification information in a tile format,
 * enhanced with CVA for better variant management and customization.
 */
export const NotificationTile = React.forwardRef<HTMLDivElement, NotificationTileProps>(
  ({ className, variant = 'info', icon, title, timestamp, description, onClose, ...props }, ref) => {
    // The 'variant' prop now defaults to 'info' directly in the destructuring.
    // CVA handles applying the correct root classes based on the resolved variant.
    const styles = innerElementStyles[variant!]; // Use the resolved variant


    return (
      <div
        ref={ref}
        className={cn(notificationTileVariants({ variant, className }))}
        role="alert"
        {...props}
      >
        {/* Icon */}
        <div className="w-10 h-10 relative flex-shrink-0 flex items-center justify-center">
          <span className={cn(styles.icon)}>{icon}</span>
        </div>

        {/* Content */}
        <div className="flex-1 inline-flex flex-col justify-start items-start gap-2">
          {/* Header: Title & Timestamp */}
          <div className="self-stretch inline-flex justify-between items-start">
            <div className="flex justify-start items-center gap-4">
              {/* Title */}
              <div className="flex justify-center items-center gap-2">
                <div className={cn("text-body-sm font-medium font-satoshi leading-tight tracking-[2%]", styles.title)}>
                  {title}
                </div>
              </div>
              {/* Timestamp */}
              <div className="flex justify-center items-center gap-2">
                <div className={cn("text-label-sm font-medium font-satoshi leading-3 tracking-wide", styles.timestamp)}>
                  {timestamp}
                </div>
              </div>
            </div>

            {/* Close Button (Conditional) */}
            {onClose && (
              <button
                onClick={onClose}
                className={cn(
                  "w-4 h-4 relative flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-primary-300 rounded",
                  styles.closeButton
                )}
                aria-label="Close notification"
              >
                <Icon name='Cross' />
              </button>
            )}
          </div>
          {/* Description */}
          <div className="self-stretch inline-flex justify-center items-center gap-2">
            <div className={cn("flex-1 text-body-sm font-normal font-satoshi leading-tight tracking-[2%]", styles.description)}>
              {description}
            </div>
          </div>
        </div>
      </div>
    );
  }
);

NotificationTile.displayName = 'NotificationTile';