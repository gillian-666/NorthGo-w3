import type { ReactNode } from "react";
import { metadata as studioMetadata, viewport as studioViewport } from "next-sanity/studio";

export const metadata = {
  ...studioMetadata,
  title: "Northgo CMS",
};

export const viewport = studioViewport;

export default function StudioLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-[color:var(--navy-deep)]">{children}</div>
  );
}
