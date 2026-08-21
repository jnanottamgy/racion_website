import { ImageResponse } from "next/og";
import { totalCourts, totalSites } from "@/content/projects";
import { site } from "@/lib/site";

export const alt = `${site.name} — ${site.tagline}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/**
 * Share card.
 *
 * Rendered at build time rather than shipped as a static PNG so the court count
 * can never go stale against the project schedule — the number on the card and
 * the number on the site come from the same array.
 */
export default function OpengraphImage() {
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
          background:
            "radial-gradient(ellipse 90% 70% at 20% -10%, #2a1035 0%, #0c0710 62%)",
          color: "#f3efe9",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
          <div
            style={{
              width: 14,
              height: 14,
              background: "#65c100",
              borderRadius: 999,
              display: "flex",
            }}
          />
          <div
            style={{
              fontSize: 22,
              letterSpacing: 6,
              textTransform: "uppercase",
              color: "#a8a0ac",
              display: "flex",
            }}
          >
            {site.legalName}
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 26 }}>
          <div
            style={{
              fontSize: 104,
              lineHeight: 1,
              letterSpacing: -3,
              fontWeight: 700,
              display: "flex",
            }}
          >
            {site.tagline}
          </div>
          <div
            style={{
              fontSize: 30,
              color: "#a8a0ac",
              maxWidth: 880,
              lineHeight: 1.4,
              display: "flex",
            }}
          >
            African teak badminton and squash courts on an interlocked pine
            framework — flooring, lighting, poles and nets on one contract.
          </div>
        </div>

        <div style={{ display: "flex", gap: 64, alignItems: "flex-end" }}>
          <Stat label="Courts" value={String(totalCourts)} accent />
          <Stat label="Sites" value={String(totalSites)} />
          <div
            style={{
              marginLeft: "auto",
              fontSize: 24,
              color: "#8a8090",
              display: "flex",
            }}
          >
            Bangalore, Karnataka
          </div>
        </div>
      </div>
    ),
    size,
  );
}

function Stat({
  label,
  value,
  accent = false,
}: {
  label: string;
  value: string;
  accent?: boolean;
}) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
      <div
        style={{
          fontSize: 18,
          letterSpacing: 4,
          textTransform: "uppercase",
          color: "#8a8090",
          display: "flex",
        }}
      >
        {label}
      </div>
      <div
        style={{
          fontSize: 64,
          fontWeight: 700,
          color: accent ? "#8be034" : "#f3efe9",
          display: "flex",
        }}
      >
        {value}
      </div>
    </div>
  );
}
