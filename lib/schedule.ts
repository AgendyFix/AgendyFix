/**
 * "Próxima clase": la siguiente sesión según día y hora actuales.
 * Todo puro: la hora actual entra como `WeekMoment` para poder probarlo.
 * `day` usa el WeekDayChoice del API (0 = Lunes … 6 = Domingo).
 */
import { formatClock, type AcademyGroup, type AcademySchedule } from "./academies";

export type WeekMoment = { day: number; minutes: number };

export type NextSession = {
  group: AcademyGroup;
  schedule: AcademySchedule;
  /** 0 = hoy, 1 = mañana, … 7 = mismo día de la semana que viene. */
  daysAhead: number;
};

const MINUTES_PER_DAY = 24 * 60;
const WEEKDAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

/** Momento de la semana en una zona horaria (por defecto la de Mérida). */
export function weekMomentIn(date: Date, timeZone = "America/Merida"): WeekMoment {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone,
    weekday: "short",
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  }).formatToParts(date);
  const get = (type: Intl.DateTimeFormatPartTypes) =>
    parts.find((p) => p.type === type)?.value ?? "";
  const day = Math.max(0, WEEKDAYS.indexOf(get("weekday")));
  const minutes = (Number(get("hour")) % 24) * 60 + Number(get("minute"));
  return { day, minutes };
}

/** Momento neutro (lunes 00:00) para el render en servidor: da la primera sesión de la semana. */
export const WEEK_START: WeekMoment = { day: 0, minutes: 0 };

function startMinutes(s: AcademySchedule): number {
  const [h, m] = s.start_time.split(":").map(Number);
  return h * 60 + m;
}

/** Siguiente sesión a partir de `now` (si ya empezó hoy, cuenta la de la próxima semana). */
export function nextSession(groups: AcademyGroup[], now: WeekMoment): NextSession | null {
  let best: NextSession | null = null;
  let bestDelta = Infinity;
  for (const group of groups) {
    for (const schedule of group.schedules) {
      let daysAhead = (((schedule.day_of_week - now.day) % 7) + 7) % 7;
      const start = startMinutes(schedule);
      if (daysAhead === 0 && start < now.minutes) daysAhead = 7;
      const delta = daysAhead * MINUTES_PER_DAY + (start - now.minutes);
      if (delta < bestDelta) {
        bestDelta = delta;
        best = { group, schedule, daysAhead };
      }
    }
  }
  return best;
}

/**
 * "Hoy · 7:00 pm" / "Mañana · 10:00 am" / "Sábado · 10:00 am".
 * Con `relative=false` siempre usa el nombre del día (para SSR, que se cachea).
 */
export function nextSessionLabel(session: NextSession, relative: boolean): string {
  const day =
    relative && session.daysAhead === 0
      ? "Hoy"
      : relative && session.daysAhead === 1
        ? "Mañana"
        : session.schedule.day_display;
  return `${day} · ${formatClock(session.schedule.start_time)}`;
}
