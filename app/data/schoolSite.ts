export const schoolProfile = {
  name: "Bright Future Senior Secondary School",
  shortName: "Bright Future School",
  tagline: "Senior Secondary Campus",
  phone: "+91 12345 67890",
  phoneHref: "tel:+911234567890",
  whatsappHref: "https://wa.me/911234567890",
  email: "info@brightfuture.school",
  address: "Main Road, Jaipur, Rajasthan",
  session: "2026-27"
};

export type WebsiteContent = {
  schoolName: string;
  shortName: string;
  tagline: string;
  session: string;
  phone: string;
  email: string;
  address: string;
  heroEyebrow: string;
  heroTitle: string;
  heroBody: string;
  aboutTitle: string;
  aboutBody: string;
  admissionTitle: string;
  admissionBody: string;
  contactTitle: string;
  contactBody: string;
  downloadDocuments: WebsiteDownloadDocument[];
  updatedAt?: string;
};

export type WebsiteDownloadDocument = {
  slug: string;
  title: string;
  filename: string;
  body: string;
};

export const defaultDownloadDocuments: WebsiteDownloadDocument[] = [
  {
    slug: "admission-form",
    title: "Admission Form",
    filename: "admission-form.pdf",
    body: [
      "Student Name: ______________________________",
      "Class Applying For: __________ Section: ______",
      "Date of Birth: __________ Gender: __________",
      "Guardian Name: _____________________________",
      "Guardian Phone: ____________________________",
      "Address: __________________________________",
      "Documents: Birth certificate, Aadhaar, report card, photos"
    ].join("\n")
  },
  {
    slug: "tc-form",
    title: "TC Form",
    filename: "tc-form.pdf",
    body: [
      "Student Name: ______________________________",
      "Admission No: ______________________________",
      "Class/Section: _____________________________",
      "Reason for TC: _____________________________",
      "Fee Clearance: _____________________________",
      "Guardian Signature: ________________________"
    ].join("\n")
  },
  {
    slug: "syllabus",
    title: "Syllabus",
    filename: "syllabus.pdf",
    body: [
      "English: Reading, writing, grammar and literature.",
      "Mathematics: Number system, algebra, geometry and data handling.",
      "Science: Physics, Chemistry, Biology concepts and practical work.",
      "Social Science: History, Civics, Geography and Economics.",
      "Computer: Digital literacy, coding basics and projects."
    ].join("\n")
  },
  {
    slug: "holiday-list",
    title: "Holiday List",
    filename: "holiday-list.pdf",
    body: [
      "Independence Day - 15 Aug 2026",
      "Raksha Bandhan - As per school circular",
      "Gandhi Jayanti - 02 Oct 2026",
      "Diwali Break - As per academic calendar",
      "Winter Break - As per academic calendar",
      "Republic Day - 26 Jan 2027"
    ].join("\n")
  },
  {
    slug: "time-table",
    title: "Time Table",
    filename: "time-table.pdf",
    body: [
      "08:00 - 08:20 Assembly",
      "08:20 - 09:00 Period 1",
      "09:00 - 09:40 Period 2",
      "09:40 - 10:20 Period 3",
      "10:20 - 10:40 Break",
      "10:40 - 13:40 Academic periods and activities"
    ].join("\n")
  },
  {
    slug: "homework-pdf",
    title: "Homework PDF",
    filename: "homework-guidelines.pdf",
    body: [
      "Check student portal daily for teacher-assigned homework.",
      "Submit homework before due date.",
      "Attach PDF/video/link where teacher requests online submission.",
      "Late submissions may require teacher approval.",
      "Use neat handwriting and mention name, class and roll number."
    ].join("\n")
  },
  {
    slug: "prospectus",
    title: "Prospectus",
    filename: "school-prospectus.pdf",
    body: [
      "Modern classrooms, laboratories, library and sports facilities.",
      "Secure student, teacher, staff and admin portals.",
      "Online admission application and reception verification workflow.",
      "Attendance, homework, exam, fee and notice modules.",
      "Contact office for class-wise eligibility and fee details."
    ].join("\n")
  },
  {
    slug: "fee-structure",
    title: "Fee Structure",
    filename: "fee-structure.pdf",
    body: [
      "Admission Fee: Contact office for current session.",
      "Monthly Tuition Fee: Class-wise as approved by school management.",
      "Transport Fee: Route-wise applicable.",
      "Exam/Activity Fee: As per school circular.",
      "Payment: School fee counter or authorized online methods."
    ].join("\n")
  }
];

export const defaultWebsiteContent: WebsiteContent = {
  schoolName: schoolProfile.name,
  shortName: schoolProfile.shortName,
  tagline: schoolProfile.tagline,
  session: schoolProfile.session,
  phone: schoolProfile.phone,
  email: schoolProfile.email,
  address: schoolProfile.address,
  heroEyebrow: `Admissions Open ${schoolProfile.session}`,
  heroTitle: schoolProfile.name,
  heroBody:
    "A complete modern school website with secure portals for admissions, academics, notices, fees, results, downloads and student communication.",
  aboutTitle: "School history, vision, mission and overview in one place.",
  aboutBody:
    "Established in 2004, the school focuses on discipline, practical learning, strong academics and technology-enabled communication between school and home.",
  admissionTitle: "Online admission enquiry and prospectus download are ready.",
  admissionBody:
    "Process, eligibility, required documents, fee structure and online form can be managed from the admission page.",
  contactTitle: "Visit or contact the school office.",
  contactBody: "Admission, transport, fee, documents ya portal access ke liye office team available hai.",
  downloadDocuments: defaultDownloadDocuments
};

