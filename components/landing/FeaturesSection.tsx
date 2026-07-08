"use client";

import { motion } from "motion/react";
import {
  Users,
  CreditCard,
  CalendarDays,
  Bell,
  GraduationCap,
  BarChart3,
} from "lucide-react";
import { SectionTracker } from "./SectionTracker";

const FEATURES = [
  {
    icon: Users,
    title: "Gestion de alumnos",
    description:
      "Directorio completo con datos de contacto, grupo asignado e historial de pagos de cada alumno. Todo accesible en un click.",
  },
  {
    icon: CreditCard,
    title: "Control de pagos",
    description:
      "Visualiza al instante quien pago, quien esta vencido y cuanto se debe. Los pagos del mes se generan solos, sin que hagas nada.",
  },
  {
    icon: CalendarDays,
    title: "Grupos y horarios",
    description:
      "Organiza tus grupos con nombre, nivel, horario, instructor y mensualidad. Tu academia configurada en minutos.",
  },
  {
    icon: Bell,
    title: "Recordatorios por WhatsApp",
    description:
      "Recordatorio automatico 5 dias antes del vencimiento y aviso de pago vencido, directo al WhatsApp de tus alumnos.",
  },
  {
    icon: GraduationCap,
    title: "Inscripciones en segundos",
    description:
      "Da de alta a un alumno, asignalo a su grupo y define su dia de pago. El sistema lleva el control desde ese momento.",
  },
  {
    icon: BarChart3,
    title: "Reportes y metricas",
    description:
      "Dashboard en tiempo real: alumnos activos, ingresos del mes y pagos pendientes de cobrar. Decisiones con datos, no con intuicion.",
  },
];

export function FeaturesSection() {
  return (
    <SectionTracker sectionId="features" className="py-16 md:py-24">
      <div className="mx-auto max-w-6xl px-4 md:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h2 className="text-2xl md:text-3xl font-extrabold text-foreground mb-3">
            Todo lo que necesitas en un solo lugar
          </h2>
          <p className="text-muted-foreground text-base md:text-lg max-w-2xl mx-auto">
            Funcionalidades disenadas para academias de musica, danza, yoga, idiomas,
            artes marciales y cualquier espacio educativo.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {FEATURES.map((feat, i) => (
            <motion.div
              key={feat.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.4, delay: i * 0.08 }}
              className="group rounded-2xl border border-border bg-card p-6 hover:border-primary/30 hover:shadow-md transition-all"
            >
              <div className="flex items-center justify-center h-11 w-11 rounded-xl bg-primary/10 text-primary mb-4 group-hover:bg-primary/15 transition-colors">
                <feat.icon className="h-5 w-5" />
              </div>
              <h3 className="font-bold text-foreground mb-2">{feat.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {feat.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </SectionTracker>
  );
}
