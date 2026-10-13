"use client";

import { useId, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { ArrowDown } from "lucide-react";
import {
  formatTimeRange,
  shortDay,
  sortedSchedules,
  type AcademyGroup,
  type ClassGroupSection,
} from "@/lib/academies";
import { InterestButton } from "./InterestButton";
import { btnGhost, card } from "./styles";

function GroupCard({ group }: { group: AcademyGroup }) {
  const schedules = sortedSchedules(group);
  return (
    <article className={`${card} flex flex-col gap-5 p-5 md:p-6`}>
      <div className="flex items-start justify-between gap-3">
        <h3 className="font-display text-2xl font-bold leading-tight tracking-[-0.02em] text-(--af-text)">
          {group.name}
        </h3>
        {group.level_display && (
          <span className="shrink-0 rounded-full bg-[rgb(var(--af-hi-rgb)/0.14)] px-2.5 py-1 text-xs font-semibold text-(--af-hi)">
            {group.level_display}
          </span>
        )}
      </div>

      {schedules.length > 0 ? (
        <ul className="space-y-2">
          {schedules.map((s) => (
            <li key={`${s.day_of_week}-${s.start_time}`} className="flex items-baseline gap-3">
              <span className="w-14 shrink-0 font-display text-3xl font-extrabold tracking-[-0.03em] text-(--af-text)">
                {shortDay(s.day_display)}
              </span>
              <span className="text-lg font-medium tabular-nums text-(--af-text)/90">
                {formatTimeRange(s)}
              </span>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-sm text-(--af-muted)">Pregunta por el horario</p>
      )}

      {group.instructor_name && (
        <p className="text-sm text-(--af-muted)">
          con <span className="font-semibold text-(--af-text)">{group.instructor_name}</span>
        </p>
      )}

      <InterestButton interest={group.name} source="group" className={`${btnGhost} mt-auto w-full`}>
        Quiero este grupo
        <ArrowDown className="h-4 w-4" aria-hidden />
      </InterestButton>
    </article>
  );
}

export function AcademySchedule({ sections }: { sections: ClassGroupSection[] }) {
  const [active, setActive] = useState(0);
  const reduce = useReducedMotion();
  const baseId = useId();
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);

  if (sections.length === 0) return null;
  const current = sections[Math.min(active, sections.length - 1)];

  function onKeyDown(e: React.KeyboardEvent<HTMLDivElement>) {
    const n = sections.length;
    let next: number | null = null;
    if (e.key === "ArrowRight") next = (active + 1) % n;
    else if (e.key === "ArrowLeft") next = (active - 1 + n) % n;
    else if (e.key === "Home") next = 0;
    else if (e.key === "End") next = n - 1;
    if (next === null) return;
    e.preventDefault();
    setActive(next);
    tabRefs.current[next]?.focus();
  }

  return (
    <div>
      {sections.length > 1 && (
        <div
          role="tablist"
          aria-label="Disciplinas"
          onKeyDown={onKeyDown}
          className="-mx-5 flex gap-2 overflow-x-auto px-5 pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {sections.map((s, i) => {
            const selected = i === active;
            return (
              <button
                key={s.key}
                ref={(el) => {
                  tabRefs.current[i] = el;
                }}
                role="tab"
                id={`${baseId}-tab-${s.key}`}
                aria-selected={selected}
                aria-controls={`${baseId}-panel-${s.key}`}
                tabIndex={selected ? 0 : -1}
                onClick={() => setActive(i)}
                className={`relative h-12 shrink-0 rounded-full px-5 text-base font-semibold transition-colors ${
                  selected ? "text-(--af-ink)" : "text-(--af-muted) hover:text-(--af-text)"
                }`}
              >
                {selected && (
                  <motion.span
                    layoutId={`${baseId}-pill`}
                    transition={reduce ? { duration: 0 } : { duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
                    className="absolute inset-0 rounded-full bg-(--af-accent)"
                  />
                )}
                <span className="relative">{s.name}</span>
              </button>
            );
          })}
        </div>
      )}

      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={current.key}
          role={sections.length > 1 ? "tabpanel" : undefined}
          id={`${baseId}-panel-${current.key}`}
          aria-labelledby={sections.length > 1 ? `${baseId}-tab-${current.key}` : undefined}
          initial={reduce ? false : { opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={reduce ? undefined : { opacity: 0, y: -6 }}
          transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
          className="mt-4 grid gap-4 sm:grid-cols-2"
        >
          {current.groups.map((g) => (
            <GroupCard key={g.id} group={g} />
          ))}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
