import { PublicPageShell } from "../components/PublicPageShell";
import { ContactCta, FacilityGrid, PageHero } from "../components/PublicSections";

export default function FacilitiesPage() {
  return (
    <PublicPageShell>
      <PageHero
        eyebrow="Facilities"
        title="Smart classrooms, labs, library, sports and safe transport."
        body="Every facility is planned to support academic learning, student confidence, practical exposure and a safe campus experience."
      />
      <section className="siteSection">
        <FacilityGrid detailed />
      </section>
      <ContactCta />
    </PublicPageShell>
  );
}
