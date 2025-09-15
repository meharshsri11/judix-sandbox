import { ComponentPropsWithoutRef } from "react";

export const DropdownItem_2: React.FC<ComponentPropsWithoutRef<"button">> = ({
  className = "text-gray-700",
  children,
  ...props
}) => (
  <button
    className={`w-40 px-4 py-2.5 text-sm ${className} hover:bg-gray-50 flex items-center gap-3 text-left whitespace-nowrap`}
    {...props}
  >
    {children}
  </button>
);