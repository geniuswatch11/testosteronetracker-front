"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { ChevronLeft, ChevronDown, Shield, Lock, Database, UserCheck, Globe, Mail } from "lucide-react"

interface Section {
  id: number
  title: string
  icon: React.ReactNode
  content: string | string[]
  subsections?: { title: string; content: string }[]
  table?: { headers: string[]; rows: string[][] }
}

export default function PrivacyCookiesPolicyPage() {
  const router = useRouter()
  const [openId, setOpenId] = useState<number | null>(1)

  const toggleSection = (id: number) => {
    setOpenId(openId === id ? null : id)
  }

  const sections: Section[] = [
    {
      id: 1,
      title: "1. Introducción",
      icon: <Shield className="h-5 w-5" />,
      content: [
        "Bienvenido a la plataforma de estimación hormonal de Genius Fit Watch LLC (\"nosotros\", \"nuestra empresa\", \"la Compañía\").",
        "Esta Política de Privacidad explica de forma clara cómo recopilamos, utilizamos, almacenamos, protegemos y compartimos la información personal de los usuarios que acceden a nuestro sitio web, aplicación móvil o cualquier otro servicio digital (en conjunto, la \"Plataforma\").",
        "Al utilizar la Plataforma, usted acepta los términos descritos en esta Política de Privacidad. Si no está de acuerdo con ellos, le recomendamos no utilizar nuestros servicios."
      ]
    },
    {
      id: 2,
      title: "2. Descargo de Responsabilidad Médica",
      icon: <UserCheck className="h-5 w-5" />,
      content: [
        "Nuestra Plataforma ofrece estimaciones aproximadas de niveles hormonales —incluyendo testosterona total— basadas en algoritmos propios y en los datos proporcionados por el usuario o recopilados a través de dispositivos conectados.",
        "Genius Fit Watch LLC no ofrece asesoramiento médico, diagnóstico ni tratamiento. Los contenidos, resultados y recomendaciones generados por la Plataforma tienen fines informativos y educativos, y no deben interpretarse como orientación médica profesional.",
        "Antes de realizar cambios en su dieta, estilo de vida o rutina de ejercicios, o de interpretar los resultados como indicadores clínicos, consulte siempre a su médico o proveedor de salud calificado.",
        "Genius Fit Watch LLC no se responsabiliza por decisiones de salud tomadas en base a la información generada por nuestra Plataforma."
      ]
    },
    {
      id: 3,
      title: "3. Información que Recopilamos",
      icon: <Database className="h-5 w-5" />,
      content: "Recopilamos distintos tipos de información con el objetivo de ofrecer una experiencia segura, personalizada y eficiente.",
      subsections: [
        {
          title: "a) Información que usted proporciona directamente:",
          content: "Datos de cuenta (nombre, correo electrónico, peso, altura, fecha de nacimiento) y contribuciones voluntarias (resultados de análisis hormonales)."
        },
        {
          title: "b) Información recopilada automáticamente:",
          content: "Datos de uso y cookies/tokens de sesión."
        },
        {
          title: "c) Información proveniente de servicios de terceros:",
          content: "Datos fisiológicos conectados mediante SpikeAPI, procesados en tiempo real y no almacenados permanentemente."
        }
      ]
    },
    {
      id: 4,
      title: "4. Cómo Utilizamos su Información",
      icon: <Lock className="h-5 w-5" />,
      content: [
        "Usamos la información recopilada con los siguientes fines legítimos:",
        "• Operar, mantener y optimizar la Plataforma",
        "• Generar estimaciones hormonales",
        "• Mejorar la precisión de los algoritmos",
        "• Comunicarnos con usted sobre actualizaciones",
        "• Prevenir fraudes o cumplir obligaciones legales"
      ]
    },
    {
      id: 5,
      title: "5. Cómo Compartimos su Información",
      icon: <Globe className="h-5 w-5" />,
      content: [
        "Genius Fit Watch LLC no vende, alquila ni comercia con su información personal.",
        "Solo compartimos datos con:",
        "• Proveedores tecnológicos (como AWS o Google LLC)",
        "• Por cumplimiento legal",
        "• Para proteger la seguridad e integridad de los usuarios"
      ]
    },
    {
      id: 6,
      title: "6. Seguridad de los Datos",
      icon: <Shield className="h-5 w-5" />,
      content: [
        "Aplicamos medidas técnicas y organizativas conforme a los estándares internacionales (AES-256, HTTPS, cifrado en tránsito y reposo).",
        "Su información se almacena cifrada en AWS y solo el personal autorizado tiene acceso restringido."
      ]
    },
    {
      id: 7,
      title: "7. Retención y Eliminación de Datos",
      icon: <Database className="h-5 w-5" />,
      content: [
        "Conservamos su información personal únicamente mientras su cuenta esté activa.",
        "Si solicita la eliminación o se da de baja, todos los datos asociados —incluidos los de SpikeAPI— se eliminarán de manera permanente y segura de nuestros sistemas."
      ]
    },
    {
      id: 8,
      title: "8. Derechos del Usuario",
      icon: <UserCheck className="h-5 w-5" />,
      content: [
        "El usuario puede ejercer sus derechos directamente desde la Plataforma, en la sección de configuración de su cuenta, o contactando al equipo de Genius Fit Watch LLC.",
        "",
        "Derechos:",
        "• Acceder y actualizar información desde la aplicación",
        "• Eliminar la cuenta y sus datos",
        "• Revocar el consentimiento para conexiones externas (SpikeAPI) desde la app",
        "",
        "Para asistencia adicional: privacidad@geniusfitwatch.com"
      ]
    },
    {
      id: 9,
      title: "9. Privacidad de Menores",
      icon: <Shield className="h-5 w-5" />,
      content: "Nuestra Plataforma no está destinada a menores de 18 años. Si detectamos información de menores, será eliminada de inmediato."
    },
    {
      id: 10,
      title: "10. Transferencias Internacionales de Datos",
      icon: <Globe className="h-5 w-5" />,
      content: "Nuestra infraestructura opera en AWS (Estados Unidos). Al usar la Plataforma, usted autoriza la transferencia internacional de sus datos bajo las garantías contractuales aplicables."
    },
    {
      id: 11,
      title: "11. Subprocesadores de Terceros",
      icon: <Database className="h-5 w-5" />,
      content: "Utilizamos proveedores especializados (\"subprocesadores\") para operar de forma eficiente. Antes de integrarlos, verificamos sus políticas de seguridad y privacidad.",
      table: {
        headers: ["Entidad", "Propósito", "Ubicación"],
        rows: [
          ["Amazon Web Services (AWS)", "Alojamiento de infraestructura y seguridad", "Estados Unidos"],
          ["Google LLC", "Analítica y medición de uso", "Estados Unidos"],
          ["SpikeAPI", "Integración y procesamiento temporal de métricas fisiológicas", "Estados Unidos"]
        ]
      }
    },
    {
      id: 12,
      title: "12. Almacenamiento de Datos de Servicios Externos",
      icon: <Lock className="h-5 w-5" />,
      content: [
        "Cuando el usuario conecta su dispositivo mediante SpikeAPI, los datos fisiológicos se recopilan únicamente mientras la conexión esté activa.",
        "Al eliminar la cuenta o revocar el permiso, toda la información se borra automáticamente, incluyendo cualquier token o vínculo con servicios externos."
      ]
    },
    {
      id: 13,
      title: "13. Cambios en esta Política",
      icon: <Shield className="h-5 w-5" />,
      content: "Podemos modificar esta Política de Privacidad ocasionalmente para reflejar actualizaciones tecnológicas, legales o operativas. Publicaremos la nueva versión en esta página y, si hay cambios significativos, se notificará al usuario por correo o dentro de la aplicación."
    },
    {
      id: 14,
      title: "14. Contacto",
      icon: <Mail className="h-5 w-5" />,
      content: [
        "Para consultas o solicitudes sobre esta Política de Privacidad, comuníquese con nosotros a:",
        "",
        "■ privacidad@geniusfitwatch.com",
        "■ Genius Fit Watch LLC – Estados Unidos"
      ]
    }
  ]

  return (
    <main className="min-h-screen bg-black text-white pb-20">
      <div className="container mx-auto max-w-4xl px-4 py-6">
        {/* Header */}
        <div className="flex items-center mb-6">
          <button
            onClick={() => router.back()}
            className="mr-3 p-1 hover:bg-neutral-800 rounded-full transition-colors"
          >
            <ChevronLeft className="h-6 w-6" />
          </button>
          <div>
            <h1 className="text-2xl font-bold">Política de Privacidad</h1>
            <p className="text-sm text-neutral-400 mt-1">Genius Fit Watch LLC</p>
          </div>
        </div>

        {/* Introduction Banner */}
        <div className="bg-gradient-to-r from-primary-600/20 to-primary-cyan-600/20 border border-primary-600/30 rounded-lg p-6 mb-6">
          <div className="flex items-start gap-4">
            <Shield className="h-8 w-8 text-primary-600 flex-shrink-0 mt-1" />
            <div>
              <h2 className="text-lg font-semibold mb-2">Tu privacidad es nuestra prioridad</h2>
              <p className="text-sm text-neutral-300 leading-relaxed">
                En Genius Fit Watch LLC nos comprometemos a proteger tu información personal. 
                Esta política explica de manera clara y transparente cómo manejamos tus datos.
              </p>
            </div>
          </div>
        </div>

        {/* Sections */}
        <div className="space-y-3">
          {sections.map((section) => (
            <div
              key={section.id}
              className="bg-neutral-900 border border-neutral-800 rounded-lg overflow-hidden hover:border-neutral-700 transition-colors"
            >
              <button
                onClick={() => toggleSection(section.id)}
                className="w-full flex items-center justify-between p-4 text-left hover:bg-neutral-800/50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="text-primary-600">
                    {section.icon}
                  </div>
                  <span className="text-sm font-semibold">{section.title}</span>
                </div>
                <ChevronDown
                  className={`h-5 w-5 flex-shrink-0 transition-transform text-neutral-400 ${
                    openId === section.id ? "rotate-180" : ""
                  }`}
                />
              </button>
              
              {openId === section.id && (
                <div className="px-4 pb-4 text-sm text-neutral-300 leading-relaxed border-t border-neutral-800 pt-4">
                  {Array.isArray(section.content) ? (
                    <div className="space-y-3">
                      {section.content.map((paragraph, idx) => (
                        <p key={idx}>{paragraph}</p>
                      ))}
                    </div>
                  ) : (
                    <p className="mb-3">{section.content}</p>
                  )}

                  {section.subsections && (
                    <div className="mt-4 space-y-3">
                      {section.subsections.map((subsection, idx) => (
                        <div key={idx} className="bg-neutral-800/50 rounded-lg p-3">
                          <h4 className="font-semibold text-white mb-2">{subsection.title}</h4>
                          <p className="text-neutral-400">{subsection.content}</p>
                        </div>
                      ))}
                    </div>
                  )}

                  {section.table && (
                    <div className="mt-4 overflow-x-auto">
                      <table className="w-full border border-neutral-700 rounded-lg overflow-hidden">
                        <thead className="bg-neutral-800">
                          <tr>
                            {section.table.headers.map((header, idx) => (
                              <th key={idx} className="px-4 py-3 text-left text-xs font-semibold text-white border-b border-neutral-700">
                                {header}
                              </th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          {section.table.rows.map((row, rowIdx) => (
                            <tr key={rowIdx} className="border-b border-neutral-800 last:border-0">
                              {row.map((cell, cellIdx) => (
                                <td key={cellIdx} className="px-4 py-3 text-xs text-neutral-400">
                                  {cell}
                                </td>
                              ))}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="mt-8 p-6 bg-neutral-900 border border-neutral-800 rounded-lg">
          <div className="flex items-start gap-4">
            <Mail className="h-6 w-6 text-primary-600 flex-shrink-0 mt-1" />
            <div>
              <h3 className="font-semibold mb-2">¿Tienes preguntas?</h3>
              <p className="text-sm text-neutral-400 mb-3">
                Si tienes alguna duda sobre nuestra Política de Privacidad, no dudes en contactarnos.
              </p>
              <a 
                href="mailto:privacidad@geniusfitwatch.com"
                className="text-sm text-primary-600 hover:text-primary-500 underline"
              >
                privacidad@geniusfitwatch.com
              </a>
            </div>
          </div>
        </div>

        {/* Last Updated */}
        <p className="text-center text-xs text-neutral-500 mt-6">
          Última actualización: {new Date().toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' })}
        </p>
      </div>
    </main>
  )
}
