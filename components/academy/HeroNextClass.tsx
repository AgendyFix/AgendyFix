"use client";

import { useEffect, useState } from "react";
import type { AcademyGroup } from "@/lib/academies";
import {
  nextSession,
  nextSessionLabel,
  weekMomentIn,
  WEEK_START,
  type NextSession,
} from "@/lib/schedule";

type View = { session: NextSession; label: string };

function neutral(groups: AcademyGroup[]): View | null {
  const session = nextSession(groups, WEEK_START);
  return session ? { session, label: nextSessionLabel(session, false) } : null;
}

/**
 * "Próxima clase" del hero. El servidor (cacheado con revalidate) renderiza la
 * primera sesión de la semana con el nombre del día; en el cliente se recalcula
 * con la hora real de Mérida ("Hoy", "Mañana"…). Sin mismatch de hidratación.
 */
export function HeroNextClass({ groups }: { groups: AcademyGroup[] }) {
  const [view, setView] = useState<View | null>(() => neutral(groups));

  useEffect(() => {
    const session = nextSession(groups, weekMomentIn(new Date()));
    setView(session ? { session, label: nextSessionLabel(session, true) } : null);
  }, [groups]);

  if (!view) return null;
  const { session, label } = view;

  return (
    <div>
      <p className="text-xs font-semibold uppercase tracking-[0.22em] text-(--af-accent-text)">
        Próxima clase
      </p>
      <p className="mt-2 font-display text-4xl font-extrabold leading-none tracking-[-0.03em] text-(--af-text)">
        {label}
      </p>
      <div className="mt-3 flex flex-wrap items-center gap-x-2 gap-y-1 text-base text-(--af-muted)">
        <span className="font-semibold text-(--af-text)">{session.group.name}</span>
        {session.group.instructor_name && <span>con {session.group.instructor_name}</span>}
        {session.group.level_display && (
          <span className="rounded-full bg-[rgb(var(--af-hi-rgb)/0.14)] px-2.5 py-0.5 text-xs font-semibold text-(--af-hi)">
            {session.group.level_display}
          </span>
        )}
      </div>
    </div>
  );
}
