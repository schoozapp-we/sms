import Image from "next/image";
import Link from "next/link";
import type { CSSProperties } from "react";
import {
  Award,
  Bell,
  BookOpen,
  CheckCircle2,
  ChevronRight,
  Clock3,
  ClipboardCheck,
  GraduationCap,
  FileText,
  Globe2,
  Headphones,
  LibraryBig,
  Lightbulb,
  Mail,
  MapPin,
  Phone,
  PlayCircle,
  Sparkles,
  Trophy,
  Users
} from "lucide-react";
import { PublicPageShell } from "./components/PublicPageShell";
import { ContactEnquiryForm } from "./components/ContactEnquiryForm";
import { EdukaHeroCarousel, EdukaTeacherSlider } from "./components/EdukaHomeInteractive";
import {
  CheckList,
  DownloadGrid,
  FacilityGrid,
  QuickLinkList,
  SectionHeading,
  PortalGrid
} from "./components/PublicSections";
import {
  academicFeatures,
  achievements,
  galleryPreview,
  modernFeatures,
  newsItems,
  quickLinks
} from "./data/schoolSite";
import { getWebsiteContent } from "@/lib/server/websiteContent";
import { getPublicGallery, getPublicTeachers } from "@/lib/server/publicMedia";

export const dynamic = "force-dynamic";

const learningTracks = [
  {
    title: "Foundation School",
    label: "Nursery - 5",
    body: "Phonics, numeracy, habits, activities and confident classroom participation.",
    icon: Sparkles
  },
  {
    title: "Middle School",
    label: "6 - 8",
    body: "Concept clarity, lab exposure, reading discipline and guided assessments.",
    icon: BookOpen
  },
  {
    title: "Senior School",
    label: "9 - 12",
    body: "Board preparation, stream guidance, projects and career-focused mentoring.",
    icon: GraduationCap
  }
];

const impactStats = [
  { value: "500", label: "Total Courses", icon: BookOpen },
  { value: "1800", label: "Our Students", icon: Users },
  { value: "700", label: "Skilled Lecturers", icon: GraduationCap },
  { value: "30", label: "Win Awards", icon: Trophy }
];

const whyChooseItems = [
  { title: "Expert Teachers", body: "Experienced faculty with focused class mentoring.", icon: GraduationCap },
  { title: "Course Material", body: "Syllabus, notes, timetable and downloads in one place.", icon: LibraryBig },
  { title: "Online Classes", body: "Digital workflow for homework, notices and learning updates.", icon: ClipboardCheck },
  { title: "Affordable Process", body: "Clear admission, fee and enquiry support for parents.", icon: Headphones }
];

const fallbackTeachers = [
  { id: "angela", name: "Angela T. Vigil", department: "Associate Professor", subjects: ["Science"], profileImageUrl: "/images/school-portal-hero.png" },
  { id: "frank", name: "Frank A. Mitchell", department: "Associate Professor", subjects: ["Mathematics"], profileImageUrl: "/images/school-portal-hero.png" },
  { id: "susan", name: "Susan D. Lunsford", department: "CEO & Founder", subjects: ["Academic Head"], profileImageUrl: "/images/school-portal-hero.png" },
  { id: "dennis", name: "Dennis A. Pruitt", department: "Associate Professor", subjects: ["English"], profileImageUrl: "/images/school-portal-hero.png" }
];

