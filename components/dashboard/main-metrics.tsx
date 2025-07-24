import React from "react";
import { Heart, Flame } from "lucide-react";

interface MainMetricsProps {
  bpm: number;
  calories: number;
}

export default function MainMetrics({ bpm, calories }: MainMetricsProps) {
  return (
    <div className="flex gap-4">
      <div className="flex-1 bg-[#1a1a1a] text-gray-100 rounded-xl p-4 flex flex-col items-center shadow-md">
        <div className="flex items-center gap-2 mb-1">
          <Heart className="w-6 h-6 text-orange-500" />
          <span className="text-xs text-gray-400">BPM</span>
        </div>
        <div className="text-2xl font-bold">{bpm}</div>
        <div className="text-xs text-gray-400">FC Promedio</div>
      </div>
      <div className="flex-1 bg-[#1a1a1a] text-gray-100 rounded-xl p-4 flex flex-col items-center shadow-md">
        <div className="flex items-center gap-2 mb-1">
          <Flame className="w-6 h-6 text-yellow-500" />
          <span className="text-xs text-gray-400">kcal</span>
        </div>
        <div className="text-2xl font-bold">{calories}</div>
        <div className="text-xs text-gray-400">Calorías</div>
      </div>
    </div>
  );
}
