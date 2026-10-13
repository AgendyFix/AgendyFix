import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { cleanHandle, type DirectoryAcademy } from "@/lib/academies";
import { buildAcademyTheme } from "@/lib/theme";
import { AcademyLogo } from "./AcademyLogo";

/**
 * Tarjeta del catálogo (home y /academias): fondo oscuro con el gradiente del
 * acento de cada academia, logo o monograma, nombre, descripción (2 líneas) y handle.
 */
export function AcademyCard({ academy }: { academy: DirectoryAcademy }) {
  const theme = buildAcademyTheme(academy.accent_color, academy.slug);
  return (
    <Link
      href={`/${academy.slug}`}
      style={theme.cssVars}
      className="af-grain group relative flex min-h-[280px] flex-col justify-between overflow-hidden rounded-[24px] bg-(--af-bg) p-6 text-(--af-text) transition-transform duration-300 hover:-translate-y-1 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-(--af-accent)"
    >
      <div
        aria-hidden
        className="absolute inset-0 transition-opacity duration-300 group-hover:opacity-100"
        style={{
          backgroundImage:
            "radial-gradient(85% 75% at 100% 0%, rgb(var(--af-accent-rgb) / 0.9) 0%, rgb(var(--af-accent-rgb) / 0) 62%), radial-gradient(65% 55% at 0% 100%, rgb(var(--af-support-rgb) / 0.6) 0%, rgb(var(--af-support-rgb) / 0) 60%)",
        }}
      />
      <div className="flex items-start justify-between gap-3">
        <AcademyLogo name={academy.name} logoUrl={academy.logo_url} size={56} />
        {academy.instagram_handle && (
          <span className="max-w-[55%] truncate rounded-full border border-white/20 bg-black/20 px-3 py-1 text-xs font-medium">
            @{cleanHandle(academy.instagram_handle)}
          </span>
        )}
      </div>
      <div>
        <h3 className="font-display text-[28px] font-extrabold leading-[1] tracking-[-0.03em] text-balance md:text-3xl">
          {academy.name}
        </h3>
        {academy.description && (
          <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-(--af-text)/80">
            {academy.description}
          </p>
        )}
        <span className="mt-4 inline-flex items-center gap-1 text-sm font-semibold">
          Ver academia
          <ArrowUpRight className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" aria-hidden />
        </span>
      </div>
    </Link>
  );
}
