import { ImageResponse } from "next/og";
import { siteConfig } from "@/lib/seo/config";

export const alt = "Doxa - Watches";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/**
 * Site-wide social-share card for every page that doesn't set its own
 * openGraph.images (product pages override this with a real product photo -
 * see watches/[id]'s generateMetadata). Dark/ink-inverse to match the
 * storefront's default theme; flat, bordered, zero-radius, no gradients -
 * same rules as everywhere else in DESIGN.md.
 */
export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "80px",
          backgroundColor: "#0a0a0a",
        }}
      >
        <div
          style={{
            display: "flex",
            fontSize: 108,
            fontWeight: 700,
            letterSpacing: "0.2em",
            color: "#fafafa",
          }}
        >
          DOXA
        </div>
        <div
          style={{
            display: "flex",
            marginTop: 32,
            fontSize: 34,
            fontWeight: 500,
            color: "#a1a1aa",
          }}
        >
          {siteConfig.tagline}
        </div>
        <div
          style={{
            display: "flex",
            position: "absolute",
            left: 80,
            right: 80,
            bottom: 80,
            height: 1,
            backgroundColor: "#27272a",
          }}
        />
      </div>
    ),
    { ...size },
  );
}
