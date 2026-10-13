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

export type AcademyDiscipline = { id: string; name: string };

export type AcademyPrice = { name: string; price: number };

export type PaymentMethodCode = "cash" | "transfer" | "card";

export type AcademyPaymentMethod = { code: PaymentMethodCode; label: string };

export type AcademyPromotion = {
  name: string;
  /** Entero en MXN; 0 = gratis; null = promo sin precio. */
  price: number | null;
  description: string;
};

export type Academy = {
  name: string;
  slug: string;
  tagline: string | null;
  description: string | null;
  address: string | null;
  whatsapp: string | null;
  instagram_handle: string | null;
  logo_url: string | null;
  accent_color: string | null;
  prices: AcademyPrice[];
  payment_methods: AcademyPaymentMethod[];
  promotions: AcademyPromotion[];
  disciplines: AcademyDiscipline[];
  groups: AcademyGroup[];
};

export type DirectoryAcademy = {
  name: string;
  slug: string;
  tagline: string | null;
  instagram_handle: string | null;
  logo_url: string | null;
  accent_color: string | null;
};

const PAYMENT_CODES: PaymentMethodCode[] = ["cash", "transfer", "card"];

function str(v: unknown): string | null {
  return typeof v === "string" && v.trim() !== "" ? v : null;
}

function list<T>(v: unknown, map: (item: Record<string, unknown>) => T | null): T[] {
  if (!Array.isArray(v)) return [];
  const out: T[] = [];
  for (const item of v) {
    if (item && typeof item === "object") {
      const mapped = map(item as Record<string, unknown>);
      if (mapped) out.push(mapped);
    }
  }
  return out;
}

/**
 * Convierte la respuesta cruda del API en un `Academy` con todos los campos
 * presentes. Tolera respuestas anteriores al contrato v2 (sin listas).
 */
export function normalizeAcademy(raw: Record<string, unknown>): Academy {
  return {
    name: String(raw.name ?? ""),
    slug: String(raw.slug ?? ""),
    tagline: str(raw.tagline),
    description: str(raw.description),
    address: str(raw.address),
    whatsapp: str(raw.whatsapp),
    instagram_handle: str(raw.instagram_handle),
    logo_url: str(raw.logo_url),
    accent_color: str(raw.accent_color),
    prices: list(raw.prices, (p) =>
      typeof p.name === "string" && typeof p.price === "number"
        ? { name: p.name, price: p.price }
        : null,
    ),
    payment_methods: list(raw.payment_methods, (m) =>
      typeof m.code === "string" &&
      PAYMENT_CODES.includes(m.code as PaymentMethodCode) &&
      typeof m.label === "string"
        ? { code: m.code as PaymentMethodCode, label: m.label }
        : null,
    ),
    promotions: list(raw.promotions, (p) =>
      typeof p.name === "string"
        ? {
            name: p.name,
            price: typeof p.price === "number" ? p.price : null,
            description: typeof p.description === "string" ? p.description : "",
          }
        : null,
    ),
    disciplines: list(raw.disciplines, (d) =>
      typeof d.id === "string" && typeof d.name === "string"
        ? { id: d.id, name: d.name }
        : null,
    ),
    groups: list(raw.groups, (g) =>
      typeof g.id === "string" && typeof g.name === "string"
        ? {
            id: g.id,
            name: g.name,
            level: String(g.level ?? ""),
            level_display: String(g.level_display ?? ""),
            instructor_name: String(g.instructor_name ?? ""),
            discipline_ids: Array.isArray(g.discipline_ids)
              ? g.discipline_ids.filter((x): x is string => typeof x === "string")
              : [],
            schedules: list(g.schedules, (s) =>
              typeof s.start_time === "string" && typeof s.end_time === "string"
                ? {
                    day_of_week: Number(s.day_of_week ?? 0),
                    day_display: String(s.day_display ?? ""),
                    start_time: s.start_time,
                    end_time: s.end_time,
                  }
                : null,
            ),
          }
        : null,
    ),
  };
}

export function normalizeDirectoryAcademy(
  raw: Record<string, unknown>,
): DirectoryAcademy | null {
  const slug = str(raw.slug);
  const name = str(raw.name);
  if (!slug || !name) return null;
  return {
    name,
    slug,
    tagline: str(raw.tagline),
    instagram_handle: str(raw.instagram_handle),
    logo_url: str(raw.logo_url),
    accent_color: str(raw.accent_color),
  };
}

