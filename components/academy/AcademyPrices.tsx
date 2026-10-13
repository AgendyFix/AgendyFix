import { formatMXN, type AcademyPaymentMethod, type AcademyPrice } from "@/lib/academies";
import { AcademySection } from "./AcademySection";
import { PaymentMethodIcon } from "./PaymentMethodIcon";
import { Reveal } from "./Reveal";
import { chip } from "./styles";

type Props = {
  prices: AcademyPrice[];
  paymentMethods: AcademyPaymentMethod[];
};

/** Precios estilo menú: nombre …… $450 MXN. */
export function AcademyPrices({ prices, paymentMethods }: Props) {
  if (prices.length === 0) return null;

  return (
    <AcademySection eyebrow="Precios" title="Claro y sin letras chiquitas">
      <Reveal delay={0.05}>
        <ul className="rounded-[24px] border border-(--af-border) bg-(--af-surface) px-5 py-2 md:px-8">
          {prices.map((p, i) => (
            <li
              key={`${p.name}-${i}`}
              className="flex items-baseline gap-3 border-b border-(--af-border) py-4 last:border-b-0 md:py-5"
            >
              <span className="text-base font-medium text-(--af-text) md:text-lg">{p.name}</span>
              <span
                aria-hidden
                className="min-w-6 flex-1 -translate-y-1.5 border-b-2 border-dotted border-(--af-border)"
              />
              <span className="shrink-0 whitespace-nowrap">
                <span className="font-display text-2xl font-bold tabular-nums tracking-[-0.02em] text-(--af-text) md:text-3xl">
                  {formatMXN(p.price)}
                </span>
                <span className="ml-1.5 text-xs font-semibold text-(--af-muted)">MXN</span>
              </span>
            </li>
          ))}
        </ul>

        {paymentMethods.length > 0 && (
          <div className="mt-5 flex flex-wrap items-center gap-2">
            <span className="mr-1 text-sm text-(--af-muted)">Aceptamos</span>
            {paymentMethods.map((m) => (
              <span key={m.code} className={chip}>
                <PaymentMethodIcon code={m.code} className="h-4 w-4 text-(--af-accent-text)" />
                {m.label}
              </span>
            ))}
          </div>
        )}
      </Reveal>
    </AcademySection>
  );
}
