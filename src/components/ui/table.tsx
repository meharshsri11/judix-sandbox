import { cn } from "@/utils/cn_tw_merger";
import { ClassValue } from "class-variance-authority/types";
import { Icon } from "judix-icon";
import React, { ReactNode } from "react";

export interface CDPTableDataIf {
  headings: string[] | ReactNode[];
  rows: (string | ReactNode)[][];
}

const Table = ({
  tData,
  desktopTableClassName,
  desktopHeadingElementClassName,
  desktopBodyElementClassName,
  
  onRowClick, // New prop for row-specific clicks
}: {
  tData: CDPTableDataIf;
  desktopTableClassName?: ClassValue;
  desktopHeadingElementClassName?: ClassValue;
  desktopBodyElementClassName?: ClassValue;

  onRowClick?: (rowIndex: number) => void; // Added new prop type
}) => {
  return (
    <>
      {/* Mobile  Table */}
      <div className="flex flex-col gap-4 xl:hidden">
        {/* Rows */}
        {tData &&
          tData.rows.map((val, key) => {
            return (
              <MobileTableCard key={key} data={val} headings={tData.headings} />
            );
          })}
      </div>

      {/* Desktop  Table */}
      <table
        className={cn(
          "hidden xl:table relative w-full  border-collapse border-[0.75px] border-neutral-200 rounded-md bg-neutral-100 overflow-auto",
          desktopTableClassName
        )}
      >
        <thead className="sticky top-0 bg-neutral-100">
          <tr className="">
            {tData &&
              tData.headings.map((val, index) => {
                return (
                  <TableHeading
                    className={desktopHeadingElementClassName}
                    key={index}
                  >
                    {val}
                  </TableHeading>
                );
              })}
          </tr>
        </thead>
        <tbody className="">
          {tData &&
            tData.rows.map((val, index) => {
              return (
                <TableRow
                  tableBodyElementClassName={desktopBodyElementClassName}
                  key={index}
                  data={val}
                  onClick={onRowClick ? () => onRowClick(index) : undefined} // Pass onClick to TableRow
                />
              );
            })}
        </tbody>
      </table>
    </>
  );
};

export const TableRow = ({
  data,
  tableBodyElementClassName,
  onClick, // Added onClick prop
}: {
  data?: (string | ReactNode)[];
  tableBodyElementClassName?: ClassValue;
  onClick?: () => void; // Added onClick prop type
}) => {
  return (
    <tr className="hover:bg-neutral-200 cursor-pointer" onClick={onClick}>
      {data?.map((val, index) => {
        return (
          <TableBodyElement className={tableBodyElementClassName} key={index}>
            {val || (
              <div className="flex justify-center items-center cursor-pointer text-yellow-600" title="Data is being Fetched">
                <Icon name="InfoCircle" />
              </div>
            )}
          </TableBodyElement>
        );
      })}
    </tr>
  );
};

const TableHeading = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: ClassValue;
}) => {
  return (
    <th
      className={cn(
        "px-3 py-2 min-h-12 max-h-16 text-neutral-700 font-medium text-body-sm leading-[130%] tracking-[0.02em] border-[0.75px] border-neutral-200 ",
        className
      )}
    >
      {children}
    </th>
  );
};

const TableBodyElement = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: ClassValue;
}) => {
  return (
    <td
      className={cn(
        "px-3 py-4 min-h-20 max-h-[120px] font-medium text-label-lg tracking-[0.03em] leading-[130%] border-[0.75px] border-neutral-200 text-neutral-600 text-center",
        className
      )}
    >
      {children}
    </td>
  );
};

export const MobileTableCard = ({
  data,
  headings,
}: {
  data?: (string | ReactNode)[];
  headings?: string[] | ReactNode[];
}) => {
  return (
    <>
      <div className="flex flex-col border-x-[0.5px] border-t-[0.5px] border-neutral-200">
        {headings?.map((val, key) => {
          return (
            <MobileCardRowComponent key={key} label={val} value={data![key]} />
          );
        })}
      </div>
    </>
  );
};

const MobileCardRowComponent = ({
  label,
  value,
  labelClassName,
  valueClassName,
}: {
  label: string | ReactNode;
  value: string | ReactNode;
  labelClassName?: ClassValue;
  valueClassName?: ClassValue;
}) => {
  return (
    <>
      <div className="flex  border-b-[0.5px] border-neutral-200">
        <div
          className={cn(
            "w-[136px] p-2 text-body-sm font-normal tracking-[0.03em] leading-[130%] text-neutral-600",
            labelClassName
          )}
        >
          {label}
        </div>
        <div
          className={cn(
            "border-l-[0.5px] border-neutral-200 flex-1 p-2 font-medium text-body-sm leading-[130%] tracking-[0.03em] text-neutral-800",
            valueClassName
          )}
        >
          {value}
        </div>
      </div>
    </>
  );
};

export default Table;
