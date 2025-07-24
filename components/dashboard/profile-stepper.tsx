"use client";

import { useLanguage } from "@/lib/i18n/language-context";
import { CheckCircle, XCircle, User, Smartphone } from "lucide-react";

interface ProfileStepperProps {
  hasWhoop: boolean;
  hasPersonalData: boolean;
}

export default function ProfileStepper({
  hasWhoop,
  hasPersonalData,
}: ProfileStepperProps) {
  const { t } = useLanguage();

  return (
    <div className="w-full max-w-xs mx-auto bg-[#181A20] rounded-2xl p-6 shadow-lg flex flex-col items-center">
      <div className="bg-[#23262F] rounded-full p-4 mb-4">
        <Smartphone className="h-8 w-8 text-[#735BF2]" />
      </div>
      <h2 className="text-2xl font-bold text-white mb-2 text-center">
        {t("stepper.title")}
      </h2>
      <p className="text-sm text-[#B1B5C3] mb-4 text-center">
        {t("stepper.subtitle")}
      </p>
      <div className="flex items-center mb-2"></div>

      <div className="space-y-4 w-full">
        {/* Dispositivo */}
        <div
          className={`flex items-center justify-between rounded-xl p-4 ${
            hasWhoop
              ? "bg-green-900/20 border-green-800"
              : "bg-[#23262F] border-[#23262F]"
          } border`}
        >
          <div className="flex items-center space-x-3">
            <Smartphone
              className={`h-6 w-6 ${
                hasWhoop ? "text-green-500" : "text-[#735BF2]"
              }`}
            />
            <div>
              <div className="font-semibold text-white">
                {t("stepper.device")}
              </div>
              <div className="text-xs text-[#B1B5C3]">
                {hasWhoop
                  ? t("stepper.deviceConnected")
                  : t("stepper.deviceNotConnected")}
              </div>
            </div>
          </div>
          {hasWhoop ? (
            <CheckCircle className="h-6 w-6 text-green-500" />
          ) : (
            <XCircle className="h-6 w-6 text-red-500" />
          )}
        </div>
        {/* Perfil */}
        <div
          className={`flex items-center justify-between rounded-xl p-4 ${
            hasPersonalData
              ? "bg-green-900/20 border-green-800"
              : "bg-[#23262F] border-[#23262F]"
          } border`}
        >
          <div className="flex items-center space-x-3">
            <User
              className={`h-6 w-6 ${
                hasPersonalData ? "text-green-500" : "text-[#735BF2]"
              }`}
            />
            <div>
              <div className="font-semibold text-white">
                {t("stepper.profile")}
              </div>
              <div className="text-xs text-[#B1B5C3]">
                {hasPersonalData
                  ? t("stepper.profileCompleted")
                  : t("stepper.profileNotCompleted")}
              </div>
            </div>
          </div>
          {hasPersonalData ? (
            <CheckCircle className="h-6 w-6 text-green-500" />
          ) : (
            <XCircle className="h-6 w-6 text-red-500" />
          )}
        </div>
      </div>
    </div>
  );
}
