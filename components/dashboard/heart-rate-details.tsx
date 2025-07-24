import React from "react";

interface HeartRateDetailsProps {
  rest: number;
  avg: number;
  max: number;
}

export default function HeartRateDetails({ rest, avg, max }: HeartRateDetailsProps) {
  return (
    <div className="bg-gray-900 text-gray-100 rounded-xl p-4 shadow-md">
      <div className="font-semibold mb-2">Frecuencia Cardíaca</div>
      <div className="flex justify-between text-center">
        <div>
          <div className="text-xs text-gray-400">Reposo</div>
          <div className="text-xl font-bold">{rest}</div>
          <div className="text-xs text-gray-400">BPM</div>
        </div>
        <div>
          <div className="text-xs text-gray-400">Promedio</div>
          <div className="text-xl font-bold">{avg}</div>
          <div className="text-xs text-gray-400">BPM</div>
        </div>
        <div>
          <div className="text-xs text-gray-400">Máxima</div>
          <div className="text-xl font-bold">{max}</div>
          <div className="text-xs text-gray-400">BPM</div>
        </div>
      </div>
    </div>
  );
}
