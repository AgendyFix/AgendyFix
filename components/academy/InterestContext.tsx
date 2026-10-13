"use client";

import { createContext, useCallback, useContext, useMemo, useState } from "react";

type InterestContextValue = {
  /** Interés elegido fuera del formulario ("Quiero este grupo", promo). */
  interest: string | null;
  /** Fija el interés y baja al formulario. */
  choose: (label: string) => void;
};

const InterestContext = createContext<InterestContextValue>({
  interest: null,
  choose: () => {},
});

export function scrollToForm() {
  const el = document.getElementById("inscripcion");
  if (!el) return;
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  el.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "start" });
}

export function InterestProvider({ children }: { children: React.ReactNode }) {
  const [interest, setInterest] = useState<string | null>(null);
  const choose = useCallback((label: string) => {
    setInterest(label);
    scrollToForm();
  }, []);
  const value = useMemo(() => ({ interest, choose }), [interest, choose]);
  return (
    <InterestContext.Provider value={value}>{children}</InterestContext.Provider>
  );
}

export function useInterest(): InterestContextValue {
  return useContext(InterestContext);
}
