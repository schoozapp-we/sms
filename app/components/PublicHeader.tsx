import Link from "next/link";
import { ChevronDown, Phone, Shield } from "lucide-react";
import { portals, schoolProfile } from "../data/schoolSite";

const navItems = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  { label: "Academics", href: "/academics" },
  { label: "Admission", href: "/admission" },
  { label: "Facilities", href: "/facilities" },
  { label: "Gallery", href: "/gallery" },
  { label: "Contact", href: "/contact" }
];

export function PublicHeader() {
  return (
    <header className="portalSiteHeader">
      <Link href="/" className="portalBrand" aria-label="Bright Future School home">
        <span>
          <Shield size={20} />
        </span>
        <div>
            <strong>{schoolProfile.shortName}</strong>
            <small>{schoolProfile.tagline}</small>
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
        <a href={schoolProfile.phoneHref} className="portalCallLink">
          <Phone size={15} /> {schoolProfile.phone}
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
    </header>
  );
}
