"use client";

import { X } from "lucide-react";
import { useEffect, useRef } from "react";
import { useLanguage } from "@/lib/i18n/language-context";
import Image from "next/image";
import { useTheme } from "next-themes";

interface DeviceOption {
  name: string;
  value: string;
}

interface DeviceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectDevice: (deviceName: string) => void;
}

const deviceOptions: DeviceOption[] = [
  { name: "Fitbit", value: "fitbit" },
  { name: "Garmin", value: "garmin" },
  { name: "Oura", value: "oura" },
  { name: "Whoop", value: "whoop" },
  { name: "Withings", value: "withings" },
  { name: "Polar", value: "polar" },
  { name: "Strava", value: "strava" },
  { name: "Huawei", value: "huawei" },
];

export default function DeviceModal(props: DeviceModalProps) {
  const { isOpen, onClose, onSelectDevice } = props;
  // const { resolvedTheme } = useTheme();
  const { resolvedTheme } = useTheme();
  const { t } = useLanguage();
  const modalRef = useRef<HTMLDivElement>(null);

  // Close modal when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        modalRef.current &&
        !modalRef.current.contains(event.target as Node)
      ) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      // Prevent scrolling of the body when modal is open
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      // Restore scrolling when modal is closed
      document.body.style.overflow = "auto";
    };
  }, [isOpen, onClose]);

  // Handle escape key press
  useEffect(() => {
    const handleEscKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscKey);
    }

    return () => {
      document.removeEventListener("keydown", handleEscKey);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleDeviceClick = (deviceName: string) => {
    onSelectDevice(deviceName);
    onClose();
  };

  // Determinar la carpeta de logos según el tema
  const logoFolder = resolvedTheme === "dark" ? "logosDark" : "logos";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div
        ref={modalRef}
        className="relative w-full max-w-md max-h-[80vh] bg-background rounded-lg shadow-lg mx-4"
      >
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-xl font-semibold">
            {t("settings.selectDevice")}
          </h2>
          <button
            onClick={onClose}
            className="p-1 rounded-full hover:bg-muted transition-colors"
            aria-label="Close"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="overflow-y-auto p-4 max-h-[calc(80vh-4rem)]">
          <div className="grid grid-cols-2 gap-4">
            {deviceOptions.map((device) => (
              <button
                key={device.name}
                onClick={() => handleDeviceClick(device.value)}
                className="flex flex-col items-center justify-center p-4 rounded-lg border hover:bg-muted/50 transition-colors h-24"
              >
                <Image
                  src={`/${logoFolder}/${device.value}.png`}
                  alt={device.name}
                  width={90}
                  height={60}
                  style={{ background: "transparent" }}
                />
                <span className="text-sm text-center">{device.name}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// Helper function to get emoji for device icons
function getDeviceIcon(iconName: string): string {
  switch (iconName) {
    case "activity":
      return "⌚️";
    case "heart":
      return "❤️";
    case "watch":
      return "⌚";
    case "circle":
      return "⭕";
    case "heart-pulse":
      return "💓";
    case "book":
      return "📚";
    case "bike":
      return "🚴";
    case "car":
      return "🚗";
    case "home":
      return "🏠";
    default:
      return "📱";
  }
}
