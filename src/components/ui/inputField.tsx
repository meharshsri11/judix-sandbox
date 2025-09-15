"use client"
import * as React from "react";
import { cn } from "../../utils/cn_tw_merger";
import { cva, VariantProps } from "class-variance-authority";
import { IconProps } from "judix-icon/dist/Icon";
import { Icon } from "judix-icon";

export const inputVariants = cva(
  "inline-flex items-center justify-center w-full transition-colors border border-neutral-300 bg-neutral-100 min-w-[224px]",
  {
    variants: {
      variant: {
        primary:
          "text-neutral-700 hover:border-primary-300 focus-within:border-primary-400 focus-within:hover:border-primary-400",
        grey: "text-neutral-700 hover:border-neutral-600 focus-within:border-neutral-700 focus-within:hover:border-neutral-700",
        accent:
          "text-neutral-700 hover:border-accent-300 focus-within:border-accent-400 focus-within:hover:border-accent-400",
      },
      size: {
        small: "h-10 px-4 rounded-sm text-body-sm font-normal",
        medium: "h-12 rounded-sm px-3 text-body-md font-normal",
        large:
          "h-14 rounded-sm px-3 border-[0.5px] gap-2 text-body-md font-normal leading-[20.8%]",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "small",
    },
  }
);

export interface InputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "size">,
    VariantProps<typeof inputVariants> {
  label?: string;
  labelClassName?: string;
  icon?: IconProps["name"];
  helper?: string;
  helperClassName?: string;
}


/**
 * A customizable input field component with support for labels, icons, helper text, and variants.
 * 
 * @example
 * // Primary input with label
 * <InputField label="Username" variant="primary" size="medium" />
 * 
 * @example
 * // Input with icon and helper text
 * <InputField icon="Search" helper="Please enter a valid email" variant="accent" size="large" />
 * 
 * @variants
 * - **primary**: Primary brand color scheme
 * - **grey**: Neutral grey color scheme
 * - **accent**: Secondary accent color scheme
 * 
 * @sizes
 * - **small**: Compact size (40px height)
 * - **medium**: Medium size (48px height)
 * - **large**: Large size (56px height)
 * 
 * @props
 * - `label` (string): Label text for the input field
 * - `labelClassName` (string): Additional class names for the label
 * - `icon` (IconName): Icon to display inside the input field
 * - `helper` (string): Helper text to display below the input field
 * - `helperClassName` (string): Additional class names for the helper text
 * - `variant` (string): Visual style of the input field
 * - `size` (string): Size of the input field
 * - `className` (string): Additional custom class names
 * - `ref` (React.Ref): Ref to the input element
 */
const InputField = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, variant, type, size, name, label, icon, helper, helperClassName , labelClassName , disabled ,...props }, ref) => {
    return (

      <div className={`flex flex-col gap-2 w-full`}>
        {label && <label htmlFor={name} className={cn("text-body-sm  font-medium w-max" , labelClassName)}>{label}</label>}

        <div className={cn(inputVariants({ variant, size }), className , disabled && "bg-base-200 border-neutral-300 hover:border-neutral-300")}>
          <input
            type={type}
            name={name}
            id={name}
            className={cn(`peer outline-none w-full disabled:bg-base-200 disabled:text-neutral-400 disabled:cursor-not-allowed`)}
            ref={ref}
            disabled={disabled}
            {...props}
          />
          {icon && <Icon name={icon} size={18} className="cursor-pointer peer-disabled:cursor-not-allowed text-neutral-300" />}
        </div>
        {helper && <span className={cn("text-red-400 text-label-md font-normal" , helperClassName )}>{helper}</span>}
      </div>
    );
  }
);
InputField.displayName = "Input";

export default InputField;
