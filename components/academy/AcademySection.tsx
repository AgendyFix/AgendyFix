export function AcademySection({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="mx-auto max-w-3xl px-5 py-10 md:py-14">
      <h2 className="mb-6 text-2xl md:text-3xl font-extrabold text-secondary">
        {title}
      </h2>
      {children}
    </section>
  );
}
