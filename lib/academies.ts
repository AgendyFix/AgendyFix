export const API_URL =
  process.env.NEXT_PUBLIC_API_URL ?? "https://us-api.agendyfix.com/api/v1";

export type AcademySchedule = {
  day_of_week: number;
  day_display: string;
  start_time: string;
  end_time: string;
};

export type AcademyGroup = {
  id: string;
  name: string;
  level: string;
  level_display: string;
  instructor_name: string;
  discipline_ids: string[];
  schedules: AcademySchedule[];
};

export type Academy = {
  name: string;
  slug: string;
  tagline: string | null;
  description: string | null;
  address: string | null;
  whatsapp: string | null;
  instagram_handle: string | null;
  prices_text: string | null;
  disciplines: { id: string; name: string }[];
  groups: AcademyGroup[];
};

export type DirectoryAcademy = {
  name: string;
  slug: string;
  tagline: string | null;
  instagram_handle: string | null;
};

/** null si no existe (404) o el API falla. */
export async function getAcademy(slug: string): Promise<Academy | null> {
  try {
    const res = await fetch(
      `${API_URL}/public/academies/${encodeURIComponent(slug)}/`,
      { next: { revalidate: 60 } },
    );
    if (!res.ok) return null;
    return (await res.json()) as Academy;
  } catch {
    return null;
  }
}

/** Nunca lanza: lista vacía si el API no responde. */
export async function getDirectory(
  revalidate = 300,
): Promise<DirectoryAcademy[]> {
  try {
    const res = await fetch(`${API_URL}/public/academies/`, {
      next: { revalidate },
    });
    if (!res.ok) return [];
    const data = await res.json();
    return Array.isArray(data) ? data : [];
  } catch {
    return [];
  }
}

export function cleanHandle(handle: string): string {
  return handle.trim().replace(/^@/, "");
}

export function instagramUrl(handle: string): string {
  return `https://instagram.com/${cleanHandle(handle)}`;
}

export function mapsUrl(address: string): string {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`;
}

export function waUrl(number: string, text?: string): string {
  const digits = number.replace(/\D/g, "");
  const full = digits.length === 10 ? `52${digits}` : digits;
  return `https://wa.me/${full}${text ? `?text=${encodeURIComponent(text)}` : ""}`;
}

function fmt(time: string): { h: string; m: string; mer: "am" | "pm" } {
  const [hh, mm] = time.split(":").map(Number);
  return {
    h: String(hh % 12 === 0 ? 12 : hh % 12),
    m: String(mm).padStart(2, "0"),
    mer: hh >= 12 ? "pm" : "am",
  };
}

/** "Martes 7:00 – 8:00 pm" */
export function formatSchedule(s: AcademySchedule): string {
  const a = fmt(s.start_time);
  const b = fmt(s.end_time);
  const start = `${a.h}:${a.m}${a.mer !== b.mer ? ` ${a.mer}` : ""}`;
  return `${s.day_display} ${start} – ${b.h}:${b.m} ${b.mer}`;
}

export type ClassGroupSection = {
  key: string;
  name: string;
  groups: AcademyGroup[];
};

/** Agrupa por disciplina; un grupo con varias disciplinas aparece en cada una. */
export function groupByDiscipline(academy: Academy): ClassGroupSection[] {
  const sections: ClassGroupSection[] = academy.disciplines
    .map((d) => ({
      key: d.id,
      name: d.name,
      groups: academy.groups.filter((g) => g.discipline_ids.includes(d.id)),
    }))
    .filter((s) => s.groups.length > 0);

  const known = new Set(academy.disciplines.map((d) => d.id));
  const others = academy.groups.filter(
    (g) => !g.discipline_ids.some((id) => known.has(id)),
  );
  if (others.length > 0) {
    sections.push({ key: "otras", name: "Otras clases", groups: others });
  }
  return sections;
}

export function sortedSchedules(group: AcademyGroup): AcademySchedule[] {
  return [...group.schedules].sort(
    (a, b) =>
      a.day_of_week - b.day_of_week || a.start_time.localeCompare(b.start_time),
  );
}

export type RegisterPayload = {
  name: string;
  last_name: string;
  phone: string;
  email: string;
  interest: string;
  privacy_accepted: boolean;
  website: string;
};

export type RegisterResult =
  | { status: "ok" }
  | { status: "throttled" }
  | { status: "invalid"; fieldErrors: Record<string, string> }
  | { status: "error" };

export async function registerForAcademy(
  slug: string,
  payload: RegisterPayload,
): Promise<RegisterResult> {
  try {
    const res = await fetch(
      `${API_URL}/public/academies/${encodeURIComponent(slug)}/register/`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "omit",
        body: JSON.stringify(payload),
      },
    );
    if (res.ok) return { status: "ok" };
    if (res.status === 429) return { status: "throttled" };
    if (res.status === 400) {
      const body: unknown = await res.json().catch(() => null);
      const fieldErrors: Record<string, string> = {};
      if (body && typeof body === "object") {
        for (const [field, value] of Object.entries(body)) {
          const msg = Array.isArray(value) ? value[0] : value;
          if (typeof msg === "string") fieldErrors[field] = msg;
        }
      }
      return { status: "invalid", fieldErrors };
    }
    return { status: "error" };
  } catch {
    return { status: "error" };
  }
}
