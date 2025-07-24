import React from "react";

export default function DataUpdateAlert() {
  return (
    <div className="bg-gray-900 text-gray-100 rounded-xl p-4 flex items-center gap-2 shadow-md">
      <span className="inline-block w-2 h-2 bg-green-500 rounded-full mr-2" />
      <div>
        <div className="font-semibold">Datos del día anterior</div>
        <div className="text-xs text-gray-400">La data se actualiza diariamente a las 00:00 UTC.</div>
      </div>
    </div>
  );
}
