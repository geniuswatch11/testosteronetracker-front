"use client"

import Modal from "@/components/ui/modal"
import Link from "next/link"
import { ExternalLink } from "lucide-react"

interface TermsModalProps {
  isOpen: boolean
  onClose: () => void
  onAccept: () => void
}

export default function TermsModal({ isOpen, onClose, onAccept }: TermsModalProps) {
  const handleAccept = () => {
    onAccept()
    onClose()
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Terms and Conditions"
      maxWidth="xl"
      footer={
        <button
          onClick={handleAccept}
          className="w-full rounded-full bg-primary-600 py-4 text-center text-lg font-semibold text-black transition-all hover:bg-primary-500 active:scale-95"
        >
          Agree
        </button>
      }
    >
      <div className="space-y-6 text-sm text-neutral-300">
        {/* Privacy Policy Link */}
        <div className="bg-primary-600/10 border border-primary-600/30 rounded-lg p-4">
          <Link 
            href="/privacy-cookies-policy" 
            target="_blank"
            className="flex items-center gap-2 text-primary-600 hover:text-primary-500 transition-colors"
          >
            <ExternalLink className="h-4 w-4" />
            <span className="font-medium">Ver Política de Privacidad completa</span>
          </Link>
        </div>

        {/* 1. Introducción y Aceptación de los Términos */}
        <section>
          <h3 className="text-base font-semibold text-white mb-2">
            1. Introducción y Aceptación de los Términos
          </h3>
          <div className="space-y-2 text-neutral-400">
            <p>
              Bienvenido a la plataforma de estimación de testosterona de Genius Fit Watch LLC ("nosotros", "nuestro"). Este documento constituye un acuerdo legal vinculante entre usted y Genius Fit Watch LLC.
            </p>
            <p>
              Al acceder, registrarse o utilizar nuestro sitio web y nuestra aplicación móvil (conjuntamente, la "Plataforma"), usted confirma que ha leído, entendido y aceptado estar sujeto a las prácticas y condiciones descritas en este documento. Si no está de acuerdo con estos términos, por favor, no utilice nuestros servicios.
            </p>
          </div>
        </section>

        {/* 2. Información Importante: Descargo de Responsabilidad Médica */}
        <section>
          <h3 className="text-base font-semibold text-white mb-2">
            2. Información Importante: Descargo de Responsabilidad Médica
          </h3>
          <div className="space-y-2 text-neutral-400">
            <p>
              Nuestra Plataforma ofrece estimaciones de los niveles de testosterona total basadas en un algoritmo propio y en los datos proporcionados por usted y su dispositivo portátil. Es fundamental que comprenda lo siguiente:
            </p>
            <p className="font-semibold text-danger-400">
              Genius Fit Watch LLC no proporciona asesoramiento ni diagnósticos médicos. Los servicios y el contenido de nuestra Plataforma no están destinados, diseñados ni implican diagnosticar, prevenir, monitorear, tratar o aliviar ninguna enfermedad o condición médica, ni para determinar el estado de salud de los usuarios o ser un sustituto de la atención médica profesional.
            </p>
            <p>
              La información disponible a través de nuestra Plataforma se proporciona únicamente con el propósito de mejorar el bienestar a través de la educación. Debe consultar a su médico de atención primaria u otros proveedores de atención médica si tiene alguna pregunta sobre las implicaciones de la información o los resultados de nuestra Plataforma y antes de realizar cambios en su dieta o rutina de ejercicios.
            </p>
            <p>
              Genius Fit Watch LLC no se hace responsable de ninguna decisión de salud tomada con base en la información proporcionada por nuestra Plataforma.
            </p>
          </div>
        </section>

        {/* 3. Cuentas de Usuario y Elegibilidad */}
        <section>
          <h3 className="text-base font-semibold text-white mb-2">
            3. Cuentas de Usuario y Elegibilidad
          </h3>
          <div className="space-y-2 text-neutral-400">
            <p>
              Para utilizar la Plataforma, debe registrarse y crear una cuenta. Al hacerlo, se compromete a proporcionar información precisa y completa. Usted es responsable de mantener la confidencialidad de su cuenta y contraseña.
            </p>
            <p>
              Nuestra Plataforma no está dirigida a personas menores de 18 años y no recopilamos intencionadamente información personal de menores.
            </p>
          </div>
        </section>

        {/* 4. Política de Privacidad */}
        <section>
          <h3 className="text-base font-semibold text-white mb-2">
            4. Política de Privacidad
          </h3>
          <p className="text-neutral-400 mb-3">
            Esta sección describe cómo recopilamos, utilizamos, protegemos y compartimos su información personal cuando utiliza nuestra Plataforma.
          </p>
          
          <div className="space-y-4">
            <div>
              <h4 className="font-semibold text-white mb-2">a. Información que Recopilamos</h4>
              <p className="text-neutral-400 mb-2">Recopilamos diferentes tipos de información para proporcionar y mejorar nuestra Plataforma:</p>
              <ul className="list-disc list-inside space-y-1 text-neutral-400 ml-2">
                <li><strong>Información que usted nos proporciona directamente:</strong> Datos de la cuenta (correo electrónico, nombre de usuario, peso, altura, fecha de nacimiento) y contribuciones voluntarias (resultados de análisis hormonales).</li>
                <li><strong>Información recopilada automáticamente:</strong> Datos de uso y cookies/tokens de sesión.</li>
                <li><strong>Información de servicios de terceros:</strong> Datos fisiológicos conectados mediante SpikeAPI, procesados en tiempo real y no almacenados permanentemente.</li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-white mb-2">b. Cómo Utilizamos su Información</h4>
              <ul className="list-disc list-inside space-y-1 text-neutral-400 ml-2">
                <li>Operar y mantener la Plataforma</li>
                <li>Generar estimaciones hormonales</li>
                <li>Mejorar nuestros servicios y algoritmos</li>
                <li>Comunicarnos con usted sobre actualizaciones</li>
                <li>Seguridad y prevención de fraudes</li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-white mb-2">c. Cómo Compartimos su Información</h4>
              <p className="text-neutral-400">
                No vendemos ni alquilamos su información personal. Solo la compartimos con proveedores de servicios (como AWS), por obligaciones legales, o para proteger nuestros derechos.
              </p>
            </div>

            <div>
              <h4 className="font-semibold text-white mb-2">d. Seguridad de los Datos</h4>
              <p className="text-neutral-400">
                Implementamos medidas de seguridad técnicas y organizativas para proteger su información. Su información personal se almacena de forma cifrada en nuestra infraestructura de AWS.
              </p>
            </div>

            <div>
              <h4 className="font-semibold text-white mb-2">e. Sus Derechos y Opciones</h4>
              <ul className="list-disc list-inside space-y-1 text-neutral-400 ml-2">
                <li>Acceder y actualizar su información desde la aplicación</li>
                <li>Eliminar su cuenta y sus datos</li>
                <li>Revocar el consentimiento para conexiones externas (SpikeAPI)</li>
              </ul>
            </div>
          </div>
        </section>

        {/* 5. Subprocesadores de Terceros */}
        <section>
          <h3 className="text-base font-semibold text-white mb-2">
            5. Subprocesadores de Terceros
          </h3>
          <p className="text-neutral-400 mb-3">
            Utilizamos subprocesadores de terceros para proporcionar nuestros servicios. Realizamos una debida diligencia para evaluar sus prácticas de privacidad y seguridad antes de contratarlos.
          </p>
          <div className="overflow-x-auto">
            <table className="w-full text-xs border border-neutral-700 rounded-lg">
              <thead className="bg-neutral-800">
                <tr>
                  <th className="px-3 py-2 text-left text-white">Entidad</th>
                  <th className="px-3 py-2 text-left text-white">Propósito</th>
                  <th className="px-3 py-2 text-left text-white">País</th>
                </tr>
              </thead>
              <tbody className="text-neutral-400">
                <tr className="border-t border-neutral-700">
                  <td className="px-3 py-2">Amazon Web Services (AWS)</td>
                  <td className="px-3 py-2">Servicios de hosting e infraestructura</td>
                  <td className="px-3 py-2">Estados Unidos</td>
                </tr>
                <tr className="border-t border-neutral-700">
                  <td className="px-3 py-2">Google LLC</td>
                  <td className="px-3 py-2">Servicios de análisis y medición de uso</td>
                  <td className="px-3 py-2">Estados Unidos</td>
                </tr>
                <tr className="border-t border-neutral-700">
                  <td className="px-3 py-2">SpikeAPI</td>
                  <td className="px-3 py-2">Integración y procesamiento temporal de métricas fisiológicas</td>
                  <td className="px-3 py-2">Estados Unidos</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* 6. Propiedad Intelectual */}
        <section>
          <h3 className="text-base font-semibold text-white mb-2">
            6. Propiedad Intelectual
          </h3>
          <p className="text-neutral-400">
            Todos los derechos, títulos e intereses en la Plataforma, incluyendo el algoritmo, software, texto, gráficos y logotipos, son propiedad exclusiva de Genius Fit Watch LLC. No se le concede ningún derecho a utilizar nuestra marca o propiedad intelectual sin nuestro consentimiento previo por escrito.
          </p>
        </section>

        {/* 7. Cambios en los Términos */}
        <section>
          <h3 className="text-base font-semibold text-white mb-2">
            7. Cambios en los Términos y la Política de Privacidad
          </h3>
          <p className="text-neutral-400">
            Podemos actualizar estos términos ocasionalmente. Le notificaremos cualquier cambio publicando la nueva política en esta página. Si los cambios son significativos, le proporcionaremos un aviso más destacado, como un correo electrónico.
          </p>
        </section>

        {/* 8. Contacto */}
        <section>
          <h3 className="text-base font-semibold text-white mb-2">
            8. Contacto
          </h3>
          <p className="text-neutral-400">
            Si tiene alguna pregunta o inquietud sobre estos términos o nuestra política de privacidad, por favor, póngase en contacto con nosotros en:{" "}
            <a
              href="mailto:privacidad@geniusfitwatch.com"
              className="text-primary-600 hover:text-primary-500 underline"
            >
              privacidad@geniusfitwatch.com
            </a>
          </p>
        </section>
      </div>
    </Modal>
  )
}
