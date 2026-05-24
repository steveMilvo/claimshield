import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "ClaimShield — Your AI insurance claim negotiator",
    short_name: "ClaimShield",
    description:
      "Reads your policy, picks apart the denial, drafts your appeal in 60 seconds.",
    start_url: "/",
    scope: "/",
    display: "standalone",
    orientation: "portrait",
    background_color: "#F6F9FC",
    theme_color: "#0A3173",
    categories: ["finance", "productivity", "utilities"],
    icons: [
      {
        src: "/icon.svg",
        sizes: "any",
        type: "image/svg+xml",
        purpose: "any",
      },
      {
        src: "/apple-icon",
        sizes: "180x180",
        type: "image/png",
        purpose: "any",
      },
    ],
  };
}
