/**
 * Cinta decorativa con las disciplinas. Solo decoración: aria-hidden,
 * contenido duplicado para el loop y se detiene con prefers-reduced-motion.
 */
export function AcademyMarquee({ items }: { items: string[] }) {
  if (items.length === 0) return null;
  // Repetimos hasta tener suficiente ancho para que el loop no se note.
  const base = items.length < 4 ? [...items, ...items, ...items] : items;
  const Row = () => (
    <>
      {base.map((item, i) => (
        <span key={`${item}-${i}`} className="flex items-center">
          <span className="px-5 md:px-7">{item}</span>
          <span className="text-(--af-ink)/60">✦</span>
        </span>
      ))}
    </>
  );

  return (
    <div aria-hidden="true" className="relative -my-6 overflow-hidden py-6">
      <div className="-mx-[6vw] -rotate-3 bg-(--af-accent) py-3 text-(--af-ink) shadow-[0_20px_60px_-30px_rgb(var(--af-accent-rgb)/0.9)]">
        <div className="af-marquee-track font-display text-2xl font-extrabold uppercase tracking-[-0.02em] md:text-4xl">
          <Row />
          <Row />
        </div>
      </div>
    </div>
  );
}
