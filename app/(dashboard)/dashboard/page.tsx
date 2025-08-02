"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useTheme } from "next-themes";
import ProfileStepper from "@/components/dashboard/profile-stepper";
import TestosteroneChart from "@/components/dashboard/testosterone-chart";
import TestosteroneTable from "@/components/dashboard/testosterone-table";
import HealthStats from "@/components/dashboard/health-stats";
import { DashboardSkeleton } from "@/components/dashboard/dashboard-skeleton";
import { InitializingLoader } from "@/components/dashboard/initializing-loader";
import { ConnectionError } from "@/components/dashboard/connection-error";
import LabTestModal from "@/components/dashboard/lab-test-modal";
import { authApi, type UserProfile } from "@/lib/api/auth";
import { useLanguage } from "@/lib/i18n/language-context";
import TestosteroneValue from "@/components/dashboard/testosterone-value";
import { profileApi } from "@/lib/api/profile";
import { healthApi } from "@/lib/api/health";
import DataUpdateAlert from "@/components/dashboard/data-update-alert";
import TestosteroneInfo from "@/components/dashboard/testosterone-info";
import MainMetrics from "@/components/dashboard/main-metrics";
import HeartRateDetails from "@/components/dashboard/heart-rate-details";
import SleepSummary from "@/components/dashboard/sleep-summary";
import TestosteroneFilter from "@/components/dashboard/testosterone-filter";
import TestosteroneLineChart from "@/components/dashboard/testosterone-line-chart";

