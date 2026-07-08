"use client";

import { useEffect, useRef, Suspense } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import posthog from "posthog-js";
import { PostHogProvider } from "posthog-js/react";
import { persistUtm, getFirstTouchUrl } from "@/lib/tracking";

const BOT_RE =
  /bot|crawl|spider|slurp|facebook|twitter|whatsapp|linkedin|pinterest|telegram|discord|preview/i;

function isBot(): boolean {
  if (typeof navigator === "undefined") return true;
  return BOT_RE.test(navigator.userAgent);
}

const PH_KEY = process.env.NEXT_PUBLIC_POSTHOG_KEY ?? "";

function PostHogInit() {
  useEffect(() => {
    if (!PH_KEY || isBot()) return;

    // Init diferido: PostHog no necesita arrancar durante la ventana de carga,
    // y su costo de JS en móvil retrasa el LCP si corre junto a la hidratación.
    let started = false;
    const start = () => {
      if (started) return;
      started = true;
      posthog.init(PH_KEY, {
        api_host: "https://us.i.posthog.com",
        ui_host: "https://us.posthog.com",
        capture_pageview: false,
        capture_pageleave: true,
        person_profiles: "identified_only",
        persistence: "localStorage+cookie",
      });

      persistUtm();
      getFirstTouchUrl();

      // Pageview inicial (PostHogPageview solo captura cambios de ruta
      // posteriores; antes del init las capturas se perderían).
      posthog.capture("$pageview", { $current_url: window.location.href });
    };

    if ("requestIdleCallback" in window) {
      requestIdleCallback(start, { timeout: 5000 });
    } else {
      setTimeout(start, 3000);
    }
  }, []);
  return null;
}

function PostHogPageview() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const lastUrl = useRef("");

  useEffect(() => {
    const url = pathname + (searchParams?.toString() ? `?${searchParams}` : "");
    if (url !== lastUrl.current) {
      // El pageview inicial lo captura PostHogInit tras el init diferido;
      // aquí solo los cambios de ruta posteriores.
      const isFirst = lastUrl.current === "";
      lastUrl.current = url;
      if (!isFirst) {
        posthog.capture("$pageview", {
          $current_url: window.location.origin + url,
        });
      }
    }
  }, [pathname, searchParams]);

  return null;
}

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <PostHogProvider client={posthog}>
      <PostHogInit />
      <Suspense fallback={null}>
        <PostHogPageview />
      </Suspense>
      {children}
    </PostHogProvider>
  );
}
