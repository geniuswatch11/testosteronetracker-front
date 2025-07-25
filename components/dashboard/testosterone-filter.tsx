import React from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

interface TestosteroneFilterProps {
  startDate: string;
  endDate: string;
  onStartDateChange: (date: string) => void;
  onEndDateChange: (date: string) => void;
  onApply: () => void;
}

export default function TestosteroneFilter({
  startDate,
  endDate,
  onStartDateChange,
  onEndDateChange,
  onApply,
}: TestosteroneFilterProps) {
  // Convertir string a Date para el DatePicker
  const startDateValue = startDate ? new Date(startDate + "T00:00:00") : null;
  const endDateValue = endDate ? new Date(endDate + "T00:00:00") : null;
  return (
    <div className="bg-[#1a1a1a] rounded-lg p-3 w-full">
      <div className="text-xs mb-2 font-semibold text-white">
        Filtrar por Fecha
      </div>
      <div className="flex gap-2 mb-2 justify-between">
        <div className="flex flex-col">
          <label className="text-xs mb-1 text-white">Inicio</label>
          <DatePicker
            selected={startDateValue}
            onChange={(date: Date | null) =>
              onStartDateChange(date ? date.toISOString().slice(0, 10) : "")
            }
            dateFormat="yyyy-MM-dd"
            className="bg-gray-800 text-white rounded px-1 py-2 text-xs border-none outline-none"
            placeholderText="Inicio"
          />
        </div>
        <div className="flex flex-col">
          <label className="text-xs mb-1 text-white">Final</label>
          <DatePicker
            selected={endDateValue}
            onChange={(date: Date | null) =>
              onEndDateChange(date ? date.toISOString().slice(0, 10) : "")
            }
            dateFormat="yyyy-MM-dd"
            className="bg-gray-800 text-white rounded px-1 py-2 text-xs border-none outline-none"
            placeholderText="Final"
          />
        </div>
      </div>
      <button
        onClick={onApply}
        className="bg-orange-500 hover:bg-orange-600 text-white rounded px-4 py-1 text-xs font-semibold transition-colors"
      >
        Aplicar
      </button>
    </div>
  );
}
