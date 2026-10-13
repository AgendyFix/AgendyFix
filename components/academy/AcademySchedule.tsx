import { User } from "lucide-react";
import {
  formatSchedule,
  groupByDiscipline,
  sortedSchedules,
  type Academy,
} from "@/lib/academies";
import { AcademySection } from "./AcademySection";

export function AcademySchedule({ academy }: { academy: Academy }) {
  const sections = groupByDiscipline(academy);

  return (
    <AcademySection title="Clases y horarios">
      {sections.length === 0 ? (
        <p className="text-muted-foreground">
          Pregunta por horarios disponibles
        </p>
      ) : (
        <div className="space-y-8">
          {sections.map((section) => (
            <div key={section.key}>
              <h3 className="mb-3 text-sm font-bold uppercase tracking-wider text-primary">
                {section.name}
              </h3>
              <div className="grid gap-3 sm:grid-cols-2">
                {section.groups.map((group) => (
                  <article
                    key={group.id}
                    className="rounded-2xl border border-border bg-card p-5"
                  >
                    <h4 className="font-bold text-foreground">{group.name}</h4>
                    <p className="mt-1 text-sm text-muted-foreground">
                      {group.level_display}
                    </p>
                    {group.instructor_name && (
                      <p className="mt-1 flex items-center gap-1.5 text-sm text-muted-foreground">
                        <User className="h-3.5 w-3.5" />
                        {group.instructor_name}
                      </p>
                    )}
                    <ul className="mt-3 space-y-1 text-sm font-medium text-foreground">
                      {sortedSchedules(group).map((s) => (
                        <li key={`${s.day_of_week}-${s.start_time}`}>
                          {formatSchedule(s)}
                        </li>
                      ))}
                    </ul>
                  </article>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </AcademySection>
  );
}
