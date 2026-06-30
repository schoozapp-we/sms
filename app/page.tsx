import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  Award,
  Bell,
  BookOpen,
  BriefcaseBusiness,
  Building2,
  Bus,
  CheckCircle2,
  ClipboardList,
  Download,
  FileText,
  GraduationCap,
  Landmark,
  Mail,
  MapPin,
  MessageCircle,
  MonitorCheck,
  Phone,
  PlayCircle,
  Search,
  Shield,
  Sparkles,
  Trophy,
  Users
} from "lucide-react";

const accessCards = [
  { title: "Student Portal", href: "/student/login", signupHref: "/signup?role=student", note: "Attendance, homework, results, report card and notices." },
  { title: "Parent Portal", href: "/parent/login", signupHref: "/signup?role=parent", note: "Child progress, fee updates, notices and report cards." },
  { title: "Teacher Portal", href: "/teacher/login", signupHref: "/signup?role=teacher", note: "Class attendance, assignments, marks and communication." },
  { title: "Staff Portal", href: "/staff/login", signupHref: "/signup?role=staff", note: "Admissions, records, fee follow-ups and office work." },
  { title: "Admin Panel", href: "/admin/login", signupHref: "/signup?role=admin", note: "Manage news, teachers, admissions, gallery, users and downloads." }
];

const quickLinks = ["Online Admission", "Fee Structure", "Prospectus", "TC Form", "Holiday List", "Time Table", "Syllabus", "Career / Vacancy"];
const highlights = [
  { label: "Students", value: "1200+", icon: Users },
  { label: "Board", value: "CBSE", icon: Landmark },
  { label: "Classes", value: "Nursery-12", icon: GraduationCap },
  { label: "Smart Rooms", value: "35+", icon: MonitorCheck }
];
const newsItems = [
  { tag: "Admission", title: "Admissions open for session 2026-27", date: "30 Jun 2026" },
  { tag: "Circular", title: "Parent-teacher meeting schedule released", date: "05 Jul 2026" },
  { tag: "Event", title: "Inter-house sports trials start next week", date: "09 Jul 2026" }
];
const facilities = [
  { title: "Smart Class", body: "Digital boards, multimedia learning and interactive classroom sessions.", icon: MonitorCheck },
  { title: "Library", body: "Reading room, reference books, newspapers and exam preparation material.", icon: BookOpen },
  { title: "Computer Lab", body: "Practical computer education with supervised access and modern systems.", icon: Building2 },
  { title: "Science Lab", body: "Physics, chemistry and biology practical learning with safety guidance.", icon: Sparkles },
  { title: "Sports", body: "Outdoor and indoor sports with competitions and fitness activities.", icon: Trophy },
  { title: "Transport", body: "Route-wise transport support with secure student movement tracking.", icon: Bus }
];
const academics = ["CBSE aligned curriculum", "Classes Nursery to 12th", "Science, Commerce and Humanities", "Activity based teaching methodology", "Academic calendar and exam planning", "Regular homework and progress review"];
const managementItems = ["Chairman message", "Principal message", "Management committee", "Department-wise staff details"];
const downloads = ["Admission Form", "TC Form", "Syllabus", "Holiday List", "Time Table", "Homework PDF"];
const achievements = ["Board result toppers", "Sports achievements", "Awards and competitions", "Annual function recognition"];
const galleryPreview = ["Annual Function", "Sports Day", "Independence Day", "Science Exhibition"];
const modernFeatures = ["Mobile responsive design", "Search bar", "Hindi + English ready", "WhatsApp chat button", "Click-to-call button", "Newsletter", "Notice popup", "Online admission", "Online fee payment", "SEO friendly", "Fast loading", "Secure portals"];

