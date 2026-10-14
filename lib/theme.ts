/**
 * Tema visual por academia, derivado de `accent_color`.
 * Todo es puro y determinista: misma entrada → mismas variables CSS.
 */

export type Rgb = { r: number; g: number; b: number };
export type Hsl = { h: number; s: number; l: number };

export type AcademyTheme = {
  /** Acento tal cual (fondos de botones, mesh, glow). */
  accent: string;
  /** Texto sobre el acento (oscuro o claro según luminancia), contraste ≥ 4.5:1. */
  accentInk: string;
  /** Acento ajustado para usarse como TEXTO sobre el fondo oscuro (≥ 4.5:1). */
  accentText: string;
  /** Color de apoyo (segundo blob del mesh). */
  support: string;
  /** Color de contraste/realce para textos pequeños (eyebrows, niveles), ≥ 4.5:1 sobre fondo. */
  highlight: string;
  bg: string;
  surface: string;
  border: string;
  text: string;
  muted: string;
  /** Variables listas para `style={}` en el contenedor raíz. */
  cssVars: Record<`--${string}`, string>;
};

export const DARK = {
  bg: "#0B0A10",
  surface: "#16141D",
  border: "#2A2633",
  text: "#F5F3F7",
  muted: "#A8A3B3",
} as const;

/** Paleta curada para academias sin `accent_color` (se elige por hash del slug). */
export const FALLBACK_ACCENTS = [
  "#FF2E88", // magenta
  "#7B5CFF", // violeta
  "#FF6B2C", // naranja
  "#2CD4A6", // menta
  "#F7C948", // ámbar
  "#38BDF8", // cielo
  "#F43F5E", // coral
  "#A3E635", // lima
] as const;

const HEX_RE = /^#?([0-9a-f]{3}|[0-9a-f]{6})$/i;

export function normalizeHex(input: string | null | undefined): string | null {
  if (!input) return null;
  const m = HEX_RE.exec(input.trim());
  if (!m) return null;
  let hex = m[1].toLowerCase();
  if (hex.length === 3) hex = hex.split("").map((c) => c + c).join("");
  return `#${hex}`;
}

export function hexToRgb(hex: string): Rgb {
  const n = normalizeHex(hex);
  if (!n) throw new Error(`Color inválido: ${hex}`);
  return {
    r: parseInt(n.slice(1, 3), 16),
    g: parseInt(n.slice(3, 5), 16),
    b: parseInt(n.slice(5, 7), 16),
  };
}

export function rgbToHex({ r, g, b }: Rgb): string {
  const c = (v: number) =>
    Math.max(0, Math.min(255, Math.round(v))).toString(16).padStart(2, "0");
  return `#${c(r)}${c(g)}${c(b)}`;
}

export function rgbToHsl({ r, g, b }: Rgb): Hsl {
  const rn = r / 255, gn = g / 255, bn = b / 255;
  const max = Math.max(rn, gn, bn), min = Math.min(rn, gn, bn);
  const l = (max + min) / 2;
  if (max === min) return { h: 0, s: 0, l };
  const d = max - min;
  const s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
  let h: number;
  if (max === rn) h = ((gn - bn) / d + (gn < bn ? 6 : 0)) * 60;
  else if (max === gn) h = ((bn - rn) / d + 2) * 60;
  else h = ((rn - gn) / d + 4) * 60;
  return { h, s, l };
}

export function hslToRgb({ h, s, l }: Hsl): Rgb {
  const hue = ((h % 360) + 360) % 360;
  const c = (1 - Math.abs(2 * l - 1)) * s;
  const x = c * (1 - Math.abs(((hue / 60) % 2) - 1));
  const m = l - c / 2;
  let [r, g, b] = [0, 0, 0];
  if (hue < 60) [r, g, b] = [c, x, 0];
  else if (hue < 120) [r, g, b] = [x, c, 0];
  else if (hue < 180) [r, g, b] = [0, c, x];
  else if (hue < 240) [r, g, b] = [0, x, c];
  else if (hue < 300) [r, g, b] = [x, 0, c];
  else [r, g, b] = [c, 0, x];
  return { r: (r + m) * 255, g: (g + m) * 255, b: (b + m) * 255 };
}

/** Luminancia relativa (WCAG 2.x). */
export function relativeLuminance(hex: string): number {
  const { r, g, b } = hexToRgb(hex);
  const lin = (v: number) => {
    const c = v / 255;
    return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
  };
  return 0.2126 * lin(r) + 0.7152 * lin(g) + 0.0722 * lin(b);
}

/** Ratio de contraste WCAG entre dos colores (1–21). */
export function contrastRatio(a: string, b: string): number {
  const la = relativeLuminance(a);
  const lb = relativeLuminance(b);
  const [hi, lo] = la > lb ? [la, lb] : [lb, la];
  return (hi + 0.05) / (lo + 0.05);
}

/**
 * Texto para poner sobre `bg`: el que tenga más contraste entre oscuro y claro.
 * Con el acento sobre tema oscuro casi siempre gana el oscuro (nunca blanco sobre magenta).
 */
export function pickInkOn(bg: string, dark = DARK.bg, light = DARK.text): string {
  return contrastRatio(bg, dark) >= contrastRatio(bg, light) ? dark : light;
}

/**
 * Ajusta la luminosidad de `fg` (manteniendo tono y saturación) hasta que
 * contraste ≥ `min` sobre `bg`. Sobre fondos oscuros aclara; sobre claros oscurece.
 */
