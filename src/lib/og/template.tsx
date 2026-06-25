import { OG_COLORS } from "@/lib/og/constants";
import { SITE_NAME } from "@/lib/seo";

export type OgImageVariant =
  | "default"
  | "country"
  | "visa"
  | "compare"
  | "guide"
  | "tool";

export type OgImageProps = {
  title: string;
  subtitle?: string;
  eyebrow?: string;
  flags?: string[];
  variant?: OgImageVariant;
};

function truncateTitle(text: string, maxLength: number): string {
  if (text.length <= maxLength) {
    return text;
  }

  const truncated = text.slice(0, maxLength + 1);
  const lastSpace = truncated.lastIndexOf(" ");
  return `${(lastSpace > 40 ? truncated.slice(0, lastSpace) : text.slice(0, maxLength)).trim()}…`;
}

function FlagRow({ flags }: { flags: string[] }) {
  if (flags.length === 0) {
    return null;
  }

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: flags.length > 1 ? 20 : 0,
        marginBottom: 28,
      }}
    >
      {flags.map((flag, index) => (
        <div
          key={`${flag}-${index}`}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 12,
          }}
        >
          {index > 0 && flags.length === 2 && (
            <span
              style={{
                fontSize: 28,
                fontWeight: 600,
                color: OG_COLORS.muted,
              }}
            >
              vs
            </span>
          )}
          <span style={{ fontSize: 56, lineHeight: 1 }}>{flag}</span>
        </div>
      ))}
    </div>
  );
}

export function OgImage({
  title,
  subtitle,
  eyebrow,
  flags = [],
  variant = "default",
}: OgImageProps) {
  const displayTitle = truncateTitle(title, 90);
  const displaySubtitle = subtitle ? truncateTitle(subtitle, 120) : undefined;

  const accentColor =
    variant === "guide"
      ? "#185fa5"
      : variant === "tool"
        ? "#2d7a4f"
        : OG_COLORS.primary;

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        position: "relative",
        background: `linear-gradient(135deg, ${OG_COLORS.navy} 0%, ${OG_COLORS.navyMid} 52%, #0d4a82 100%)`,
        padding: "56px 64px",
        fontFamily:
          'ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, sans-serif',
      }}
    >
      {/* Decorative editorial panel */}
      <div
        style={{
          position: "absolute",
          top: 0,
          right: 0,
          width: 420,
          height: "100%",
          background: `linear-gradient(90deg, transparent 0%, ${OG_COLORS.accentLine} 100%)`,
          opacity: 0.6,
        }}
      />

      <div style={{ display: "flex", flexDirection: "column", flex: 1 }}>
        {/* Brand lockup */}
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div
            style={{
              width: 10,
              height: 10,
              borderRadius: "50%",
              background: accentColor,
            }}
          />
          <span
            style={{
              fontSize: 22,
              fontWeight: 700,
              letterSpacing: "-0.02em",
              color: OG_COLORS.white,
            }}
          >
            nomad
            <span style={{ color: accentColor }}>index</span>
          </span>
          <span
            style={{
              fontSize: 14,
              fontWeight: 500,
              color: OG_COLORS.muted,
              marginLeft: 8,
            }}
          >
            {SITE_NAME}
          </span>
        </div>

        <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center", maxWidth: 980 }}>
          {eyebrow && (
            <p
              style={{
                fontSize: 16,
                fontWeight: 600,
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                color: accentColor,
                margin: "0 0 20px 0",
              }}
            >
              {eyebrow}
            </p>
          )}

          <FlagRow flags={flags} />

          <h1
            style={{
              fontSize: displayTitle.length > 60 ? 48 : 56,
              fontWeight: 700,
              lineHeight: 1.12,
              letterSpacing: "-0.03em",
              color: OG_COLORS.white,
              margin: 0,
            }}
          >
            {displayTitle}
          </h1>

          {displaySubtitle && (
            <p
              style={{
                fontSize: 24,
                lineHeight: 1.4,
                color: OG_COLORS.primarySoft,
                margin: "20px 0 0 0",
                opacity: 0.92,
              }}
            >
              {displaySubtitle}
            </p>
          )}
        </div>
      </div>

      {/* Footer rule */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          borderTop: `1px solid ${OG_COLORS.accentLine}`,
          paddingTop: 24,
        }}
      >
        <span style={{ fontSize: 16, color: OG_COLORS.muted }}>
          nomadindex.app
        </span>
        <span style={{ fontSize: 14, color: OG_COLORS.muted }}>
          Visas · Residency · Remote Work
        </span>
      </div>
    </div>
  );
}
