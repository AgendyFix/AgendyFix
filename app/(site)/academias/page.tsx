import type { Metadata } from "next";
import { MessageCircle } from "lucide-react";
import { getDirectory } from "@/lib/academies";
import { buildWaUrl } from "@/lib/tracking";
import { AcademyCard } from "@/components/academy/AcademyCard";

const WA_MSG = "Hola, tengo una academia y quiero mi página en AgendyFix.";

export const metadata: Metadata = {
  title: "Academias",
  description:
    "Catálogo de academias de baile, música, artes marciales y más que reciben inscripciones con AgendyFix. Encuentra horarios, precios y regístrate en línea.",
  alternates: { canonical: "/academias" },
  openGraph: {
    type: "website",
    locale: "es_MX",
    url: "/academias",
    title: "Academias | AgendyFix",
    description:
      "Catálogo de academias que reciben inscripciones en línea con AgendyFix.",
  },
};

export const revalidate = 300;

export default async function AcademiasPage() {
  const academies = await getDirectory();

  return (
    <div className="mx-auto max-w-6xl px-4 py-12 md:px-6 md:py-20">
      <header className="mb-10 max-w-2xl">
        <p className="mb-2 text-sm font-semibold uppercase tracking-wider text-primary">
          Catálogo
        </p>
        <h1 className="text-3xl font-extrabold text-foreground md:text-5xl">Academias</h1>
        <p className="mt-3 text-base text-muted-foreground md:text-lg">
          Academias que ya reciben inscripciones desde su página. Entra, revisa horarios y
          precios, y regístrate en un minuto.
        </p>
      </header>

      {academies.length === 0 ? (
        <p className="rounded-2xl border border-border bg-card p-8 text-center text-muted-foreground">
          Pronto verás academias aquí.
        </p>
      ) : (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {academies.map((a) => (
            <AcademyCard key={a.slug} academy={a} />
          ))}
        </div>
      )}

      <aside className="mt-16 rounded-2xl border border-border bg-muted/40 p-6 md:flex md:items-center md:justify-between md:p-8">
        <div>
          <h2 className="text-xl font-bold text-foreground">¿Tienes una academia?</h2>
          <p className="mt-1 text-muted-foreground">
            Te creamos tu página con horarios, precios e inscripciones en línea.
          </p>
        </div>
        <a
          href={buildWaUrl(WA_MSG)}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-4 inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 font-semibold text-primary-foreground hover:brightness-105 md:mt-0"
        >
          <MessageCircle className="h-5 w-5" aria-hidden />
          Quiero mi página
        </a>
      </aside>
    </div>
  );
}