export function ensureContrast(fg: string, bg: string, min = 4.5): string {
  if (contrastRatio(fg, bg) >= min) return normalizeHex(fg) as string;
  const bgIsDark = relativeLuminance(bg) < 0.5;
  const hsl = rgbToHsl(hexToRgb(fg));
  let l = hsl.l;
  for (let i = 0; i < 40; i++) {
    l = bgIsDark ? Math.min(1, l + 0.02) : Math.max(0, l - 0.02);
    const candidate = rgbToHex(hslToRgb({ ...hsl, l }));
    if (contrastRatio(candidate, bg) >= min) return candidate;
  }
  return bgIsDark ? DARK.text : DARK.bg;
}

/** Hash determinista (djb2) → índice de la paleta de fallback. */
export function hashString(input: string): number {
  let h = 5381;
  for (let i = 0; i < input.length; i++) h = ((h << 5) + h + input.charCodeAt(i)) | 0;
  return Math.abs(h);
}

export function fallbackAccent(slug: string): string {
  return FALLBACK_ACCENTS[hashString(slug) % FALLBACK_ACCENTS.length];
}

const clamp01 = (v: number) => Math.max(0, Math.min(1, v));

/**
 * Apoyo del mesh: mismo tono (giro pequeño), algo más oscuro y con menos croma.
 * Naranja → terracota, cian → azul, magenta → fucsia profundo.
 */
function supportFrom(accent: string): string {
  const hsl = rgbToHsl(hexToRgb(accent));
  // Cianes y azules giran hacia el azul (no hacia el verde); el resto hacia el
  // tono más profundo (naranja → terracota, ámbar → naranja, magenta → fucsia).
  const direction = hsl.h >= 160 && hsl.h < 250 ? 1 : -1;
  return rgbToHex(
    hslToRgb({
      h: hsl.h + direction * 22,
      s: clamp01(hsl.s * 0.85),
      l: clamp01(Math.min(hsl.l - 0.1, 0.5)),
    }),
  );
}

/** Realce para textos pequeños: mismo tono (giro pequeño) y más claro. */
function highlightFrom(accent: string): string {
  const hsl = rgbToHsl(hexToRgb(accent));
  return rgbToHex(
    hslToRgb({
      h: hsl.h + 15,
      // Grises y negros se quedan grises (no inventar un tono).
      s: hsl.s < 0.1 ? hsl.s : clamp01(Math.max(hsl.s, 0.6)),
      l: clamp01(Math.max(hsl.l + 0.12, 0.7)),
    }),
  );
}

function rgbTriplet(hex: string): string {
  const { r, g, b } = hexToRgb(hex);
  return `${r} ${g} ${b}`;
}

/**
 * Construye el tema de una academia. `accentColor` puede ser null o inválido:
 * entonces se usa un acento curado elegido por hash del slug.
 */
export function buildAcademyTheme(
  accentColor: string | null | undefined,
  slug: string,
): AcademyTheme {
  const rawAccent = normalizeHex(accentColor) ?? fallbackAccent(slug);
  const accentInk = pickInkOn(rawAccent);
  // Si ni el texto oscuro ni el claro llegan a 4.5:1 (p. ej. #E11D48), se
  // ajusta apenas la luminosidad del acento, conservando tono y saturación.
  const accent = ensureContrast(rawAccent, accentInk, 4.5);
  const accentText = ensureContrast(accent, DARK.bg, 4.5);
  // Paleta análoga: la página se ve "del color de la academia", sin tonos ajenos.
  const support = supportFrom(accent);
  const highlight = ensureContrast(highlightFrom(accent), DARK.bg, 4.5);

  const theme: Omit<AcademyTheme, "cssVars"> = {
    accent,
    accentInk,
    accentText,
    support,
    highlight,
    ...DARK,
  };

  return {
    ...theme,
    // Prefijo `af-` para no pisar las variables de la landing (--border, --muted…).
    cssVars: {
      "--af-accent": accent,
      "--af-accent-rgb": rgbTriplet(accent),
      "--af-ink": accentInk,
      "--af-accent-text": accentText,
      "--af-support": support,
      "--af-support-rgb": rgbTriplet(support),
      "--af-hi": highlight,
      "--af-hi-rgb": rgbTriplet(highlight),
      "--af-bg": DARK.bg,
      "--af-surface": DARK.surface,
      "--af-border": DARK.border,
      "--af-text": DARK.text,
      "--af-muted": DARK.muted,
    },
  };
}

/** Conectores que no cuentan para el monograma ("Escuela de Música" → "EM"). */
const CONNECTORS = new Set(["de", "del", "la", "las", "el", "los", "y", "e", "en"]);

/** "Dance Company" → "DC"; "Escuela de Música Allegro" → "EM"; "Yoga" → "Y". Máximo 2 letras. */
export function initials(name: string): string {
  const all = name
    .replace(/[^\p{L}\p{N}\s]/gu, " ")
    .split(/\s+/)
    .filter(Boolean);
  if (all.length === 0) return "?";
  const meaningful = all.filter((w) => !CONNECTORS.has(w.toLowerCase()));
  const words = meaningful.length > 0 ? meaningful : all;
  const letters = words.length === 1 ? [words[0][0]] : [words[0][0], words[1][0]];
  return letters.join("").toUpperCase();
}
