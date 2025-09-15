"use client"
import React from "react";
import { cva, VariantProps } from "class-variance-authority";
import { cn } from "../../utils/cn_tw_merger";

export const radioVariants = cva(
  "rounded-full transition-colors outline-none cursor-pointer border-neutral-400 peer-disabled:hover:border-neutral-400",
  {
    variants: {
      variant: {
        primary:
          "hover:border-primary-200 peer-checked:hover:border-primary-400 peer-checked:border-primary-400 peer-checked:text-primary-400 ",
        accent: "hover:border-accent-200 peer-checked:hover:border-accent-400 peer-checked:border-accent-400 peer-checked:text-accent-400",
        grey: "hover:border-neutral-400 peer-checked:hover:border-neutral-700  peer-checked:border-neutral-700",
      },
      size: {
        small: "border w-3.5 h-3.5",
        medium: "border-2 w-4  h-4",
        large: "border-2 w-5 h-5",
      },
      isDisabled:{
        true:"",
        false:""
      }
    },
    defaultVariants: {
      variant: "primary",
      size: "medium",
    },
    
  }
);

export interface RadioProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "size">,
    VariantProps<typeof radioVariants> {}

// Map outer size to inner dot size
const innerSizeMapping: Record<"small" | "medium" | "large", string> = {
  small: "w-[7px] h-[7px] translate-x-[0.5px]",
  medium: "w-2 h-2",
  large: "w-2.5 h-2.5",
};

// Map variant to inner dot background color
const innerColorMapping: Record<"primary" | "accent" | "grey", string> = {
  primary: "bg-primary-400",
  accent: "bg-accent-400",
  grey: "bg-neutral-700",
};

/**
 * A customizable radio button component with support for variants, sizes, and disabled states.
 * 
 * @example
 * // Primary radio button
 * <Radio variant="primary" size="medium" />
 * 
 * @example
 * // Disabled grey radio button
 * <Radio variant="grey" size="small" disabled />
 * 
 * @variants
 * - **primary**: Primary brand color scheme
 * - **accent**: Secondary accent color scheme
 * - **grey**: Neutral grey color scheme
 * 
 * @sizes
 * - **small**: Compact size (14px x 14px)
 * - **medium**: Medium size (16px x 16px)
 * - **large**: Large size (20px x 20px)
 * 
 * @props
 * - `variant` (string): Visual style of the radio button
 * - `size` (string): Size of the radio button
 * - `disabled` (boolean): Whether the radio button is disabled
 * - `className` (string): Additional custom class names
 * - `ref` (React.Ref): Ref to the input element
 */
const Radio = React.forwardRef<HTMLInputElement, RadioProps>(
  ({ className, variant, size, disabled = false , ...props }, ref) => {

    const innerSizeClass = innerSizeMapping[size || "medium"];
    const innerColorClass =
      innerColorMapping[
        (variant as "primary" | "accent" | "grey") || "grey"
      ];

    return (
      <label className="group relative inline-flex items-center cursor-pointer">
        {/* Hidden radio input (the 'peer') */}
        <input type="radio" className="peer hidden" ref={ref} disabled={disabled} {...props} />

        {/* Outer circle (unselected/selected border) */}
        <div className={cn(radioVariants({ variant, size }), className)} />

        {/* Overlay for the inner dot (only visible when checked) */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-0 peer-checked:opacity-100 peer-disabled:opacity-100 transition-opacity aspect-square">
          <div
            className={cn("rounded-full transform ", innerSizeClass, innerColorClass , disabled &&"bg-neutral-400")}
          />
        </div>
      </label>
    );
  }
);

Radio.displayName = "Radio";

export default Radio;
