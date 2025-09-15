"use client"
import React from "react";
import { cva, VariantProps } from "class-variance-authority";
import { cn } from "../../utils/cn_tw_merger";

// Toggle container variants including color, size, and disabled styling
export const toggleVariants = cva(
  "relative inline-flex items-center transition-colors rounded-full cursor-pointer",
  {
    variants: {
      variant: {
        primary: "bg-neutral-300 peer-checked:bg-primary-400",
        accent: "bg-neutral-300 peer-checked:bg-accent-400",
        "semantic-blue": "bg-neutral-300 peer-checked:bg-blue-400",
      },
      size: {
        small: "w-8 h-4",
        medium: "w-10  h-5",
        large: "w-12 h-6",
      },
      isDisabled: {
        true: "opacity-50 cursor-not-allowed",
        false: "",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "medium",
      isDisabled: false,
    },
  }
);

// Extend the component props by combining standard input props and the toggle variants
export interface ToggleButtonProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "size">,
    VariantProps<typeof toggleVariants> {}

// Map the outer size to the thumb (inner dot) size
const thumbSizeMapping: Record<"small" | "medium" | "large", string> = {
  small: "w-3.5 h-3.5",
  medium: "w-[18px] h-[18px]",
  large: "w-[22px] h-[22px]",
};

// Map the size to the translate class used to move the thumb when checked
const thumbTranslateMapping: Record<"small" | "medium" | "large", string> = {
  small: "peer-checked:translate-x-4",
  medium: "peer-checked:translate-x-5",
  large: "peer-checked:translate-x-6",
};

/**
 * A customizable toggle button component with support for variants, sizes, and disabled states.
 * 
 * @example
 * // Primary toggle button
 * <ToggleButton variant="primary" size="medium" />
 * 
 * @example
 * // Disabled accent toggle button
 * <ToggleButton variant="accent" size="large" disabled />
 * 
 * @variants
 * - **primary**: Primary brand color scheme
 * - **accent**: Secondary accent color scheme
 * - **semantic-blue**: Semantic blue color scheme
 * 
 * @sizes
 * - **small**: Compact size (32px x 16px)
 * - **medium**: Medium size (40px x 20px)
 * - **large**: Large size (48px x 24px)
 * 
 * @props
 * - `variant` (string): Visual style of the toggle button
 * - `size` (string): Size of the toggle button
 * - `disabled` (boolean): Whether the toggle button is disabled
 * - `className` (string): Additional custom class names
 * - `ref` (React.Ref): Ref to the input element
 */
const ToggleButton = React.forwardRef<HTMLInputElement, ToggleButtonProps>(
  ({ className, variant, size, disabled, ...props }, ref) => {
    // Combine the native disabled prop with the styling variant
    
    const toggleSize = size || "medium";

    return (
      <label className={cn("relative inline-flex items-center cursor-pointer", className)}>
        {/* Hidden checkbox acting as the toggle's state */}
        <input
          type="checkbox"
          className="peer sr-only"
          ref={ref}
          disabled={disabled}
          {...props}
        />

        {/* Outer container styled based on variant, size, and disabled state */}
        <div className={cn(toggleVariants({ variant, size: toggleSize, isDisabled: disabled }))}>
          
        </div>
        {/* The thumb that slides on toggle */}
        <div
            className={cn(
              "absolute left-[1px] transform bg-neutral-100 rounded-full shadow transition-transform",
              thumbSizeMapping[toggleSize],
              thumbTranslateMapping[toggleSize],
              disabled && "cursor-not-allowed"
            )}
          />
      </label>
    );
  }
);

ToggleButton.displayName = "ToggleButton";

export default ToggleButton;
