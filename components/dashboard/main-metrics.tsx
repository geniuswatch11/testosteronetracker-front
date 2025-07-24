import React from "react";

interface MainMetricsProps {
  bpm: number;
  calories: number;
}

export default function MainMetrics({ bpm, calories }: MainMetricsProps) {
  return (
    <div className="flex gap-4">
      <div className="flex-1 bg-gray-900 text-gray-100 rounded-xl p-4 flex flex-col items-center shadow-md">
        <div className="text-xs text-gray-400 mb-1">FC Promedio</div>
        <div className="text-2xl font-bold">{bpm}</div>
        <div className="text-xs text-gray-400">BPM</div>
      </div>
      <div className="flex-1 bg-gray-900 text-gray-100 rounded-xl p-4 flex flex-col items-center shadow-md">
        <div className="text-xs text-gray-400 mb-1">Calorías</div>
        <div className="text-2xl font-bold">{calories}</div>
        <div className="text-xs text-gray-400">kcal</div>
      </div>
    </div>
  );
}
