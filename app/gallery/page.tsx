import Image from "next/image";
import { PlayCircle } from "lucide-react";
import { PublicPageShell } from "../components/PublicPageShell";
import { ContactCta, PageHero, SectionHeading } from "../components/PublicSections";
import { galleryPreview } from "../data/schoolSite";
import { getPublicGallery } from "@/lib/server/publicMedia";

export default async function GalleryPage() {
  const publicGallery = await getPublicGallery();
  const items = publicGallery.length
    ? publicGallery
    : galleryPreview.map((title, index) => ({ id: title, title, imageUrl: "/images/school-portal-hero.png", description: String(index) }));

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
          {items.map((item, index) => (
            <article key={item.id}>
              <Image src={item.imageUrl} alt={`${item.title} gallery preview`} fill sizes="(max-width: 800px) 100vw, 33vw" style={{ objectPosition: `${42 + index * 5}% center` }} />
              <div><PlayCircle size={18} /><strong>{item.title}</strong></div>
            </article>
          ))}
        </div>
      </section>
      <ContactCta />
    </PublicPageShell>
  );
}
