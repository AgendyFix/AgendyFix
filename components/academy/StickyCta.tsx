"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { MessageCircle } from "lucide-react";
import { waUrl } from "@/lib/academies";

type Props = {
  label: string;
  whatsapp: string | null;
  whatsappText: string;
};

/**
 * Barra fija inferior (móvil) que aparece cuando el CTA del hero sale de vista
 * y se oculta mientras el formulario está visible.
 */
export function StickyCta({ label, whatsapp, whatsappText }: Props) {
  const [heroVisible, setHeroVisible] = useState(true);
  const [formVisible, setFormVisible] = useState(false);
  const reduce = useReducedMotion();

  useEffect(() => {
    const hero = document.querySelector("[data-hero-cta]");
    const form = document.getElementById("inscripcion");
    if (!hero || !form) return;
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.target === hero) setHeroVisible(e.isIntersecting);
          if (e.target === form) setFormVisible(e.isIntersecting);
        }
      },
      { threshold: 0.05 },
    );
    io.observe(hero);
    io.observe(form);
    return () => io.disconnect();
  }, []);

  const show = !heroVisible && !formVisible;

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={reduce ? { opacity: 0 } : { y: 96 }}
          animate={reduce ? { opacity: 1 } : { y: 0 }}
          exit={reduce ? { opacity: 0 } : { y: 96 }}
          transition={{ type: "spring", stiffness: 400, damping: 30 }}
          className="fixed inset-x-0 bottom-0 z-40 border-t border-(--af-border) bg-[rgb(11_10_16/0.94)] pb-[env(safe-area-inset-bottom)] md:hidden"
        >
          <div className="flex items-center gap-2 px-4 py-3">
            <a
              href="#inscripcion"
              className="inline-flex h-12 flex-1 items-center justify-center rounded-full bg-(--af-accent) px-6 text-base font-semibold text-(--af-ink) active:scale-[0.97]"
            >
              {label}
            </a>
            {whatsapp && (
              <a
                href={waUrl(whatsapp, whatsappText)}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Escribir por WhatsApp"
                className="inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-white/20 bg-white/5 text-(--af-text) active:scale-[0.97]"
              >
                <MessageCircle className="h-5 w-5" aria-hidden />
              </a>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
