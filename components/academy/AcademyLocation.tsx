import { Instagram, MapPin, Navigation } from "lucide-react";
import { cleanHandle, directionsUrl, instagramUrl, mapsEmbedUrl } from "@/lib/academies";
import { AcademySection } from "./AcademySection";
import { Reveal } from "./Reveal";
import { btnGhost, btnPrimary, card } from "./styles";

type Props = {
  address: string | null;
  mapsUrl: string | null;
  instagramHandle: string | null;
};

export function AcademyLocation({ address, mapsUrl, instagramHandle }: Props) {
  if (!address && !instagramHandle) return null;

  return (
    <AcademySection
      eyebrow={address ? "Ubicación" : "Redes"}
      title={address ? "Ven a conocernos" : "Síguenos"}
    >
      <Reveal delay={0.05}>
        <div className={`${card} overflow-hidden`}>
          <div className="p-6 md:p-8">
            {address && (
              <p className="flex items-start gap-3 text-lg leading-relaxed text-(--af-text) md:text-xl">
                <MapPin className="mt-1 h-6 w-6 shrink-0 text-(--af-accent-text)" aria-hidden />
                <span className="whitespace-pre-line">{address}</span>
              </p>
            )}
            <div className={`flex flex-col gap-3 sm:flex-row ${address ? "mt-6" : ""}`}>
              {address && (
                <a
                  href={directionsUrl(mapsUrl, address)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`${btnPrimary} h-12 text-sm`}
                >
                  <Navigation className="h-4 w-4" aria-hidden />
                  Cómo llegar
                </a>
              )}
              {instagramHandle && (
                <a
                  href={instagramUrl(instagramHandle)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={btnGhost}
                >
                  <Instagram className="h-4 w-4" aria-hidden />
                  @{cleanHandle(instagramHandle)}
                </a>
              )}
            </div>
          </div>

          {address && (
            <div className="px-3 pb-3 md:px-4 md:pb-4">
              {/* Mapa sin API key, construido con la dirección escrita. El filtro
                  atenúa el blanco del mapa para que no "queme" en el tema oscuro. */}
              <iframe
                src={mapsEmbedUrl(address)}
                title={`Mapa de la ubicación: ${address}`}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                allowFullScreen
                className="h-64 w-full rounded-2xl border border-[rgb(var(--af-accent-rgb)/0.35)] bg-(--af-bg) [filter:saturate(0.85)_contrast(0.95)_brightness(0.92)] md:h-80"
              />
            </div>
          )}
        </div>
      </Reveal>
    </AcademySection>
  );
}
