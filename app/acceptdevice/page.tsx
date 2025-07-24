"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { CheckCircle } from "lucide-react";
import toast from "react-hot-toast";
import { apiRequest } from "@/lib/api/api-client";
import { useLanguage } from "@/lib/i18n/language-context";

export default function AcceptDevicePage() {
  const router = useRouter();
  //const searchParams = useSearchParams();
  const [loading, setLoading] = useState(true);
  const [success, setSuccess] = useState(false);
  const { t } = useLanguage();

  useEffect(() => {
    const validateDevice = async () => {
      try {
        await apiRequest("/spike/consent-callback/", {
          method: "POST",
          data: { consent_given: true },
        });
        setSuccess(true);
      } catch (error) {
        toast.error("No se pudo validar el dispositivo");
        setSuccess(false);
      } finally {
        setLoading(false);
      }
    };
    validateDevice();
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <CheckCircle className="w-20 h-20 text-green-500 mb-6" />
      <h1 className="text-2xl font-bold mb-2 text-center">
        {loading
          ? "Validando dispositivo..."
          : success
          ? "Dispositivo conectado"
          : "Error al conectar el dispositivo"}
      </h1>
      <button
        onClick={() => router.push("/dashboard")}
        className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
      >
        <span>{t("dashboard.goToDashboard")}</span>
      </button>
    </div>
  );
}
