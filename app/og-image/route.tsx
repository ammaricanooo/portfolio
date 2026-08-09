import { ImageResponse } from "next/og";

export const runtime = "edge";
export const contentType = "image/png";
export const size = { width: 1200, height: 630 };

export async function GET() {
  return new ImageResponse(
    (
      <div
        style={{
          background: "#09090b",
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          justifyContent: "flex-end",
          padding: "80px",
          fontFamily: "serif",
        }}
      >
        {/* Top label */}
        <div
          style={{
            position: "absolute",
            top: "80px",
            left: "80px",
            display: "flex",
            gap: "32px",
            alignItems: "center",
          }}
        >
          <span
            style={{
              fontFamily: "monospace",
              fontSize: "12px",
              letterSpacing: "0.2em",
              textTransform: "uppercase",
              color: "#52525b",
            }}
          >
            ammaricano.my.id
          </span>
          <span
            style={{
              fontFamily: "monospace",
              fontSize: "12px",
              letterSpacing: "0.2em",
              textTransform: "uppercase",
              color: "#52525b",
            }}
          >
            Software Engineer
          </span>
        </div>

        {/* Main name */}
        <div
          style={{
            fontSize: "96px",
            fontWeight: "700",
            color: "#fafafa",
            lineHeight: 1,
            letterSpacing: "-0.03em",
            textTransform: "uppercase",
            marginBottom: "24px",
          }}
        >
          Ammar
          <br />
          Abdul Malik
        </div>

        {/* Bottom descriptor */}
        <div
          style={{
            fontFamily: "monospace",
            fontSize: "14px",
            letterSpacing: "0.15em",
            textTransform: "uppercase",
            color: "#71717a",
          }}
        >
          Full-Stack · Next.js · Laravel · Node.js · Bogor, Indonesia
        </div>
      </div>
    ),
    { ...size }
  );
}