export default async function HomePage() {
  const content = await getWebsiteContent();
  const [publicGallery, publicTeachers] = await Promise.all([getPublicGallery(), getPublicTeachers()]);
  const teachers = publicTeachers.length ? publicTeachers : fallbackTeachers;

  return (
    <PublicPageShell>
      <EdukaHeroCarousel />

      <section className="sectionGrid aboutGrid edukaAbout edukaSystem">
        <div className="edukaAboutCollage">
          <div className="collageImage collageTall">
            <Image
              src="/images/school-portal-hero.png"
              alt={`${content.shortName} student learning`}
              fill
              sizes="(max-width: 900px) 80vw, 280px"
            />
          </div>
          <div className="collageImage collageRound">
            <Image
              src="/images/school-portal-hero.png"
              alt={`${content.shortName} group study`}
              fill
              sizes="220px"
            />
          </div>
          <div className="collageImage collageWide">
            <Image
              src="/images/school-portal-hero.png"
              alt={`${content.shortName} classroom activity`}
              fill
              sizes="(max-width: 900px) 72vw, 300px"
            />
          </div>
          <div className="collageExperience">
            <Lightbulb size={34} />
            <strong>30 Years Of</strong>
            <span>Quality Service</span>
          </div>
        </div>

        <article className="sectionIntro systemCopy">
          <p>About Us</p>
          <h2>Our Edukation System <mark>Inspires</mark> You More.</h2>
          <span>{content.aboutBody}</span>
          <div className="systemServiceList">
            <div>
              <span><BookOpen size={26} /></span>
              <strong>Edukation Services</strong>
              <small>Academic planning, class communication and digital learning support.</small>
            </div>
            <div>
              <span><Globe2 size={26} /></span>
              <strong>International Hubs</strong>
              <small>Modern exposure through activities, labs, reading and guided projects.</small>
            </div>
          </div>
          <blockquote>Learning becomes stronger when school, students and parents move together with clarity.</blockquote>
          <Link href="/about" className="inlineDetailLink">Read Full About Page</Link>
        </article>
      </section>

      <section className="impactBand" aria-label="School achievements">
        <div className="impactOverlay" />
        <div className="impactGrid">
          {impactStats.map((item, index) => {
            const Icon = item.icon;
            return (
              <article key={`${item.label}-${index}`} style={{ animationDelay: `${index * 90}ms` } as CSSProperties}>
                <span><Icon size={33} /></span>
                <strong>{item.value}</strong>
                <small>+ {item.label}</small>
              </article>
            );
          })}
        </div>
      </section>

      <section className="siteSection edukaPrograms">
        <SectionHeading eyebrow="Learning Pathways" title="Programs designed for every stage of school life." />
        <div className="programGrid">
          {learningTracks.map((track, index) => {
            const Icon = track.icon;
            return (
              <article key={`${track.title}-${index}`} style={{ animationDelay: `${index * 90}ms` } as CSSProperties}>
                <span className="programIcon"><Icon size={24} /></span>
                <small>{track.label}</small>
                <h3>{track.title}</h3>
                <p>{track.body}</p>
                <Link href="/academics">Explore <ChevronRight size={14} /></Link>
              </article>
            );
          })}
        </div>
      </section>

      <section className="admissionBanner">
        <div>
          <p>Admission Open</p>
          <h2>{content.admissionTitle}</h2>
          <span>{content.admissionBody}</span>
        </div>
        <div className="bannerActions">
          <Link href="/admission" className="heroPrimaryLink">Admission Details</Link>
          <Link href="/admission#admission-form" className="heroSecondaryLink">Apply Online</Link>
        </div>
      </section>

      <section className="contentSplit">
        <article className="sectionIntro">
          <p>Academics</p>
          <h2>Curriculum, subjects, classes and academic calendar.</h2>
          <span>Structured teaching methodology with regular exam planning, homework, results and performance reviews.</span>
          <Link href="/academics" className="inlineDetailLink">Open Academics Page</Link>
        </article>
        <CheckList items={academicFeatures} icon="book" />
      </section>

      <section className="siteSection">
        <SectionHeading eyebrow="Facilities" title="Campus facilities for modern learning." />
        <FacilityGrid />
      </section>

      <section className="whyChooseBand">
        <div className="whyChooseCopy">
          <p><BookOpen size={17} /> Why Choose Us</p>
          <h2>We Are Expert & <mark>Do Our Best</mark> For Your Goal</h2>
          <span>Strong teaching, clear communication and a modern school portal make daily learning smoother for every student.</span>
          <div className="whyFeatureGrid">
            {whyChooseItems.map((item) => {
              const Icon = item.icon;
              return (
                <article key={item.title}>
                  <span><Icon size={28} /></span>
                  <div>
                    <strong>{item.title}</strong>
                    <small>{item.body}</small>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
        <div className="whyChooseImage">
          <Image
            src="/images/school-portal-hero.png"
            alt={`${content.shortName} students walking in campus`}
            fill
            sizes="(max-width: 900px) 92vw, 470px"
          />
        </div>
      </section>

      <section className="contentSplit">
        <div className="newsPanel">
          <SectionHeading eyebrow="News & Events" title="Latest circulars and upcoming events." />
          {newsItems.map((item) => (
            <article className="newsItem" key={item.title}>
              <span>{item.tag}</span>
              <div><strong>{item.title}</strong><small>{item.date}</small></div>
            </article>
        ))}
        </div>
        <div className="featureListPanel achievementPanel">
          <h3>Achievements</h3>
          {achievements.map((item) => <div className="checkRow" key={item}><Award size={16} /><span>{item}</span></div>)}
          <div className="achievementSpotlight">
            <Clock3 size={18} />
            <strong>Daily Learning Rhythm</strong>
            <span>Assembly, periods, activities, revision and homework tracking in a balanced routine.</span>
          </div>
        </div>
      </section>

      <section className="siteSection">
        <div className="homeSectionCenter">
          <p>Gallery</p>
          <h2>Our Photo <mark>Gallery</mark></h2>
          <span>Campus life, events, activities and celebrations from the school community.</span>
        </div>
        <div className="galleryGrid homeMasonryGallery">
          {(publicGallery.length ? publicGallery.slice(0, 6) : galleryPreview.slice(0, 6).map((title, index) => ({ id: title, title, imageUrl: "/images/school-portal-hero.png", description: String(index) }))).map((item, index) => (
            <article key={`${item.id}-${index}`}>
              <Image src={item.imageUrl} alt={`${item.title} gallery preview`} fill sizes="(max-width: 800px) 100vw, 25vw" style={{ objectPosition: `${45 + index * 6}% center` }} />
              <div><PlayCircle size={18} /><strong>{item.title}</strong></div>
            </article>
          ))}
        </div>
        <Link href="/gallery" className="inlineDetailLink">Open Full Gallery</Link>
      </section>

      <section className="siteSection teacherShowcaseSection">
        <div className="homeSectionCenter">
          <p>Teachers</p>
          <h2>Meet With Our <mark>Teachers</mark></h2>
          <span>Faculty profiles, departments and subject experts for daily academic support.</span>
        </div>
        <EdukaTeacherSlider teachers={teachers} />
      </section>

      <section className="contentSplit">
        <div className="downloadPanel">
          <SectionHeading eyebrow="Downloads" title="Forms, syllabus, holiday list, timetable and PDFs." />
          <DownloadGrid items={content.downloadDocuments} />
        </div>
        <QuickLinkList items={quickLinks} />
      </section>

      <section className="siteSection">
        <SectionHeading eyebrow="Portal Login" title="Secure login access for every role." />
        <PortalGrid />
      </section>

      <section className="siteSection">
        <SectionHeading eyebrow="Modern Features" title="Website features included in this upgrade." />
        <div className="modernFeatureGrid">
          {modernFeatures.map((item) => <span key={item}><CheckCircle2 size={15} /> {item}</span>)}
        </div>
      </section>

      <section className="contactSection">
        <div>
          <p>Contact Us</p>
          <h2>Visit or contact the school office.</h2>
          <div className="contactRows">
            <span><MapPin size={16} /> {content.address}</span>
            <span><Phone size={16} /> {content.phone}</span>
            <span><Mail size={16} /> {content.email}</span>
          </div>
        </div>
        <ContactEnquiryForm compact defaultTopic="Website enquiry" />
        <a
          className="mapBox"
          href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(content.address)}`}
          target="_blank"
          rel="noopener noreferrer"
        >
          <MapPin size={24} />
          <strong>Open Google Map</strong>
          <span>{content.address}</span>
        </a>
      </section>

      <section className="homeFooterStrip">
        <Link href="/portal-login"><Bell size={15} /> Portal Login</Link>
        <Link href="/admission"><BookOpen size={15} /> Admission</Link>
        <Link href="/academics"><FileText size={15} /> Academic Plan</Link>
      </section>
    </PublicPageShell>
  );
}
