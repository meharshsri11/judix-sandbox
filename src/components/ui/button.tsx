"use client"
import { cva, VariantProps } from "class-variance-authority";
import React from "react";
import {cn} from "../../utils/cn_tw_merger"
import { Icon } from "judix-icon";
import { IconProps } from "judix-icon/dist/Icon";

export const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 rounded-md transition-colors focus:outline-none cursor-pointer shadow-sm tracking-[0.02em] leading-[130%] disabled:bg-neutral-200 disabled:text-neutral-400 disabled:cursor-not-allowed select-none",
  {
    variants: {
      variant: {
        primary: "bg-primary-400 text-neutral-100 hover:bg-primary-600",
        outline:
          "bg-neutral-100 hover:outline-1 hover:-outline-offset-1 hover:outline-neutral-600 text-neutral-800",
        accent: "bg-accent-400 text-neutral-100 hover:bg-accent-600",
      },
      size: {
        extraSmall: "h-8 px-3 py-1.5 rounded-sm text-body-sm font-medium",
        small: "h-9 px-4 py-2 rounded-sm text-body-sm font-medium",
        medium: "h-10 rounded-sm px-4 py-2 text-body-md font-medium",
        large: "h-11 rounded-sm px-4 py-2 gap-2 text-body-lg font-bold",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "small",
    },
  }
);


export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  /**
   * Icon name to display before button text
   * @example "ArrowRight"
   */
  prefixIcon?: IconProps["name"];

  /**
   * Icon name to display after button text
   * @example "ExternalLink"
   */
  suffixIcon?: IconProps["name"];

  /**
   * Additional props to pass to both icons
   * @default { size: 16, strokeWidth: 1.5 }
   */
  iconsProps?: Omit<IconProps , "name">;
}

/**
 * A customizable button component with support for variants, icons, and sizes.
 *
 * @example
 * // Primary button with icon
 * <Button variant="primary" size="large" prefixIcon="Checkmark">
 *   Submit
 * </Button>
 *
 * @example
 * // Outline button
 * <Button variant="outline" size="medium">
 *   Cancel
 * </Button>
 *
 * @variants
 * - **primary**: Primary brand color
 * - **outline**: Light background with border
 * - **accent**: Secondary accent color
 *
 * @sizes
 * - **small**: Compact size for dense UIs
 * - **medium**: Default size
 * - **large**: Prominent call-to-action
 *
 * @props
 * - `prefixIcon` (IconName): Icon before text
 * - `suffixIcon` (IconName): Icon after text
 * - `iconsProps` (IconProps): Additional icon styling
 */
const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant,
      size,
      prefixIcon,
      suffixIcon,
      iconsProps,
      children,
      type = "button",
      ...props
    },
    ref
  ) => {
    const iconSizeMap: Record<
      NonNullable<ButtonProps["size"]>,
      IconProps["size"]
    > = {
      extraSmall: 14,
      small: 14,
      medium: 16,
      large: 16,
    };
    return (
      <button
        type={type}
        className={cn(buttonVariants({ variant, size }), className)}
        ref={ref}
        {...props}
      >
        {prefixIcon && (
          <Icon
            name={prefixIcon}
            size={iconSizeMap[size!]}
            strokeWidth={2}
            {...iconsProps}
          />
        )}
        {children}
        {suffixIcon && (
          <Icon
            name={suffixIcon}
            size={iconSizeMap[size!]}
            strokeWidth={2}
            {...iconsProps}
          />
        )}
      </button>
    );
  }
);
Button.displayName = "Button";

export default Button;
