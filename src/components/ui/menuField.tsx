import * as React from "react";
import { useState, useEffect, useRef } from "react"; // Added useState, useEffect, useRef
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/utils/cn_tw_merger";
import { Dropdown, DropdownItem } from "./dropdown/Dropdown"; // Import Dropdown again
// import Button from "./button"; // Button not used directly
import InputField from "./inputField";
import { Icon } from "judix-icon"; // Import Icon for the dropdown arrow

// --- CVA Variants ---

const menuFieldLabelVariants = cva(
  "block mb-1 font-medium text-neutral-700", // Base label styles
  {
    variants: {
      size: {
        large: "text-label-lg",
        normal: "text-label-md",
        medium: "text-label-sm",
      },
    },
    defaultVariants: {
      size: "normal",
    },
  }
);

const menuFieldTriggerVariants = cva(
  "relative flex w-full items-center justify-between ",
  {
    variants: {
      size: {
        large: "h-12 text-body-lg", // Adjust height and text size
        normal: "h-10 text-body-md",
        medium: "h-8 text-body-sm", // Adjust height and text size
      },
      error: {
        true: "border-red-500 focus:ring-red-500 focus:border-red-500", // Error border
        false: "border-neutral-300", // Normal border
      },
    },
    defaultVariants: {
      size: "normal",
      error: false,
    },
  }
);

const menuFieldErrorVariants = cva(
  "mt-1 text-red-600", // Base error styles
  {
    variants: {
      size: {
        large: "text-label-md",
        normal: "text-label-sm",
        medium: "text-xs", // Maybe smaller for medium?
      },
    },
    defaultVariants: {
      size: "normal",
    },
  }
);

// --- Props Interface ---

interface Option {
  value: string | number;
  label: string;
}

interface MenuFieldProps extends React.HTMLAttributes<HTMLDivElement> {
  label?: string;
  options: Option[];
  value?: string | number;
  onValueChange?: (value: string | number) => void; // Renamed from onChange
  placeholder?: string;
  size?: VariantProps<typeof menuFieldTriggerVariants>["size"];
  error?: string;
  disabled?: boolean;
  // Allow passing props to the dropdown content itself if needed
  dropdownClassName?: string;
  dropdownOffset?: number;
  id?: string; // Allow passing an id for label association
  portalTargetSelector?: string; // Add portal target selector prop
}

// --- Component Implementation ---

