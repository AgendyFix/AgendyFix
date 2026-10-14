import Link from "next/link";

export default function AcademyNotFound() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-[#0B0A10] px-5 text-center text-[#F5F3F7]">
      <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#A8A3B3]">404</p>
      <h1 className="mt-3 font-display text-5xl font-extrabold tracking-[-0.03em] md:text-7xl">
        Esta página no existe
      </h1>
      <p className="mt-4 max-w-md text-[#A8A3B3]">
        Revisa el enlace o explora las academias disponibles.
      </p>
      <Link
        href="/academias"
        className="mt-8 inline-flex h-14 items-center rounded-full bg-[#F5F3F7] px-7 font-semibold text-[#0B0A10]"
      >
        Ver academias
      </Link>
    </main>
  );
}
