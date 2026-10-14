import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import type { DirectoryAcademy } from "@/lib/academies";
import { buildAcademyTheme } from "@/lib/theme";
import { AcademyLogo } from "./AcademyLogo";

type Props = {
  academy: DirectoryAcademy;
  /** Copia decorativa dentro de un loop (marquee): fuera del árbol accesible y del tab order. */
  decorative?: boolean;
  className?: string;
};

/**
 * Tarjeta CLARA del catálogo (home y /academias), con el tono de la landing de
 * AgendyFix. Solo el logo/monograma lleva el acento de la academia; el tema
 * oscuro vive únicamente dentro de /<slug>.
 */
export function AcademyCard({ academy, decorative = false, className = "" }: Props) {
  const theme = buildAcademyTheme(academy.accent_color, academy.slug);
  return (
    <Link
      href={`/${academy.slug}`}
      aria-hidden={decorative || undefined}
      tabIndex={decorative ? -1 : undefined}
      className={`group flex items-center gap-4 rounded-2xl border border-border bg-card p-4 transition-[border-color,box-shadow,transform] duration-200 hover:-translate-y-0.5 hover:border-primary/60 hover:shadow-md focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary ${className}`}
    >
      <span style={theme.cssVars as React.CSSProperties} className="shrink-0">
        <AcademyLogo name={academy.name} logoUrl={academy.logo_url} size={56} />
      </span>
      <span className="min-w-0 flex-1">
        <span className="flex items-center gap-1.5">
          <span className="truncate font-bold text-foreground">{academy.name}</span>
          <ArrowUpRight
            className="h-4 w-4 shrink-0 text-primary opacity-0 transition-opacity group-hover:opacity-100"
            aria-hidden
          />
        </span>
        {academy.description && (
          <span className="mt-0.5 block truncate text-sm text-muted-foreground">
            {academy.description}
          </span>
        )}
      </span>
    </Link>
  );
}
