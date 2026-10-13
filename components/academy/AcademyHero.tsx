import { Instagram, MessageCircle } from "lucide-react";
import { instagramUrl, waUrl, type Academy } from "@/lib/academies";

export function AcademyHero({ academy }: { academy: Academy }) {
  return (
    <header className="bg-secondary text-secondary-foreground">
      <div className="mx-auto max-w-3xl px-5 py-16 md:py-24 text-center">
        <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-balance">
          {academy.name}
        </h1>
        {academy.tagline && (
          <p className="mt-4 text-lg md:text-xl text-secondary-foreground/80 text-balance">
            {academy.tagline}
          </p>
        )}
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
          <a
            href="#inscripcion"
            className="w-full sm:w-auto rounded-full bg-primary px-8 py-3.5 text-base font-semibold text-primary-foreground shadow-lg transition hover:brightness-105"
          >
            Inscribirme
          </a>
          {academy.whatsapp && (
            <a
              href={waUrl(academy.whatsapp)}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-full border border-secondary-foreground/30 px-8 py-3.5 text-base font-semibold transition hover:bg-secondary-foreground/10"
            >
              <MessageCircle className="h-5 w-5" />
              WhatsApp
            </a>
          )}
        </div>
        {academy.instagram_handle && (
          <a
            href={instagramUrl(academy.instagram_handle)}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-6 inline-flex items-center gap-2 text-sm text-secondary-foreground/80 hover:text-secondary-foreground"
          >
            <Instagram className="h-4 w-4" />@{academy.instagram_handle}
          </a>
        )}
      </div>
    </header>
  );
}