/**
 * null solo si la academia no existe (404). Cualquier otro fallo lanza, para que
 * Next siga sirviendo la última versión cacheada en vez de un 404 falso.
 */
export async function getAcademy(slug: string): Promise<Academy | null> {
  const res = await fetch(
    `${API_URL}/public/academies/${encodeURIComponent(slug)}/`,
    { next: { revalidate: 60 } },
  );
  if (res.status === 404) return null;
  if (!res.ok) throw new Error(`API ${res.status} al cargar la academia ${slug}`);
  const raw: unknown = await res.json();
  if (!raw || typeof raw !== "object") {
    throw new Error(`Respuesta inválida del API para la academia ${slug}`);
  }
  return normalizeAcademy(raw as Record<string, unknown>);
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
    const data: unknown = await res.json();
    if (!Array.isArray(data)) return [];
    return data
      .filter((x): x is Record<string, unknown> => Boolean(x) && typeof x === "object")
      .map(normalizeDirectoryAcademy)
      .filter((x): x is DirectoryAcademy => x !== null);
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

/** 450 → "$450"; 1250 → "$1,250" (es-MX, sin decimales). */
export function formatMXN(amount: number): string {
  return `$${Math.round(amount).toLocaleString("es-MX")}`;
}

/** Primera promoción gratis (price === 0), si hay. */
export function freePromotion(academy: Academy): AcademyPromotion | null {
  return academy.promotions.find((p) => p.price === 0) ?? null;
}

/** Promoción a destacar: la gratis si existe, si no la primera activa. */
export function featuredPromotion(academy: Academy): AcademyPromotion | null {
  return freePromotion(academy) ?? academy.promotions[0] ?? null;
}

/** Niveles distintos de los grupos, en orden de aparición. */
export function uniqueLevels(groups: AcademyGroup[]): string[] {
  const seen = new Set<string>();
  const out: string[] = [];
  for (const g of groups) {
    const lvl = g.level_display.trim();
    if (lvl && !seen.has(lvl)) {
      seen.add(lvl);
      out.push(lvl);
    }
  }
  return out;
}

/** Nombres de instructores distintos, en orden de aparición. */
export function uniqueInstructors(groups: AcademyGroup[]): string[] {
  const seen = new Set<string>();
  const out: string[] = [];
  for (const g of groups) {
    const n = g.instructor_name.trim();
    if (n && !seen.has(n)) {
      seen.add(n);
      out.push(n);
    }
  }
  return out;
}

type ClockTime = { h: string; m: string; mer: "am" | "pm" };

function fmt(time: string): ClockTime {
  const [hh, mm] = time.split(":").map(Number);
  return {
    h: String(hh % 12 === 0 ? 12 : hh % 12),
    m: String(mm).padStart(2, "0"),
    mer: hh >= 12 ? "pm" : "am",
  };
}

/** "7:00 – 8:00 pm" (sin el día). */
export function formatTimeRange(s: AcademySchedule): string {
  const a = fmt(s.start_time);
  const b = fmt(s.end_time);
  const start = `${a.h}:${a.m}${a.mer !== b.mer ? ` ${a.mer}` : ""}`;
  return `${start} – ${b.h}:${b.m} ${b.mer}`;
}

/** "Martes 7:00 – 8:00 pm" */
export function formatSchedule(s: AcademySchedule): string {
  return `${s.day_display} ${formatTimeRange(s)}`;
}

/** "Martes" → "Mar", "Miércoles" → "Mié". */
export function shortDay(dayDisplay: string): string {
  return dayDisplay.slice(0, 3);
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

/**
 * Tamaño del nombre en el hero según su longitud, para que quepa en ≤ 2 líneas
 * en móvil sin sacrificar impacto en nombres cortos.
 */
export function displayNameSize(name: string): string {
  const longest = Math.max(...name.split(/\s+/).map((w) => w.length), 0);
  if (name.length <= 14 && longest <= 9) return "clamp(56px, 14vw, 104px)";
  if (name.length <= 24 && longest <= 12) return "clamp(44px, 11vw, 84px)";
  return "clamp(34px, 8.5vw, 64px)";
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
