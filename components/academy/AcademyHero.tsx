import { ArrowDown, Instagram, MessageCircle } from "lucide-react";
import {
  cleanHandle,
  displayNameSize,
  freePromotion,
  instagramUrl,
  waUrl,
  type Academy,
} from "@/lib/academies";
import { AcademyLogo } from "./AcademyLogo";
import { btnPrimary, btnSecondary, chip } from "./styles";

export function heroCtaLabel(academy: Academy): string {
  return freePromotion(academy) ? "Reserva tu clase gratis" : "Inscríbete";
}

export function AcademyHero({ academy }: { academy: Academy }) {
  const words = academy.name.trim().split(/\s+/);
  const disciplines = academy.disciplines.slice(0, 6);
  const waText = `Hola, vi la página de ${academy.name} y quiero información.`;

  return (
    <header className="af-mesh af-grain relative flex min-h-[100svh] flex-col overflow-hidden">
      {/* Barra superior: logo + Instagram */}
      <div className="mx-auto flex w-full max-w-5xl items-center justify-between px-5 pt-5 md:pt-8">
        <div className="af-fade-up flex items-center gap-3" style={{ "--d": "0ms" } as React.CSSProperties}>
          <AcademyLogo name={academy.name} logoUrl={academy.logo_url} size={56} priority />
        </div>
        {academy.instagram_handle && (
          <a
            href={instagramUrl(academy.instagram_handle)}
            target="_blank"
            rel="noopener noreferrer"
            className={`${chip} af-fade-up hover:bg-white/10`}
            style={{ "--d": "120ms" } as React.CSSProperties}
          >
            <Instagram className="h-4 w-4" aria-hidden />
            <span>@{cleanHandle(academy.instagram_handle)}</span>
          </a>
        )}
      </div>

      <div className="flex-1" />

      {/* Bloque principal, anclado abajo */}
      <div className="mx-auto w-full max-w-5xl px-5 pb-10 md:pb-16">
        {disciplines.length > 0 && (
          <ul
            className="af-fade-up mb-5 flex flex-wrap gap-2"
            style={{ "--d": "200ms" } as React.CSSProperties}
            aria-label="Disciplinas"
          >
            {disciplines.map((d) => (
              <li key={d.id} className={chip}>
                {d.name}
              </li>
            ))}
          </ul>
        )}

        <h1
          className="max-w-[12ch] font-display font-extrabold leading-[0.92] tracking-[-0.035em] text-(--af-text) text-balance"
          style={{ fontSize: displayNameSize(academy.name) }}
        >
          {words.map((w, i) => (
            <span key={`${w}-${i}`} className="af-word" style={{ "--i": i } as React.CSSProperties}>
              {w}
              {i < words.length - 1 ? " " : ""}
            </span>
          ))}
        </h1>

        {academy.tagline && (
          <p
            className="af-fade-up mt-5 max-w-xl text-lg leading-relaxed text-(--af-text)/85 md:text-2xl md:leading-snug"
            style={{ "--d": `${words.length * 60 + 160}ms` } as React.CSSProperties}
          >
            {academy.tagline}
          </p>
        )}

        <div
          className="af-fade-up mt-8 flex flex-col gap-3 sm:flex-row sm:items-center"
          style={{ "--d": `${words.length * 60 + 260}ms` } as React.CSSProperties}
        >
          <a href="#inscripcion" data-hero-cta className={btnPrimary}>
            {heroCtaLabel(academy)}
            <ArrowDown className="h-5 w-5" aria-hidden />
          </a>
          {academy.whatsapp && (
            <a
              href={waUrl(academy.whatsapp, waText)}
              target="_blank"
              rel="noopener noreferrer"
              className={btnSecondary}
            >
              <MessageCircle className="h-5 w-5" aria-hidden />
              WhatsApp
            </a>
          )}
        </div>
      </div>
    </header>
  );
}
