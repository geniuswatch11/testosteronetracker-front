import React from "react";

interface SleepSummaryProps {
  duration: string;
  score?: number;
}

export default function SleepSummary({ duration, score }: SleepSummaryProps) {
  return (
    <div className="bg-[#1a1a1a] text-gray-100 rounded-xl p-4 shadow-md flex flex-col ">
      <div className="font-semibold mb-1">Sueño</div>
      <div className="flex items-center gap-4 justify-between">
        <div>
          <div className="text-2xl font-bold">{duration}</div>
          <div className="text-xs text-gray-400">Duración total</div>
        </div>
        <div className="relative w-20 h-20 flex items-center justify-center">
          {/* Circular ProgressBar SVG - tamaño aumentado */}
          <svg className="absolute top-0 left-0" width="80" height="80">
            <circle
              cx="40"
              cy="40"
              r="34"
              fill="none"
              stroke="#333"
              strokeWidth="6"
            />
            <circle
              cx="40"
              cy="40"
              r="34"
              fill="none"
              stroke="#4ade80"
              strokeWidth="6"
              strokeDasharray={2 * Math.PI * 34}
              strokeDashoffset={
                score !== undefined
                  ? 2 * Math.PI * 34 * (1 - score / 100)
                  : 2 * Math.PI * 34
              }
              strokeLinecap="round"
              style={{ transition: "stroke-dashoffset 0.5s" }}
            />
          </svg>
          <span
            className="absolute text-xl font-bold text-white"
            style={{
              left: "50%",
              top: "50%",
              transform: "translate(-50%, -50%)",
            }}
          >
            {score !== undefined ? `${score}%` : "--"}
          </span>
        </div>
      </div>
    </div>
  );
}
