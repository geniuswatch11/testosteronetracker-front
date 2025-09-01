"use client";

import { useState, useEffect } from "react";
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface DatePickerProps {
  id: string;
  value: string; // Espera el formato "yyyy-MM-dd"
  onChange: (value: string) => void; // Devuelve el formato "yyyy-MM-dd"
  min?: string;
  max?: string;
  required?: boolean;
  label: string;
  helperText?: string;
  format?: string; // Prop para el formato de visualización, ej: "MM/dd/yyyy"
}

export default function DatePicker({
  id,
  value,
  onChange,
  min,
  max,
  required = false,
  label,
  helperText,
  format: displayFormat = "PPP", // Formato por defecto "Jul 2, 2024"
}: DatePickerProps) {
  const [isOpen, setIsOpen] = useState(false);

  // Convierte las fechas de string a objetos Date, especificando UTC para evitar problemas de zona horaria.

  const [selectedDate, setSelected] = useState<Date | undefined>();

  // Sincroniza el estado local con la prop 'value' para evitar el error.
  useEffect(() => {
    if (value) {
      setSelected(new Date(`${value}T00:00:00`));
    } else {
      setSelected(undefined);
    }
  }, [value]);

  useEffect(() => {
    if (selectedDate) {
      setIsOpen(false);
    }
  }, [selectedDate]);

  return (
    <div className="space-y-1">
      <label htmlFor={id} className="block text-sm font-medium mb-1">
        {label}
      </label>
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <Button
            variant={"outline"}
            id={id}
            className={cn(
              "w-full justify-start text-left font-normal",
              !value && "text-muted-foreground"
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {value && selectedDate ? (
              format(selectedDate, displayFormat)
            ) : (
              <span>Pick a date</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0">
          <Calendar
            mode="single"
            selected={selectedDate}
            setSelected={setSelected}
          />
        </PopoverContent>
      </Popover>
      {helperText && (
        <p className="text-xs text-muted-foreground mt-1">{helperText}</p>
      )}
      {/* Input oculto para mantener la validación nativa de formularios (ej. 'required') */}
      <input
        type="text"
        value={value}
        required={required}
        onChange={() => {}}
        className="sr-only"
        aria-hidden="true"
        tabIndex={-1}
      />
    </div>
  );
}
