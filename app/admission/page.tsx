import Link from "next/link";
import { FileCheck2, FileText, IndianRupee, UserPlus } from "lucide-react";
import { AdmissionApplicationForm } from "../components/AdmissionApplicationForm";
import { PublicPageShell } from "../components/PublicPageShell";
import { ContactCta, DownloadGrid, InfoBand, PageHero, SectionHeading } from "../components/PublicSections";
import { admissionSteps, schoolProfile } from "../data/schoolSite";
import { getWebsiteContent } from "@/lib/server/websiteContent";

const documents = ["Birth certificate", "Aadhaar card", "Previous report card", "Transfer certificate", "Passport size photos", "Parent ID proof"];

export default async function AdmissionPage() {
  const content = await getWebsiteContent();

  return (
    <PublicPageShell>
      <PageHero
        eyebrow={`Admission ${schoolProfile.session}`}
        title="Online admission enquiry, eligibility and document details."
        body="Parents can review the full process, required documents, fee information and start admission from this page."
      />

      <section className="admissionBanner">
        <div>
          <p>Apply Online</p>
          <h2>Start admission registration for session {schoolProfile.session}.</h2>
          <span>Submit student details online and the school office will guide the next step.</span>
        </div>
        <div className="bannerActions">
          <Link href="#admission-form" className="heroPrimaryLink"><UserPlus size={16} /> Apply Now</Link>
          <a href={schoolProfile.phoneHref} className="heroSecondaryLink">Call Office</a>
        </div>
      </section>

      <AdmissionApplicationForm />

      <InfoBand>
        <SectionHeading eyebrow="Process" title="Simple admission flow for parents." />
        <div className="timelineGrid">
          {admissionSteps.map((step, index) => (
            <article key={step}>
              <strong>{String(index + 1).padStart(2, "0")}</strong>
              <p>{step}</p>
            </article>
          ))}
        </div>
      </InfoBand>

      <section className="detailTwoCol">
        <article className="detailPanel">
          <FileCheck2 size={24} />
          <h2>Required Documents</h2>
          <div className="miniPillGrid">
            {documents.map((item) => <span key={item}>{item}</span>)}
          </div>
        </article>
        <article className="detailPanel">
          <IndianRupee size={24} />
          <h2>Fee Structure</h2>
          <p>Class-wise fee structure, transport charges and payment schedule can be shared by the school office or downloaded when PDFs are uploaded.</p>
        </article>
      </section>

      <section className="siteSection">
        <SectionHeading eyebrow="Downloads" title="Admission forms and school documents." />
        <DownloadGrid items={content.downloadDocuments} />
      </section>

      <section className="detailPanel">
        <FileText size={24} />
        <h2>Eligibility</h2>
        <p>Nursery to Class 12 admissions depend on seat availability, age criteria, previous academic record and interaction or assessment where applicable.</p>
      </section>

      <ContactCta />
    </PublicPageShell>
  );
}
