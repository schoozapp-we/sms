import { Mail, MapPin, MessageCircle, Phone } from "lucide-react";
import { ContactEnquiryForm } from "../components/ContactEnquiryForm";
import { PublicPageShell } from "../components/PublicPageShell";
import { PageHero } from "../components/PublicSections";
import { schoolProfile } from "../data/schoolSite";

export default function ContactPage() {
  return (
    <PublicPageShell>
      <PageHero
        eyebrow="Contact"
        title="School office, address and enquiry form."
        body="Contact the school for admission, fees, transport, documents, portal access and general enquiries."
      />

      <section className="contactSection contactPageSection">
        <div>
          <p>Reach Us</p>
          <h2>Visit or contact the school office.</h2>
          <div className="contactRows">
            <span><MapPin size={16} /> {schoolProfile.address}</span>
            <span><Phone size={16} /> {schoolProfile.phone}</span>
            <span><Mail size={16} /> {schoolProfile.email}</span>
          </div>
        </div>
        <ContactEnquiryForm defaultTopic="Admission / general enquiry" />
        <a
          className="mapBox"
          href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(schoolProfile.address)}`}
          target="_blank"
          rel="noopener noreferrer"
        >
          <MapPin size={24} />
          <strong>Open Google Map</strong>
          <span>{schoolProfile.address}</span>
        </a>
      </section>

      <section className="detailCardGrid threeCol siteSection">
        <article>
          <Phone size={21} />
          <h3>Call Office</h3>
          <p>{schoolProfile.phone}</p>
          <a href={schoolProfile.phoneHref}>Call Now</a>
        </article>
        <article>
          <MessageCircle size={21} />
          <h3>WhatsApp</h3>
          <p>Quick admission and document enquiries.</p>
          <a href={schoolProfile.whatsappHref}>Open WhatsApp</a>
        </article>
        <article>
          <Mail size={21} />
          <h3>Email</h3>
          <p>{schoolProfile.email}</p>
          <a href={`mailto:${schoolProfile.email}`}>Send Email</a>
        </article>
      </section>
    </PublicPageShell>
  );
}
