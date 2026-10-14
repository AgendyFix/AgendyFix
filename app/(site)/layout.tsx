import { LandingNavbar } from "@/components/landing/LandingNavbar";
import { LandingFooter } from "@/components/landing/LandingFooter";
import { WhatsAppFab } from "@/components/landing/WhatsAppFab";

export default function SiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <LandingNavbar />
      <main className="flex-1">{children}</main>
      <LandingFooter />
      <WhatsAppFab />
    </div>
  );
}
