import Link from "next/link";
import { cleanHandle, getDirectory } from "@/lib/academies";

export async function AcademiesDirectorySection() {
  const academies = await getDirectory();
  if (academies.length === 0) return null;

  return (
    <section className="py-16 md:py-24">
      <div className="mx-auto max-w-6xl px-4 md:px-6">
        <h2 className="mb-10 text-center text-2xl md:text-3xl font-extrabold text-foreground">
          Academias que ya usan AgendyFix
        </h2>
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {academies.map((a) => (
            <Link
              key={a.slug}
              href={`/${a.slug}`}
              className="rounded-2xl border border-border bg-card p-6 transition hover:border-primary hover:shadow-md"
            >
              <h3 className="font-bold text-foreground">{a.name}</h3>
              {a.tagline && (
                <p className="mt-2 text-sm text-muted-foreground">{a.tagline}</p>
              )}
              {a.instagram_handle && (
                <p className="mt-3 text-sm font-medium text-primary">
                  @{cleanHandle(a.instagram_handle)}
                </p>
              )}
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
