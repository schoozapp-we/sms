import Image from "next/image";
import Link from "next/link";
import {
  Award,
  Bell,
  BookOpen,
  CheckCircle2,
  FileText,
  Mail,
  MapPin,
  MessageCircle,
  Phone,
  PlayCircle,
  Search
} from "lucide-react";
import { PublicPageShell } from "./components/PublicPageShell";
import { ContactEnquiryForm } from "./components/ContactEnquiryForm";
import { TeacherCarousel } from "./components/TeacherCarousel";
import {
  CheckList,
  DownloadGrid,
  FacilityGrid,
  PortalGrid,
  PublicHero,
  QuickLinkList,
  SectionHeading,
  StatsBand
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

export default async function HomePage() {
  const content = await getWebsiteContent();
  const [publicGallery, publicTeachers] = await Promise.all([getPublicGallery(), getPublicTeachers()]);
  const phoneHref = `tel:${content.phone.replace(/[^\d+]/g, "")}`;
  const whatsappHref = `https://wa.me/${content.phone.replace(/\D/g, "")}`;

  return (
    <PublicPageShell>
      <PublicHero
        eyebrow={content.heroEyebrow}
        title={content.heroTitle}
        body={content.heroBody}
      />

      <section className="siteSearchBand" aria-label="Search and quick actions">
        <div className="siteSearch">
          <Search size={18} />
          <span>Search admissions, circulars, downloads, teachers and events</span>
        </div>
        <a href={whatsappHref} className="whatsappLink">
          <MessageCircle size={17} /> WhatsApp Chat
        </a>
        <a href={phoneHref} className="callLink">
          <Phone size={17} /> Click to Call
        </a>
      </section>

      <StatsBand />

      <section className="sectionGrid aboutGrid">
        <article className="sectionIntro">
          <p>About Us</p>
          <h2>{content.aboutTitle}</h2>
          <span>{content.aboutBody}</span>
          <Link href="/about" className="inlineDetailLink">Read Full About Page</Link>
        </article>
        <div className="infoPanel">
          <h3>Vision & Mission</h3>
          <p>To build confident, responsible and curious learners through value-based education, modern infrastructure and regular parent engagement.</p>
          <div className="miniPillGrid">
            {["CBSE Affiliation", "Smart Infrastructure", "Safe Transport", "Digital ERP"].map((item) => <span key={item}>{item}</span>)}
          </div>
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
        <div className="featureListPanel">
          <h3>Achievements</h3>
          {achievements.map((item) => <div className="checkRow" key={item}><Award size={16} /><span>{item}</span></div>)}
        </div>
      </section>

      <section className="siteSection">
        <SectionHeading eyebrow="Gallery" title="Photo and video gallery preview." />
        <div className="galleryGrid">
          {(publicGallery.length ? publicGallery.slice(0, 4) : galleryPreview.slice(0, 4).map((title, index) => ({ id: title, title, imageUrl: "/images/school-portal-hero.png", description: String(index) }))).map((item, index) => (
            <article key={item.id}>
              <Image src={item.imageUrl} alt={`${item.title} gallery preview`} fill sizes="(max-width: 800px) 100vw, 25vw" style={{ objectPosition: `${45 + index * 6}% center` }} />
              <div><PlayCircle size={18} /><strong>{item.title}</strong></div>
            </article>
          ))}
        </div>
        <Link href="/gallery" className="inlineDetailLink">Open Full Gallery</Link>
      </section>

      <section className="siteSection">
        <SectionHeading eyebrow="Teachers" title="Meet our faculty team." />
        <TeacherCarousel teachers={publicTeachers} />
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
