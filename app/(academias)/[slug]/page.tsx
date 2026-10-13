import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getAcademy } from "@/lib/academies";
import { AcademyHero } from "@/components/academy/AcademyHero";
import { AcademySection } from "@/components/academy/AcademySection";
import { AcademySchedule } from "@/components/academy/AcademySchedule";
import { AcademyLocation } from "@/components/academy/AcademyLocation";
import { RegisterForm } from "@/components/academy/RegisterForm";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const academy = await getAcademy(slug);
  if (!academy) return {};

  const title = `${academy.name} | Clases e inscripciones`;
  const description = academy.tagline || academy.description || undefined;
  return {
    title: { absolute: title },
    description,
    alternates: { canonical: `/${slug}` },
    openGraph: { type: "website", title, description, url: `/${slug}` },
  };
}

export default async function AcademyPage({ params }: Props) {
  const { slug } = await params;
  const academy = await getAcademy(slug);
  if (!academy) notFound();

  return (
    <div className="min-h-screen bg-background">
      <AcademyHero academy={academy} />

      {academy.description && (
        <AcademySection title="Sobre nosotros">
          <p className="whitespace-pre-line leading-relaxed text-foreground/80">
            {academy.description}
          </p>
        </AcademySection>
      )}

      <AcademySchedule academy={academy} />

      {academy.prices_text && (
        <AcademySection title="Precios">
          <p className="whitespace-pre-line rounded-2xl border border-border bg-muted p-5 leading-relaxed text-foreground">
            {academy.prices_text}
          </p>
        </AcademySection>
      )}

      {academy.address && <AcademyLocation address={academy.address} />}

      <div id="inscripcion" className="scroll-mt-4">
        <AcademySection title="Inscríbete">
          <RegisterForm
            slug={slug}
            disciplines={academy.disciplines.map((d) => d.name)}
            whatsapp={academy.whatsapp}
          />
        </AcademySection>
      </div>

      <footer className="py-8 text-center text-xs text-muted-foreground">
        <Link href="/" className="hover:underline">
          Página creada con AgendyFix
        </Link>
      </footer>
    </div>
  );
}
