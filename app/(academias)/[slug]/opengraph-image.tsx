import { ImageResponse } from "next/og";
import { getAcademy } from "@/lib/academies";
import { buildAcademyTheme, initials } from "@/lib/theme";

export const alt = "Página de la academia";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

type Props = { params: Promise<{ slug: string }> };

/** Imagen OG por academia con su tema (acento + apoyo sobre fondo oscuro). */
export default async function OpenGraphImage({ params }: Props) {
  const { slug } = await params;
  const academy = await getAcademy(slug);
  const name = academy?.name ?? "Academia";
  const theme = buildAcademyTheme(academy?.accent_color ?? null, slug);
  const disciplines = academy?.disciplines.slice(0, 5).map((d) => d.name) ?? [];
  const nameSize = name.length <= 14 ? 132 : name.length <= 24 ? 104 : 76;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: 72,
          color: theme.text,
          fontFamily: "sans-serif",
          backgroundColor: theme.bg,
          backgroundImage: `radial-gradient(circle at 92% 4%, ${theme.accent} 0%, ${theme.bg} 55%), radial-gradient(circle at 4% 100%, ${theme.support} 0%, ${theme.bg} 50%)`,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 24 }}>
          {academy?.logo_url ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={academy.logo_url}
              alt=""
              width={96}
              height={96}
              style={{ width: 96, height: 96, borderRadius: 28, background: "#fff", objectFit: "contain" }}
            />
          ) : (
            <div
              style={{
                width: 96,
                height: 96,
                borderRadius: 28,
                background: theme.accent,
                color: theme.accentInk,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 40,
                fontWeight: 800,
              }}
            >
              {initials(name)}
            </div>
          )}
          {academy?.instagram_handle && (
            <div style={{ fontSize: 28, opacity: 0.85 }}>@{academy.instagram_handle.replace(/^@/, "")}</div>
          )}
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          {disciplines.length > 0 && (
            <div style={{ display: "flex", gap: 12 }}>
              {disciplines.map((d) => (
                <div
                  key={d}
                  style={{
                    fontSize: 22,
                    padding: "8px 18px",
                    borderRadius: 999,
                    border: "2px solid rgba(255,255,255,0.3)",
                  }}
                >
                  {d}
                </div>
              ))}
            </div>
          )}
          <div
            style={{
              fontSize: nameSize,
              fontWeight: 800,
              lineHeight: 0.95,
              letterSpacing: -4,
              maxWidth: 1000,
            }}
          >
            {name}
          </div>
          {academy?.tagline && (
            <div style={{ fontSize: 30, opacity: 0.85, maxWidth: 900 }}>{academy.tagline}</div>
          )}
        </div>
      </div>
    ),
    { ...size },
  );
}
