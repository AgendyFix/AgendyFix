"use client";

import { useState } from "react";
import { MessageCircle } from "lucide-react";
import {
  registerForAcademy,
  waUrl,
  type RegisterResult,
} from "@/lib/academies";
import { trackEvent } from "@/lib/tracking";

const OTHER_INTERESTS = ["Clase muestra", "Otro"];

const inputClass =
  "w-full rounded-xl border border-input bg-background px-4 py-3 text-base text-foreground outline-none focus:border-primary focus:ring-2 focus:ring-primary/30";

function Field({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-medium text-foreground">
        {label}
      </span>
      {children}
      {error && <span className="mt-1 block text-sm text-destructive">{error}</span>}
    </label>
  );
}

type Props = {
  slug: string;
  disciplines: string[];
  whatsapp: string | null;
};

export function RegisterForm({ slug, disciplines, whatsapp }: Props) {
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<RegisterResult | null>(null);
  const [firstName, setFirstName] = useState("");

  const fieldErrors = result?.status === "invalid" ? result.fieldErrors : {};
  const waButton = whatsapp && (
    <a
      href={waUrl(whatsapp)}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center gap-2 rounded-full bg-[#25D366] px-6 py-3 font-semibold text-white"
    >
      <MessageCircle className="h-5 w-5" />
      Escríbenos por WhatsApp
    </a>
  );

  if (result?.status === "ok") {
    return (
      <div className="rounded-2xl border border-border bg-card p-6 text-center space-y-4">
        <p className="text-lg font-semibold text-foreground">
          ¡Listo, {firstName}! La academia te contactará pronto.
        </p>
        {waButton}
      </div>
    );
  }

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const text = (key: string) => String(form.get(key) ?? "").trim();

    setSubmitting(true);
    const res = await registerForAcademy(slug, {
      name: text("name"),
      last_name: text("last_name"),
      phone: text("phone"),
      email: text("email"),
      interest: text("interest"),
      privacy_accepted: form.get("privacy_accepted") === "on",
      website: text("website"),
    });
    setSubmitting(false);
    setResult(res);
    if (res.status === "ok") {
      setFirstName(text("name"));
      trackEvent("academy_register_submitted", { slug });
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Nombre" error={fieldErrors.name}>
          <input name="name" required autoComplete="given-name" className={inputClass} />
        </Field>
        <Field label="Apellido" error={fieldErrors.last_name}>
          <input name="last_name" required autoComplete="family-name" className={inputClass} />
        </Field>
      </div>
      <Field label="Teléfono (10 dígitos)" error={fieldErrors.phone}>
        <input
          name="phone"
          type="tel"
          inputMode="numeric"
          required
          // Acepta "999 123 4567" o "999-123-4567"; el API normaliza a 10 dígitos
          pattern="[0-9 ()\-]{10,16}"
          maxLength={16}
          autoComplete="tel-national"
          className={inputClass}
        />
      </Field>
      <Field label="Correo (opcional)" error={fieldErrors.email}>
        <input name="email" type="email" autoComplete="email" className={inputClass} />
      </Field>
      <Field label="¿Qué te interesa?" error={fieldErrors.interest}>
        <select name="interest" required defaultValue="" className={inputClass}>
          <option value="" disabled>
            Selecciona una opción
          </option>
          {[...disciplines, ...OTHER_INTERESTS].map((o) => (
            <option key={o} value={o}>
              {o}
            </option>
          ))}
        </select>
      </Field>

      {/* Honeypot: invisible para personas, los bots lo llenan. */}
      <div aria-hidden="true" className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
        <input name="website" tabIndex={-1} autoComplete="off" />
      </div>

      <label className="flex items-start gap-3 text-sm text-muted-foreground">
        <input
          name="privacy_accepted"
          type="checkbox"
          required
          className="mt-1 h-4 w-4 accent-primary"
        />
        <span>
          Acepto el{" "}
          <a href="/privacidad" target="_blank" className="underline text-primary">
            aviso de privacidad
          </a>
          .
        </span>
      </label>
      {fieldErrors.privacy_accepted && (
        <p className="text-sm text-destructive">{fieldErrors.privacy_accepted}</p>
      )}

      {result?.status === "throttled" && (
        <p role="alert" className="text-sm text-destructive">
          Recibimos varios registros desde tu red, intenta más tarde o escríbenos por WhatsApp.
        </p>
      )}
      {result?.status === "error" && (
        <p role="alert" className="text-sm text-destructive">
          No pudimos enviar tu registro. Revisa tu conexión e intenta de nuevo.
        </p>
      )}
      {result?.status === "invalid" && Object.keys(fieldErrors).length === 0 && (
        <p role="alert" className="text-sm text-destructive">
          Revisa los datos e intenta de nuevo.
        </p>
      )}
      {(result?.status === "throttled" || result?.status === "error") && waButton}

      <button
        type="submit"
        disabled={submitting}
        className="w-full rounded-full bg-primary px-8 py-3.5 text-base font-semibold text-primary-foreground shadow-lg transition hover:brightness-105 disabled:opacity-60"
      >
        {submitting ? "Enviando..." : "Inscribirme"}
      </button>
    </form>
  );
}
