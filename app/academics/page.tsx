import { CalendarDays, GraduationCap, NotebookTabs } from "lucide-react";
import { PublicPageShell } from "../components/PublicPageShell";
import { CheckList, ContactCta, InfoBand, PageHero, SectionHeading } from "../components/PublicSections";
import { academicFeatures } from "../data/schoolSite";

const streams = ["Primary Foundation", "Middle School", "Secondary Classes", "Science Stream", "Commerce Stream", "Humanities Stream"];
const examPlan = ["Unit tests", "Half-yearly exams", "Pre-board preparation", "Practical records", "Report cards", "Parent review meetings"];

export default function AcademicsPage() {
  return (
    <PublicPageShell>
      <PageHero
        eyebrow="Academics"
        title="Curriculum, subjects, classes and academic planning."
        body="A structured academic system for Nursery to Class 12 with regular homework, assessment, report cards and parent communication."
      />

      <section className="contentSplit">
        <article className="sectionIntro">
          <p>Learning Plan</p>
          <h2>CBSE aligned teaching with activity-based classroom practice.</h2>
          <span>Teachers follow monthly plans, topic revision, classwork review and exam readiness checkpoints.</span>
        </article>
        <CheckList items={academicFeatures} icon="book" />
      </section>

      <InfoBand>
        <SectionHeading eyebrow="Classes & Streams" title="Academic coverage from foundation to senior secondary." />
        <div className="detailCardGrid threeCol">
          {streams.map((stream) => (
            <article key={stream}>
              <GraduationCap size={21} />
              <h3>{stream}</h3>
              <p>Class-wise syllabus, attendance, homework and result records are managed in the portal.</p>
            </article>
          ))}
        </div>
      </InfoBand>

      <section className="detailTwoCol">
        <article className="detailPanel">
          <CalendarDays size={24} />
          <h2>Academic Calendar</h2>
          <p>Monthly activities, holidays, tests, competitions and PTM dates can be published for students and parents.</p>
        </article>
        <article className="detailPanel">
          <NotebookTabs size={24} />
          <h2>Exam & Result System</h2>
          <div className="miniPillGrid">
            {examPlan.map((item) => <span key={item}>{item}</span>)}
          </div>
        </article>
      </section>

      <ContactCta />
    </PublicPageShell>
  );
}
