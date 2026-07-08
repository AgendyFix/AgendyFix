import type { Metadata } from "next";
import { Geist } from "next/font/google";
import Providers from "@/components/providers";
import { LandingNavbar } from "@/components/landing/LandingNavbar";
import { LandingFooter } from "@/components/landing/LandingFooter";
import { WhatsAppFab } from "@/components/landing/WhatsAppFab";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "optional",
});

const siteUrl = "https://agendyfix.com";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "AgendyFix — Software de gestión para academias",
    template: "%s | AgendyFix",
  },
  description:
    "Centraliza alumnos, inscripciones, pagos y clases grupales. Envía recordatorios automáticos por WhatsApp. El software que tu academia necesita para crecer.",
  keywords: [
    "software para academias",
    "gestión de academias",
    "control de alumnos",
    "inscripciones academia",
    "pagos academia",
    "clases grupales",
    "recordatorios WhatsApp",
    "software escuela de musica",
    "academia de danza",
    "estudio de yoga",
    "artes marciales gestión",
  ],
  openGraph: {
    type: "website",
    locale: "es_MX",
    url: siteUrl,
    siteName: "AgendyFix",
    title: "AgendyFix — Software de gestión para academias",
    description:
      "Centraliza alumnos, inscripciones, pagos y clases grupales. El software que tu academia necesita para crecer.",
    images: [
      {
        url: "/og_image.jpg",
        width: 1200,
        height: 630,
        alt: "AgendyFix",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "AgendyFix — Software de gestión para academias",
    description:
      "Centraliza alumnos, pagos y clases. Recordatorios automáticos por WhatsApp.",
    images: ["/og_image.jpg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body className={`${geistSans.variable} antialiased`}>
        <Providers>
          <div className="min-h-screen flex flex-col bg-background">
            <LandingNavbar />
            <main className="flex-1">{children}</main>
            <LandingFooter />
            <WhatsAppFab />
          </div>
        </Providers>
      </body>
    </html>
  );
}