export default function HomePage() {
  return (
    <main className="schoolSite">
      <header className="siteHeader">
        <Link href="/" className="siteBrand" aria-label="Bright Future School home">
          <span><Shield size={22} /></span>
          <div>
            <strong>Bright Future School</strong>
            <small>Senior Secondary School</small>
          </div>
        </Link>
        <nav className="siteNav" aria-label="Main navigation">
          {["Home", "About", "Academics", "Admission", "Facilities", "Gallery", "Contact"].map((item) => (
            <a href={`#${item.toLowerCase()}`} key={item}>{item}</a>
          ))}
        </nav>
        <div className="siteHeaderActions">
          <a href="tel:+911234567890" className="iconTextLink"><Phone size={16} /> Call</a>
          <Link href="/dashboard" className="headerPortalLink">Portal</Link>
        </div>
      </header>

      <section id="home" className="schoolHero">
        <Image src="/images/school-portal-hero.png" alt="Modern school campus" fill priority sizes="100vw" className="schoolHeroImage" />
        <div className="schoolHeroOverlay" />
        <div className="schoolHeroContent">
          <p>Admissions Open 2026-27</p>
          <h1>Bright Future Senior Secondary School</h1>
          <span>
            A complete school website and secure management portal for admissions,
            academics, notices, fees, results and communication.
          </span>
          <div className="schoolHeroActions">
            <Link href="/signup" className="heroPrimaryLink">Online Admission <ArrowRight size={16} /></Link>
            <Link href="/student/login" className="heroSecondaryLink">Student & Parent Portal</Link>
          </div>
        </div>
        <div className="heroNoticeBox">
          <strong>Notice</strong>
          <span>Admission enquiry, fee payment and report card access are available online.</span>
        </div>
      </section>

      <section className="siteSearchBand" aria-label="Search and quick actions">
        <div className="siteSearch"><Search size={18} /><span>Search admissions, circulars, downloads, teachers and events</span></div>
        <a href="https://wa.me/911234567890" className="whatsappLink"><MessageCircle size={17} /> WhatsApp Chat</a>
        <a href="tel:+911234567890" className="callLink"><Phone size={17} /> Click to Call</a>
      </section>

      <section className="schoolStats" aria-label="School highlights">
        {highlights.map((item) => {
          const Icon = item.icon;
          return (
            <article key={item.label}>
              <Icon size={19} />
              <strong>{item.value}</strong>
              <span>{item.label}</span>
            </article>
          );
        })}
      </section>

      <section id="about" className="sectionGrid aboutGrid">
        <article className="sectionIntro">
          <p>About Us</p>
          <h2>School history, vision, mission and overview in one place.</h2>
          <span>
            Established in 2004, the school focuses on discipline, practical learning,
            strong academics and technology-enabled communication between school and home.
          </span>
        </article>
        <div className="infoPanel">
          <h3>Vision & Mission</h3>
          <p>To build confident, responsible and curious learners through value-based education, modern infrastructure and regular parent engagement.</p>
          <div className="miniPillGrid">
            {["CBSE Affiliation", "Smart Infrastructure", "Safe Transport", "Digital ERP"].map((item) => <span key={item}>{item}</span>)}
          </div>
        </div>
      </section>

      <section className="messageSection">
        <article>
          <p>Principal&apos;s Welcome Message</p>
          <h2>Learning should feel disciplined, caring and future-ready.</h2>
          <span>
            Our aim is to help every child grow academically, socially and emotionally.
            This website keeps parents, students and staff connected with daily school life.
          </span>
          <strong>Principal, Bright Future Senior Secondary School</strong>
        </article>
        <aside>
          <h3>Management</h3>
          {managementItems.map((item) => (
            <div className="checkRow" key={item}><CheckCircle2 size={16} /><span>{item}</span></div>
          ))}
        </aside>
      </section>

      <section className="admissionBanner" id="admission">
        <div>
          <p>Admission Open</p>
          <h2>Online admission enquiry and prospectus download are ready.</h2>
          <span>Process, eligibility, required documents, fee structure and online form can be managed from this section.</span>
        </div>
        <div className="bannerActions">
          <Link href="/signup" className="heroPrimaryLink">Apply Online</Link>
          <a href="#downloads" className="heroSecondaryLink">Download Prospectus</a>
        </div>
      </section>

      <section id="academics" className="contentSplit">
        <article className="sectionIntro">
          <p>Academics</p>
          <h2>Curriculum, subjects, classes and academic calendar.</h2>
          <span>Structured teaching methodology with regular exam planning, homework, results and performance reviews.</span>
        </article>
        <div className="featureListPanel">
          {academics.map((item) => <div className="checkRow" key={item}><BookOpen size={16} /><span>{item}</span></div>)}
        </div>
      </section>

      <section id="facilities" className="siteSection">
        <div className="sectionHead"><p>Facilities</p><h2>Campus facilities for modern learning.</h2></div>
        <div className="facilityGrid">
          {facilities.map((facility) => {
            const Icon = facility.icon;
            return <article key={facility.title}><Icon size={20} /><h3>{facility.title}</h3><p>{facility.body}</p></article>;
          })}
        </div>
      </section>

      <section id="news" className="contentSplit">
        <div className="newsPanel">
          <div className="sectionHead compactHead"><p>News & Events</p><h2>Latest news, circulars and upcoming events.</h2></div>
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

      <section id="gallery" className="siteSection">
        <div className="sectionHead"><p>Gallery</p><h2>Photo and video gallery preview.</h2></div>
        <div className="galleryGrid">
          {galleryPreview.map((item, index) => (
            <article key={item}>
              <Image src="/images/school-portal-hero.png" alt={`${item} gallery preview`} fill sizes="(max-width: 800px) 100vw, 25vw" style={{ objectPosition: `${45 + index * 6}% center` }} />
              <div><PlayCircle size={18} /><strong>{item}</strong></div>
            </article>
          ))}
        </div>
      </section>

      <section id="downloads" className="contentSplit">
        <div className="downloadPanel">
          <div className="sectionHead compactHead"><p>Downloads</p><h2>Forms, syllabus, holiday list, timetable and PDFs.</h2></div>
          <div className="downloadGrid">
            {downloads.map((item) => <a href="#" key={item}><Download size={16} /><span>{item}</span></a>)}
          </div>
        </div>
        <div className="featureListPanel">
          <h3>Quick Links</h3>
          {quickLinks.map((item) => <div className="checkRow" key={item}><ClipboardList size={16} /><span>{item}</span></div>)}
        </div>
      </section>

      <section id="portal" className="siteSection">
        <div className="sectionHead"><p>Student, Parent & Admin Portal</p><h2>Login access for every role.</h2></div>
        <div className="portalGrid">
          {accessCards.map((card) => (
            <article className="portalMiniCard" key={card.href}>
              <h3>{card.title}</h3>
              <p>{card.note}</p>
              <div><Link href={card.href}>Open Portal</Link><Link href={card.signupHref}>Signup</Link></div>
            </article>
          ))}
        </div>
      </section>

      <section className="siteSection">
        <div className="sectionHead"><p>Modern Features</p><h2>Website features already planned into the layout.</h2></div>
        <div className="modernFeatureGrid">
          {modernFeatures.map((item) => <span key={item}><CheckCircle2 size={15} /> {item}</span>)}
        </div>
      </section>

      <section id="contact" className="contactSection">
        <div>
          <p>Contact Us</p>
          <h2>Visit or contact the school office.</h2>
          <div className="contactRows">
            <span><MapPin size={16} /> Main Road, Jaipur, Rajasthan</span>
            <span><Phone size={16} /> +91 12345 67890</span>
            <span><Mail size={16} /> info@brightfuture.school</span>
          </div>
        </div>
        <form className="contactForm">
          <input aria-label="Name" placeholder="Your name" />
          <input aria-label="Phone" placeholder="Phone number" />
          <input aria-label="Message" placeholder="Message" />
          <button type="button">Send Enquiry</button>
        </form>
        <div className="mapBox">
          <MapPin size={24} />
          <strong>Google Map</strong>
          <span>Embed school location here</span>
        </div>
      </section>

      <footer className="siteFooter">
        <div>
          <strong>Bright Future Senior Secondary School</strong>
          <span>Home | About | Admission | Gallery | FAQ | Alumni | Privacy Policy | Terms & Conditions</span>
        </div>
        <div className="footerActions">
          <Link href="/admin/login"><BriefcaseBusiness size={15} /> Admin Panel</Link>
          <a href="#news"><Bell size={15} /> Notices</a>
          <a href="#downloads"><FileText size={15} /> Downloads</a>
        </div>
      </footer>
    </main>
  );
}
