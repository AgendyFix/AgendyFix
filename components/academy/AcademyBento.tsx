import { Instagram, Sparkles } from "lucide-react";
import {
  cleanHandle,
  instagramUrl,
  uniqueInstructors,
  uniqueLevels,
  type Academy,
} from "@/lib/academies";
import { AcademySection } from "./AcademySection";
import { PaymentMethodIcon } from "./PaymentMethodIcon";
import { Reveal } from "./Reveal";

const tile =
  "rounded-[24px] border border-(--af-border) bg-(--af-surface) p-5 md:rounded-[32px] md:p-7";
const label = "text-xs font-semibold uppercase tracking-[0.2em] text-(--af-muted)";
const big =
  "font-display text-6xl font-extrabold leading-none tracking-[-0.04em] md:text-7xl";

/**
 * Bento "Por qué aquí" con datos reales. Cada tarjeta solo aparece si hay dato;
 * los métodos de pago van aquí solo cuando no hay lista de precios (si la hay,
 * se muestran junto a los precios).
 */
export function AcademyBento({ academy }: { academy: Academy }) {
  const levels = uniqueLevels(academy.groups);
  const instructors = uniqueInstructors(academy.groups);
  const showPayments = academy.payment_methods.length > 0 && academy.prices.length === 0;
  const promo = academy.promotions[0] ?? null;

  const tiles: React.ReactNode[] = [];

  if (academy.disciplines.length > 0) {
    tiles.push(
      <div
        key="disciplines"
        className="col-span-2 rounded-[24px] bg-(--af-accent) p-5 text-(--af-ink) md:rounded-[32px] md:p-7"
      >
        <p className="text-xs font-semibold uppercase tracking-[0.2em] opacity-75">Disciplinas</p>
        <p className={`${big} mt-3`}>{academy.disciplines.length}</p>
        <p className="mt-3 text-base font-medium leading-snug opacity-90">
          {academy.disciplines.map((d) => d.name).join(" · ")}
        </p>
      </div>,
    );
  }

  if (academy.description) {
    tiles.push(
      <div key="description" className={`${tile} col-span-2`}>
        <p className={label}>Sobre nosotros</p>
        <p className="mt-3 whitespace-pre-line text-base leading-relaxed text-(--af-text)/90 md:text-lg">
          {academy.description}
        </p>
      </div>,
    );
  }

  const weeklyClasses = academy.groups.reduce((n, g) => n + g.schedules.length, 0);
  if (weeklyClasses > 0) {
    tiles.push(
      <div key="classes" className={tile}>
        <p className={label}>Clases</p>
        <p className={`${big} mt-3 text-(--af-text)`}>{weeklyClasses}</p>
        <p className="mt-3 text-sm text-(--af-muted)">
          {weeklyClasses === 1 ? "clase a la semana" : "clases a la semana"}
          {instructors.length > 0 && (
            <>
              {" "}
              con{" "}
              <span className="font-semibold text-(--af-text)">{instructors.join(", ")}</span>
            </>
          )}
        </p>
      </div>,
    );
  }

  if (levels.length > 0) {
    tiles.push(
      <div key="levels" className={tile}>
        <p className={label}>Niveles</p>
        <ul className="mt-4 flex flex-wrap gap-2">
          {levels.map((l) => (
            <li
              key={l}
              className="rounded-full bg-[rgb(var(--af-hi-rgb)/0.14)] px-3 py-1.5 text-sm font-semibold text-(--af-hi)"
            >
              {l}
            </li>
          ))}
        </ul>
      </div>,
    );
  }

  if (showPayments) {
    tiles.push(
      <div key="payments" className={tile}>
        <p className={label}>Formas de pago</p>
        <ul className="mt-4 space-y-2.5">
          {academy.payment_methods.map((m) => (
            <li key={m.code} className="flex items-center gap-2.5 text-base font-medium text-(--af-text)">
              <PaymentMethodIcon code={m.code} className="h-5 w-5 text-(--af-accent-text)" />
              {m.label}
            </li>
          ))}
        </ul>
      </div>,
    );
  }

  if (promo) {
    tiles.push(
      <a
        key="promo"
        href="#promo"
        className={`${tile} group flex flex-col justify-between border-[rgb(var(--af-accent-rgb)/0.45)] transition-colors hover:bg-[rgb(var(--af-accent-rgb)/0.08)]`}
      >
        <p className={`${label} flex items-center gap-1.5 text-(--af-accent-text)`}>
          <Sparkles className="h-3.5 w-3.5" aria-hidden />
          Promo
        </p>
        <p className="mt-4 font-display text-xl font-bold leading-tight text-(--af-text)">
          {promo.name}
        </p>
      </a>,
    );
  }

  if (academy.instagram_handle) {
    tiles.push(
      <a
        key="instagram"
        href={instagramUrl(academy.instagram_handle)}
        target="_blank"
        rel="noopener noreferrer"
        className={`${tile} flex flex-col justify-between transition-colors hover:border-(--af-accent)`}
      >
        <Instagram className="h-6 w-6 text-(--af-accent-text)" aria-hidden />
        <p
          className="mt-4 truncate font-display text-lg font-bold leading-tight text-(--af-text)"
          title={`@${cleanHandle(academy.instagram_handle)}`}
        >
          @{cleanHandle(academy.instagram_handle)}
        </p>
      </a>,
    );
  }

  if (tiles.length < 2) return null;

  return (
    <AcademySection eyebrow="Por qué aquí" title="Lo que encuentras">
      <Reveal delay={0.05}>
        <div className="grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-4">{tiles}</div>
      </Reveal>
    </AcademySection>
  );
}
