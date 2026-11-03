// ============================================
// SMOKE TEST: postcss-color-mix-fallback con el globals.css real
// ============================================
// La copia fuente del plugin (con sus tests unitarios) vive en agendy-front.
// Este test avisa si una actualización de Tailwind cambia su salida y el
// fallback para Safari 15 deja de aplicarse en silencio. Correr con: npm test

import { test } from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import postcss from "postcss";
import tailwind from "@tailwindcss/postcss";
import colorMixFallback from "./postcss-color-mix-fallback.cjs";

const from = fileURLToPath(new URL("./app/globals.css", import.meta.url));

test("el globals.css compilado trae los fallbacks para Safari 15", async () => {
  const input = await readFile(from, "utf8");
  const { css } = await postcss([tailwind({ optimize: { minify: true } }), colorMixFallback()]).process(input, { from });

  assert.match(css, /\.bg-primary\\\/10\{background-color:oklch\(var\(--primary-ch\) \/ 10%\)\}/, "bg-primary/10 sin fallback");
  assert.match(css, /--tw-shadow-color:oklch\(var\(--primary-ch\) \/ 25%\)/, "shadow-primary/25 sin fallback");
  assert.doesNotMatch(css, /oklch\(var\(--color-/, "pisó un fallback de la paleta de Tailwind");
});
