"use client";

/** API caído y sin versión cacheada: mismo look que el 404, con reintento. */
export default function AcademyError({ unstable_retry }: { error: Error; unstable_retry: () => void }) {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-[#0B0A10] px-5 text-center text-[#F5F3F7]">
      <h1 className="font-display text-4xl font-extrabold tracking-[-0.03em] md:text-6xl">
        No pudimos cargar esta página
      </h1>
      <p className="mt-4 max-w-md text-[#A8A3B3]">Intenta de nuevo en unos segundos.</p>
      <button
        type="button"
        onClick={() => unstable_retry()}
        className="mt-8 inline-flex h-14 items-center rounded-full bg-[#F5F3F7] px-7 font-semibold text-[#0B0A10]"
      >
        Reintentar
      </button>
    </main>
  );
}
