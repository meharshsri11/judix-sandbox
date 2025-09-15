"use client"
import * as React from "react";
import { cva, VariantProps } from "class-variance-authority";
import { cn } from "../../utils/cn_tw_merger";
import { Icon } from "judix-icon";
import { IconProps } from "judix-icon/dist/Icon";

export const badgeVariants = cva(
  "flex items-center justify-center gap-1.5 w-max transition-colors cursor-pointer outline outline-offset-[-1px]",
  {
    variants: {
      color: {
        red: "bg-red-000 text-red-300 outline-red-200",
        orange: "bg-orange-000 text-orange-300 outline-orange-200",
        yellow: "bg-yellow-000 text-yellow-400 outline-yellow-300",
        green: "bg-green-000 text-green-400 outline-green-300",
        blue: "bg-blue-000 text-blue-400 outline-blue-300",
        grey: "bg-neutral-200 text-neutral-600 outline-neutral-500",
        primary: "bg-primary--100 text-primary-300 outline-primary-200",
        accent: "bg-accent--100 text-accent-300 outline-accent-200",
      },
      variant: {
        default: "outline-transparent",
        "two-tone-with-bg":
          "outline",
        "two-tone-no-bg":
          "outline bg-transparent",
      },
      size: {
        small: "px-3.5 py-1.5 h-[22px] text-label-md leading-[135%] tracking-[0em]",
        medium: "px-3.5 py-1.5 h-6 text-body-sm leading-[135%] tracking-[0em]",
        large: "px-4 h-7 text-body-md leading-[135%] tracking-[0em]",
      },
      corner: {
        sharp: "rounded-xs",
        rounded: "rounded-full",
      },
    },
    defaultVariants: {
      color: "grey",

      variant: "default",
      size: "medium",
      corner: "rounded",
    },
  }
);

export interface BadgeProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "color">,
    VariantProps<typeof badgeVariants> {
  showPrefixDot?: boolean;
  suffixIcon?: IconProps["name"];
  suffixIconSize?: IconProps["size"];
}

/**
 * A customizable badge component with support for colors, variants, sizes, and icons.
 * 
 * @example
 * // Default badge with grey color
 * <Badge>Default Badge</Badge>
 * 
 * @example
 * // Badge with a prefix dot and suffix icon
 * <Badge color="blue" showPrefixDot suffixIcon="Checkmark">
 *   Success
 * </Badge>
 * 
 * @variants
 * - **default**: No border, solid background
 * - **two-tone-with-bg**: With border and background
 * - **two-tone-no-bg**: With border, no background
 * 
 * @colors
 * - **red**: Red color scheme
 * - **orange**: Orange color scheme
 * - **yellow**: Yellow color scheme
 * - **green**: Green color scheme
 * - **blue**: Blue color scheme
 * - **grey**: Neutral grey color scheme
 * - **primary**: Primary brand color scheme
 * - **accent**: Secondary accent color scheme
 * 
 * @sizes
 * - **small**: Compact size (22px height)
 * - **medium**: Medium size (24px height)
 * - **large**: Large size (28px height)
 * 
 * @corners
 * - **sharp**: Sharp corners with small radius
 * - **rounded**: Fully rounded corners
 * 
 * @props
 * - `color` (string): Color scheme of the badge
 * - `variant` (string): Visual style of the badge
 * - `size` (string): Size of the badge
 * - `corner` (string): Corner style of the badge
 * - `showPrefixDot` (boolean): Whether to show a dot before the text
 * - `suffixIcon` (IconName): Icon to display after the text
 * - `className` (string): Additional custom class names
 */
function Badge({
  className,
  color,
  variant,
  size,
  corner,
  showPrefixDot = false,
  suffixIcon,
  suffixIconSize,
  children,
  ...props
}: BadgeProps) {
  const IconSizeMapBasedOnSize = {
    small: 14,
    medium: 14,
    large: 16,
  };
  return (
    <div
      className={cn(badgeVariants({ color, variant, size, corner }), className)}
      {...props}
    >
      {showPrefixDot && (
        <div className="w-1 h-1 rounded-full bg-current"></div>
      )}
      <div className="neutralspace-nowrap w-full">{children}</div>
      {suffixIcon && (
        <div className="inline-block text-current">
          <Icon name={suffixIcon} size={suffixIconSize ? suffixIconSize : IconSizeMapBasedOnSize[size!]} />
        </div>
      )}
    </div>
  );
}

export default Badge;
