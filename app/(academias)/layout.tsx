import { Bricolage_Grotesque, Inter } from "next/font/google";

// Fuentes solo para las páginas de academias: no afectan la landing de AgendyFix.
const display = Bricolage_Grotesque({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-bricolage",
});

const body = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

export default function AcademiasLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className={`${display.variable} ${body.variable} af-academy`}>
      {children}
    </div>
  );
}
