import { HeroSection } from "@/components/landing/HeroSection";
import { PainPointsSection } from "@/components/landing/PainPointsSection";
import { FeaturesSection } from "@/components/landing/FeaturesSection";
import { HowItWorksSection } from "@/components/landing/HowItWorksSection";
import { SocialProofSection } from "@/components/landing/SocialProofSection";
import { PricingSection } from "@/components/landing/PricingSection";
import { FaqSection } from "@/components/landing/FaqSection";
import { FAQS } from "@/components/landing/faqs";
import { FinalCtaSection } from "@/components/landing/FinalCtaSection";
import { ScrollDepthTracker } from "@/components/landing/ScrollDepthTracker";

const siteUrl = "https://agendyfix.com";

export default function LandingPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "SoftwareApplication",
        name: "AgendyFix",
        applicationCategory: "BusinessApplication",
        operatingSystem: "Web",
        description:
          "Software de gestion para academias y escuelas. Centraliza alumnos, inscripciones, pagos, clases grupales y recordatorios por WhatsApp.",
        url: siteUrl,
        offers: {
          "@type": "Offer",
          price: "25",
          priceCurrency: "MXN",
          description:
            "$25 MXN por alumno activo al mes. Primer mes gratis, sin tarjeta de crédito.",
        },
      },
      {
        "@type": "Organization",
        name: "AgendyFix",
        url: siteUrl,
        logo: `${siteUrl}/logo.png`,
        contactPoint: {
          "@type": "ContactPoint",
          telephone: "+52-99-9576-8092",
          contactType: "sales",
          availableLanguage: "es",
        },
      },
      {
        "@type": "FAQPage",
        mainEntity: FAQS.map((faq) => ({
          "@type": "Question",
          name: faq.question,
          acceptedAnswer: { "@type": "Answer", text: faq.answer },
        })),
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <ScrollDepthTracker />
      <HeroSection />
      <PainPointsSection />
      <FeaturesSection />
      <HowItWorksSection />
      <SocialProofSection />
      <PricingSection />
      <FaqSection />
      <FinalCtaSection />
    </>
  );
}
