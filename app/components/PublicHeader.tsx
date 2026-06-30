import Link from "next/link";
import { ChevronDown, Phone, Shield } from "lucide-react";

const navItems = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  { label: "Academics", href: "/academics" },
  { label: "Admission", href: "/admission" },
  { label: "Facilities", href: "/facilities" },
  { label: "Gallery", href: "/gallery" },
  { label: "Contact", href: "/contact" }
];

const portals = [
  { label: "Student Portal", href: "/student/login" },
  { label: "Parent Portal", href: "/parent/login" },
  { label: "Teacher Portal", href: "/teacher/login" },
  { label: "Staff Portal", href: "/staff/login" },
  { label: "Admin Portal", href: "/admin/login" }
];

export function PublicHeader() {
  return (
    <header className="portalSiteHeader">
      <Link href="/" className="portalBrand" aria-label="Bright Future School home">
        <span>
          <Shield size={20} />
        </span>
        <div>
          <strong>Bright Future School</strong>
          <small>Senior Secondary Campus</small>
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
        <a href="tel:+911234567890" className="portalCallLink">
          <Phone size={15} /> +91 12345 67890
        </a>
        <details className="portalMenu">
          <summary>
            Portal Login <ChevronDown size={14} />
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
