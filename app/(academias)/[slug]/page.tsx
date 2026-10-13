import type { Metadata, Viewport } from "next";
import { cache } from "react";
import { notFound } from "next/navigation";
import { getAcademy, groupByDiscipline } from "@/lib/academies";
import { buildAcademyTheme, DARK } from "@/lib/theme";
import { AcademyHero, heroCtaLabel } from "@/components/academy/AcademyHero";
import { AcademyMarquee } from "@/components/academy/AcademyMarquee";
import { AcademyPromo } from "@/components/academy/AcademyPromo";
import { AcademySection } from "@/components/academy/AcademySection";
import { AcademySchedule } from "@/components/academy/AcademySchedule";
import { AcademyBento } from "@/components/academy/AcademyBento";
import { AcademyPrices } from "@/components/academy/AcademyPrices";
import { AcademyLocation } from "@/components/academy/AcademyLocation";
import { RegisterForm } from "@/components/academy/RegisterForm";
import { StickyCta } from "@/components/academy/StickyCta";
import { InterestProvider } from "@/components/academy/InterestContext";

type Props = { params: Promise<{ slug: string }> };

// Una sola llamada al API por request aunque metadata, viewport y página la pidan.
const loadAcademy = cache(getAcademy);

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const academy = await loadAcademy(slug);
  if (!academy) return {};

  const title = `${academy.name} | Clases e inscripciones`;
  const description = academy.tagline || academy.description || undefined;
  return {
    title: { absolute: title },
    description,
    alternates: { canonical: `/${slug}` },
    openGraph: { type: "website", title, description, url: `/${slug}`, locale: "es_MX" },
    twitter: { card: "summary_large_image", title, description },
  };
}

export async function generateViewport(): Promise<Viewport> {
  return { themeColor: DARK.bg };
}

export default async function AcademyPage({ params }: Props) {
  const { slug } = await params;
  const academy = await loadAcademy(slug);
  if (!academy) notFound();

  const theme = buildAcademyTheme(academy.accent_color, slug);
  const sections = groupByDiscipline(academy);
  const ctaLabel = heroCtaLabel(academy);
  const waText = `Hola, vi la página de ${academy.name} y quiero información.`;

  return (
    <InterestProvider>
      <div
        className="min-h-screen bg-(--af-bg) text-(--af-text)"
        style={theme.cssVars as React.CSSProperties}
      >
        <AcademyHero academy={academy} />

        <AcademyMarquee items={academy.disciplines.map((d) => d.name)} />

        <AcademyPromo promotions={academy.promotions} />

        {sections.length > 0 && (
          <AcademySection id="horarios" eyebrow="Horarios" title="Clases y grupos">
            <AcademySchedule sections={sections} />
          </AcademySection>
        )}

        <AcademyBento academy={academy} />

        <AcademyPrices prices={academy.prices} paymentMethods={academy.payment_methods} />

        <AcademyLocation address={academy.address} instagramHandle={academy.instagram_handle} />

        <AcademySection id="inscripcion" eyebrow="Inscripción" title="Aparta tu lugar" className="md:max-w-3xl">
          <RegisterForm
            slug={slug}
            academyName={academy.name}
            disciplines={academy.disciplines.map((d) => d.name)}
            whatsapp={academy.whatsapp}
            instagramHandle={academy.instagram_handle}
          />
        </AcademySection>

        <footer className="px-5 pb-28 pt-4 text-center text-xs text-(--af-muted) md:pb-10">
          © {new Date().getFullYear()} {academy.name}
        </footer>

        <StickyCta label={ctaLabel} whatsapp={academy.whatsapp} whatsappText={waText} />
      </div>
    </InterestProvider>
  );
}
