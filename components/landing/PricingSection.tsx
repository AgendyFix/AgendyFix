"use client";

import { motion } from "motion/react";
import { Check } from "lucide-react";
import { SectionTracker } from "./SectionTracker";
import { trackEvent } from "@/lib/tracking";

const PLANS = [
  {
    name: "50 alumnos",
    price: "1,250",
    description: "Academia pequeña arrancando",
    featured: false,
    features: [
      "Alumnos e inscripciones ilimitadas",
      "Grupos y horarios ilimitados",
      "Control de pagos mensuales",
      "WhatsApp automático incluido",
      "Dashboard con métricas",
    ],
  },
  {
    name: "100 alumnos",
    price: "2,500",
    description: "Academia en crecimiento",
    featured: true,
    features: [
      "Todo lo del plan anterior",
      "Instructores y especialidades",
      "Reportes de cobranza",
      "Tracking de entrega WhatsApp",
      "Soporte prioritario",
    ],
  },
  {
    name: "200+ alumnos",
    price: "5,000",
    description: "Academia consolidada",
    featured: false,
    features: [
      "Todo lo anterior incluido",
      "Multi-sucursal",
      "Analytics avanzado",
      "Onboarding personalizado",
      "Account manager dedicado",
    ],
  },
];

export function PricingSection() {
  return (
    <SectionTracker sectionId="pricing" className="py-16 md:py-24 bg-muted/40">
      <div className="mx-auto max-w-6xl px-4 md:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h2 className="text-2xl md:text-3xl font-extrabold text-foreground mb-3">
            Precio simple, sin sorpresas
          </h2>
          <p className="text-muted-foreground text-base md:text-lg max-w-2xl mx-auto">
            $25 MXN por alumno activo al mes. Sin membresías fijas, sin costos
            ocultos. Primer mes gratis, sin tarjeta de crédito.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 items-stretch">
          {PLANS.map((plan, i) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.4, delay: i * 0.08 }}
              className={`relative flex flex-col rounded-2xl border bg-card p-6 ${
                plan.featured
                  ? "border-primary shadow-lg shadow-primary/10"
                  : "border-border"
              }`}
            >
              {plan.featured && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-primary px-3 py-1 text-xs font-bold text-primary-foreground">
                  MÁS COMÚN
                </span>
              )}
              <h3 className="font-bold text-foreground mb-2">{plan.name}</h3>
              <div className="mb-1">
                <span className="text-3xl md:text-4xl font-extrabold text-foreground">
                  ${plan.price}
                </span>
                <span className="text-sm text-muted-foreground"> MXN/mes</span>
              </div>
              <p className="text-sm text-muted-foreground mb-5">
                {plan.description}
              </p>
              <ul className="space-y-2.5 mb-6 flex-1">
                {plan.features.map((feature) => (
                  <li
                    key={feature}
                    className="flex items-start gap-2 text-sm text-muted-foreground"
                  >
                    <Check className="h-4 w-4 mt-0.5 shrink-0 text-primary" />
                    {feature}
                  </li>
                ))}
              </ul>
              <a
                href="https://app.agendyfix.com"
                target="_blank"
                rel="noopener noreferrer"
                onClick={() =>
                  trackEvent("cta_click", {
                    location: "pricing",
                    plan: plan.name,
                  })
                }
                className={`block rounded-xl px-5 py-3 text-center text-sm font-bold transition-colors ${
                  plan.featured
                    ? "bg-primary text-primary-foreground hover:bg-primary/90"
                    : "border border-border text-foreground hover:border-primary/40 hover:text-primary"
                }`}
              >
                Empezar gratis
              </a>
            </motion.div>
          ))}
        </div>

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-center text-sm text-muted-foreground mt-8"
        >
          Solo pagas por tus alumnos activos inscritos: $25 MXN × alumno, cada
          mes. Prueba 30 días sin costo.
        </motion.p>
      </div>
    </SectionTracker>
  );
}
