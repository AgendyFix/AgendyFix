import { initials } from "@/lib/theme";

type Props = {
  name: string;
  logoUrl: string | null;
  /** Lado en px. */
  size?: number;
  /** true en el hero (carga inmediata). */
  priority?: boolean;
  className?: string;
};

/**
 * Logo de la academia o, si no hay, monograma con sus iniciales en fuente
 * display sobre el acento. `logo_url` puede ser cualquier https (lo sube
 * AgendyFix desde el admin), por eso usamos <img> con tamaño fijo.
 */
export function AcademyLogo({
  name,
  logoUrl,
  size = 64,
  priority = false,
  className = "",
}: Props) {
  const radius = size >= 96 ? "rounded-[28px]" : size >= 56 ? "rounded-2xl" : "rounded-xl";

  if (logoUrl) {
    return (
      <span
        className={`inline-flex shrink-0 items-center justify-center overflow-hidden bg-white ${radius} ${className}`}
        style={{ width: size, height: size, padding: Math.round(size * 0.1) }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element -- origen arbitrario (https), sin optimizador */}
        <img
          src={logoUrl}
          alt={`Logo de ${name}`}
          width={size}
          height={size}
          loading={priority ? "eager" : "lazy"}
          fetchPriority={priority ? "high" : "auto"}
          decoding="async"
          className="h-full w-full object-contain"
        />
      </span>
    );
  }

  return (
    <span
      role="img"
      aria-label={name}
      className={`inline-flex shrink-0 select-none items-center justify-center bg-(--af-accent) font-display font-extrabold leading-none tracking-[-0.04em] text-(--af-ink) ${radius} ${className}`}
      style={{ width: size, height: size, fontSize: Math.round(size * 0.42) }}
    >
      {initials(name)}
    </span>
  );
}
