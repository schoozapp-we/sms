import Link from "next/link";
import { ChevronDown, Menu, Phone, Shield } from "lucide-react";
import { portals } from "../data/schoolSite";
import { getWebsiteContent } from "@/lib/server/websiteContent";

const navItems = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  { label: "Academics", href: "/academics" },
  { label: "Admission", href: "/admission" },
  { label: "Facilities", href: "/facilities" },
  { label: "Gallery", href: "/gallery" },
  { label: "Contact", href: "/contact" }
];

export async function PublicHeader() {
  const content = await getWebsiteContent();
  const phoneHref = `tel:${content.phone.replace(/[^\d+]/g, "")}`;

  return (
    <header className="portalSiteHeader">
      <Link href="/" className="portalBrand" aria-label="Bright Future School home">
        <span>
          <Shield size={20} />
        </span>
        <div>
            <strong>{content.shortName}</strong>
            <small>{content.tagline}</small>
        </div>
      </Link>

      <nav className="portalNav" aria-label="Main navigation">
        {navItems.map((item) => (
          <Link key={item.href} href={item.href}>
            {item.label}
          </Link>
        ))}
      </nav>

      <div className="portalHeaderActions">
        <a href={phoneHref} className="portalCallLink">
          <Phone size={15} /> {content.phone}
        </a>
        <details className="portalMenu">
          <summary>
            <Link href="/portal-login">Portal Login</Link> <ChevronDown size={14} />
          </summary>
          <div className="portalMenuList">
            {portals.map((portal) => (
              <Link key={portal.href} href={portal.href}>
                {portal.label}
              </Link>
            ))}
          </div>
        </details>
      </div>

      <details className="portalMobileMenu">
        <summary aria-label="Open navigation menu">
          <Menu size={22} />
        </summary>
        <div className="portalMobileMenuPanel">
          <nav aria-label="Mobile navigation">
            {navItems.map((item) => (
              <Link key={item.href} href={item.href}>
                {item.label}
              </Link>
            ))}
          </nav>
          <div className="portalMobilePortalLinks">
            <Link href="/portal-login">Portal Login</Link>
            {portals.map((portal) => (
              <Link key={portal.href} href={portal.href}>
                {portal.label}
              </Link>
            ))}
          </div>
          <a href={phoneHref} className="portalMobileCallLink">
            <Phone size={15} /> {content.phone}
          </a>
        </div>
      </details>
    </header>
  );
}
