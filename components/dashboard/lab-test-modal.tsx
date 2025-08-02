"use client";

import { X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useLanguage } from "@/lib/i18n/language-context";

interface LabOption {
  nombre: string;
  url: string;
  icono: string;
  isText?: boolean;
  textColor?: string;
  secondaryText?: string;
  secondaryColor?: string;
}

interface LabTestModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const labOptions: LabOption[] = [
  {
    nombre: "Hone Health",
    url: "https://honehealth.com/",
    icono: "",
    isText: true,
    textColor: "text-blue-500",
    secondaryText: "Health",
    secondaryColor: "text-blue-300",
  },
  {
    nombre: "Any Lab Test Now",
    url: "https://www.anylabtestnow.com/",
    icono:
      "https://www.anylabtestnow.com/wp-content/uploads/2023/10/ALTN-logo.svg",
  },
  {
    nombre: "Everlywell",
    url: "https://www.everlywell.com/",
    icono: "",
    isText: true,
    textColor: "text-green-500",
  },
  {
    nombre: "Grassroots Labs",
    url: "https://www.grassrootslabs.com/",
    icono: "https://www.grassrootslabs.com/assets/img/loggo.png",
  },
  {
    nombre: "Labcorp",
    url: "https://www.labcorp.com/",
    icono:
      "https://www.labcorp.com/content/dam/labcorp/logos/labcorp-logos/logo.png",
  },
  {
    nombre: "LetsGetChecked",
    url: "https://www.letsgetchecked.com/",
    icono:
      "https://res.cloudinary.com/dvkudjdzf/image/upload/v1745510985/svg_mjr0ia.png",
  },
  {
    nombre: "Maximus Tribe",
    url: "https://www.maximustribe.com/",
    icono: "",
    isText: true,
    textColor: "text-black dark:text-white font-bold",
  },
  {
    nombre: "myLAB Box",
    url: "https://www.mylabbox.com/",
    icono:
      "https://www.mylabbox.com/wp-content/uploads/2022/10/logo-mylabbox-large-pngquant.png",
  },
  {
    nombre: "Quest Diagnostics",
    url: "http://questdiagnostics.com/",
    icono:
      "https://s7d6.scene7.com/is/image/questdiagnostics/Quest-Diagnostics-RGB-gradient?$corp-header-logo$",
  },
  {
    nombre: "Testing",
    url: "https://www.testing.com/",
    icono: "https://www.testing.com/wp-content/uploads/2022/09/logo.svg",
  },
  {
    nombre: "Verywell Health",
    url: "https://www.verywellhealth.com/",
    icono: "",
    isText: true,
    textColor: "text-blue-500",
    secondaryText: "Health",
    secondaryColor: "text-blue-300",
  },
];

export default function LabTestModal({ isOpen, onClose }: LabTestModalProps) {
  const { t } = useLanguage();
  const modalRef = useRef<HTMLDivElement>(null);
  const [imageErrors, setImageErrors] = useState<{ [key: string]: boolean }>(
    {}
  );

  // Close modal when clicking outside
  useEffect(() => {
    // Inicializar el estado de errores de imagen
    const initialErrors: { [key: string]: boolean } = {};
    labOptions.forEach((lab) => {
      if (!lab.icono) {
        initialErrors[lab.nombre] = true;
      }
    });
    setImageErrors(initialErrors);

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

  const handleLabClick = (url: string) => {
    window.open(url, "_blank");
  };

  const handleImageError = (labName: string) => {
    console.error(
      `Error loading image for ${labName}. URL: ${
        labOptions.find((lab) => lab.nombre === labName)?.icono
      }`
    );
    setImageErrors((prev) => ({ ...prev, [labName]: true }));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div
        ref={modalRef}
        className="relative w-full max-w-md max-h-[80vh] bg-background rounded-lg shadow-lg mx-4"
      >
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-xl font-semibold">{t("dashboard.selectLab")}</h2>
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
            {labOptions.map((lab) => (
              <button
                key={lab.nombre}
                onClick={() => handleLabClick(lab.url)}
                className="flex flex-col items-center justify-center p-4 rounded-lg border hover:bg-muted/50 transition-colors h-32"
              >
                <div className="h-16 flex items-center justify-center mb-2">
                  {lab.isText || imageErrors[lab.nombre] ? (
                    <div className="text-center">
                      <span
                        className={`text-lg ${lab.textColor || "text-primary"}`}
                      >
                        {lab.nombre}
                      </span>
                      {lab.secondaryText && (
                        <span className={`text-lg ${lab.secondaryColor || ""}`}>
                          {" "}
                          {lab.secondaryText}
                        </span>
                      )}
                    </div>
                  ) : (
                    <div className="relative h-16 w-full flex items-center justify-center bg-gray-200 dark:bg-gray-800 rounded-md p-2">
                      <img
                        src={lab.icono || "/placeholder.svg"}
                        alt={lab.nombre}
                        className="max-h-full max-w-full object-contain"
                        onError={() => handleImageError(lab.nombre)}
                        loading="lazy"
                        crossOrigin="anonymous"
                      />
                    </div>
                  )}
                </div>
                <span className="text-xs text-center mt-2 line-clamp-2">
                  {lab.nombre}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
