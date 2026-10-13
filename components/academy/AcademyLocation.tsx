import { MapPin } from "lucide-react";
import { mapsUrl } from "@/lib/academies";
import { AcademySection } from "./AcademySection";

export function AcademyLocation({ address }: { address: string }) {
  return (
    <AcademySection title="Ubicación">
      <p className="flex items-start gap-2 text-foreground">
        <MapPin className="mt-1 h-5 w-5 shrink-0 text-primary" />
        {address}
      </p>
      <a
        href={mapsUrl(address)}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-3 inline-block text-sm font-semibold text-primary hover:underline"
      >
        Ver en Google Maps
      </a>
    </AcademySection>
  );
}
