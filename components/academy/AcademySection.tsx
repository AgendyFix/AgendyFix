import { Reveal } from "./Reveal";
import { eyebrow as eyebrowClass } from "./styles";

type Props = {
  id?: string;
  eyebrow?: string;
  title: string;
  children: React.ReactNode;
  className?: string;
};

export function AcademySection({ id, eyebrow, title, children, className = "" }: Props) {
  return (
    <section
      id={id}
      className={`mx-auto w-full max-w-5xl scroll-mt-6 px-5 py-16 md:py-24 ${className}`}
    >
      <Reveal>
        {eyebrow && <p className={eyebrowClass}>{eyebrow}</p>}
        <h2 className="mt-2 font-display text-[40px] font-extrabold leading-[0.95] tracking-[-0.03em] text-(--af-text) md:text-6xl">
          {title}
        </h2>
      </Reveal>
      <div className="mt-8 md:mt-12">{children}</div>
    </section>
  );
}
