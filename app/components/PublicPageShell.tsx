import type { ReactNode } from "react";
import { PublicFooter } from "./PublicFooter";
import { PublicHeader } from "./PublicHeader";
import { SocialRail } from "./SocialRail";

export function PublicPageShell({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <main className="portalSite">
      <PublicHeader />
      <SocialRail />
      <div className="portalContent">{children}</div>
      <PublicFooter />
    </main>
  );
}
