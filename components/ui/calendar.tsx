"use client";

import * as React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { DayPicker, DropdownProps } from "react-day-picker";

import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";

export type CalendarProps = React.ComponentProps<typeof DayPicker>;

export function CustomSelectDropdown(props: DropdownProps) {
  const { options = [], value, onChange } = props;

  const handleValueChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    if (onChange) {
      onChange(event);
    }
  };

  return (
    <select
      className={cn(
        "rounded-md border px-2 py-1 text-sm",
        buttonVariants({ variant: "outline" })
      )}
      value={value}
      onChange={handleValueChange}
    >
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  );
}

function Calendar({
  className,
  classNames,
  showOutsideDays = false,
  ...props
}: any) {
  return (
    <DayPicker
      className={cn("p-3", className)}
      classNames={{
        table: "w-full border-collapse space-y-1",
        head_row: "flex",
        head_cell: "w-9 font-normal text-[0.8rem]",
        row: "flex w-full mt-2",
        cell: "h-9 w-9 text-center text-sm p-0",
        day: "h-9 w-9 p-0 font-normal",
        ...classNames,
      }}
      captionLayout="dropdown"
      components={{ Dropdown: CustomSelectDropdown }}
      mode="single"
      selected={props.selected}
      onSelect={props.setSelected}
    />
  );
}
Calendar.displayName = "Calendar";

export { Calendar };
