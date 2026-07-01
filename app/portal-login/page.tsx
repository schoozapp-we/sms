import Link from "next/link";
import { ArrowRight, LockKeyhole, ShieldCheck, UserPlus } from "lucide-react";
import { PublicPageShell } from "../components/PublicPageShell";
import { PageHero, PortalGrid, SectionHeading } from "../components/PublicSections";
import { portals } from "../data/schoolSite";

export default function PortalLoginPage() {
  return (
    <PublicPageShell>
      <PageHero
        eyebrow="Portal Login"
        title="Choose your secure school login portal."
        body="Students, parents, teachers, staff and admin users can open their correct role-wise login page from here."
      />

      <section className="siteSection">
        <SectionHeading eyebrow="Role Based Access" title="Select the portal you want to open." />
        <PortalGrid />
      </section>

      <section className="detailTwoCol">
        <article className="detailPanel accentPanel">
          <LockKeyhole size={24} />
          <h2>Secure Access</h2>
          <p>Each login page checks the selected portal role and sends users to the correct dashboard after authentication.</p>
        </article>
        <article className="detailPanel">
          <UserPlus size={24} />
          <h2>New User Signup</h2>
          <p>New users can request approval for the right role. Admin signup may require invite-code verification.</p>
          <div className="miniPillGrid">
            {portals.map((portal) => <Link href={portal.signupHref} key={portal.signupHref}>{portal.label} Signup</Link>)}
          </div>
        </article>
      </section>

      <section className="homeFooterStrip">
        <Link href="/student/login"><ShieldCheck size={15} /> Student</Link>
        <Link href="/parent/login"><ShieldCheck size={15} /> Parent</Link>
        <Link href="/admin/login"><ArrowRight size={15} /> Admin</Link>
      </section>
    </PublicPageShell>
  );
}