const MenuField = React.forwardRef<HTMLDivElement, MenuFieldProps>(
  (
    {
      className,
      label,
      options,
      value,
      onValueChange, // Use the renamed prop
      placeholder = "Select an option",
      size = "normal",
      error,
      disabled,
      dropdownClassName,
      dropdownOffset,
      id,
      portalTargetSelector = "#dialog-portal-target", // Default portal target
      ...props
    },
    ref // Forward ref to the main container div
  ) => {
    const getInitialLabel = () =>
      options.find((option) => option.value === value)?.label ?? "";
    const [inputValue, setInputValue] = useState<string>(getInitialLabel());
    const [filteredOptions, setFilteredOptions] = useState<Option[]>(options);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    // const containerRef = useRef<HTMLDivElement>(null); // No longer needed for click outside
    const inputRef = useRef<HTMLInputElement>(null); // Ref for the input element inside InputField

    const hasError = !!error;
    // Generate unique IDs if not provided, or use provided ID
    const reactId = React.useId();
    const inputId = id || `${reactId}-input`; // Use id for input if provided
    const labelId = id ? `${id}-label` : `${reactId}-label`;
    const listboxId = id ? `${id}-listbox` : `${reactId}-listbox`;

    // Update input value if the external value prop changes
    useEffect(() => {
      setInputValue(getInitialLabel());
    }, [value, options]);

    // Filter options based on input value, but show all if input matches selected value
    useEffect(() => {
      if (!isDropdownOpen) {
        // Optionally reset filter when closed if desired, or leave as is
        // setFilteredOptions(options); // Example: Reset filter on close
        return;
      }

      const selectedOptionLabel = options.find(opt => opt.value === value)?.label;
      const lowerCaseInput = inputValue.toLowerCase();

      // If a value is selected AND the input hasn't been changed by the user since selection
      if (value !== undefined && value !== null && selectedOptionLabel && inputValue === selectedOptionLabel) {
        setFilteredOptions(options); // Show all options
      } else {
        // Otherwise, filter based on the current input
        setFilteredOptions(
          options.filter((option) =>
            option.label.toLowerCase().includes(lowerCaseInput)
          )
        );
      }
    }, [inputValue, options, isDropdownOpen, value]); // Add value to dependency array

    // Click outside and Escape key are handled by the Dropdown component

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      setInputValue(event.target.value);
      if (!isDropdownOpen) {
        setIsDropdownOpen(true); // Open dropdown on typing
      }
    };

   

    // We might need a slight delay on blur to allow item click
    // const handleInputBlur = () => {
    //   setTimeout(() => {
    //     setIsDropdownOpen(false);
    //   }, 150); // Delay to allow click event on dropdown item
    // };

    const handleOptionClick = (option: Option) => {
      onValueChange?.(option.value);
      setInputValue(option.label);
      setIsDropdownOpen(false);
      inputRef.current?.focus(); // Keep focus on input after selection
    };

    const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
      if (
        event.key === "Enter" &&
        isDropdownOpen &&
        filteredOptions.length > 0
      ) {
        // Handle selection with Enter key - select the first filtered option
        handleOptionClick(filteredOptions[0]);
        event.preventDefault(); // Prevent form submission if applicable
        // Escape is handled by Dropdown component
        // } else if (event.key === 'Escape') {
        //     setIsDropdownOpen(false);
      } else if (event.key === "ArrowDown") {
        // TODO: Basic arrow key navigation could be added here
        // Focus the first item in the dropdown list?
      }
    };

    // Helper function to map MenuField size to InputField size
    const mapMenuSizeToInputSize = (
      menuSize: typeof size
    ): "large" | "medium" | "small" | undefined => {
      if (menuSize === "large") return "large";
      if (menuSize === "normal") return "medium";
      if (menuSize === "medium") return "small";
      return undefined; // Should not happen with default 'normal'
    };

    const inputFieldSize = mapMenuSizeToInputSize(size);

    return (
      // Pass forwarded ref to the outer div if needed, or remove if not used externally
      <div className={cn(className)} ref={ref} {...props}>
        {/* Label */}
        {label && (
          <label
            htmlFor={inputId}
            id={labelId}
            className={cn(menuFieldLabelVariants({ size }))}
          >
            {label}
          </label>
        )}

        {/* Use Dropdown Component */}
        <Dropdown
          position="bottom"
          align="start"
          offset={dropdownOffset ?? 4}
          className={dropdownClassName} // Pass classname to dropdown content
          portalTargetSelector={portalTargetSelector} // Use the prop
          isOpen={isDropdownOpen}
          onOpenChange={setIsDropdownOpen}
          trigger={
            // The trigger is the InputField structure
            <div className="relative w-full">
              <InputField
                ref={inputRef} // Pass ref to the underlying input
                id={inputId}
                value={inputValue}
                onChange={handleInputChange}
                // onBlur={handleInputBlur} // Use click outside instead for better UX
                onKeyDown={handleKeyDown} // Add keydown handler
                placeholder={placeholder}
                variant={"grey"} // Or use props
                size={inputFieldSize} // Use mapped size
                className={cn(
                  // Use original menuField size for trigger styling, but inputFieldSize for input's internal height/padding
                  menuFieldTriggerVariants({ size, error: hasError }),
                  "pr-10" // Add padding for the icon
                )}
                disabled={disabled}
                role="combobox"
                aria-haspopup="listbox"
                aria-expanded={isDropdownOpen}
                aria-controls={listboxId} // Link input to the listbox
                aria-autocomplete="list" // Indicate list autocompletion
                aria-labelledby={labelId} // Link to label
                autoComplete="off" // Prevent browser autocomplete interfering
              />
              {/* Icon inside the InputField container, acts as part of the trigger */}
              <div
                className="absolute inset-y-0 right-0 flex items-center pr-3 cursor-pointer"
                onClick={(e) => {
                  e.stopPropagation(); // Prevent input focus handler from immediately re-opening
                  setIsDropdownOpen(!isDropdownOpen); // Toggle on icon click
                }}
                aria-hidden="true"
              >
                <Icon name="ArrowDown" size={16} className="text-neutral-500" />
              </div>
            </div>
          }
        >
          {/* Dropdown Content */}
          <div
            id={listboxId} // Keep ID for aria-controls
            role="listbox"
            aria-labelledby={labelId}
            className="max-h-60 overflow-auto" // Add scroll within dropdown content
          >
            {filteredOptions.length > 0 ? (
              filteredOptions.map((option) => (
                <DropdownItem
                  key={option.value}
                  onClick={() => handleOptionClick(option)}
                  aria-selected={value === option.value}
                  role="option"
                  className={cn(
                    "cursor-pointer",
                    value === option.value ? "bg-neutral-200 font-semibold" : ""
                  )}
                >
                  {option.label}
                </DropdownItem>
              ))
            ) : (
              <div className="px-4 py-3 text-sm text-neutral-500">
                No options found
              </div>
            )}
          </div>
        </Dropdown>

        {/* Error Message */}
        {hasError && (
          <p className={cn(menuFieldErrorVariants({ size }))}>{error}</p>
        )}
      </div>
    );
  }
);

MenuField.displayName = "MenuField";

// Keep exported variants
export {
  MenuField,
  menuFieldTriggerVariants,
  menuFieldLabelVariants,
  menuFieldErrorVariants,
};
