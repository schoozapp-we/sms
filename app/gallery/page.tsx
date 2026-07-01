import Image from "next/image";
import { PlayCircle } from "lucide-react";
import { PublicPageShell } from "../components/PublicPageShell";
import { ContactCta, PageHero, SectionHeading } from "../components/PublicSections";
import { galleryPreview } from "../data/schoolSite";

export default function GalleryPage() {
  return (
    <PublicPageShell>
      <PageHero
        eyebrow="Gallery"
        title="School events, celebrations and classroom moments."
        body="A complete gallery page for annual function, sports day, exhibitions, award ceremonies and daily learning activities."
      />
      <section className="siteSection">
        <SectionHeading eyebrow="Photo Gallery" title="Campus life highlights." />
        <div className="galleryGrid expandedGallery">
          {galleryPreview.map((item, index) => (
            <article key={item}>
              <Image src="/images/school-portal-hero.png" alt={`${item} gallery preview`} fill sizes="(max-width: 800px) 100vw, 33vw" style={{ objectPosition: `${42 + index * 5}% center` }} />
              <div><PlayCircle size={18} /><strong>{item}</strong></div>
            </article>
          ))}
        </div>
      </section>
      <ContactCta />
    </PublicPageShell>
  );
}
