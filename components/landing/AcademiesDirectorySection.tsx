import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { getDirectory } from "@/lib/academies";
import { AcademyCard } from "@/components/academy/AcademyCard";

const HOME_LIMIT = 6;

export async function AcademiesDirectorySection() {
  const academies = await getDirectory();
  if (academies.length === 0) return null;

  return (
    <section id="academias" className="py-16 md:py-24">
      <div className="mx-auto max-w-6xl px-4 md:px-6">
        <div className="mb-10 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="mb-2 text-sm font-semibold uppercase tracking-wider text-primary">
              Catálogo
            </p>
            <h2 className="text-2xl md:text-3xl font-extrabold text-foreground">
              Academias en AgendyFix
            </h2>
            <p className="mt-2 max-w-xl text-muted-foreground">
              Cada academia tiene su propia página para recibir inscripciones desde Instagram.
            </p>
          </div>
          <Link
            href="/academias"
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary hover:underline"
          >
            Ver todas las academias
            <ArrowRight className="h-4 w-4" aria-hidden />
          </Link>
        </div>
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {academies.slice(0, HOME_LIMIT).map((a) => (
            <AcademyCard key={a.slug} academy={a} />
          ))}
        </div>
      </div>
    </section>
  );
}
