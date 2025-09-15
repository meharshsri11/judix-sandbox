"use client"
import { cva, VariantProps } from "class-variance-authority";
import React from "react";
import { cn } from "../../utils/cn_tw_merger";
import { Icon } from "judix-icon";
import { IconProps } from "judix-icon/dist/Icon";

export const iconButtonVariants = cva(
  "inline-flex items-center justify-center transition-colors focus:outline-none cursor-pointer p-2 ",
  {
    variants: {
      variant: {
        primary: "bg-base-100 text-primary-400 hover:bg-neutral-300 disabled:text-primary-100",
        "primary-two-tone": "bg-base-100 text-primary-400 hover:bg-primary-100 disabled:text-primary-100 disabled:bg-primary--100",
        outline:
          "bg-base-100 hover:outline-1 hover:-outline-offset-1 hover:outline-neutral-600 text-neutral-800",
        accent: "bg-base-100 text-accent-400 hover:bg-neutral-300 disabled:text-accent-100",
        "accent-two-tone": "bg-neutral-100 text-accent-400 hover:bg-accent-100 disabled:bg-accent--100 disabled:text-accent-100",
        neutral:"bg-base-100 text-neutral-700 hover:bg-neutral-300 disabled:text-neutral-400",
      },
      corner: {
        rounded: "rounded-full",
        sharp: "rounded-md",
      },
    },
    defaultVariants: {
      variant: "primary",
      corner: "rounded",
    },
  }
);

export interface IconButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof iconButtonVariants> {
  icon : IconProps["name"];
  iconClassName?: string;
  iconStrokeWidth?: number;
  iconSize?: number;
}

/**
 * A customizable icon button component with support for variants and corner styles.
 * 
 * @example
 * // Primary icon button
 * <IconButton icon="ArrowRight" variant="primary" />
 * 
 * @example
 * // Accent two-tone icon button with sharp corners
 * <IconButton icon="Checkmark" variant="accent-two-tone" corner="sharp" />
 * 
 * @variants
 * - **primary**: Neutral background with primary color icon
 * - **primary-two-tone**: Neutral background with primary color icon and hover effect
 * - **outline**: Light background with shadow and neutral color icon
 * - **accent**: Neutral background with accent color icon
 * - **accent-two-tone**: Neutral background with accent color icon and hover effect
 * - **neutral**: Neutral background with neutral color icon
 * 
 * @corners
 * - **rounded**: Fully rounded corners
 * - **sharp**: Slightly rounded corners
 * 
 * @props
 * - `icon` (IconName): Name of the icon to display
 * - `variant` (string): Visual style of the button
 * - `corner` (string): Corner style of the button
 * - `className` (string): Additional custom class names
 * - `ref` (React.Ref): Ref to the button element
 */
const IconButton = React.forwardRef<HTMLButtonElement, IconButtonProps>(
  (
    {
      className,
      variant,
      corner,
      icon,
      iconClassName,
      iconStrokeWidth = 2,
      iconSize = 15,
      ...props
    },
    ref
  ) => {
    
    return (
      <button
        className={cn(iconButtonVariants({ variant, corner }), className)}
        ref={ref}
        {...props}
      >
        <Icon name={icon} size={iconSize} strokeWidth={iconStrokeWidth} className={iconClassName} />
      </button>
    );
  }
);
IconButton.displayName = "IconButton";

export default IconButton;
