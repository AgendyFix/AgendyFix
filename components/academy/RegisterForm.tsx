"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { Instagram, MessageCircle } from "lucide-react";
import {
  cleanHandle,
  instagramUrl,
  registerForAcademy,
  waUrl,
  type RegisterResult,
} from "@/lib/academies";
import { trackEvent } from "@/lib/tracking";
import { useInterest } from "./InterestContext";
import { btnGhost, btnPrimary, card } from "./styles";

const EXTRA_INTERESTS = ["Clase muestra", "Otro"];

type Values = {
  name: string;
  last_name: string;
  phone: string;
  email: string;
  interest: string;
  privacy_accepted: boolean;
};

type Field = keyof Values;

const EMPTY: Values = {
  name: "",
  last_name: "",
  phone: "",
  email: "",
  interest: "",
  privacy_accepted: false,
};

/** 10 dígitos + lada opcional (+52 1 = 3 más). */
const MAX_PHONE_DIGITS = 13;

/** Deja solo lo que se usa para escribir un teléfono y no permite pasar de MAX_PHONE_DIGITS. */
export function sanitizePhone(next: string, prev: string): string {
  const clean = next.replace(/[^0-9+()\- ]/g, "");
  return clean.replace(/\D/g, "").length > MAX_PHONE_DIGITS ? prev : clean;
}

/** Validación local, suave: solo se muestra tras blur o al enviar. */
export function validate(v: Values): Partial<Record<Field, string>> {
  const e: Partial<Record<Field, string>> = {};
  if (!v.name.trim()) e.name = "Escribe tu nombre";
  if (!v.last_name.trim()) e.last_name = "Escribe tu apellido";
  // Acepta lada (+52, 52 1, 044); la API normaliza a 10 dígitos y descarta números imposibles.
  const phoneDigits = v.phone.replace(/\D/g, "").length;
  if (phoneDigits < 10 || phoneDigits > MAX_PHONE_DIGITS) e.phone = "Necesitamos 10 dígitos";
  if (v.email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.email.trim()))
    e.email = "Revisa el correo";
  if (!v.interest) e.interest = "Elige una opción";
  if (!v.privacy_accepted) e.privacy_accepted = "Necesitamos tu aceptación";
  return e;
}

const inputBase =
  "h-14 w-full rounded-2xl border bg-(--af-bg) px-4 text-base text-(--af-text) outline-none transition-[border-color,box-shadow] placeholder:text-(--af-muted)/60 focus:border-(--af-accent) focus:ring-2 focus:ring-[rgb(var(--af-accent-rgb)/0.35)]";
const errorText = "#FF9B9B";

function Label({ htmlFor, children }: { htmlFor: string; children: React.ReactNode }) {
  return (
    <label htmlFor={htmlFor} className="mb-2 block text-sm font-medium text-(--af-text)">
      {children}
    </label>
  );
}

function FieldError({ id, message }: { id: string; message?: string }) {
  if (!message) return null;
  return (
    <p id={id} className="mt-1.5 text-sm" style={{ color: errorText }}>
      {message}
    </p>
  );
}

const CONFETTI = Array.from({ length: 12 }, (_, i) => {
  const angle = (i / 12) * Math.PI * 2;
  const dist = 90 + (i % 3) * 30;
  return {
    dx: `${Math.round(Math.cos(angle) * dist)}px`,
    dy: `${Math.round(Math.sin(angle) * dist - 40)}px`,
    delay: `${(i % 4) * 40}ms`,
    color: ["var(--af-accent)", "var(--af-support)", "var(--af-hi)"][i % 3],
    rotate: `${(i * 37) % 90}deg`,
  };
});

type Props = {
  slug: string;
  academyName: string;
  disciplines: string[];
  whatsapp: string | null;
  instagramHandle: string | null;
};

