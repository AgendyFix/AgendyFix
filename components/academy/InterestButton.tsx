"use client";

import { motion, useReducedMotion } from "motion/react";
import { trackEvent } from "@/lib/tracking";
import { useInterest } from "./InterestContext";

type Props = {
  /** Texto que se preselecciona como interés en el formulario. */
  interest: string;
  source: "group" | "promo";
  className?: string;
  children: React.ReactNode;
};

/** Botón que preselecciona el interés y baja al formulario de inscripción. */
export function InterestButton({ interest, source, className, children }: Props) {
  const { choose } = useInterest();
  const reduce = useReducedMotion();
  return (
    <motion.button
      type="button"
      whileTap={reduce ? undefined : { scale: 0.96 }}
      onClick={() => {
        trackEvent("academy_interest_selected", { interest, source });
        choose(interest);
      }}
      className={className}
    >
      {children}
    </motion.button>
  );
}
