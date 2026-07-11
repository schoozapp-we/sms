import Link from "next/link";
import {
  ChevronDown,
  Menu,
  Phone,
  Search,
  Shield,
  UserRoundCheck
} from "lucide-react";
import { portals } from "../data/schoolSite";
import { getWebsiteContent } from "@/lib/server/websiteContent";

const navItems = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  {
    label: "Academics",
    href: "/academics",
    children: [
      { label: "Curriculum", href: "/academics" },
      { label: "Syllabus", href: "/api/downloads/syllabus" },
      { label: "Time Table", href: "/api/downloads/time-table" },
      { label: "Results Portal", href: "/portal-login" }
    ]
  },
  {
    label: "Admission",
    href: "/admission",
    children: [
      { label: "Apply Online", href: "/admission#admission-form" },
      { label: "Admission Details", href: "/admission" },
      { label: "Fee Structure", href: "/api/downloads/fee-structure" },
      { label: "Prospectus", href: "/api/downloads/prospectus" }
    ]
  },
  {
    label: "Facilities",
    href: "/facilities",
    children: [
      { label: "Smart Classes", href: "/facilities#smart-classes" },
      { label: "Library", href: "/facilities#library" },
      { label: "Computer Lab", href: "/facilities#computer-lab" },
      { label: "Transport", href: "/facilities#transport" }
    ]
  },
  { label: "Gallery", href: "/gallery" },
  { label: "Contact", href: "/contact" }
];

export async function PublicHeader() {
  const content = await getWebsiteContent();
  const phoneHref = `tel:${content.phone.replace(/[^\d+]/g, "")}`;
  const [brandFirst, ...brandRest] = content.shortName.split(" ");
  const brandTail = brandRest.join(" ");

  return (
    <header className="portalSiteHeader">
      <div className="portalHeaderMain">
        <Link href="/" className="portalBrand" aria-label={`${content.shortName} home`}>
          <span>
            <Shield size={24} />
          </span>
          <div>
              <strong><b>{brandFirst}</b>{brandTail ? ` ${brandTail}` : ""}</strong>
              <small>{content.tagline}</small>
          </div>
        </Link>

        <nav className="portalNav" aria-label="Main navigation">
          {navItems.map((item) => (
            item.children ? (
              <div className="portalNavDropdown" key={`${item.label}-${item.href}`}>
                <Link href={item.href} className="portalNavTrigger">
                  {item.label}
                  <ChevronDown size={14} />
                </Link>
                <div className="portalNavPopup">
                  <strong>{item.label}</strong>
                  {item.children.map((child) => (
                    <Link key={`${item.label}-${child.label}`} href={child.href}>
                      {child.label}
                    </Link>
                  ))}
                </div>
              </div>
            ) : (
              <Link key={`${item.label}-${item.href}`} href={item.href}>
                {item.label}
              </Link>
            )
          ))}
        </nav>

        <div className="portalHeaderActions">
          <button className="portalSearchBtn" type="button" aria-label="Search">
            <Search size={23} />
          </button>
          <div className="portalLoginDropdown">
            <Link href="/portal-login" className="portalApplyBtn">
              <UserRoundCheck size={16} /> Portal Login
            </Link>
            <div className="portalLoginPopup">
              <strong>Portal Login</strong>
              {portals.map((portal) => (
                <Link key={portal.href} href={portal.href}>
                  {portal.label}
                </Link>
              ))}
            </div>
          </div>
        </div>

        <details className="portalMobileMenu">
          <summary aria-label="Open navigation menu">
            <Menu size={22} />
          </summary>
          <div className="portalMobileMenuPanel">
            <nav aria-label="Mobile navigation">
              {navItems.map((item) => (
                <Link key={`${item.label}-${item.href}`} href={item.href}>
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
      </div>
    </header>
  );
}
