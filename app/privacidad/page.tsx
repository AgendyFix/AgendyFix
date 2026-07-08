import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Aviso de Privacidad",
  description:
    "Aviso de Privacidad de AgendyFix. Conoce cómo protegemos y manejamos tus datos personales.",
  alternates: { canonical: "/privacidad" },
};

const SECTIONS = [
  {
    title: "1. Responsable del Tratamiento",
    body: (
      <p>
        <strong>AgendyFix</strong> (en adelante &quot;nosotros&quot; o &quot;la
        Empresa&quot;) es el responsable del tratamiento de tus datos
        personales. Si tienes dudas sobre esta política, puedes contactarnos a
        través de nuestros canales de atención disponibles en nuestro sitio
        web.
      </p>
    ),
  },
  {
    title: "2. Datos Personales que Recopilamos",
    body: (
      <>
        <p>Recopilamos y procesamos los siguientes datos personales:</p>
        <ul>
          <li>
            <strong>Información de contacto:</strong> Nombre, correo
            electrónico, número de teléfono
          </li>
          <li>
            <strong>Información de negocio:</strong> Nombre de la empresa, tipo
            de servicio, ubicación
          </li>
          <li>
            <strong>Datos de solicitud:</strong> Detalles de citas, servicios
            solicitados, preferencias
          </li>
          <li>
            <strong>Información técnica:</strong> Dirección IP, tipo de
            navegador, datos de uso de la plataforma
          </li>
        </ul>
      </>
    ),
  },
  {
    title: "3. Finalidades del Tratamiento",
    body: (
      <>
        <p>Utilizamos tus datos personales para:</p>
        <ul>
          <li>
            Proporcionar y mejorar nuestros servicios de agendamiento y gestión
            de citas
          </li>
          <li>Procesar solicitudes de demostración y pruebas gratuitas</li>
          <li>
            Enviar comunicaciones relevantes, actualizaciones y notificaciones
          </li>
          <li>Personalizar tu experiencia en nuestra plataforma</li>
          <li>Cumplir con obligaciones legales y regulatorias</li>
          <li>
            Prevenir fraude y garantizar la seguridad de nuestros servicios
          </li>
          <li>Análisis estadístico y mejora continua de la calidad</li>
        </ul>
      </>
    ),
  },
  {
    title: "4. Base Legal del Tratamiento",
    body: (
      <p>
        El tratamiento de tus datos personales se realiza conforme a tu
        consentimiento expreso y cuando es necesario para la ejecución de un
        contrato o el cumplimiento de obligaciones legales aplicables en tu
        jurisdicción.
      </p>
    ),
  },
  {
    title: "5. Compartición de Datos",
    body: (
      <>
        <p>
          No compartimos tus datos personales con terceros sin tu
          consentimiento, excepto:
        </p>
        <ul>
          <li>
            Con proveedores de servicios que nos ayudan a operar la plataforma
            (hosting, análisis)
          </li>
          <li>Cuando sea requerido por la ley o autoridades competentes</li>
          <li>
            Para proteger nuestros derechos legales y la seguridad de nuestros
            usuarios
          </li>
        </ul>
      </>
    ),
  },
  {
    title: "6. Seguridad de los Datos",
    body: (
      <p>
        Implementamos medidas técnicas, administrativas y de seguridad para
        proteger tus datos personales contra acceso no autorizado, alteración,
        divulgación o destrucción. Esto incluye encriptación, controles de
        acceso y auditorías regulares.
      </p>
    ),
  },
  {
    title: "7. Retención de Datos",
    body: (
      <p>
        Conservamos tus datos personales durante el tiempo necesario para
        cumplir con los fines descritos o conforme a los plazos establecidos
        por la ley. Puedes solicitar la eliminación de tus datos en cualquier
        momento.
      </p>
    ),
  },
  {
    title: "8. Tus Derechos",
    body: (
      <>
        <p>Conforme a la legislación aplicable, tienes derecho a:</p>
        <ul>
          <li>
            <strong>Acceso:</strong> Solicitar acceso a tus datos personales
          </li>
          <li>
            <strong>Rectificación:</strong> Corregir datos inexactos o
            incompletos
          </li>
          <li>
            <strong>Eliminación:</strong> Solicitar la supresión de tus datos
            (derecho al olvido)
          </li>
          <li>
            <strong>Portabilidad:</strong> Recibir tus datos en formato
            estructurado
          </li>
          <li>
            <strong>Oposición:</strong> Oponerte al tratamiento de tus datos
          </li>
          <li>
            <strong>Retiro del consentimiento:</strong> Retirar tu
            consentimiento en cualquier momento
          </li>
        </ul>
        <p>
          Para ejercer cualquiera de estos derechos, contacta con nosotros
          utilizando los datos de contacto disponibles en nuestro sitio web.
        </p>
      </>
    ),
  },
  {
    title: "9. Cookies y Tecnologías Similares",
    body: (
      <p>
        Utilizamos cookies para mejorar tu experiencia, recordar preferencias y
        analizar cómo usas nuestro sitio. Puedes controlar las cookies desde la
        configuración de tu navegador.
      </p>
    ),
  },
  {
    title: "10. Links a Terceros",
    body: (
      <p>
        Nuestro sitio puede contener enlaces a sitios web de terceros. No somos
        responsables por sus políticas de privacidad. Te recomendamos revisar
        sus avisos de privacidad antes de proporcionar tus datos.
      </p>
    ),
  },
  {
    title: "11. Cambios en esta Política",
    body: (
      <p>
        Nos reservamos el derecho de modificar este Aviso de Privacidad en
        cualquier momento. Te notificaremos de cambios significativos
        publicando la versión actualizada en esta página.
      </p>
    ),
  },
  {
    title: "12. Contacto",
    body: (
      <>
        <p>
          Si tienes preguntas sobre este Aviso de Privacidad o tus derechos,
          por favor contacta con nosotros a través de:
        </p>
        <ul>
          <li>
            <strong>Correo Electrónico:</strong> privacidad@agendyfix.com
          </li>
          <li>
            <strong>Sitio Web:</strong> www.agendyfix.com
          </li>
          <li>
            <strong>Formulario de Contacto:</strong> Disponible en nuestro
            sitio web
          </li>
        </ul>
      </>
    ),
  },
];

