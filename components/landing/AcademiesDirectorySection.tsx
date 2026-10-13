import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { getDirectory, type DirectoryAcademy } from "@/lib/academies";
import { AcademyCard } from "@/components/academy/AcademyCard";

/** A partir de cuántas academias la franja se anima en loop. */
const LOOP_MIN = 4;
/** Segundos por tarjeta: con más academias el loop dura más, la velocidad se mantiene. */
const SECONDS_PER_CARD = 5;

function Row({ academies, decorative }: { academies: DirectoryAcademy[]; decorative: boolean }) {
  return (
    <>
      {academies.map((a) => (
        <AcademyCard
          key={`${decorative ? "dup-" : ""}${a.slug}`}
          academy={a}
          decorative={decorative}
          className="w-[300px] shrink-0"
        />
      ))}
    </>
  );
}

export async function AcademiesDirectorySection() {
  const academies = await getDirectory();
  if (academies.length === 0) return null;
  const loop = academies.length >= LOOP_MIN;

  return (
    <section id="academias" className="py-16 md:py-24">
      <div className="mx-auto max-w-6xl px-4 md:px-6">
        <div className="mb-10 text-center">
          <p className="mb-2 text-sm font-semibold uppercase tracking-wider text-primary">
            Catálogo
          </p>
          <h2 className="text-2xl md:text-3xl font-extrabold text-foreground">
            Academias que ya usan AgendyFix
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-muted-foreground">
            Cada una tiene su propia página para recibir inscripciones desde Instagram.
          </p>
        </div>
      </div>

      {loop ? (
        <div
          className="af-academies-marquee"
          style={{ "--af-marquee-duration": `${academies.length * SECONDS_PER_CARD}s` } as React.CSSProperties}
        >
          <div className="af-academies-track">
            <Row academies={academies} decorative={false} />
            <Row academies={academies} decorative />
          </div>
        </div>
      ) : (
        <div className="mx-auto flex max-w-6xl flex-wrap justify-center gap-4 px-4 md:px-6">
          <Row academies={academies} decorative={false} />
        </div>
      )}

      <div className="mt-10 text-center">
        <Link
          href="/academias"
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-6 py-3.5 text-sm font-bold text-primary-foreground shadow-lg shadow-primary/25 transition-colors hover:bg-primary/90"
        >
          Ver todas las academias
          <ArrowRight className="h-4 w-4" aria-hidden />
        </Link>
      </div>
    </section>
  );
}
