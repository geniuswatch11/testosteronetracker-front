import React from "react";

interface TestosteroneInfoProps {
  value: number;
  unit?: string;
  startDate: string;
  endDate: string;
  onStartDateChange: (date: string) => void;
  onEndDateChange: (date: string) => void;
  onApply: () => void;
}

export default function TestosteroneInfo({
  value,
  unit = "ng/dL",
  startDate,
  endDate,
  onStartDateChange,
  onEndDateChange,
  onApply,
}: TestosteroneInfoProps) {
  return (
    <div className="bg-orange-400 text-white rounded-xl p-4 shadow-md">
      <div className="flex justify-between items-center mb-2">
        <div>
          <div className="font-semibold text-lg">Testosterona</div>
          <div className="text-xs text-white/80">
            Estimación basada en métricas
          </div>
        </div>
        <div className="text-3xl font-bold">
          {value} <span className="text-base font-normal">{unit}</span>
        </div>
      </div>
    </div>
  );
}
