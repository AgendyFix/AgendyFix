import { ArrowDown, Sparkles } from "lucide-react";
import { featuredPromotion, formatMXN, type Academy } from "@/lib/academies";
import { HeroNextClass } from "./HeroNextClass";
import { InterestButton } from "./InterestButton";

const hasSchedules = (a: Academy) => a.groups.some((g) => g.schedules.length > 0);

/** true si hay algo real que mostrar (si no, el hero queda a una columna). */
export function hasHeroSideCard(academy: Academy): boolean {
  return hasSchedules(academy) || featuredPromotion(academy) !== null;
}

/**
 * Tarjeta lateral del hero (solo desktop): próxima clase + promo activa.
 * Slot preparado para la foto de la academia (fase 2, imágenes en S3): irá
 * arriba del contenido, dentro de este mismo marco.
 */
export function HeroSideCard({ academy }: { academy: Academy }) {
  const promo = featuredPromotion(academy);
  const showNext = hasSchedules(academy);
  if (!showNext && !promo) return null;

  return (
    <aside
      aria-label="Resumen"
      className="af-fade-up relative overflow-hidden rounded-[32px] border border-[rgb(var(--af-accent-rgb)/0.45)] bg-[rgb(22_20_29/0.92)] shadow-[0_0_90px_-30px_rgb(var(--af-accent-rgb)/0.7)]"
      style={{ "--d": "260ms" } as React.CSSProperties}
    >
      <div
        aria-hidden
        className="pointer-events-none absolute -right-20 -top-20 h-56 w-56 rounded-full bg-[rgb(var(--af-accent-rgb)/0.18)] blur-3xl"
      />
      {/* Slot: foto de la academia (fase 2). Ej. <AcademyPhoto className="aspect-[4/3]" /> */}
      <div className="relative p-7">
        {showNext && <HeroNextClass groups={academy.groups} />}

        {promo && (
          <div className={showNext ? "mt-6 border-t border-(--af-border) pt-6" : ""}>
            <p className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-[0.22em] text-(--af-accent-text)">
              <Sparkles className="h-3.5 w-3.5" aria-hidden />
              Promoción activa
            </p>
            <p className="mt-2 font-display text-2xl font-bold leading-tight tracking-[-0.02em] text-(--af-text)">
              {promo.price === 0 && (
                <span className="mr-2 text-(--af-accent-text)">GRATIS</span>
              )}
              {promo.price !== null && promo.price > 0 && (
                <span className="mr-2 tabular-nums text-(--af-accent-text)">{formatMXN(promo.price)}</span>
              )}
              {promo.name}
            </p>
            <InterestButton
              interest={promo.name}
              source="promo"
              className="mt-4 inline-flex h-11 items-center gap-2 rounded-full border border-(--af-border) px-5 text-sm font-semibold text-(--af-text) transition-colors hover:border-(--af-accent)"
            >
              La quiero
              <ArrowDown className="h-4 w-4" aria-hidden />
            </InterestButton>
          </div>
        )}
      </div>
    </aside>
  );
}
