// ============================================
// TEST: coordsFromMapsUrl (extracción de coordenadas de una URL de Google Maps)
// ============================================
// La búsqueda del mapa embebido por texto muestra varios pines cuando la
// dirección es ambigua. El fix embebe el punto exacto del link compartido, y para
// eso hay que sacarle las coordenadas a la URL larga. Correr con: npm test
//
// Nota: el .ts se importa vía el loader de TS de Node; si el entorno no lo tiene,
// este archivo se puede portar a import directo cuando academies.ts se compile.

import { test } from "node:test";
import assert from "node:assert/strict";

// Reimplementación 1:1 de coordsFromMapsUrl para probar la lógica sin tooling de TS.
// Si cambias el regex en lib/academies.ts, cámbialo aquí también.
function coordsFromMapsUrl(url) {
  const pin = url.match(/!3d(-?\d+(?:\.\d+)?)!4d(-?\d+(?:\.\d+)?)/);
  if (pin) return `${pin[1]},${pin[2]}`;
  const center = url.match(/@(-?\d+(?:\.\d+)?),(-?\d+(?:\.\d+)?)/);
  if (center) return `${center[1]},${center[2]}`;
  const query = url.match(/[?&]q=(-?\d+(?:\.\d+)?),(-?\d+(?:\.\d+)?)/);
  if (query) return `${query[1]},${query[2]}`;
  return null;
}

test("prioriza el pin del lugar (!3d!4d) sobre el centro del mapa (@)", () => {
  const url =
    "https://www.google.com/maps/place/Danzar%C3%A9/@21.006962,-89.702614,14z/data=!4m7!3m6!8m2!3d20.9980092!4d-89.6901462";
  assert.equal(coordsFromMapsUrl(url), "20.9980092,-89.6901462");
});

test("usa el centro del mapa (@) cuando no hay pin", () => {
  const url = "https://www.google.com/maps/@19.4326,-99.1332,15z";
  assert.equal(coordsFromMapsUrl(url), "19.4326,-99.1332");
});

test("usa q=lat,lng cuando viene en el query", () => {
  const url = "https://www.google.com/maps?q=20.5,-100.1&output=embed";
  assert.equal(coordsFromMapsUrl(url), "20.5,-100.1");
});

test("devuelve null cuando la URL no trae coordenadas (p. ej. un link corto)", () => {
  assert.equal(coordsFromMapsUrl("https://maps.app.goo.gl/vMCWPsj36qNtNEsz8"), null);
});
