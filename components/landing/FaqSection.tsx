"use client";

import { motion } from "motion/react";
import { SectionTracker } from "./SectionTracker";
import { trackEvent } from "@/lib/tracking";
import { FAQS } from "./faqs";

export function FaqSection() {
  return (
    <SectionTracker sectionId="faq" className="py-16 md:py-24">
      <div className="mx-auto max-w-3xl px-4 md:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h2 className="text-2xl md:text-3xl font-extrabold text-foreground mb-3">
            Preguntas frecuentes
          </h2>
        </motion.div>

        <div className="space-y-3">
          {FAQS.map((faq, i) => (
            <motion.details
              key={faq.question}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.4, delay: i * 0.05 }}
              className="group rounded-2xl border border-border bg-card overflow-hidden"
              onToggle={(e) => {
                if ((e.target as HTMLDetailsElement).open) {
                  trackEvent("faq_open", { question: faq.question });
                }
              }}
            >
              <summary className="cursor-pointer list-none px-5 py-4 font-bold text-foreground flex items-center justify-between gap-3 [&::-webkit-details-marker]:hidden">
                {faq.question}
                <span className="text-primary text-xl leading-none shrink-0 transition-transform group-open:rotate-45">
                  +
                </span>
              </summary>
              <p className="px-5 pb-5 text-sm md:text-base text-muted-foreground leading-relaxed">
                {faq.answer}
              </p>
            </motion.details>
          ))}
        </div>
      </div>
    </SectionTracker>
  );
}
