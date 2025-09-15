"use client"
import { cva, VariantProps } from "class-variance-authority";
import React from "react";
import { cn } from "../../utils/cn_tw_merger";
import { Icon } from "judix-icon";

export const checkBoxVariants = cva(
  "appearance-none border transition-all outline-none cursor-pointer flex items-center justify-center peer-disabled:border-neutral-200 peer-disabled:bg-neutral-200 peer-disabled:hover:border-neutral-200",
  {
    variants: {
      variant: {
        primary:
          "border-neutral-300 hover:border-primary-200 peer-checked:bg-primary-400 peer-checked:border-primary-400 peer-checked:hover:border-primary-400",
        accent:
          "border-neutral-300 hover:border-accent-200 peer-checked:bg-accent-400 peer-checked:border-accent-400 peer-checked:hover:border-accent-400",
        grey: "border-neutral-300 hover:border-neutral-700 peer-checked:border-neutral-700 peer-checked:bg-neutral-800 peer-checked:text-neutral-100",
      },
      checkboxSize: {
        extraSmall: "h-[14px] w-[14px] rounded-xs",
        small: "h-4 w-4 rounded-xs",
        medium: "h-[18px] w-[18px] rounded-xs",
        large: "h-5 w-5 rounded-xs",
      },
    },
    defaultVariants: {
      variant: "primary",
      checkboxSize: "medium",
    },
  }
);

export interface CheckBoxProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "size">,
    VariantProps<typeof checkBoxVariants> {}

/**
 * A customizable checkbox component with support for variants and sizes.
 *
 * @example
 * // Primary checkbox
 * <CheckBox variant="primary" checkboxSize="medium" />
 *
 * @example
 * // Grey checkbox with custom class
 * <CheckBox variant="grey" checkboxSize="large" className="custom-class" />
 *
 * @variants
 * - **primary**: Primary brand color scheme
 * - **accent**: Secondary accent color scheme
 * - **grey**: Neutral grey color scheme
 *
 * @sizes
 * - **extraSmall**: Compact size (14px x 14px)
 * - **small**: Small size (16px x 16px)
 * - **medium**: Medium size (18px x 18px)
 * - **large**: Large size (20px x 20px)
 *
 * @props
 * - `variant` (string): Visual style of the checkbox
 * - `checkboxSize` (string): Size of the checkbox
 * - `className` (string): Additional custom class names
 * - `ref` (React.Ref): Ref to the input element
 */
const CheckBox = React.forwardRef<HTMLInputElement, CheckBoxProps>(
  ({ className, variant, checkboxSize, ...props }, ref) => {
    return (
      <label className="relative inline-flex items-center cursor-pointer">
        {/* Hidden input with peer class */}
        <input type="checkbox" className="peer hidden" ref={ref} {...props} />
        {/* Styled checkbox container */}
        <div
          className={cn(checkBoxVariants({ variant, checkboxSize }), className)}
        />
        {/* Overlay for the check icon */}
        <div className="absolute inset-0  flex items-center justify-center pointer-events-none opacity-0 peer-checked:opacity-100 peer-disabled:opacity-100 text-neutral-100 transition-opacity px-1 py-[5px]">
          <Icon name="SingleTick" color="neutral" strokeWidth={2} className="" />
        </div>
      </label>
    );
  }
);

CheckBox.displayName = "CheckBox";

export default CheckBox;