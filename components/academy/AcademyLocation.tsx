import { Instagram, MapPin, Navigation } from "lucide-react";
import { cleanHandle, instagramUrl, mapsUrl } from "@/lib/academies";
import { AcademySection } from "./AcademySection";
import { Reveal } from "./Reveal";
import { btnGhost, btnPrimary, card } from "./styles";

type Props = {
  address: string | null;
  instagramHandle: string | null;
};

export function AcademyLocation({ address, instagramHandle }: Props) {
  if (!address && !instagramHandle) return null;

  return (
    <AcademySection
      eyebrow={address ? "Ubicación" : "Redes"}
      title={address ? "Ven a conocernos" : "Síguenos"}
    >
      <Reveal delay={0.05}>
        <div className={`${card} p-6 md:p-8`}>
          {address && (
            <p className="flex items-start gap-3 text-lg leading-relaxed text-(--af-text) md:text-xl">
              <MapPin className="mt-1 h-6 w-6 shrink-0 text-(--af-accent-text)" aria-hidden />
              <span className="whitespace-pre-line">{address}</span>
            </p>
          )}
          <div className={`flex flex-col gap-3 sm:flex-row ${address ? "mt-6" : ""}`}>
            {address && (
              <a
                href={mapsUrl(address)}
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
      </Reveal>
    </AcademySection>
  );
}
