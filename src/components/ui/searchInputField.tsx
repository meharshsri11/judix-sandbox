"use client"
import * as React from "react";
import { useState, useEffect, useRef } from "react";
import { cn } from "../../utils/cn_tw_merger";
import { cva, VariantProps } from "class-variance-authority";
import { IconProps } from "judix-icon/dist/Icon";
import { Icon } from "judix-icon";

export const searchInputVariants = cva(
    "inline-flex gap-3 px-4 items-center justify-center w-full transition-all bg-neutral-100 border border-neutral-100 shadow-sm hover:border hover:border-neutral-200",
    {
        variants: {
            size: {
                small: "h-10 rounded-sm text-body-sm font-normal",
                normal: "h-12 rounded-sm text-body-md font-normal",
            },
        },
        defaultVariants: {
            size: "small",
        },
    }
);

export interface SearchOptionsIF {
    id: string,
    isRecentSearch?: boolean;
    text: string;
    onClick: (id: string) => void;
}

export interface SearchInputProps
    extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "size">,
    VariantProps<typeof searchInputVariants> {
    prefixIcon?: IconProps["name"];
    options?: SearchOptionsIF[];
    onRemoveClick: (id: string) => void;
    dropdownOffset?: number; // Add dropdownOffset prop
    setSearchedInput?: React.Dispatch<React.SetStateAction<string>>
}

const SearchInputField = React.forwardRef<HTMLInputElement, SearchInputProps>(
    ({ className, type = "text", size, name, prefixIcon = "SearchNormal1", disabled, options, onRemoveClick = () => { }, placeholder="Search in here...", dropdownOffset = 0,setSearchedInput, ...props }, ref) => { // Add dropdownOffset with default
        const [isInFocus, setIsInFocus] = useState(false);
        const [highlightedIndex, setHighlightedIndex] = useState(0);
        const [isDropdownVisible, setIsDropdownVisible] = useState(false);
        const [dropdownTop, setDropdownTop] = useState<number>(0); // State for dynamic top
        const optionsRef = useRef<HTMLDivElement>(null);
        const inputContainerRef = useRef<HTMLDivElement>(null); // Ref for input container

        // Calculate dropdown top position
        useEffect(() => {
            if (inputContainerRef.current) {
                const newTop = inputContainerRef.current.offsetHeight + dropdownOffset;
                setDropdownTop(newTop);
            }
        }, [size, dropdownOffset, isInFocus]); // Re-calculate if size, offset, or focus changes

        useEffect(() => {
            if (isInFocus && options?.length) {
                setIsDropdownVisible(true);
            } else {
                setIsDropdownVisible(false);
            }
        }, [isInFocus, options]);

        useEffect(() => {
            if (optionsRef.current && highlightedIndex !== -1) {
                const optionElement = optionsRef.current.children[highlightedIndex] as HTMLElement;
                if (optionElement) {
                    const container = optionsRef.current;
                    const optionTop = optionElement.offsetTop;
                    const optionBottom = optionTop + optionElement.offsetHeight;
                    const containerTop = container.scrollTop;
                    const containerBottom = containerTop + container.offsetHeight;

                    // TODO: Get dynamic padding from computed styles
                    const paddingTop = 70;

                    if (optionTop < containerTop + paddingTop) {
                        // Scroll up to show option at top with padding
                        container.scrollTop = optionTop - paddingTop;
                    } else if (optionBottom > containerBottom) {
                        // Scroll down to show option at bottom
                        container.scrollTop = optionBottom - container.offsetHeight;
                    }
                }
            }
        }, [highlightedIndex]);
        const handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void = (e) => {
            setSearchedInput?.(e.target.value.toLowerCase())
        };
        return (
            <div className={cn(
                "relative flex flex-col min-w-[378.67px]",
                className
            )}
                onFocus={() => setIsInFocus(true)}
                onBlur={() => {
                    // Small delay to allow click events on dropdown items to register
                    setTimeout(() => setIsInFocus(false), 100);
                }}
            >
                <div
                    ref={inputContainerRef} // Apply ref to input container
                    className={cn(
                        searchInputVariants({ size }),
                        // className,
                        disabled && "bg-base-200 border-neutral-300 hover:border-neutral-300",
                        isInFocus && "border border-neutral-200 rounded-b-none",
                        // isInFocus ? "py-3" : "py-2"
                    )}>
                    {/* Search Input Box */}
                    {prefixIcon && <Icon name={prefixIcon} size={18} className="cursor-pointer peer-disabled:cursor-not-allowed text-neutral-400" strokeWidth={2} />}
                    <input
                        type={type}
                        name={name}
                        id={name}
                        className={cn(`peer outline-none w-full h-full disabled:bg-base-200 disabled:text-neutral-400 disabled:cursor-not-allowed placeholder:text-neutral-400`)}
                        ref={ref}
                        disabled={disabled}
                        placeholder={isInFocus ? "Start typing...": placeholder}
                        onKeyDown={(e) => {
                            if (!options) return;

                            if (e.key === 'ArrowDown') {
                                e.preventDefault();
                                setHighlightedIndex(prev =>
                                    prev < options.length - 1 ? prev + 1 : 0
                                );
                            } else if (e.key === 'ArrowUp') {
                                e.preventDefault();
                                setHighlightedIndex(prev =>
                                    prev > 0 ? prev - 1 : options.length - 1
                                );
                            } else if (e.key === 'Enter' && highlightedIndex !== -1) {
                                e.preventDefault();
                                options[highlightedIndex].onClick(options[highlightedIndex].id);
                            }
                        }}
                        onChange={handleChange}
                        {...props}
                    />
                </div>
                {options && (
                    <div
                        ref={optionsRef}
                        className={cn(
                            "absolute transition-all duration-200 z-50 w-full flex flex-col bg-neutral-100 pt-2 px-3 pb-3 h-[280px] overflow-y-auto shadow-sm border border-neutral-200 border-t-0 rounded-b-sm", // Removed top-[36px]
                            isDropdownVisible ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-2 pointer-events-none"
                        )}
                        style={{ top: `${dropdownTop}px` }} // Apply dynamic top style
                    >
                        {options.map((val, key) => {
                            return (
                                <div
                                    key={key}
                                    className={`flex justify-between px-4 py-3 rounded-sm cursor-pointer hover:bg-neutral-200 ${val.isRecentSearch ? "text-primary-400" : "text-neutral-600"
                                        } ${key === highlightedIndex ? "bg-neutral-200" : ""
                                        }`}
                                    onClick={() => val.onClick(val.id)}
                                >
                                    <div className="text-body-sm leading-[130%] tracking-[2px]">
                                        {val.text}
                                    </div>
                                    {val.isRecentSearch && <Icon
                                        onMouseDown={(e) => e.preventDefault()}
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            onRemoveClick(val.id);
                                        }}
                                        name="CloseCircle"
                                        size={16}
                                        className="cursor-pointer"
                                    />}
                                </div>
                            )
                        })}
                    </div>
                )}
            </div>
        );
    }
);
SearchInputField.displayName = "Input";

export default SearchInputField;
