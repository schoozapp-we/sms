import Link from "next/link";
import { Facebook, Instagram, Mail, MapPin, Phone, Send, Youtube, MessageCircle } from "lucide-react";
import { getWebsiteContent } from "@/lib/server/websiteContent";

export async function PublicFooter() {
  const content = await getWebsiteContent();
  const phoneHref = `tel:${content.phone.replace(/[^\d+]/g, "")}`;
  const whatsappHref = `https://wa.me/${content.phone.replace(/\D/g, "")}`;

  return (
    <footer className="portalFooter">
      <div className="footerGrid">
        <section className="footerBrandBlock">
          <strong><span>edu</span>ka</strong>
          <p>{content.schoolName} brings admissions, academics, activities and parent communication together in one modern campus experience.</p>
          <a href={phoneHref}><Phone size={18} /> {content.phone}</a>
          <span><MapPin size={18} /> {content.address}</span>
          <span><Mail size={18} /> {content.email}</span>
        </section>

        <section>
          <h3>Quick Links</h3>
          <Link href="/about">About Us</Link>
          <Link href="/contact">Faq</Link>
          <Link href="/gallery">Testimonials</Link>
          <Link href="/admission">Terms Of Service</Link>
          <Link href="/gallery">Update News</Link>
        </section>

        <section>
          <h3>Our Campus</h3>
          <Link href="/admission#admission-form">Application Form</Link>
          <Link href="/academics">Academic Department</Link>
          <Link href="/facilities#sports">Health Care</Link>
          <Link href="/facilities">Our Facilities</Link>
          <Link href="/academics">Scholarships</Link>
        </section>

        <section className="footerNewsletter">
          <h3>Newsletter</h3>
          <p>Subscribe our newsletter to get latest update and news.</p>
          <form>
            <input aria-label="Email" placeholder="Your Email" type="email" />
            <button type="button">Subscribe Now <Send size={16} /></button>
          </form>
        </section>
      </div>

      <div className="footerBottom">
        <span>© Copyright 2026 <b>Eduka</b> All Rights Reserved.</span>
        <div className="portalFooterActions">
          <a href="#" aria-label="Facebook"><Facebook size={16} /></a>
          <a href="#" aria-label="Instagram"><Instagram size={16} /></a>
          <a href="#" aria-label="YouTube"><Youtube size={16} /></a>
          <a href={whatsappHref} aria-label="WhatsApp"><MessageCircle size={16} /></a>
        </div>
      </div>
    </footer>
  );
}