export default function DashboardPage() {
  const router = useRouter();
  const { t, setLocale } = useLanguage();
  const { setTheme } = useTheme();
  const [isInitializing, setIsInitializing] = useState(true); // Estado para la inicialización completa
  const [isInitialLoading, setIsInitialLoading] = useState(true); // Carga inicial de la página
  const [isDataLoading, setIsDataLoading] = useState(false); // Carga de datos específicamente
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [profileComplete, setProfileComplete] = useState(false);
  const [selectedInterval, setSelectedInterval] = useState(1); // Día por defecto
  const [error, setError] = useState<string | null>(null);
  const [profileError, setProfileError] = useState<string | null>(null);
  const [themeInitialized, setThemeInitialized] = useState(false);
  const [isLabModalOpen, setIsLabModalOpen] = useState(false);
  const [deviceConnected, setDeviceConnected] = useState(false);
  const [healthData, setHealthData] = useState<any>({});
  const [testosteroneLevels, setTestosteroneLevels] = useState<any[]>([]);
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");

  // Definir los intervalos disponibles
  const intervals = [
    { label: t("charts.intervals.day"), value: 1 },
    { label: t("charts.intervals.week"), value: 7 },
    { label: t("charts.intervals.month"), value: 30 },
  ];

  // Efecto para cargar el perfil del usuario y configurar la aplicación
  useEffect(() => {
    const initializeApp = async () => {
      // Verificación adicional de autenticación
      if (!authApi.isAuthenticated()) {
        router.replace("/login");
        return;
      }

      try {
        // Obtener el perfil del usuario
        const profile = await authApi.getUserProfile();
        setUserProfile(profile);
        const isDeviceConnected = await profileApi.checkDeviceConnected();
        console.log("Device connected:", isDeviceConnected);

        // Configurar el tema según las preferencias del usuario
        // Only set theme once during initialization
        if (!themeInitialized) {
          if (profile.theme === "white") {
            setTheme("light");
          } else if (profile.theme === "dark") {
            setTheme("dark");
          } else {
            setTheme("system");
          }
          setThemeInitialized(true);
        }
        const locale = profile.lenguaje || "en";
        // Configurar el idioma según las preferencias del usuario
        console.log("Setting locale to:", locale);
        setLocale(locale);

        // Verificar si el perfil está completo
        const isComplete = authApi.isProfileComplete(
          profile.profile_completion_percentage
        );
        setProfileComplete(isComplete);
        setDeviceConnected(isDeviceConnected);

        // Si el perfil está completo, cargar los datos de salud
        if (isComplete) {
          await fetchHealthData();
        }

        // Finalizar la inicialización
        setIsInitializing(false);

        // Después de un breve retraso, mostrar la interfaz
        setTimeout(() => {
          setIsInitialLoading(false);
        }, 500);
      } catch (error) {
        console.error("Error initializing app:", error);
        setProfileError(t("errors.profileLoadError"));
        setIsInitializing(false);
        setIsInitialLoading(false);
      }
    };

    initializeApp();
  }, [router, setTheme, setLocale, t, themeInitialized]);

  // Efecto para actualizar datos cuando cambia el intervalo
  useEffect(() => {
    // No cargar datos durante la carga inicial o si el perfil no está completo
    if (!isInitialLoading && !isInitializing && profileComplete) {
      fetchHealthData();
    }
  }, [selectedInterval, profileComplete]);

  // Función para cargar datos de salud
  const fetchHealthData = async () => {
    try {
      const data = await healthApi.getSpikeStats();
      console.log("Health data fetched:", data);
      setHealthData(data);
    } catch (error) {
      console.error("Error fetching health data:", error);
    }
  };

  const fetchTestosteroneLevels = async (
    startDate: string,
    endDate: string
  ) => {
    try {
      const data = await healthApi.getTestosteroneLevels(startDate, endDate);
      setTestosteroneLevels(data);
    } catch (error) {
      console.error("Error fetching testosterone levels:", error);
    }
  };

  // Mostrar pantalla de inicialización mientras se carga el perfil y se configura la app
  if (isInitializing) {
    return <InitializingLoader />;
  }

  // Mostrar esqueleto durante la carga inicial
  if (isInitialLoading) {
    return (
      <main className="container mx-auto max-w-md px-4 py-6">
        <DashboardSkeleton />
      </main>
    );
  }
  const latestTestosteroneValue =
    testosteroneLevels.length > 0
      ? testosteroneLevels[testosteroneLevels.length - 1]
          .testosterona_total_ng_dl
      : 0;

  console.log(
    "Rendering dashboard with profile:",
    profileComplete,
    deviceConnected
  );
  return (
    <main className="container mx-auto max-w-md px-4 py-6 space-y-8">
      {!profileComplete || !deviceConnected ? (
        <div className="mt-8 mb-12">
          <ProfileStepper
            hasWhoop={deviceConnected}
            hasPersonalData={profileComplete}
          />
        </div>
      ) : (
        <>
          <div className="text-center space-y-4">
            <h1 className="text-2xl font-bold text-center">
              {t("dashboard.overview")}
            </h1>
            <button
              onClick={() => setIsLabModalOpen(true)}
              className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            >
              <span>{t("dashboard.labTest")}</span>
            </button>
          </div>

          {/* Testosterona Info arriba */}
          <div className="mt-4">
            <TestosteroneInfo
              value={latestTestosteroneValue}
              unit="ng/dL"
              startDate={startDate}
              endDate={endDate}
              onStartDateChange={setStartDate}
              onEndDateChange={setEndDate}
              onApply={() => fetchTestosteroneLevels(startDate, endDate)}
            />
          </div>

          {/* Filtro de fechas debajo */}
          <div className="mt-4">
            <TestosteroneFilter
              startDate={startDate}
              endDate={endDate}
              onStartDateChange={setStartDate}
              onEndDateChange={setEndDate}
              onApply={() => fetchTestosteroneLevels(startDate, endDate)}
            />
          </div>

          {/* Gráfico de testosterona debajo del filtro */}
          <div className="mt-4">
            {/* Placeholder para el gráfico, reemplaza con tu componente real */}
            <div className="bg-[#1a1a1a] rounded-lg p-4 text-white text-center">
              {/* Aquí va el gráfico de testosterona */}
              {testosteroneLevels.length > 0 ? (
                <TestosteroneLineChart data={testosteroneLevels} />
              ) : (
                "No hay datos para mostrar"
              )}
            </div>
          </div>
          <TestosteroneTable
            birthDate={userProfile?.birth_date || null}
            testosteroneValue={latestTestosteroneValue || null}
            isLoading={isDataLoading}
          />
          <h2 className="text-2xl font-bold">Estadisticas</h2>
          {/* Métricas principales: FC promedio y calorías */}
          <div className="mt-4">
            <MainMetrics
              bpm={healthData.heartrate ?? 0}
              calories={Math.round(healthData.calories_burned_total ?? 0)}
            />
          </div>

          {/* Análisis detallado: Frecuencia Cardíaca */}
          <div className="mt-4">
            <HeartRateDetails
              rest={healthData.heartrate_resting ?? 0}
              avg={healthData.heartrate ?? 0}
              max={healthData.heartrate_max ?? 0}
            />
          </div>

          {/* Sueño */}
          <div className="mt-4">
            <SleepSummary
              duration={
                healthData.sleep_duration_total
                  ? (() => {
                      const totalSeconds = Math.floor(
                        healthData.sleep_duration_total / 1000
                      );
                      const hours = Math.floor(totalSeconds / 3600);
                      const minutes = Math.floor((totalSeconds % 3600) / 60);
                      return `${hours}h ${minutes}min`;
                    })()
                  : "0h 0min"
              }
              score={healthData.sleep_score}
            />
          </div>
        </>
      )}

      {/* Modal de laboratorios */}
      <LabTestModal
        isOpen={isLabModalOpen}
        onClose={() => setIsLabModalOpen(false)}
      />
    </main>
  );
}
