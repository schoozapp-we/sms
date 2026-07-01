import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";
import {
  ArrowRight,
  Award,
  BookOpen,
  Building2,
  Bus,
  CheckCircle2,
  ClipboardList,
  Computer,
  Download,
  FlaskConical,
  GraduationCap,
  Landmark,
  Library,
  MonitorCheck,
  Phone,
  ShieldCheck,
  Trophy,
  Users
} from "lucide-react";
import { facilities, highlights, portals, schoolProfile } from "../data/schoolSite";

const statIcons = [Users, Landmark, GraduationCap, MonitorCheck];
const facilityIcons = [MonitorCheck, Library, Computer, FlaskConical, Trophy, Bus];

export function PublicHero({
  eyebrow,
  title,
  body,
  primaryHref = "/admission",
  primaryLabel = "Apply Online",
  secondaryHref = "/portal-login",
  secondaryLabel = "Portal Login"
}: Readonly<{
  eyebrow: string;
  title: string;
  body: string;
  primaryHref?: string;
  primaryLabel?: string;
  secondaryHref?: string;
  secondaryLabel?: string;
}>) {
  return (
    <section className="publicHero">
      <Image
        src="/images/school-portal-hero.png"
        alt="Bright Future School campus"
        fill
        priority
        sizes="100vw"
        className="publicHeroImage"
      />
      <div className="publicHeroShade" />
      <div className="publicHeroCopy">
        <p>{eyebrow}</p>
        <h1>{title}</h1>
        <span>{body}</span>
        <div className="publicHeroActions">
          <Link href={primaryHref} className="heroPrimaryLink">
            {primaryLabel} <ArrowRight size={16} />
          </Link>
          <Link href={secondaryHref} className="heroSecondaryLink">
            {secondaryLabel}
          </Link>
        </div>
      </div>
      <aside className="heroNoticeBox">
        <strong>Session {schoolProfile.session}</strong>
        <span>Admission enquiry, fee payment and report card access are available online.</span>
      </aside>
    </section>
  );
}

export function PageHero({ eyebrow, title, body }: Readonly<{ eyebrow: string; title: string; body: string }>) {
  return (
    <section className="detailHero">
      <div>
        <p>{eyebrow}</p>
        <h1>{title}</h1>
        <span>{body}</span>
      </div>
    </section>
  );
}

export function StatsBand() {
  return (
    <section className="schoolStats" aria-label="School highlights">
      {highlights.map((item, index) => {
        const Icon = statIcons[index] ?? CheckCircle2;
        return (
          <article key={item.label}>
            <Icon size={19} />
            <strong>{item.value}</strong>
            <span>{item.label}</span>
          </article>
        );
      })}
    </section>
  );
}

export function SectionHeading({ eyebrow, title }: Readonly<{ eyebrow: string; title: string }>) {
  return (
    <div className="sectionHead">
      <p>{eyebrow}</p>
      <h2>{title}</h2>
    </div>
  );
}

export function CheckList({ items, icon = "check" }: Readonly<{ items: string[]; icon?: "check" | "book" | "award" | "download" }>) {
  const Icon = icon === "book" ? BookOpen : icon === "award" ? Award : icon === "download" ? Download : CheckCircle2;
  return (
    <div className="featureListPanel">
      {items.map((item) => (
        <div className="checkRow" key={item}>
          <Icon size={16} />
          <span>{item}</span>
        </div>
      ))}
    </div>
  );
}

export function FacilityGrid({ detailed = false }: Readonly<{ detailed?: boolean }>) {
  return (
    <div className={detailed ? "detailCardGrid" : "facilityGrid"}>
      {facilities.map((facility, index) => {
        const Icon = facilityIcons[index] ?? Building2;
        return (
          <article key={facility.slug} id={facility.slug}>
            <Icon size={21} />
            <h3>{facility.title}</h3>
            <p>{facility.body}</p>
            {detailed ? (
              <ul>
                {facility.details.map((detail) => (
                  <li key={detail}>{detail}</li>
                ))}
              </ul>
            ) : (
              <Link href={`/facilities#${facility.slug}`}>View Details</Link>
            )}
          </article>
        );
      })}
    </div>
  );
}

export function PortalGrid() {
  return (
    <div className="portalGrid">
      {portals.map((portal) => (
        <article className="portalMiniCard" key={portal.href}>
          <ShieldCheck size={20} />
          <h3>{portal.label}</h3>
          <p>{portal.body}</p>
          <div>
            <Link href={portal.href}>Open Portal</Link>
            <Link href={portal.signupHref}>Signup</Link>
          </div>
        </article>
      ))}
    </div>
  );
}

export function DownloadGrid({ items }: Readonly<{ items: string[] }>) {
  return (
    <div className="downloadGrid">
      {items.map((item) => (
        <a href="#" key={item}>
          <Download size={16} />
          <span>{item}</span>
        </a>
      ))}
    </div>
  );
}

export function InfoBand({ children }: Readonly<{ children: ReactNode }>) {
  return <section className="infoBand">{children}</section>;
}

export function QuickLinkList({ items }: Readonly<{ items: string[] }>) {
  return (
    <div className="featureListPanel">
      <h3>Quick Links</h3>
      {items.map((item) => (
        <div className="checkRow" key={item}>
          <ClipboardList size={16} />
          <span>{item}</span>
        </div>
      ))}
    </div>
  );
}

export function ContactCta() {
  return (
    <section className="admissionBanner">
      <div>
        <p>Need Help?</p>
        <h2>School office se directly baat karein.</h2>
        <span>Admission, transport, fee, documents ya portal access ke liye office team available hai.</span>
      </div>
      <div className="bannerActions">
        <a href={schoolProfile.phoneHref} className="heroPrimaryLink">
          <Phone size={16} /> Call Office
        </a>
        <Link href="/contact" className="heroSecondaryLink">
          Contact Page
        </Link>
      </div>
    </section>
  );
}