export default function PrivacidadPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 md:px-6 py-12 md:py-16">
      <Link
        href="/"
        className="inline-block mb-8 text-sm font-medium text-primary hover:underline"
      >
        ← Volver al inicio
      </Link>

      <header className="text-center mb-10 pb-6 border-b border-border">
        <h1 className="text-2xl md:text-3xl font-extrabold text-foreground mb-2">
          Aviso de Privacidad
        </h1>
        <p className="text-muted-foreground">
          Información sobre el tratamiento de tus datos personales
        </p>
      </header>

      <div className="rounded-xl bg-muted/50 border-l-4 border-primary px-5 py-4 mb-10 text-sm text-muted-foreground">
        <strong className="text-foreground">Última actualización:</strong>{" "}
        Noviembre 2025
        <br />
        <strong className="text-foreground">Vigencia:</strong> Conforme a las
        Leyes de Protección de Datos aplicables
      </div>

      <div className="space-y-8 [&_p]:text-muted-foreground [&_p]:leading-relaxed [&_ul]:mt-3 [&_ul]:space-y-2 [&_ul]:list-disc [&_ul]:pl-6 [&_li]:text-muted-foreground">
        {SECTIONS.map((section) => (
          <section key={section.title}>
            <h2 className="text-lg font-bold text-foreground border-l-4 border-primary pl-3 mb-3">
              {section.title}
            </h2>
            {section.body}
          </section>
        ))}
      </div>
    </div>
  );
}