export function RegisterForm({ slug, academyName, disciplines, whatsapp, instagramHandle }: Props) {
  const { interest: chosen } = useInterest();
  const reduce = useReducedMotion();
  const [values, setValues] = useState<Values>(EMPTY);
  const [touched, setTouched] = useState<Partial<Record<Field, boolean>>>({});
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<RegisterResult | null>(null);
  const [done, setDone] = useState<{ name: string; interest: string } | null>(null);

  // "Quiero este grupo" / promo: preselecciona el interés.
  useEffect(() => {
    if (chosen) setValues((v) => ({ ...v, interest: chosen }));
  }, [chosen]);

  const localErrors = validate(values);
  const serverErrors = result?.status === "invalid" ? result.fieldErrors : {};
  const errorFor = (f: Field) =>
    serverErrors[f] ?? ((touched[f] || submitted) ? localErrors[f] : undefined);

  const customInterest = chosen && !disciplines.includes(chosen) ? [chosen] : [];
  const options = [...customInterest, ...disciplines, ...EXTRA_INTERESTS];

  function set<K extends Field>(field: K, value: Values[K]) {
    setValues((v) => ({ ...v, [field]: value }));
    if (result?.status === "invalid") setResult(null);
  }
  const blur = (field: Field) => () => setTouched((t) => ({ ...t, [field]: true }));

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitted(true);
    if (Object.keys(localErrors).length > 0) {
      const first = Object.keys(localErrors)[0];
      // Los radios de "interés" devuelven un RadioNodeList (sin focus): enfocamos el primero
      const el = e.currentTarget.elements.namedItem(first);
      (el instanceof RadioNodeList ? (el[0] as HTMLElement | undefined) : (el as HTMLElement | null))?.focus();
      return;
    }
    const website = String(new FormData(e.currentTarget).get("website") ?? "");
    setSubmitting(true);
    const res = await registerForAcademy(slug, {
      name: values.name.trim(),
      last_name: values.last_name.trim(),
      phone: values.phone.trim(),
      email: values.email.trim(),
      interest: values.interest,
      privacy_accepted: values.privacy_accepted,
      website,
    });
    setSubmitting(false);
    setResult(res);
    if (res.status === "ok") {
      setDone({ name: values.name.trim(), interest: values.interest });
      trackEvent("academy_register_submitted", { slug, interest: values.interest });
    }
  }

  const waFallback = whatsapp && (
    <a
      href={waUrl(whatsapp, `Hola, intenté registrarme en la página de ${academyName} y no pude.`)}
      target="_blank"
      rel="noopener noreferrer"
      className={btnGhost}
    >
      <MessageCircle className="h-4 w-4" aria-hidden />
      Escríbenos por WhatsApp
    </a>
  );

  return (
    <motion.div layout transition={{ layout: { duration: reduce ? 0 : 0.3 } }} className={`${card} p-5 md:p-8`}>
      <AnimatePresence mode="wait" initial={false}>
        {done ? (
          <motion.div
            key="success"
            role="status"
            initial={reduce ? false : { opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
            className="relative overflow-hidden py-6 text-center"
          >
            {!reduce && (
              <div aria-hidden className="pointer-events-none absolute inset-0">
                {CONFETTI.map((c, i) => (
                  <span
                    key={i}
                    className="af-confetti"
                    style={
                      {
                        "--dx": c.dx,
                        "--dy": c.dy,
                        "--delay": c.delay,
                        background: c.color,
                        rotate: c.rotate,
                      } as React.CSSProperties
                    }
                  />
                ))}
              </div>
            )}
            <svg viewBox="0 0 48 48" className="mx-auto h-24 w-24" aria-hidden>
              <motion.circle
                cx="24"
                cy="24"
                r="21"
                fill="rgb(var(--af-accent-rgb) / 0.12)"
                stroke="var(--af-accent)"
                strokeWidth="2.5"
                initial={reduce ? false : { pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 0.4, ease: "easeOut" }}
              />
              <motion.path
                d="M15 25l6 6 12-14"
                fill="none"
                stroke="var(--af-accent)"
                strokeWidth="3.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                initial={reduce ? false : { pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 0.4, delay: 0.25, ease: "easeOut" }}
              />
            </svg>
            <h3 className="mt-5 font-display text-3xl font-extrabold tracking-[-0.03em] text-(--af-text) md:text-4xl">
              ¡Listo, {done.name}!
            </h3>
            <p className="mt-2 text-base text-(--af-muted) md:text-lg">
              La academia te escribirá pronto.
            </p>
            {(whatsapp || instagramHandle) && (
              <div className="mt-7 flex flex-col justify-center gap-3 sm:flex-row">
                {whatsapp && (
                  <a
                    href={waUrl(
                      whatsapp,
                      `Hola, soy ${done.name}. Acabo de registrarme en su página web, me interesa ${done.interest}.`,
                    )}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={btnPrimary}
                  >
                    <MessageCircle className="h-5 w-5" aria-hidden />
                    Escribir por WhatsApp
                  </a>
                )}
                {instagramHandle && (
                  <a
                    href={instagramUrl(instagramHandle)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`${btnGhost} h-14`}
                  >
                    <Instagram className="h-4 w-4" aria-hidden />
                    @{cleanHandle(instagramHandle)}
                  </a>
                )}
              </div>
            )}
          </motion.div>
        ) : (
          <motion.form
            key="form"
            onSubmit={onSubmit}
            noValidate
            exit={reduce ? undefined : { opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="space-y-5"
          >
            <div className="grid gap-5 sm:grid-cols-2">
              <div>
                <Label htmlFor="reg-name">Nombre</Label>
                <input
                  id="reg-name"
                  name="name"
                  autoComplete="given-name"
                  value={values.name}
                  onChange={(e) => set("name", e.target.value)}
                  onBlur={blur("name")}
                  aria-invalid={Boolean(errorFor("name"))}
                  aria-describedby={errorFor("name") ? "reg-name-err" : undefined}
                  className={inputBase}
                  style={{ borderColor: errorFor("name") ? errorText : "var(--af-border)" }}
                />
                <FieldError id="reg-name-err" message={errorFor("name")} />
              </div>
              <div>
                <Label htmlFor="reg-last">Apellido</Label>
                <input
                  id="reg-last"
                  name="last_name"
                  autoComplete="family-name"
                  value={values.last_name}
                  onChange={(e) => set("last_name", e.target.value)}
                  onBlur={blur("last_name")}
                  aria-invalid={Boolean(errorFor("last_name"))}
                  aria-describedby={errorFor("last_name") ? "reg-last-err" : undefined}
                  className={inputBase}
                  style={{ borderColor: errorFor("last_name") ? errorText : "var(--af-border)" }}
                />
                <FieldError id="reg-last-err" message={errorFor("last_name")} />
              </div>
            </div>

            <div>
              <Label htmlFor="reg-phone">WhatsApp (10 dígitos)</Label>
              <input
                id="reg-phone"
                name="phone"
                type="tel"
                inputMode="tel"
                autoComplete="tel"
                placeholder="999 123 4567"
                maxLength={20}
                value={values.phone}
                onChange={(e) => set("phone", sanitizePhone(e.target.value, values.phone))}
                onBlur={blur("phone")}
                aria-invalid={Boolean(errorFor("phone"))}
                aria-describedby={errorFor("phone") ? "reg-phone-err" : undefined}
                className={`${inputBase} tabular-nums`}
                style={{ borderColor: errorFor("phone") ? errorText : "var(--af-border)" }}
              />
              <FieldError id="reg-phone-err" message={errorFor("phone")} />
            </div>

            <div>
              <Label htmlFor="reg-email">
                Correo <span className="font-normal text-(--af-muted)">(opcional)</span>
              </Label>
              <input
                id="reg-email"
                name="email"
                type="email"
                autoComplete="email"
                inputMode="email"
                value={values.email}
                onChange={(e) => set("email", e.target.value)}
                onBlur={blur("email")}
                aria-invalid={Boolean(errorFor("email"))}
                aria-describedby={errorFor("email") ? "reg-email-err" : undefined}
                className={inputBase}
                style={{ borderColor: errorFor("email") ? errorText : "var(--af-border)" }}
              />
              <FieldError id="reg-email-err" message={errorFor("email")} />
            </div>

            <fieldset>
              <legend className="mb-2 block text-sm font-medium text-(--af-text)">
                ¿Qué te interesa?
              </legend>
              <div className="flex flex-wrap gap-2">
                {options.map((o) => (
                  <label key={o} className="cursor-pointer">
                    <input
                      type="radio"
                      name="interest"
                      value={o}
                      checked={values.interest === o}
                      onChange={() => {
                        set("interest", o);
                        setTouched((t) => ({ ...t, interest: true }));
                      }}
                      className="peer sr-only"
                    />
                    <span className="inline-flex h-11 items-center rounded-full border border-(--af-border) px-4 text-sm font-medium text-(--af-text) transition-colors peer-checked:border-(--af-accent) peer-checked:bg-(--af-accent) peer-checked:text-(--af-ink) peer-focus-visible:ring-2 peer-focus-visible:ring-(--af-accent-text) peer-focus-visible:ring-offset-2 peer-focus-visible:ring-offset-(--af-surface) hover:border-(--af-muted)">
                      {o}
                    </span>
                  </label>
                ))}
              </div>
              <FieldError id="reg-interest-err" message={errorFor("interest")} />
            </fieldset>

            {/* Honeypot: invisible para personas, los bots lo llenan. */}
            <div aria-hidden="true" className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
              <input name="website" tabIndex={-1} autoComplete="off" />
            </div>

            <div>
              <label className="flex cursor-pointer items-start gap-3 text-sm text-(--af-muted)">
                <input
                  name="privacy_accepted"
                  type="checkbox"
                  checked={values.privacy_accepted}
                  onChange={(e) => set("privacy_accepted", e.target.checked)}
                  onBlur={blur("privacy_accepted")}
                  className="mt-0.5 h-5 w-5 shrink-0 rounded accent-(--af-accent)"
                />
                <span>
                  Acepto el{" "}
                  <a
                    href="/privacidad"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-medium text-(--af-text) underline decoration-(--af-accent) underline-offset-4"
                  >
                    aviso de privacidad
                  </a>
                  .
                </span>
              </label>
              <FieldError id="reg-privacy-err" message={errorFor("privacy_accepted")} />
            </div>

            {result?.status === "throttled" && (
              <p role="alert" className="text-sm" style={{ color: errorText }}>
                Recibimos varios registros desde tu red. Intenta más tarde o escríbenos por WhatsApp.
              </p>
            )}
            {result?.status === "error" && (
              <p role="alert" className="text-sm" style={{ color: errorText }}>
                No pudimos enviar tu registro. Revisa tu conexión e intenta de nuevo.
              </p>
            )}
            {/* Errores sin campo propio (detail / non_field_errors) caen en el mensaje general */}
            {result?.status === "invalid" && !Object.keys(serverErrors).some((k) => k in EMPTY) && (
              <p role="alert" className="text-sm" style={{ color: errorText }}>
                Revisa los datos e intenta de nuevo.
              </p>
            )}
            {(result?.status === "throttled" || result?.status === "error") && waFallback}

            <motion.button
              type="submit"
              disabled={submitting}
              whileTap={reduce ? undefined : { scale: 0.96 }}
              className={`${btnPrimary} w-full disabled:opacity-60`}
            >
              {submitting ? "Enviando…" : "Quiero inscribirme"}
            </motion.button>
          </motion.form>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
