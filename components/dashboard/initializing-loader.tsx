import { Logo } from "@/components/ui/logo";
import { HeartPulse } from "lucide-react";
import Lottie from "lottie-react";
import heartbeatAnimation from "@/components/dashboard/hearbeat.json";

export function InitializingLoader() {
  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center bg-[#18181b] z-50">
      <div
        className="flex flex-col items-center justify-center"
        style={{ minHeight: "100vh" }}
      >
        <div className="relative flex items-center justify-center mb-8">
          {/* Icono de frecuencia cardíaca, puedes cambiar por tu propio SVG si lo prefieres */}
          <HeartPulse className="w-20 h-20  text-white-500 animate-pulse" />
        </div>
        <h2 className="text-2xl font-bold text-white mb-2">
          Sincronizando datos...
        </h2>
        <p className="text-base text-gray-400 text-center max-w-xs mb-4">
          Estamos preparando tus estadísticas más recientes.
        </p>
        <div className="w-32 mx-auto">
          <Lottie animationData={heartbeatAnimation} loop={true} />
        </div>
      </div>
    </div>
  );
}

// Definir la animación en globals.css