export const highlights = [
  { label: "Students", value: "1200+" },
  { label: "Board", value: "CBSE" },
  { label: "Classes", value: "Nursery-12" },
  { label: "Smart Rooms", value: "35+" }
];

export const portals = [
  {
    label: "Student Portal",
    href: "/student/login",
    signupHref: "/signup?role=student",
    body: "Attendance, homework, results, report card and notices."
  },
  {
    label: "Teacher Portal",
    href: "/teacher/login",
    signupHref: "/signup?role=teacher",
    body: "Class attendance, assignments, marks and communication."
  },
  {
    label: "Staff Portal",
    href: "/staff/login",
    signupHref: "/signup?role=staff",
    body: "Admissions, records, fee follow-ups and office work."
  },
  {
    label: "Admin Portal",
    href: "/admin/login",
    signupHref: "/signup?role=admin",
    body: "Manage news, teachers, admissions, gallery, users and downloads."
  }
];

export const quickLinks = [
  "Online Admission",
  "Fee Structure",
  "Prospectus",
  "TC Form",
  "Holiday List",
  "Time Table",
  "Syllabus",
  "Career / Vacancy"
];

export const newsItems = [
  { tag: "Admission", title: "Admissions open for session 2026-27", date: "30 Jun 2026" },
  { tag: "Circular", title: "Parent-teacher meeting schedule released", date: "05 Jul 2026" },
  { tag: "Event", title: "Inter-house sports trials start next week", date: "09 Jul 2026" }
];

export const facilities = [
  {
    title: "Smart Classes",
    slug: "smart-classes",
    body: "Digital boards, multimedia learning and interactive classroom sessions.",
    details: [
      "Interactive lessons with visual explainers and topic-wise practice.",
      "Digital content support for science, mathematics, social science and languages.",
      "Teacher-led classroom activities with regular revision checkpoints."
    ]
  },
  {
    title: "Library & Reading Room",
    slug: "library",
    body: "Reading room, reference books, newspapers and exam preparation material.",
    details: [
      "Age-wise reading shelves for primary, middle and senior classes.",
      "Reference books, competition material and daily newspaper reading.",
      "Quiet study hours and guided reading activities."
    ]
  },
  {
    title: "Computer Lab",
    slug: "computer-lab",
    body: "Practical computer education with supervised access and modern systems.",
    details: [
      "Hands-on classes for basic computing, coding concepts and digital literacy.",
      "Supervised lab periods with safe access rules.",
      "Project-based computer learning for senior students."
    ]
  },
  {
    title: "Science Labs",
    slug: "science-labs",
    body: "Physics, chemistry and biology practical learning with safety guidance.",
    details: [
      "Separate practical planning for Physics, Chemistry and Biology.",
      "Safety-first experiments with teacher supervision.",
      "Observation, record writing and viva preparation support."
    ]
  },
  {
    title: "Sports & Fitness",
    slug: "sports",
    body: "Outdoor and indoor sports with competitions and fitness activities.",
    details: [
      "House-wise tournaments and annual sports day.",
      "Fitness drills, yoga sessions and team-building activities.",
      "Coaching support for selected school-level competitions."
    ]
  },
  {
    title: "Safe Transport",
    slug: "transport",
    body: "Route-wise transport support with secure student movement tracking.",
    details: [
      "Route-wise pickup and drop planning.",
      "Driver and staff verification process.",
      "Parent communication for route updates and timing changes."
    ]
  }
];

export const academicFeatures = [
  "CBSE aligned curriculum",
  "Classes Nursery to 12th",
  "Science, Commerce and Humanities",
  "Activity based teaching methodology",
  "Academic calendar and exam planning",
  "Regular homework and progress review"
];

export const admissionSteps = [
  "Submit online enquiry or visit the school office.",
  "Collect prospectus, fee structure and class eligibility details.",
  "Complete registration with student and parent documents.",
  "Attend interaction or entrance assessment where applicable.",
  "Confirm admission after document verification and fee payment."
];

export const downloads = defaultDownloadDocuments.slice(0, 6).map((document) => document.title);

export const achievements = [
  "Board result toppers",
  "Sports achievements",
  "Awards and competitions",
  "Annual function recognition"
];

export const galleryPreview = [
  "Annual Function",
  "Sports Day",
  "Independence Day",
  "Science Exhibition",
  "Classroom Activities",
  "Award Ceremony"
];

export const modernFeatures = [
  "Mobile responsive design",
  "Search bar",
  "Hindi + English ready",
  "WhatsApp chat button",
  "Click-to-call button",
  "Newsletter",
  "Notice popup",
  "Online admission",
  "Online fee payment",
  "SEO friendly",
  "Fast loading",
  "Secure portals"
];
