import { Building2, CheckCircle2, HeartHandshake, Target } from "lucide-react";
import { PublicPageShell } from "../components/PublicPageShell";
import { ContactCta, InfoBand, PageHero, SectionHeading } from "../components/PublicSections";

const values = ["Discipline with care", "Value-based education", "Technology-enabled learning", "Parent partnership"];

export default function AboutPage() {
  return (
    <PublicPageShell>
      <PageHero
        eyebrow="About School"
        title="History, vision, mission and management overview."
        body="Bright Future School is built around strong academics, practical learning, safe infrastructure and a close relationship between school and family."
      />

      <section className="detailTwoCol">
        <article className="detailPanel">
          <Building2 size={24} />
          <h2>Our Story</h2>
          <p>
            Established in 2004, the school has grown into a full senior secondary campus with
            digital classrooms, laboratories, library, sports activities and role-based online portals.
          </p>
          <p>
            The goal is simple: students should receive disciplined guidance, modern exposure and
            a supportive environment where progress is tracked regularly.
          </p>
        </article>
        <article className="detailPanel accentPanel">
          <Target size={24} />
          <h2>Vision & Mission</h2>
          <p>
            To prepare confident, responsible and curious learners through value-based education,
            activity-based teaching and transparent parent communication.
          </p>
        </article>
      </section>

      <InfoBand>
        <SectionHeading eyebrow="Core Values" title="The school culture students experience every day." />
        <div className="detailCardGrid fourCol">
          {values.map((value) => (
            <article key={value}>
              <CheckCircle2 size={20} />
              <h3>{value}</h3>
              <p>Every classroom, activity and communication process is planned around this principle.</p>
            </article>
          ))}
        </div>
      </InfoBand>

      <section className="detailTwoCol">
        <article className="detailPanel">
          <HeartHandshake size={24} />
          <h2>Management Message</h2>
          <p>
            Our management focuses on safe infrastructure, regular teacher development, digital
            record keeping and a practical learning environment for every student.
          </p>
        </article>
        <article className="detailPanel">
          <h2>Principal&apos;s Message</h2>
          <p>
            Learning should feel disciplined, caring and future-ready. We work with parents to
            support academic growth, confidence, character and communication.
          </p>
        </article>
      </section>

      <ContactCta />
    </PublicPageShell>
  );
}
