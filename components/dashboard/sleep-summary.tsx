import React from "react";

interface SleepSummaryProps {
  duration: string;
}

export default function SleepSummary({ duration }: SleepSummaryProps) {
  return (
    <div className="bg-gray-900 text-gray-100 rounded-xl p-4 shadow-md flex flex-col items-center">
      <div className="font-semibold mb-1">Sueño</div>
      <div className="text-2xl font-bold">{duration}</div>
      <div className="text-xs text-gray-400">Duración total</div>
    </div>
  );
}
