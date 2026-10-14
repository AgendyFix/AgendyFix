import { ArrowDown, Sparkles } from "lucide-react";
import { formatMXN, type AcademyPromotion } from "@/lib/academies";
import { InterestButton } from "./InterestButton";
import { Reveal } from "./Reveal";
import { btnPrimary, eyebrow } from "./styles";

function PromoPrice({ price }: { price: number | null }) {
  if (price === null) return null;
  if (price === 0) {
    return (
      <p className="font-display text-7xl font-extrabold leading-none tracking-[-0.04em] text-(--af-accent-text) md:text-8xl">
        GRATIS
      </p>
    );
  }
  return (
    <p className="font-display text-6xl font-extrabold leading-none tracking-[-0.04em] tabular-nums text-(--af-accent-text) md:text-8xl">
      {formatMXN(price)}
      <span className="ml-2 align-top font-body text-base font-semibold tracking-normal text-(--af-muted)">
        MXN
      </span>
    </p>
  );
}

export function AcademyPromo({ promotions }: { promotions: AcademyPromotion[] }) {
  if (promotions.length === 0) return null;
  const [featured, ...rest] = promotions;

  return (
    <section id="promo" className="mx-auto w-full max-w-5xl scroll-mt-6 px-5 pt-20 md:pt-28">
      <Reveal>
        <article className="relative overflow-hidden rounded-[24px] border border-[rgb(var(--af-accent-rgb)/0.55)] bg-(--af-surface) p-6 shadow-[0_0_90px_-20px_rgb(var(--af-accent-rgb)/0.55)] md:rounded-[32px] md:p-10">
          <div
            aria-hidden
            className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-[rgb(var(--af-accent-rgb)/0.22)] blur-3xl"
          />
          <div className="relative grid gap-6 md:grid-cols-[1fr_auto] md:items-end">
            <div>
              <p className={`${eyebrow} flex items-center gap-2`}>
                <Sparkles className="h-3.5 w-3.5" aria-hidden />
                Promoción activa
              </p>
              <div className="mt-4">
                <PromoPrice price={featured.price} />
              </div>
              <h2 className="mt-3 font-display text-3xl font-bold leading-tight tracking-[-0.02em] text-(--af-text) md:text-4xl">
                {featured.name}
              </h2>
              {featured.description && (
                <p className="mt-2 max-w-prose text-base leading-relaxed text-(--af-muted) md:text-lg">
                  {featured.description}
                </p>
              )}
            </div>
            <InterestButton interest={featured.name} source="promo" className={`${btnPrimary} w-full md:w-auto`}>
              La quiero
              <ArrowDown className="h-5 w-5" aria-hidden />
            </InterestButton>
          </div>

          {rest.length > 0 && (
            <ul className="relative mt-8 divide-y divide-(--af-border) border-t border-(--af-border)">
              {rest.map((p) => (
                <li key={p.name} className="flex items-baseline justify-between gap-4 py-3">
                  <div>
                    <p className="font-semibold text-(--af-text)">{p.name}</p>
                    {p.description && (
                      <p className="text-sm text-(--af-muted)">{p.description}</p>
                    )}
                  </div>
                  {p.price !== null && (
                    <p className="shrink-0 font-display text-xl font-bold tabular-nums text-(--af-accent-text)">
                      {p.price === 0 ? "Gratis" : formatMXN(p.price)}
                    </p>
                  )}
                </li>
              ))}
            </ul>
          )}
        </article>
      </Reveal>
    </section>
  );
}
