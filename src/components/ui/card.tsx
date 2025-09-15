import { cn } from "@/utils/cn_tw_merger";
import React, { ReactNode } from "react";

export const CardTitleComponent = ({ children }: { children: ReactNode }) => {
  return (
    <div className="text-neutral-500 font-bold leading-[130%] py-1 px-0.5">
      {/* Title */}
      {children}
    </div>
  );
};

const Card = ({
  title,
  className,
  children,
}: {
  title?: ReactNode;
  className?: string;
  children?: ReactNode;
}) => {
  return (
    <>
      <div
        className={cn(
          `flex flex-col bg-neutral-100 rounded-md shadow-sm p-4 gap-5`,
          className
        )}
      >
        {title && (
          <div className="text-neutral-500 font-bold leading-[130%] py-1 px-0.5">
            {/* Title */}
            {title}
          </div>
        )}
        {children}
      </div>
    </>
  );
};

export default Card;
