"use client";

import {
  AlertTriangle,
  ArrowLeft,
  ArrowRight,
  Bell,
  BookOpenCheck,
  BriefcaseBusiness,
  Bus,
  CalendarDays,
  ClipboardList,
  CircleAlert,
  Coins,
  Download,
  ExternalLink,
  FileText,
  Gauge,
  Globe2,
  LayoutDashboard,
  LineChart,
  LogOut,
  Menu,
  MessageSquareText,
  ReceiptText,
  Save,
  Search,
  Send,
  ShieldCheck,
  Sparkles,
  Target,
  UsersRound,
  WalletCards
} from "lucide-react";
import { useRouter } from "next/navigation";
import type { CSSProperties } from "react";
import { useEffect, useMemo, useState } from "react";
import { defaultWebsiteContent, type WebsiteContent, type WebsiteDownloadDocument } from "../data/schoolSite";
import AppLoader from "./AppLoader";

type Role = "admin" | "teacher" | "student" | "parent" | "staff";

type DashboardStat = {
  label: string;
  value: string;
  trend: string;
};

type RoleDashboardProps = {
  role: Role;
};

type DashboardTab =
  | "overview"
  | "analytics"
  | "calendar"
  | "command"
  | "accounts"
  | "payroll"
  | "transport"
  | "admissions"
  | "records"
  | "classes"
  | "attendance"
  | "homework"
  | "parents"
  | "exams"
  | "studentProfile"
  | "fees"
  | "performance"
  | "approvals"
  | "website"
  | "insights"
  | "notices";

type MeResponse = {
  user: {
    name: string;
    role: string;
    email: string;
  };
};

type AdminAttendancePoint = {
  day: string;
  present: number;
  late: number;
  absent: number;
  leave: number;
  total: number;
  attendanceRate: number;
};

type AdminFeePoint = {
  month: string;
  billed: number;
  collected: number;
  due: number;
};

type AdminAdmissionPoint = {
  month: string;
  count: number;
};

type AdminClassStrength = {
  classLabel: string;
  count: number;
};

type AdminStaffBreakdown = {
  role: string;
  count: number;
};

type AdminCalendarEvent = {
  id: string;
  title: string;
  date: string;
  type: "exam" | "fee" | "notice";
  meta: string;
};

type AdminExam = {
  id: string;
  title: string;
  subject: string;
  classLabel: string;
  examDate: string;
};

type AdminFeeAlert = {
  id: string;
  invoiceNo: string;
  studentName: string;
  classLabel: string;
  amountDue: number;
  status: "paid" | "partial" | "pending" | "overdue";
  dueDate: string;
};

type AdminInsights = {
  attendanceTrend: AdminAttendancePoint[];
  feeTrend: AdminFeePoint[];
  admissionsTrend: AdminAdmissionPoint[];
  classStrength: AdminClassStrength[];
  staffBreakdown?: AdminStaffBreakdown[];
  calendarEvents: AdminCalendarEvent[];
  upcomingExams: AdminExam[];
  feeAlerts: AdminFeeAlert[];
  security: {
    pendingApprovals: number;
    overdueFees: number;
    attendanceSyncToday: number;
    authMode: string;
  };
};

type RoleDashboardApiResponse = {
  role: Role;
  title: string;
  intro: string;
  stats: DashboardStat[];
  modules: string[];
  notices: Array<{
    id: string;
    title: string;
    body: string;
    priority: string;
    audience: string;
    publishAt: string;
  }>;
  profile?: {
    label: string;
    items: Array<{ key: string; value: string }>;
  };
  pendingApprovals?: Array<{
    id: string;
    name: string;
    email: string;
    role: string;
    createdAt: string;
  }>;
  adminInsights?: AdminInsights;
  teacherWorkspace?: TeacherWorkspace;
  studentWorkspace?: StudentWorkspace;
  staffWorkspace?: StaffWorkspace;
};

type TeacherStudent = {
  id: string;
  admissionNo: string;
  name: string;
  gender: string;
  className: string;
  section: string;
  rollNo?: string;
  phone?: string;
  address?: string;
  guardian?: {
    name?: string;
    phone?: string;
    email?: string;
    relation?: string;
  };
  status: string;
};

type TeacherClass = {
  id: string;
  name: string;
  section: string;
  capacity: number;
  timetable: Array<{
    day?: string;
    period?: number;
    subject?: string;
  }>;
  students: TeacherStudent[];
};

type TeacherWorkspace = {
  staff: {
    id: string;
    employeeCode: string;
    name: string;
    department: string;
    subjects: string[];
    phone: string;
    email: string;
    profileImageUrl?: string;
    qualification?: string;
    experience?: string;
    bio?: string;
  };
  classes: TeacherClass[];
  todayAttendance: Array<{
    classLabel: string;
    className: string;
    section: string;
    records: Array<{ student: string; status: "present" | "absent" | "late" | "leave"; note: string }>;
  }>;
  exams: Array<AdminExam & { className: string; section: string; maxMarks: number }>;
  homework: TeacherHomework[];
};

type TeacherHomework = {
  id: string;
  title: string;
  description: string;
  subject: string;
  className: string;
  section: string;
  classLabel: string;
  dueDate?: string;
  scheduleAt?: string;
  attachmentType: "none" | "pdf" | "video" | "voice" | "link";
  attachmentUrl: string;
  status: "draft" | "scheduled" | "active" | "closed";
  submitted: number;
  pending: number;
  reviewed: number;
  total: number;
};

type StudentHomework = {
  id: string;
  title: string;
  description: string;
  subject: string;
  classLabel: string;
  teacherName: string;
  teacherDepartment: string;
  dueDate?: string;
  scheduleAt?: string;
  attachmentType: "none" | "pdf" | "video" | "voice" | "link";
  attachmentUrl: string;
  status: "draft" | "scheduled" | "active" | "closed";
  submissionStatus: "pending" | "submitted" | "reviewed";
  submittedAt?: string | null;
  marks?: number | null;
  feedback: string;
};

type StudentWorkspace = {
  student: TeacherStudent & { dob?: string; profileImageUrl?: string };
  documents: Array<{
    id: string;
    title: string;
    category: string;
    url: string;
    resourceType: string;
    format: string;
    bytes: number;
    createdAt: string;
  }>;
  attendance: {
    summary: { total: number; present: number; late: number; absent: number; leave: number; percent: number };
    history: Array<{ date: string; status: "present" | "absent" | "late" | "leave" | "missing"; note: string }>;
  };
  fees: {
    totalBilled: number;
    totalPaid: number;
    totalDue: number;
    items: Array<{
      id: string;
      invoiceNo: string;
      month: string;
      amount: number;
      paidAmount: number;
      dueAmount: number;
      dueDate?: string;
      paidAt?: string;
      status: "paid" | "partial" | "pending" | "overdue";
    }>;
  };
  exams: Array<AdminExam & { maxMarks: number; result: { marks?: number; grade?: string; remarks?: string } | null }>;
  homework: StudentHomework[];
  performance: {
    attendancePercent: number;
    homeworkCompletion: number;
    feePaidPercent: number;
    upcomingExamCount: number;
    riskLevel: string;
    strengths: string[];
  };
};

type StaffAdmissionApplication = {
  id: string;
  applicationNo: string;
  studentName: string;
  gender: string;
  dob?: string;
  className: string;
  section: string;
  previousSchool: string;
  bloodGroup: string;
  phone: string;
  address: string;
  guardian?: {
    name?: string;
    phone?: string;
    email?: string;
    relation?: string;
    occupation?: string;
  };
  documents: Array<{ name: string; status: "pending" | "received" | "verified" }>;
  status: "new" | "verified" | "admitted" | "rejected";
  notes: string;
  createdAt: string;
  linkedStudent?: {
    admissionNo?: string;
    name?: string;
    className?: string;
    section?: string;
    rollNo?: string;
  } | null;
};

type StaffFeeDeskItem = {
  id: string;
  invoiceNo: string;
  month: string;
  amount: number;
  paidAmount: number;
  dueAmount: number;
  dueDate?: string;
  status: "paid" | "partial" | "pending" | "overdue";
  student: {
    id: string;
    admissionNo: string;
    name: string;
    classLabel: string;
    guardianPhone: string;
  };
};

type StaffWorkspace = {
  access: {
    role: string;
    canManageAdmissions: boolean;
    canManageFees: boolean;
  };
  admissions: StaffAdmissionApplication[];
  fees: StaffFeeDeskItem[];
  recentStudents: Array<{
    id: string;
    admissionNo: string;
    name: string;
    classLabel: string;
    guardian: string;
    phone: string;
  }>;
};

type MediaAssetItem = {
  _id: string;
  title: string;
  description?: string;
  category: "gallery" | "profile" | "student-document" | "teacher-photo";
  secureUrl: string;
  resourceType: string;
  format?: string;
  bytes?: number;
  createdAt?: string;
};

type WebsiteContentResponse = {
  content: WebsiteContent;
};

type DirectoryStudent = {
  _id: string;
  admissionNo: string;
  name: string;
  gender: string;
  dob?: string;
  className: string;
  section: string;
  rollNo?: string;
  phone?: string;
  address?: string;
  guardian?: {
    name?: string;
    phone?: string;
    email?: string;
    relation?: string;
  };
  status: string;
  createdAt?: string;
  updatedAt?: string;
};

type DirectoryStaff = {
  _id: string;
  employeeCode: string;
  name: string;
  role: string;
  department?: string;
  subjects?: string[];
  phone?: string;
  email?: string;
  joinedAt?: string;
  profileImageUrl?: string;
  qualification?: string;
  experience?: string;
  bio?: string;
  showOnWebsite?: boolean;
  status: string;
  createdAt?: string;
  updatedAt?: string;
};

type StudentsDirectoryResponse = {
  items: DirectoryStudent[];
  total: number;
};

type DirectoryView = "students" | "teachers" | "staff";

type DirectoryProfile =
  | { kind: "student"; id: string }
  | { kind: "staff"; id: string }
  | null;

const websiteEditorFields: Array<{
  key: keyof WebsiteContent;
  label: string;
  type?: "textarea";
}> = [
  { key: "schoolName", label: "School full name" },
  { key: "shortName", label: "Header short name" },
  { key: "tagline", label: "Header tagline" },
  { key: "session", label: "Admission session" },
  { key: "phone", label: "Phone number" },
  { key: "email", label: "Email" },
  { key: "address", label: "Address", type: "textarea" },
  { key: "heroEyebrow", label: "Home hero small line" },
  { key: "heroTitle", label: "Home hero title", type: "textarea" },
  { key: "heroBody", label: "Home hero description", type: "textarea" },
  { key: "aboutTitle", label: "About section title", type: "textarea" },
  { key: "aboutBody", label: "About section text", type: "textarea" },
  { key: "admissionTitle", label: "Admission banner title", type: "textarea" },
  { key: "admissionBody", label: "Admission banner text", type: "textarea" },
  { key: "contactTitle", label: "Contact title", type: "textarea" },
  { key: "contactBody", label: "Contact helper text", type: "textarea" }
];

const roleAllowedMap: Record<Role, string[]> = {
  admin: ["admin"],
  teacher: ["teacher"],
  student: ["student"],
  parent: ["parent"],
  staff: ["staff", "accountant", "reception"]
};

const roleLoginMap: Record<Role, string> = {
  admin: "/admin/login",
  teacher: "/teacher/login",
  student: "/student/login",
  parent: "/parent/login",
  staff: "/staff/login"
};

const salaryBands: Record<string, number> = {
  admin: 52000,
  teacher: 36000,
  accountant: 32000,
  reception: 24000,
  driver: 22000,
  staff: 26000
};

function formatRoleLabel(role: string) {
  return role
    .split(/[-_\s]+/)
    .filter(Boolean)
    .map((part) => `${part.charAt(0).toUpperCase()}${part.slice(1)}`)
    .join(" ");
}

function getInitials(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part.charAt(0).toUpperCase())
    .join("") || "NA";
}

function toDayKey(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function formatDate(dateValue: string) {
  const parsed = new Date(dateValue);
  if (Number.isNaN(parsed.getTime())) return "-";
  return parsed.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric"
  });
}

function formatDayKey(dayKey: string) {
  const [year, month, day] = dayKey.split("-").map((value) => Number(value));
  if (!year || !month || !day) return "Selected Day";
  const parsed = new Date(year, month - 1, day);
  return parsed.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    weekday: "short"
  });
}

function formatMoney(amount: number) {
  return `Rs ${Math.round(amount).toLocaleString("en-IN")}`;
}

function escapeCsvValue(value: string | number) {
  const text = String(value);
  if (!/[",\n]/.test(text)) return text;
  return `"${text.replaceAll('"', '""')}"`;
}

function getLineGeometry(series: number[], width: number, height: number) {
  if (!series.length) {
    return { line: "", area: "" };
  }

  const xPadding = 10;
  const yPadding = 8;
  const maxValue = Math.max(1, ...series);
  const chartWidth = width - xPadding * 2;
  const chartHeight = height - yPadding * 2;
  const step = series.length > 1 ? chartWidth / (series.length - 1) : 0;

  const points = series.map((value, index) => {
    const x = xPadding + index * step;
    const y = height - yPadding - (value / maxValue) * chartHeight;
    return { x, y };
  });

  const line = points.map((point) => `${point.x},${point.y}`).join(" ");
  const area = [
    `M ${points[0].x} ${height - yPadding}`,
    ...points.map((point) => `L ${point.x} ${point.y}`),
    `L ${points[points.length - 1].x} ${height - yPadding}`,
    "Z"
  ].join(" ");

  return { line, area };
}

function WebsiteEditor({
  draft,
  status,
  saving,
  onChange,
  onDownloadChange,
  galleryMedia,
  uploadStatus,
  uploadingKey,
  onGalleryUpload,
  onRemoveMedia,
  onReset,
  onSave
}: Readonly<{
  draft: WebsiteContent;
  status: string;
  saving: boolean;
  onChange: (key: keyof WebsiteContent, value: string) => void;
  onDownloadChange: (index: number, key: keyof WebsiteDownloadDocument, value: string) => void;
  galleryMedia: MediaAssetItem[];
  uploadStatus: string;
  uploadingKey: string;
  onGalleryUpload: (file: File | null) => void;
  onRemoveMedia: (id: string) => void;
  onReset: () => void;
  onSave: () => void;
}>) {
  return (
    <section className="panel websiteEditorPanel">
      <div className="panelHeader">
        <div>
          <h2>Website Editor</h2>
          <p className="panelSub">Homepage aur public header/footer ka content yahan se update hoga.</p>
        </div>
        <div className="websiteEditorActions">
          <a href="/" target="_blank" rel="noopener noreferrer" className="miniBtn previewBtn">
            <ExternalLink size={14} /> Preview
          </a>
          <button type="button" className="miniBtn" onClick={onReset}>
            Reset
          </button>
          <button type="button" className="miniBtn approveBtn" onClick={onSave} disabled={saving}>
            <Save size={14} /> {saving ? "Saving..." : "Save Website"}
          </button>
        </div>
      </div>

      {status && <div className="successBox">{status}</div>}

      <div className="websiteEditorGrid">
        {websiteEditorFields.map((field) => (
          <label className={field.type === "textarea" ? "websiteField wide" : "websiteField"} key={field.key}>
            <span>{field.label}</span>
            {field.type === "textarea" ? (
              <textarea value={String(draft[field.key] || "")} onChange={(event) => onChange(field.key, event.target.value)} />
            ) : (
              <input value={String(draft[field.key] || "")} onChange={(event) => onChange(field.key, event.target.value)} />
            )}
          </label>
        ))}
      </div>

      <section className="downloadEditorPanel">
        <div className="panelHeader">
          <div>
            <h2>Download PDF Content</h2>
            <p className="panelSub">Website par jo PDFs download hote hain unka content yahan se control hoga.</p>
          </div>
        </div>
        <div className="downloadEditorGrid">
          {draft.downloadDocuments.map((document, index) => (
            <article className="downloadEditorCard" key={document.slug || index}>
              <div className="downloadEditorFields">
                <label>
                  <span>Title</span>
                  <input value={document.title} onChange={(event) => onDownloadChange(index, "title", event.target.value)} />
                </label>
                <label>
                  <span>URL Slug</span>
                  <input value={document.slug} onChange={(event) => onDownloadChange(index, "slug", event.target.value)} />
                </label>
                <label>
                  <span>Filename</span>
                  <input value={document.filename} onChange={(event) => onDownloadChange(index, "filename", event.target.value)} />
                </label>
                <label className="wide">
                  <span>PDF Lines</span>
                  <textarea value={document.body} onChange={(event) => onDownloadChange(index, "body", event.target.value)} />
                </label>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="downloadEditorPanel">
        <div className="panelHeader">
          <div>
            <h2>Gallery Images</h2>
            <p className="panelSub">Admin yahan se main website aur gallery page ke images add/remove karega.</p>
          </div>
          <label className="miniBtn approveBtn mediaUploadBtn">
            <input
              type="file"
              accept="image/*"
              onChange={(event) => onGalleryUpload(event.target.files?.[0] || null)}
              disabled={uploadingKey === "gallery"}
            />
            <Download size={14} /> {uploadingKey === "gallery" ? "Uploading..." : "Upload Image"}
          </label>
        </div>
        {uploadStatus && <div className="successBox">{uploadStatus}</div>}
        <div className="mediaManagerGrid">
          {galleryMedia.map((item) => (
            <article className="mediaManagerCard" key={item._id}>
              <img src={item.secureUrl} alt={item.title} />
              <div>
                <strong>{item.title}</strong>
                <span>{item.format || item.resourceType}</span>
              </div>
              <button type="button" className="miniBtn rejectBtn" onClick={() => onRemoveMedia(item._id)}>
                Remove
              </button>
            </article>
          ))}
          {!galleryMedia.length && <p className="emptyHint">No uploaded gallery image yet.</p>}
        </div>
      </section>
    </section>
  );
}

export default function RoleDashboard({ role }: RoleDashboardProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState("");
  const [dashboardData, setDashboardData] = useState<RoleDashboardApiResponse | null>(null);
  const [actionLoading, setActionLoading] = useState<string>("");
  const [calendarMonth, setCalendarMonth] = useState(() => new Date());
  const [selectedDayKey, setSelectedDayKey] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [showQuickActions, setShowQuickActions] = useState(false);
  const [activeTab, setActiveTab] = useState<DashboardTab>("overview");
  const [websiteDraft, setWebsiteDraft] = useState<WebsiteContent>(defaultWebsiteContent);
  const [websiteStatus, setWebsiteStatus] = useState("");
  const [websiteSaving, setWebsiteSaving] = useState(false);
  const [directoryLoading, setDirectoryLoading] = useState(false);
  const [directoryLoaded, setDirectoryLoaded] = useState(false);
  const [directoryStatus, setDirectoryStatus] = useState("");
  const [directoryView, setDirectoryView] = useState<DirectoryView>("students");
  const [directorySearch, setDirectorySearch] = useState("");
  const [selectedClassKey, setSelectedClassKey] = useState("all");
  const [selectedDirectoryProfile, setSelectedDirectoryProfile] = useState<DirectoryProfile>(null);
  const [directoryStudents, setDirectoryStudents] = useState<DirectoryStudent[]>([]);
  const [directoryStaff, setDirectoryStaff] = useState<DirectoryStaff[]>([]);
  const [selectedTeacherClassId, setSelectedTeacherClassId] = useState("");
  const [attendanceDraft, setAttendanceDraft] = useState<Record<string, "present" | "absent" | "late" | "leave">>({});
  const [attendanceStatus, setAttendanceStatus] = useState("");
  const [attendanceSaving, setAttendanceSaving] = useState(false);
  const [parentMessageTitle, setParentMessageTitle] = useState("Class update");
  const [parentMessageBody, setParentMessageBody] = useState("");
  const [parentMessageStatus, setParentMessageStatus] = useState("");
  const [parentMessageSending, setParentMessageSending] = useState(false);
  const [homeworkTitle, setHomeworkTitle] = useState("");
  const [homeworkDescription, setHomeworkDescription] = useState("");
  const [homeworkSubject, setHomeworkSubject] = useState("");
  const [homeworkDueDate, setHomeworkDueDate] = useState("");
  const [homeworkAttachmentUrl, setHomeworkAttachmentUrl] = useState("");
  const [homeworkStatus, setHomeworkStatus] = useState("");
  const [homeworkSaving, setHomeworkSaving] = useState(false);
  const [studentHomeworkSubmitting, setStudentHomeworkSubmitting] = useState("");
  const [staffActionLoading, setStaffActionLoading] = useState("");
  const [staffStatus, setStaffStatus] = useState("");
  const [uploadStatus, setUploadStatus] = useState("");
  const [uploadingKey, setUploadingKey] = useState("");
  const [galleryMedia, setGalleryMedia] = useState<MediaAssetItem[]>([]);

  useEffect(() => {
    let active = true;

    const validateSession = async () => {
      try {
        const [meResponse, dashboardResponse] = await Promise.all([
          fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/me`, { credentials: "include" }),
          fetch(`${process.env.NEXT_PUBLIC_API_URL}/dashboard/role-data`, { credentials: "include" })
        ]);

        if (!meResponse.ok || !dashboardResponse.ok) {
          router.replace(roleLoginMap[role]);
          return;
        }

        const data = (await meResponse.json()) as MeResponse;
        const roleData = (await dashboardResponse.json()) as RoleDashboardApiResponse;
        const allowed = roleAllowedMap[role];
        if (!allowed.includes(data.user.role)) {
          router.replace("/");
          return;
        }

        if (active) {
          setName(data.user.name);
          setDashboardData(roleData);
          setCalendarMonth(new Date());
          setSelectedDayKey("");
          setLoading(false);
        }

        if (role === "admin") {
          const websiteResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/website-content`, {
            credentials: "include"
          });
          if (websiteResponse.ok && active) {
            const websiteData = (await websiteResponse.json()) as WebsiteContentResponse;
            setWebsiteDraft(websiteData.content);
          }
        }
      } catch {
        router.replace(roleLoginMap[role]);
      }
    };

    validateSession();

    return () => {
      active = false;
    };
  }, [role, router]);

  useEffect(() => {
    if (role !== "admin" || activeTab !== "records" || directoryLoaded) return;

    let active = true;
    const loadDirectory = async () => {
      setDirectoryLoading(true);
      setDirectoryStatus("");
      try {
        const [studentsResponse, staffResponse] = await Promise.all([
          fetch(`${process.env.NEXT_PUBLIC_API_URL}/students?limit=500`, { credentials: "include" }),
          fetch(`${process.env.NEXT_PUBLIC_API_URL}/staff`, { credentials: "include" })
        ]);

        if (!studentsResponse.ok || !staffResponse.ok) {
          if (active) setDirectoryStatus("Records load nahi ho pa rahe. Login/session check karein.");
          return;
        }

        const studentsData = (await studentsResponse.json()) as StudentsDirectoryResponse;
        const staffData = (await staffResponse.json()) as DirectoryStaff[];

        if (active) {
          setDirectoryStudents(studentsData.items || []);
          setDirectoryStaff(staffData || []);
          setDirectoryLoaded(true);
          const firstStudent = studentsData.items?.[0];
          const firstStaff = staffData?.[0];
          if (firstStudent) {
            setSelectedDirectoryProfile({ kind: "student", id: firstStudent._id });
          } else if (firstStaff) {
            setSelectedDirectoryProfile({ kind: "staff", id: firstStaff._id });
          }
        }
      } catch {
        if (active) setDirectoryStatus("Server se records connect nahi ho pa rahe.");
      } finally {
        if (active) setDirectoryLoading(false);
      }
    };

    loadDirectory();

    return () => {
      active = false;
    };
  }, [activeTab, directoryLoaded, directoryLoading, role]);

  useEffect(() => {
    if (role !== "admin" || activeTab !== "website") return;
    let active = true;
    const loadGalleryMedia = async () => {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/media?category=gallery`, { credentials: "include" });
      if (!response.ok) return;
      const data = (await response.json()) as { items: MediaAssetItem[] };
      if (active) setGalleryMedia(data.items || []);
    };
    loadGalleryMedia();
    return () => {
      active = false;
    };
  }, [activeTab, role]);

  const currentStaffAccess = dashboardData?.staffWorkspace?.access;
  const navItems: Array<{ label: string; key: DashboardTab; icon: typeof LayoutDashboard }> =
    role === "admin"
      ? [
          { label: "Overview", key: "overview", icon: LayoutDashboard },
          { label: "Analytics", key: "analytics", icon: LineChart },
          { label: "Calendar", key: "calendar", icon: CalendarDays },
          { label: "Command Center", key: "command", icon: Gauge },
          { label: "Accounts", key: "accounts", icon: WalletCards },
          { label: "Payroll", key: "payroll", icon: BriefcaseBusiness },
          { label: "Transport", key: "transport", icon: Bus },
          { label: "Records", key: "records", icon: ReceiptText },
          { label: "Website Editor", key: "website", icon: Globe2 },
          { label: "Approvals", key: "approvals", icon: ClipboardList }
        ]
      : role === "teacher"
        ? [
            { label: "Overview", key: "overview", icon: LayoutDashboard },
            { label: "My Classes", key: "classes", icon: UsersRound },
            { label: "Attendance", key: "attendance", icon: ClipboardList },
            { label: "Homework", key: "homework", icon: FileText },
            { label: "Student Updates", key: "parents", icon: MessageSquareText },
            { label: "Exams", key: "exams", icon: BookOpenCheck },
            { label: "Notices", key: "notices", icon: Bell }
          ]
        : role === "student"
          ? [
              { label: "Overview", key: "overview", icon: LayoutDashboard },
              { label: "My Profile", key: "studentProfile", icon: ReceiptText },
              { label: "Homework", key: "homework", icon: FileText },
              { label: "Attendance", key: "attendance", icon: ClipboardList },
              { label: "Exams", key: "exams", icon: BookOpenCheck },
              { label: "Fees", key: "fees", icon: WalletCards },
              { label: "Performance", key: "performance", icon: LineChart },
              { label: "Notices", key: "notices", icon: Bell }
            ]
          : role === "staff"
            ? [
                { label: "Overview", key: "overview", icon: LayoutDashboard },
                ...(currentStaffAccess?.canManageAdmissions
                  ? [{ label: "Admission Desk", key: "admissions" as DashboardTab, icon: ClipboardList }]
                  : []),
                ...(currentStaffAccess?.canManageFees
                  ? [{ label: "Fee Desk", key: "fees" as DashboardTab, icon: WalletCards }]
                  : []),
                { label: "Records", key: "records", icon: ReceiptText },
                { label: "Notices", key: "notices", icon: Bell }
              ]
            : [
                { label: "Overview", key: "overview", icon: LayoutDashboard },
                { label: "Insights", key: "insights", icon: LineChart },
                { label: "Calendar", key: "calendar", icon: CalendarDays },
                { label: "Notices", key: "notices", icon: Bell }
              ];

  const onLogout = async () => {
    await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/logout`, {
      method: "POST",
      credentials: "include"
    });
    localStorage.removeItem("user");
    router.push("/");
    router.refresh();
  };

  const onApprovalAction = async (userId: string, action: "approve" | "reject") => {
    setActionLoading(`${action}-${userId}`);
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/approval/${userId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ action })
      });

      if (!response.ok) {
        return;
      }

      setDashboardData((prev) => {
        if (!prev) return prev;
        const updatedPending = (prev.pendingApprovals || []).filter((item) => item.id !== userId);
        const updatedStats = prev.stats.map((stat) =>
          stat.label === "Signup Requests" ? { ...stat, value: String(updatedPending.length) } : stat
        );
        return {
          ...prev,
          pendingApprovals: updatedPending,
          stats: updatedStats,
          adminInsights: prev.adminInsights
            ? {
                ...prev.adminInsights,
                security: {
                  ...prev.adminInsights.security,
                  pendingApprovals: updatedPending.length
                }
              }
            : prev.adminInsights
        };
      });
    } finally {
      setActionLoading("");
    }
  };

  const onWebsiteDraftChange = (key: keyof WebsiteContent, value: string) => {
    setWebsiteDraft((prev) => ({ ...prev, [key]: value }));
    setWebsiteStatus("");
  };

  const onWebsiteDownloadChange = (index: number, key: keyof WebsiteDownloadDocument, value: string) => {
    setWebsiteDraft((prev) => ({
      ...prev,
      downloadDocuments: prev.downloadDocuments.map((document, documentIndex) =>
        documentIndex === index ? { ...document, [key]: value } : document
      )
    }));
    setWebsiteStatus("");
  };

  const onWebsiteSave = async () => {
    setWebsiteSaving(true);
    setWebsiteStatus("");
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/website-content`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(websiteDraft)
      });
      const data = (await response.json()) as Partial<WebsiteContentResponse> & { message?: string };
      if (!response.ok || !data.content) {
        setWebsiteStatus(data.message || "Website update failed.");
        return;
      }
      setWebsiteDraft(data.content);
      setWebsiteStatus("Website content saved. Public website ab updated content dikhayegi.");
    } catch {
      setWebsiteStatus("Server se connect nahi ho pa raha.");
    } finally {
      setWebsiteSaving(false);
    }
  };

  const uploadMediaFile = async (
    file: File | null,
    category: "gallery" | "profile" | "student-document" | "teacher-photo",
    title: string,
    ownerId?: string
  ) => {
    if (!file) return;
    setUploadingKey(category);
    setUploadStatus("");
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("category", category);
      formData.append("title", title || file.name);
      if (ownerId) formData.append("ownerId", ownerId);
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/uploads/cloudinary`, {
        method: "POST",
        credentials: "include",
        body: formData
      });
      const data = await response.json();
      if (!response.ok) {
        setUploadStatus(data.message || "Upload failed.");
        return;
      }
      setUploadStatus("Upload complete.");
      if (category === "gallery") {
        setGalleryMedia((prev) => [data.asset, ...prev]);
      }
      if (category === "profile" && role === "student") {
        setDashboardData((prev) =>
          prev?.studentWorkspace
            ? {
                ...prev,
                studentWorkspace: {
                  ...prev.studentWorkspace,
                  student: { ...prev.studentWorkspace.student, profileImageUrl: data.asset.secureUrl }
                }
              }
            : prev
        );
      }
      if (category === "student-document" && role === "student") {
        setDashboardData((prev) =>
          prev?.studentWorkspace
            ? {
                ...prev,
                studentWorkspace: {
                  ...prev.studentWorkspace,
                  documents: [
                    {
                      id: data.asset._id,
                      title: data.asset.title,
                      category: data.asset.category,
                      url: data.asset.secureUrl,
                      resourceType: data.asset.resourceType,
                      format: data.asset.format || "",
                      bytes: data.asset.bytes || 0,
                      createdAt: data.asset.createdAt
                    },
                    ...prev.studentWorkspace.documents
                  ]
                }
              }
            : prev
        );
      }
      if ((category === "profile" || category === "teacher-photo") && role === "teacher") {
        setDashboardData((prev) =>
          prev?.teacherWorkspace
            ? {
                ...prev,
                teacherWorkspace: {
                  ...prev.teacherWorkspace,
                  staff: { ...prev.teacherWorkspace.staff, profileImageUrl: data.asset.secureUrl }
                }
              }
            : prev
        );
      }
      if (category === "teacher-photo" && role === "admin" && ownerId) {
        setDirectoryStaff((prev) =>
          prev.map((staff) => (staff._id === ownerId ? { ...staff, profileImageUrl: data.asset.secureUrl, showOnWebsite: true } : staff))
        );
      }
    } catch {
      setUploadStatus("Upload server se connect nahi ho pa raha. Cloudinary env check karein.");
    } finally {
      setUploadingKey("");
    }
  };

  const removeMedia = async (id: string) => {
    setUploadStatus("");
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/media/${id}`, {
      method: "DELETE",
      credentials: "include"
    });
    if (!response.ok) {
      setUploadStatus("Media remove nahi ho paya.");
      return;
    }
    setGalleryMedia((prev) => prev.filter((item) => item._id !== id));
    setUploadStatus("Media removed from public website.");
  };

  const toggleTeacherWebsite = async (staff: DirectoryStaff) => {
    const nextValue = !staff.showOnWebsite;
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/staff/${staff._id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ showOnWebsite: nextValue })
    });
    if (!response.ok) {
      setDirectoryStatus("Teacher website visibility update nahi ho payi.");
      return;
    }
    setDirectoryStaff((prev) => prev.map((item) => (item._id === staff._id ? { ...item, showOnWebsite: nextValue } : item)));
  };

  const teacherWorkspace = role === "teacher" ? dashboardData?.teacherWorkspace : undefined;

  const selectedTeacherClass = useMemo(() => {
    if (!teacherWorkspace?.classes.length) return undefined;
    return (
      teacherWorkspace.classes.find((item) => item.id === selectedTeacherClassId) ||
      teacherWorkspace.classes[0]
    );
  }, [selectedTeacherClassId, teacherWorkspace]);

  const totalTeacherStudents = teacherWorkspace?.classes.reduce((sum, item) => sum + item.students.length, 0) || 0;
  const todayTeacherDay = new Date().toLocaleDateString("en-US", { weekday: "long" });
  const todaysTeacherPeriods =
    teacherWorkspace?.classes.flatMap((classItem) =>
      (classItem.timetable || [])
        .filter((period) => (period.day || "").toLowerCase() === todayTeacherDay.toLowerCase())
        .map((period) => ({
          ...period,
          classLabel: `${classItem.name}-${classItem.section}`,
          classId: classItem.id
        }))
    ) || [];
  const nextTeacherPeriod = [...todaysTeacherPeriods].sort((a, b) => (a.period || 0) - (b.period || 0))[0];
  const teacherAttendanceCounts = useMemo(() => {
    const counts = { present: 0, absent: 0, late: 0, leave: 0, total: 0 };
    teacherWorkspace?.todayAttendance.forEach((batch) => {
      batch.records.forEach((record) => {
        counts.total += 1;
        counts[record.status] += 1;
      });
    });
    return counts;
  }, [teacherWorkspace]);
  const pendingHomeworkReviews = teacherWorkspace?.homework.reduce((sum, item) => sum + item.submitted - item.reviewed, 0) || 0;
  const selectedClassHomework =
    teacherWorkspace?.homework.filter(
      (item) => item.className === selectedTeacherClass?.name && item.section === selectedTeacherClass?.section
    ) || [];

  useEffect(() => {
    if (role !== "teacher" || !teacherWorkspace?.classes.length || selectedTeacherClassId) return;
    setSelectedTeacherClassId(teacherWorkspace.classes[0].id);
  }, [role, selectedTeacherClassId, teacherWorkspace]);

  useEffect(() => {
    if (role !== "teacher" || !selectedTeacherClass) return;
    const todayRecord = teacherWorkspace?.todayAttendance.find(
      (item) => item.className === selectedTeacherClass.name && item.section === selectedTeacherClass.section
    );
    const nextDraft: Record<string, "present" | "absent" | "late" | "leave"> = {};
    selectedTeacherClass.students.forEach((student) => {
      const existing = todayRecord?.records.find((record) => record.student === student.id);
      nextDraft[student.id] = existing?.status || "present";
    });
    setAttendanceDraft(nextDraft);
    setAttendanceStatus(todayRecord ? "Aaj ki attendance already saved hai. Update kar sakte hain." : "");
  }, [role, selectedTeacherClass, teacherWorkspace]);

  const onAttendanceStatusChange = (studentId: string, status: "present" | "absent" | "late" | "leave") => {
    setAttendanceDraft((prev) => ({ ...prev, [studentId]: status }));
    setAttendanceStatus("");
  };

  const onSaveAttendance = async () => {
    if (!selectedTeacherClass) return;
    setAttendanceSaving(true);
    setAttendanceStatus("");
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/academics/attendance`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          date: new Date(),
          className: selectedTeacherClass.name,
          section: selectedTeacherClass.section,
          records: selectedTeacherClass.students.map((student) => ({
            student: student.id,
            status: attendanceDraft[student.id] || "present"
          }))
        })
      });
      setAttendanceStatus(response.ok ? "Attendance saved successfully." : "Attendance save nahi ho payi.");
    } catch {
      setAttendanceStatus("Server se attendance save nahi ho pa rahi.");
    } finally {
      setAttendanceSaving(false);
    }
  };

  const onSendParentMessage = async () => {
    if (!selectedTeacherClass || !parentMessageBody.trim()) {
      setParentMessageStatus("Message body likhna zaruri hai.");
      return;
    }
    setParentMessageSending(true);
    setParentMessageStatus("");
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/teacher/parent-message`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          className: selectedTeacherClass.name,
          section: selectedTeacherClass.section,
          title: parentMessageTitle,
          body: parentMessageBody,
          priority: "normal"
        })
      });
      if (!response.ok) {
        setParentMessageStatus("Parent notice create nahi ho paya.");
        return;
      }
      setParentMessageBody("");
      setParentMessageStatus("Student portal ke liye notice create ho gaya.");
    } catch {
      setParentMessageStatus("Server se parent message send nahi ho pa raha.");
    } finally {
      setParentMessageSending(false);
    }
  };

  const onCreateHomework = async () => {
    if (!selectedTeacherClass || !homeworkTitle.trim() || !homeworkDescription.trim()) {
      setHomeworkStatus("Class, title aur description zaruri hai.");
      return;
    }

    setHomeworkSaving(true);
    setHomeworkStatus("");
    try {
      const subject = homeworkSubject || teacherWorkspace?.staff.subjects[0] || "General";
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/teacher/homework`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          className: selectedTeacherClass.name,
          section: selectedTeacherClass.section,
          subject,
          title: homeworkTitle,
          description: homeworkDescription,
          dueDate: homeworkDueDate || undefined,
          attachmentType: homeworkAttachmentUrl ? "link" : "none",
          attachmentUrl: homeworkAttachmentUrl || undefined,
          status: homeworkDueDate ? "active" : "draft"
        })
      });

      const created = (await response.json()) as {
        _id?: string;
        title?: string;
        description?: string;
        subject?: string;
        className?: string;
        section?: string;
        dueDate?: string;
        attachmentType?: "none" | "pdf" | "video" | "voice" | "link";
        attachmentUrl?: string;
        status?: "draft" | "scheduled" | "active" | "closed";
        submissions?: unknown[];
      } & { message?: string };

      if (!response.ok || !created._id) {
        setHomeworkStatus(created.message || "Homework create nahi ho paya.");
        return;
      }

      setDashboardData((prev) => {
        if (!prev?.teacherWorkspace) return prev;
        const homework: TeacherHomework = {
          id: created._id || "",
          title: created.title || homeworkTitle,
          description: created.description || homeworkDescription,
          subject: created.subject || subject,
          className: created.className || selectedTeacherClass.name,
          section: created.section || selectedTeacherClass.section,
          classLabel: `${created.className || selectedTeacherClass.name}-${created.section || selectedTeacherClass.section}`,
          dueDate: created.dueDate,
          attachmentType: created.attachmentType || "none",
          attachmentUrl: created.attachmentUrl || "",
          status: created.status || "active",
          submitted: 0,
          reviewed: 0,
          pending: created.submissions?.length || selectedTeacherClass.students.length,
          total: created.submissions?.length || selectedTeacherClass.students.length
        };
        return {
          ...prev,
          teacherWorkspace: {
            ...prev.teacherWorkspace,
            homework: [homework, ...prev.teacherWorkspace.homework]
          }
        };
      });

      setHomeworkTitle("");
      setHomeworkDescription("");
      setHomeworkDueDate("");
      setHomeworkAttachmentUrl("");
      setHomeworkStatus("Homework created for selected class.");
    } catch {
      setHomeworkStatus("Server se homework create nahi ho pa raha.");
    } finally {
      setHomeworkSaving(false);
    }
  };

  const studentWorkspace = role === "student" ? dashboardData?.studentWorkspace : undefined;
  const pendingStudentHomework = studentWorkspace?.homework.filter((item) => item.submissionStatus === "pending") || [];
  const upcomingStudentExam = studentWorkspace?.exams
    .filter((exam) => new Date(exam.examDate).getTime() >= Date.now())
    .sort((a, b) => new Date(a.examDate).getTime() - new Date(b.examDate).getTime())[0];
  const latestAttendanceRecord = studentWorkspace?.attendance.history[0];

  const onSubmitStudentHomework = async (homeworkId: string) => {
    setStudentHomeworkSubmitting(homeworkId);
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/student/homework/${homeworkId}/submit`, {
        method: "POST",
        credentials: "include"
      });
      if (!response.ok) return;
      setDashboardData((prev) => {
        if (!prev?.studentWorkspace) return prev;
        return {
          ...prev,
          studentWorkspace: {
            ...prev.studentWorkspace,
            homework: prev.studentWorkspace.homework.map((homework) =>
              homework.id === homeworkId
                ? { ...homework, submissionStatus: "submitted", submittedAt: new Date().toISOString() }
                : homework
            )
          }
        };
      });
    } finally {
      setStudentHomeworkSubmitting("");
    }
  };

  const staffWorkspace = role === "staff" ? dashboardData?.staffWorkspace : undefined;
  const admissionQueue = staffWorkspace?.admissions || [];
  const feeDeskQueue = staffWorkspace?.fees || [];
  const staffPendingFeeTotal = feeDeskQueue.reduce((sum, item) => sum + item.dueAmount, 0);

  const onAdmissionAction = async (applicationId: string, action: "verify" | "admit" | "reject") => {
    setStaffActionLoading(`${action}-${applicationId}`);
    setStaffStatus("");
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admissions/applications/${applicationId}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ action })
      });
      const updated = await response.json();
      if (!response.ok) {
        setStaffStatus(updated.message || "Admission action failed.");
        return;
      }

      setDashboardData((prev) => {
        if (!prev?.staffWorkspace) return prev;
        const mappedApplication: StaffAdmissionApplication = {
          id: updated._id,
          applicationNo: updated.applicationNo,
          studentName: updated.studentName,
          gender: updated.gender,
          dob: updated.dob,
          className: updated.className,
          section: updated.section,
          previousSchool: updated.previousSchool || "",
          bloodGroup: updated.bloodGroup || "",
          phone: updated.phone || "",
          address: updated.address || "",
          guardian: updated.guardian || {},
          documents: updated.documents || [],
          status: updated.status,
          notes: updated.notes || "",
          createdAt: updated.createdAt,
          linkedStudent: updated.linkedStudent || null
        };
        const admissions =
          mappedApplication.status === "admitted" || mappedApplication.status === "rejected"
            ? prev.staffWorkspace.admissions.filter((item) => item.id !== applicationId)
            : prev.staffWorkspace.admissions.map((item) => (item.id === applicationId ? mappedApplication : item));
        return {
          ...prev,
          staffWorkspace: {
            ...prev.staffWorkspace,
            admissions
          }
        };
      });

      setStaffStatus(action === "admit" ? "Student admitted and record created." : `Application ${action} complete.`);
    } catch {
      setStaffStatus("Server se admission action nahi ho pa raha.");
    } finally {
      setStaffActionLoading("");
    }
  };

  const onCollectFee = async (feeId: string, amount: number) => {
    setStaffActionLoading(`fee-${feeId}`);
    setStaffStatus("");
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/finance/fees/${feeId}/pay`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ amount })
      });
      const updated = await response.json();
      if (!response.ok) {
        setStaffStatus(updated.message || "Fee payment failed.");
        return;
      }

      setDashboardData((prev) => {
        if (!prev?.staffWorkspace) return prev;
        const fees = prev.staffWorkspace.fees
          .map((fee) =>
            fee.id === feeId
              ? {
                  ...fee,
                  paidAmount: updated.paidAmount,
                  dueAmount: Math.max(0, updated.amount - updated.paidAmount),
                  status: updated.status
                }
              : fee
          )
          .filter((fee) => fee.status !== "paid");
        return {
          ...prev,
          staffWorkspace: {
            ...prev.staffWorkspace,
            fees
          }
        };
      });
      setStaffStatus("Fee payment recorded.");
    } catch {
      setStaffStatus("Server se fee collect nahi ho pa rahi.");
    } finally {
      setStaffActionLoading("");
    }
  };

  const adminInsights = role === "admin" ? dashboardData?.adminInsights : undefined;
  const normalizedSearchTerm = searchTerm.trim().toLowerCase();

  const filteredModules = useMemo(() => {
    if (!dashboardData) return [];
    if (!normalizedSearchTerm) return dashboardData.modules;
    return dashboardData.modules.filter((module) => module.toLowerCase().includes(normalizedSearchTerm));
  }, [dashboardData, normalizedSearchTerm]);

  const filteredNotices = useMemo(() => {
    if (!dashboardData) return [];
    if (!normalizedSearchTerm) return dashboardData.notices;
    return dashboardData.notices.filter((notice) =>
      [notice.title, notice.body, notice.priority, notice.audience]
        .join(" ")
        .toLowerCase()
        .includes(normalizedSearchTerm)
    );
  }, [dashboardData, normalizedSearchTerm]);

  const calendarData = useMemo(() => {
    if (!adminInsights) return null;

    const eventMap = new Map<string, AdminCalendarEvent[]>();
    adminInsights.calendarEvents.forEach((event) => {
      const eventDate = new Date(event.date);
      if (Number.isNaN(eventDate.getTime())) return;
      const dayKey = toDayKey(eventDate);
      const existing = eventMap.get(dayKey) || [];
      existing.push(event);
      eventMap.set(dayKey, existing);
    });

    const monthStart = new Date(calendarMonth.getFullYear(), calendarMonth.getMonth(), 1);
    const firstWeekday = monthStart.getDay();
    const startCellDate = new Date(monthStart);
    startCellDate.setDate(1 - firstWeekday);

    const today = new Date();
    const todayKey = toDayKey(today);
    const sameMonthAsToday =
      today.getFullYear() === monthStart.getFullYear() && today.getMonth() === monthStart.getMonth();

    const cells: Array<{
      key: string;
      day: number;
      isCurrentMonth: boolean;
      isToday: boolean;
      events: AdminCalendarEvent[];
    }> = [];

    for (let i = 0; i < 42; i += 1) {
      const cellDate = new Date(startCellDate);
      cellDate.setDate(startCellDate.getDate() + i);
      const key = toDayKey(cellDate);
      cells.push({
        key,
        day: cellDate.getDate(),
        isCurrentMonth: cellDate.getMonth() === monthStart.getMonth(),
        isToday: key === todayKey,
        events: eventMap.get(key) || []
      });
    }

    const defaultSelectedKey = sameMonthAsToday
      ? todayKey
      : toDayKey(new Date(monthStart.getFullYear(), monthStart.getMonth(), 1));

    return {
      monthLabel: monthStart.toLocaleDateString("en-IN", { month: "long", year: "numeric" }),
      weekdays: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
      cells,
      eventMap,
      defaultSelectedKey
    };
  }, [adminInsights, calendarMonth]);

  useEffect(() => {
    if (!calendarData || selectedDayKey) return;
    setSelectedDayKey(calendarData.defaultSelectedKey);
  }, [calendarData, selectedDayKey]);

  const selectedDayEvents = useMemo(() => {
    if (!calendarData || !selectedDayKey) return [];
    return calendarData.eventMap.get(selectedDayKey) || [];
  }, [calendarData, selectedDayKey]);

  const admissionsLine = useMemo(() => {
    const series = adminInsights?.admissionsTrend.map((item) => item.count) || [];
    return getLineGeometry(series, 300, 130);
  }, [adminInsights]);

  const totalAdmissions = adminInsights?.admissionsTrend.reduce((sum, item) => sum + item.count, 0) || 0;
  const totalBilled = adminInsights?.feeTrend.reduce((sum, item) => sum + item.billed, 0) || 0;
  const totalCollected = adminInsights?.feeTrend.reduce((sum, item) => sum + item.collected, 0) || 0;
  const totalDue = Math.max(0, totalBilled - totalCollected);
  const feeCollectionRate = totalBilled ? Math.round((totalCollected / totalBilled) * 100) : 0;
  const activeStudentCount = Number(
    dashboardData?.stats.find((stat) => stat.label === "Active Students")?.value.replace(/\D/g, "") || 0
  );
  const activeStaffCount = Number(
    dashboardData?.stats.find((stat) => stat.label === "Active Staff")?.value.replace(/\D/g, "") || 0
  );
  const attendanceAverage = adminInsights?.attendanceTrend.length
    ? Math.round(
        adminInsights.attendanceTrend.reduce((sum, item) => sum + item.attendanceRate, 0) /
          adminInsights.attendanceTrend.length
      )
    : 0;
  const maxFeeBilled = Math.max(1, ...(adminInsights?.feeTrend.map((item) => item.billed) || [1]));
  const maxClassStrength = Math.max(1, ...(adminInsights?.classStrength.map((item) => item.count) || [1]));

  const payrollRows = useMemo(() => {
    const breakdown = adminInsights?.staffBreakdown?.length
      ? adminInsights.staffBreakdown
      : activeStaffCount
        ? [{ role: "staff", count: activeStaffCount }]
        : [];

    return breakdown.map((item) => {
      const salary = salaryBands[item.role] || salaryBands.staff;
      return {
        role: item.role,
        label: formatRoleLabel(item.role),
        count: item.count,
        salary,
        total: item.count * salary
      };
    });
  }, [adminInsights, activeStaffCount]);

  const teacherPayroll = payrollRows.find((row) => row.role === "teacher");
  const totalPayroll = payrollRows.reduce((sum, row) => sum + row.total, 0);
  const driverCount = payrollRows.find((row) => row.role === "driver")?.count || 0;
  const projectedBusCount = Math.max(driverCount, activeStudentCount ? Math.ceil(activeStudentCount / 45) : 0);
  const transportMonthlyIncome = activeStudentCount * 1200;
  const transportMonthlyExpense = projectedBusCount * 18000 + driverCount * (salaryBands.driver || 0);
  const facilitiesExpense = Math.max(45000, Math.round(activeStudentCount * 350));
  const projectedExpense = totalPayroll + transportMonthlyExpense + facilitiesExpense;
  const netPosition = totalCollected - projectedExpense;
  const accountsRows = [
    { head: "Fee billed", type: "Income", amount: totalBilled, note: "Actual fee invoices from DB" },
    { head: "Fee collected", type: "Income", amount: totalCollected, note: "Actual collected amount" },
    { head: "Fee due", type: "Receivable", amount: totalDue, note: "Pending + partial balance" },
    { head: "Salary payroll", type: "Expense", amount: totalPayroll, note: "Projected from staff role bands" },
    { head: "Transport operations", type: "Expense", amount: transportMonthlyExpense, note: "Projected fuel + driver cost" },
    { head: "Facilities and utilities", type: "Expense", amount: facilitiesExpense, note: "Projected monthly school running cost" }
  ];
  const teacherDirectory = useMemo(
    () => directoryStaff.filter((item) => item.role === "teacher"),
    [directoryStaff]
  );

  const supportStaffDirectory = useMemo(
    () => directoryStaff.filter((item) => item.role !== "teacher"),
    [directoryStaff]
  );

  const classSummary = useMemo(() => {
    const summary = new Map<string, { key: string; label: string; count: number }>();
    directoryStudents.forEach((student) => {
      const label = `${student.className}-${student.section || "A"}`;
      const existing = summary.get(label) || { key: label, label, count: 0 };
      existing.count += 1;
      summary.set(label, existing);
    });
    return Array.from(summary.values()).sort((a, b) => a.label.localeCompare(b.label, "en", { numeric: true }));
  }, [directoryStudents]);

  const normalizedDirectorySearch = directorySearch.trim().toLowerCase();

  const filteredStudents = useMemo(() => {
    return directoryStudents.filter((student) => {
      const classKey = `${student.className}-${student.section || "A"}`;
      const matchesClass = selectedClassKey === "all" || classKey === selectedClassKey;
      const matchesSearch =
        !normalizedDirectorySearch ||
        [
          student.name,
          student.admissionNo,
          student.className,
          student.section,
          student.rollNo,
          student.phone,
          student.guardian?.name,
          student.guardian?.phone
        ]
          .join(" ")
          .toLowerCase()
          .includes(normalizedDirectorySearch);
      return matchesClass && matchesSearch;
    });
  }, [directoryStudents, normalizedDirectorySearch, selectedClassKey]);

  const filteredTeachers = useMemo(
    () =>
      teacherDirectory.filter((staff) =>
        !normalizedDirectorySearch ||
        [staff.name, staff.employeeCode, staff.role, staff.department, staff.phone, staff.email, ...(staff.subjects || [])]
          .join(" ")
          .toLowerCase()
          .includes(normalizedDirectorySearch)
      ),
    [teacherDirectory, normalizedDirectorySearch]
  );

  const filteredSupportStaff = useMemo(
    () =>
      supportStaffDirectory.filter((staff) =>
        !normalizedDirectorySearch ||
        [staff.name, staff.employeeCode, staff.role, staff.department, staff.phone, staff.email, ...(staff.subjects || [])]
          .join(" ")
          .toLowerCase()
          .includes(normalizedDirectorySearch)
      ),
    [supportStaffDirectory, normalizedDirectorySearch]
  );

  const selectedStudentProfile =
    selectedDirectoryProfile?.kind === "student"
      ? directoryStudents.find((student) => student._id === selectedDirectoryProfile.id)
      : undefined;

  const selectedStaffProfile =
    selectedDirectoryProfile?.kind === "staff"
      ? directoryStaff.find((staff) => staff._id === selectedDirectoryProfile.id)
      : undefined;

  const currentDirectoryCount =
    directoryView === "students"
      ? filteredStudents.length
      : directoryView === "teachers"
        ? filteredTeachers.length
        : filteredSupportStaff.length;

  const onDirectoryViewChange = (view: DirectoryView) => {
    setDirectoryView(view);
    if (view !== "students") setSelectedClassKey("all");
    const firstItem =
      view === "students" ? filteredStudents[0] : view === "teachers" ? filteredTeachers[0] : filteredSupportStaff[0];
    setSelectedDirectoryProfile(
      firstItem
        ? {
            kind: view === "students" ? "student" : "staff",
            id: firstItem._id
          }
        : null
    );
  };

  const exportDirectoryList = () => {
    const rows =
      directoryView === "students"
        ? [
            ["Admission No", "Name", "Class", "Roll No", "Gender", "Phone", "Guardian", "Guardian Phone", "Status"],
            ...filteredStudents.map((student) => [
              student.admissionNo,
              student.name,
              `${student.className}-${student.section || "A"}`,
              student.rollNo || "-",
              student.gender,
              student.phone || "-",
              student.guardian?.name || "-",
              student.guardian?.phone || "-",
              student.status
            ])
          ]
        : [
            ["Employee Code", "Name", "Role", "Department", "Subjects", "Phone", "Email", "Monthly Salary", "Status"],
            ...(directoryView === "teachers" ? filteredTeachers : filteredSupportStaff).map((staff) => [
              staff.employeeCode,
              staff.name,
              formatRoleLabel(staff.role),
              staff.department || "-",
              (staff.subjects || []).join(" | ") || "-",
              staff.phone || "-",
              staff.email || "-",
              salaryBands[staff.role] || salaryBands.staff,
              staff.status
            ])
          ];

    const csv = rows.map((row) => row.map(escapeCsvValue).join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = `school-${directoryView}-directory-${toDayKey(new Date())}.csv`;
    anchor.click();
    URL.revokeObjectURL(url);
  };

  const commandCenter = useMemo(() => {
    if (!adminInsights) return null;

    const weakestAttendance = [...adminInsights.attendanceTrend].sort(
      (a, b) => a.attendanceRate - b.attendanceRate
    )[0];
    const largestClass = [...adminInsights.classStrength].sort((a, b) => b.count - a.count)[0];
    const dueAmount = adminInsights.feeTrend.reduce((sum, item) => sum + item.due, 0);
    const approvalCount = adminInsights.security.pendingApprovals;
    const overdueCount = adminInsights.security.overdueFees;
    const score = Math.max(
      42,
      Math.min(
        100,
        100 -
          Math.max(0, 92 - attendanceAverage) * 1.2 -
          Math.max(0, 92 - feeCollectionRate) * 0.9 -
          Math.min(24, approvalCount * 3) -
          Math.min(18, overdueCount * 4)
      )
    );

    const tasks = [
      {
        title: "Clear signup approvals",
        detail: `${approvalCount} pending account request(s) waiting for admin decision.`,
        priority: approvalCount > 4 ? "critical" : approvalCount > 0 ? "high" : "stable",
        action: "Open approvals",
        tab: "approvals" as DashboardTab
      },
      {
        title: "Recover fee dues",
        detail: `${formatMoney(dueAmount)} still due across ${adminInsights.feeAlerts.length} active fee alert(s).`,
        priority: overdueCount > 0 ? "critical" : dueAmount > 0 ? "high" : "stable",
        action: "Review fee alerts",
        tab: "analytics" as DashboardTab
      },
      {
        title: "Watch attendance dip",
        detail: weakestAttendance
          ? `${weakestAttendance.day} is lowest at ${weakestAttendance.attendanceRate}% attendance.`
          : "No attendance trend available yet.",
        priority: weakestAttendance && weakestAttendance.attendanceRate < 80 ? "high" : "stable",
        action: "Open analytics",
        tab: "analytics" as DashboardTab
      },
      {
        title: "Balance class load",
        detail: largestClass
          ? `${largestClass.classLabel} is the largest section with ${largestClass.count} students.`
          : "No class strength data available.",
        priority: largestClass && largestClass.count > 45 ? "high" : "stable",
        action: "See class snapshot",
        tab: "analytics" as DashboardTab
      }
    ];

    return {
      score: Math.round(score),
      scoreLabel: score >= 86 ? "Strong" : score >= 70 ? "Needs Watch" : "Attention Needed",
      dueAmount,
      nextEvent: adminInsights.calendarEvents[0],
      tasks
    };
  }, [adminInsights, attendanceAverage, feeCollectionRate]);

  const exportCommandCenter = () => {
    if (!commandCenter || !adminInsights) return;

    const rows = [
      ["Metric", "Value", "Notes"],
      ["Operations Score", commandCenter.score, commandCenter.scoreLabel],
      ["Attendance Average", `${attendanceAverage}%`, "Last 7-day trend"],
      ["Fee Collection Rate", `${feeCollectionRate}%`, `${formatMoney(totalDue)} due`],
      ["Projected Payroll", totalPayroll, "Staff role salary bands"],
      ["Transport Projection", transportMonthlyExpense, `${projectedBusCount} bus route(s)`],
      ["Net Position", netPosition, "Collected fees minus projected expenses"],
      ["Pending Approvals", adminInsights.security.pendingApprovals, "Signup requests"],
      ["Overdue Fees", adminInsights.security.overdueFees, "Fee records"],
      ...commandCenter.tasks.map((task) => [task.title, task.priority, task.detail])
    ];

    const csv = rows.map((row) => row.map(escapeCsvValue).join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = `school-command-center-${toDayKey(new Date())}.csv`;
    anchor.click();
    URL.revokeObjectURL(url);
  };

  const changeCalendarMonth = (offset: number) => {
    setCalendarMonth((prev) => new Date(prev.getFullYear(), prev.getMonth() + offset, 1));
    setSelectedDayKey("");
  };

  if (loading || !dashboardData) {
    return (
      <main className="loaderPage">
        <AppLoader title="EduSphere Portal" message="Preparing your secure dashboard..." />
      </main>
    );
  }

  return (
    <main className="shell shellDense">
      <aside className="sidebar">
        <div className="brand">
          <div className="brandMark"><ShieldCheck size={22} /></div>
          <div>
            <strong>EduSphere</strong>
            <span>{role.toUpperCase()} PORTAL</span>
          </div>
        </div>

        <nav>
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
            <button
              key={item.key}
              className={activeTab === item.key ? "active" : ""}
              onClick={() => setActiveTab(item.key)}
              type="button"
            >
              <Icon size={18} />
              <span>{item.label}</span>
            </button>
            );
          })}
          <button onClick={onLogout}>
            <LogOut size={18} />
            <span>Logout</span>
          </button>
        </nav>
      </aside>

      <section className="workspace workspaceDense">
        <header className="topbar">
          <button className="iconOnly" aria-label="Open menu" onClick={() => setShowQuickActions((prev) => !prev)}>
            <Menu size={20} />
          </button>
          <div className="search">
            <Search size={18} />
            <input
              placeholder="Search modules and notices..."
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
            />
          </div>
          <button className="iconOnly" aria-label="Notifications" onClick={() => setActiveTab("notices")}>
            <Bell size={20} />
          </button>
        </header>

        {activeTab === "overview" && (
          <section className="hero">
            <div>
              <p>Academic year 2026-27</p>
              <h1>{dashboardData.title}</h1>
              <span>{dashboardData.intro}</span>
              <span style={{ marginTop: 10 }}>Logged in as {name}</span>
            </div>
            <button type="button" onClick={() => setShowQuickActions((prev) => !prev)}>
              <Sparkles size={16} /> Quick Action
            </button>
          </section>
        )}

        {showQuickActions && activeTab === "overview" && (
          <section className="quickActionPanel" aria-label="Quick actions">
            {[
              { label: role === "admin" ? "Review approvals" : "Open today view", icon: ClipboardList, tab: role === "admin" ? "approvals" : "calendar" },
              { label: role === "admin" ? "Command center" : "Open insights", icon: role === "admin" ? Gauge : LineChart, tab: role === "admin" ? "command" : "insights" },
              { label: "Check notices", icon: Bell, tab: "notices" },
              { label: role === "admin" ? "Edit website" : "Open insights", icon: role === "admin" ? Globe2 : FileText, tab: role === "admin" ? "website" : "insights" }
            ].map((action) => {
              const Icon = action.icon;
              return (
                <button type="button" key={action.label} onClick={() => setActiveTab(action.tab as DashboardTab)}>
                  <Icon size={16} />
                  <span>{action.label}</span>
                </button>
              );
            })}
          </section>
        )}

        {activeTab === "overview" && (
          <section className="statsGrid">
            {dashboardData.stats.map((stat) => (
              <article key={stat.label} className="stat">
                <div>
                  <span>{stat.label}</span>
                  <strong>{stat.value}</strong>
                </div>
                <small>{stat.trend}</small>
              </article>
            ))}
          </section>
        )}

        {role === "staff" && staffWorkspace && activeTab === "overview" && (
          <section className="staffDesk">
            <section className="opsHero panel">
              <div>
                <p>{formatRoleLabel(staffWorkspace.access.role)} desk</p>
                <h2>{staffWorkspace.access.canManageAdmissions ? "Admission workflow" : staffWorkspace.access.canManageFees ? "Fee collection workflow" : "Office workflow"}</h2>
                <span>
                  {staffWorkspace.access.canManageAdmissions
                    ? "Online applications verify karke admitted student record banaiye."
                    : staffWorkspace.access.canManageFees
                      ? "Pending invoices, partial payments aur overdue follow-ups manage kijiye."
                      : "Front-office tasks and school records overview."}
                </span>
              </div>
              <div className="opsHeroMetrics">
                <article><span>Applications</span><strong>{admissionQueue.length}</strong></article>
                <article><span>Fee Queue</span><strong>{feeDeskQueue.length}</strong></article>
                <article><span>Due Amount</span><strong>{formatMoney(staffPendingFeeTotal)}</strong></article>
                <article><span>Recent Students</span><strong>{staffWorkspace.recentStudents.length}</strong></article>
              </div>
            </section>

            {staffStatus && <div className="successBox">{staffStatus}</div>}

            <section className="staffDeskGrid">
              {staffWorkspace.access.canManageAdmissions && (
                <article className="panel">
                  <div className="panelHeader">
                    <h2>Admission Queue</h2>
                    <button type="button" onClick={() => setActiveTab("admissions")}>Open</button>
                  </div>
                  <div className="compactList">
                    {admissionQueue.slice(0, 4).map((application) => (
                      <article className="listItem" key={application.id}>
                        <div>
                          <strong>{application.studentName}</strong>
                          <span>{application.applicationNo} | Class {application.className}-{application.section}</span>
                        </div>
                        <span className={`statusBadge status-${application.status === "new" ? "pending" : "partial"}`}>{application.status}</span>
                      </article>
                    ))}
                    {!admissionQueue.length && <p className="emptyHint">No pending admission application.</p>}
                  </div>
                </article>
              )}

              {staffWorkspace.access.canManageFees && (
                <article className="panel">
                  <div className="panelHeader">
                    <h2>Fee Counter</h2>
                    <button type="button" onClick={() => setActiveTab("fees")}>Open</button>
                  </div>
                  <div className="compactList">
                    {feeDeskQueue.slice(0, 4).map((fee) => (
                      <article className="listItem" key={fee.id}>
                        <div>
                          <strong>{fee.student.name}</strong>
                          <span>{fee.invoiceNo} | Due {formatMoney(fee.dueAmount)}</span>
                        </div>
                        <span className={`statusBadge status-${fee.status}`}>{fee.status}</span>
                      </article>
                    ))}
                    {!feeDeskQueue.length && <p className="emptyHint">No pending fee record.</p>}
                  </div>
                </article>
              )}

              <article className="panel">
                <div className="panelHeader">
                  <h2>Recent Students</h2>
                  <button type="button" onClick={() => setActiveTab("records")}>Records</button>
                </div>
                <div className="compactList">
                  {staffWorkspace.recentStudents.slice(0, 5).map((student) => (
                    <article className="listItem" key={student.id}>
                      <div>
                        <strong>{student.name}</strong>
                        <span>{student.admissionNo} | {student.classLabel}</span>
                      </div>
                      <span>{student.phone || "-"}</span>
                    </article>
                  ))}
                </div>
              </article>
            </section>
          </section>
        )}

        {role === "staff" && staffWorkspace?.access.canManageAdmissions && activeTab === "admissions" && (
          <section className="staffDesk">
            <section className="opsHero panel">
              <div>
                <p>Reception Admission Desk</p>
                <h2>{admissionQueue.length} pending application(s)</h2>
                <span>Application verify karein, document status dekhein, phir admit karte hi student record create ho jayega.</span>
              </div>
              <div className="opsHeroMetrics">
                <article><span>New</span><strong>{admissionQueue.filter((item) => item.status === "new").length}</strong></article>
                <article><span>Verified</span><strong>{admissionQueue.filter((item) => item.status === "verified").length}</strong></article>
              </div>
            </section>
            {staffStatus && <div className="successBox">{staffStatus}</div>}
            <section className="admissionQueue">
              {admissionQueue.map((application) => (
                <article className="panel admissionApplicationCard" key={application.id}>
                  <div className="admissionCardHead">
                    <div>
                      <p>{application.applicationNo}</p>
                      <h2>{application.studentName}</h2>
                      <span>Class {application.className}-{application.section} | {formatRoleLabel(application.gender)}</span>
                    </div>
                    <span className={`statusBadge status-${application.status === "new" ? "pending" : "partial"}`}>{application.status}</span>
                  </div>
                  <div className="profileDetailGrid">
                    <div><span>Guardian</span><strong>{application.guardian?.name || "-"}</strong></div>
                    <div><span>Phone</span><strong>{application.guardian?.phone || application.phone || "-"}</strong></div>
                    <div><span>DOB</span><strong>{application.dob ? formatDate(application.dob) : "-"}</strong></div>
                    <div><span>Previous School</span><strong>{application.previousSchool || "-"}</strong></div>
                    <div className="wide"><span>Address</span><strong>{application.address || "-"}</strong></div>
                  </div>
                  <div className="documentChecklist">
                    {application.documents.map((document) => (
                      <span key={document.name}>{document.name}: {document.status}</span>
                    ))}
                  </div>
                  <div className="staffActionRow">
                    <button
                      type="button"
                      className="miniBtn"
                      disabled={staffActionLoading === `verify-${application.id}` || application.status !== "new"}
                      onClick={() => onAdmissionAction(application.id, "verify")}
                    >
                      Verify
                    </button>
                    <button
                      type="button"
                      className="miniBtn approveBtn"
                      disabled={staffActionLoading === `admit-${application.id}`}
                      onClick={() => onAdmissionAction(application.id, "admit")}
                    >
                      Admit Student
                    </button>
                    <button
                      type="button"
                      className="miniBtn rejectBtn"
                      disabled={staffActionLoading === `reject-${application.id}`}
                      onClick={() => onAdmissionAction(application.id, "reject")}
                    >
                      Reject
                    </button>
                  </div>
                </article>
              ))}
              {!admissionQueue.length && <p className="emptyHint">No pending admission application.</p>}
            </section>
          </section>
        )}

        {role === "staff" && staffWorkspace?.access.canManageFees && activeTab === "fees" && (
          <section className="staffDesk">
            <section className="opsHero panel">
              <div>
                <p>Accounts Fee Desk</p>
                <h2>{formatMoney(staffPendingFeeTotal)} pending</h2>
                <span>Invoice wise due amount collect karein. Full/partial payment instantly ledger me update hoga.</span>
              </div>
              <div className="opsHeroMetrics">
                <article><span>Invoices</span><strong>{feeDeskQueue.length}</strong></article>
                <article><span>Overdue</span><strong>{feeDeskQueue.filter((item) => item.status === "overdue").length}</strong></article>
              </div>
            </section>
            {staffStatus && <div className="successBox">{staffStatus}</div>}
            <section className="panel opsTablePanel feeDeskPanel">
              <div className="opsTable feeDeskTable">
                <div className="opsTableHead">
                  <span>Student</span>
                  <span>Invoice</span>
                  <span>Due</span>
                  <span>Status</span>
                  <span>Action</span>
                </div>
                {feeDeskQueue.map((fee) => (
                  <div className="opsTableRow" key={fee.id}>
                    <div>
                      <strong>{fee.student.name}</strong>
                      <small>{fee.student.admissionNo} | {fee.student.classLabel} | {fee.student.guardianPhone || "-"}</small>
                    </div>
                    <span>{fee.invoiceNo}<small>{fee.month}</small></span>
                    <span>{formatMoney(fee.dueAmount)}<small>Paid {formatMoney(fee.paidAmount)}</small></span>
                    <span className={`statusBadge status-${fee.status}`}>{fee.status}</span>
                    <span className="tableActions">
                      <button
                        type="button"
                        className="miniBtn approveBtn"
                        disabled={staffActionLoading === `fee-${fee.id}`}
                        onClick={() => onCollectFee(fee.id, fee.dueAmount)}
                      >
                        Full
                      </button>
                      <button
                        type="button"
                        className="miniBtn"
                        disabled={staffActionLoading === `fee-${fee.id}`}
                        onClick={() => onCollectFee(fee.id, Math.max(1, Math.round(fee.dueAmount / 2)))}
                      >
                        Half
                      </button>
                    </span>
                  </div>
                ))}
                {!feeDeskQueue.length && <p className="emptyHint">No pending fee invoices.</p>}
              </div>
            </section>
          </section>
        )}

        {role === "staff" && staffWorkspace && activeTab === "records" && (
          <section className="panel">
            <div className="panelHeader">
              <h2>Recent Student Records</h2>
            </div>
            <div className="table">
              <div className="tableHead">
                <span>Admission No</span>
                <span>Name</span>
                <span>Class</span>
                <span>Guardian</span>
                <span>Phone</span>
              </div>
              {staffWorkspace.recentStudents.map((student) => (
                <div className="tableRow" key={student.id}>
                  <span>{student.admissionNo}</span>
                  <span>{student.name}</span>
                  <span>{student.classLabel}</span>
                  <span>{student.guardian || "-"}</span>
                  <span>{student.phone || "-"}</span>
                </div>
              ))}
            </div>
          </section>
        )}

        {role === "admin" && activeTab === "website" && (
          <WebsiteEditor
            draft={websiteDraft}
            status={websiteStatus}
            saving={websiteSaving}
            onChange={onWebsiteDraftChange}
            onDownloadChange={onWebsiteDownloadChange}
            galleryMedia={galleryMedia}
            uploadStatus={uploadStatus}
            uploadingKey={uploadingKey}
            onGalleryUpload={(file) => uploadMediaFile(file, "gallery", file?.name || "Gallery image")}
            onRemoveMedia={removeMedia}
            onReset={() => {
              setWebsiteDraft(defaultWebsiteContent);
              setWebsiteStatus("Default content loaded. Save karne par website par apply hoga.");
            }}
            onSave={onWebsiteSave}
          />
        )}

        {role === "student" && studentWorkspace && activeTab === "overview" && (
          <section className="studentPortal">
            <section className="studentHero panel">
              <div className="studentIdPreview">
                <span className="profileAvatar large">{getInitials(studentWorkspace.student.name)}</span>
                <div>
                  <p>Student Portal</p>
                  <h2>{studentWorkspace.student.name}</h2>
                  <span>
                    {studentWorkspace.student.admissionNo} | Class {studentWorkspace.student.className}-{studentWorkspace.student.section} | Roll{" "}
                    {studentWorkspace.student.rollNo || "-"}
                  </span>
                </div>
              </div>
              <div className="opsHeroMetrics">
                <article><span>Attendance</span><strong>{studentWorkspace.attendance.summary.percent}%</strong></article>
                <article><span>Homework</span><strong>{studentWorkspace.performance.homeworkCompletion}%</strong></article>
                <article><span>Fee Due</span><strong>{formatMoney(studentWorkspace.fees.totalDue)}</strong></article>
              </div>
            </section>

            <section className="studentOverviewGrid">
              <article className="panel studentFocusCard">
                <div className="chartHeader">
                  <div>
                    <p>Teacher Work</p>
                    <h3>{pendingStudentHomework.length} pending homework</h3>
                  </div>
                  <FileText size={18} />
                </div>
                <div className="compactList">
                  {studentWorkspace.homework.slice(0, 3).map((homework) => (
                    <article className="listItem" key={homework.id}>
                      <div>
                        <strong>{homework.title}</strong>
                        <span>{homework.subject} | {homework.teacherName}</span>
                      </div>
                      <span className={`statusBadge status-${homework.submissionStatus === "pending" ? "pending" : "paid"}`}>
                        {homework.submissionStatus}
                      </span>
                    </article>
                  ))}
                  {!studentWorkspace.homework.length && <p className="emptyHint">No homework assigned yet.</p>}
                </div>
              </article>

              <article className="panel studentFocusCard">
                <div className="chartHeader">
                  <div>
                    <p>Next Exam</p>
                    <h3>{upcomingStudentExam?.title || "No upcoming exam"}</h3>
                  </div>
                  <BookOpenCheck size={18} />
                </div>
                <div className="insightList">
                  <div className="insightRow"><span>Subject</span><strong>{upcomingStudentExam?.subject || "-"}</strong></div>
                  <div className="insightRow"><span>Date</span><strong>{upcomingStudentExam ? formatDate(upcomingStudentExam.examDate) : "-"}</strong></div>
                  <div className="insightRow"><span>Max Marks</span><strong>{upcomingStudentExam?.maxMarks || "-"}</strong></div>
                </div>
              </article>

              <article className="panel studentFocusCard">
                <div className="chartHeader">
                  <div>
                    <p>Latest Attendance</p>
                    <h3>{latestAttendanceRecord ? formatRoleLabel(latestAttendanceRecord.status) : "No record"}</h3>
                  </div>
                  <ClipboardList size={18} />
                </div>
                <div className="teacherMiniStats">
                  <span>Present <strong>{studentWorkspace.attendance.summary.present}</strong></span>
                  <span>Late <strong>{studentWorkspace.attendance.summary.late}</strong></span>
                  <span>Absent <strong>{studentWorkspace.attendance.summary.absent}</strong></span>
                  <span>Leave <strong>{studentWorkspace.attendance.summary.leave}</strong></span>
                </div>
              </article>
            </section>
          </section>
        )}

        {role === "student" && studentWorkspace && activeTab === "studentProfile" && (
          <section className="studentPortal">
            <section className="studentProfileGrid">
              <article className="panel studentIdCard">
                <div className="schoolIdTop">
                  <strong>EduSphere Student ID</strong>
                  <span>Academic Year 2026-27</span>
                </div>
                {studentWorkspace.student.profileImageUrl ? (
                  <img className="profilePhotoXl" src={studentWorkspace.student.profileImageUrl} alt={studentWorkspace.student.name} />
                ) : (
                  <span className="profileAvatar xl">{getInitials(studentWorkspace.student.name)}</span>
                )}
                <h2>{studentWorkspace.student.name}</h2>
                <p>{studentWorkspace.student.admissionNo}</p>
                <label className="miniBtn mediaUploadBtn light">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(event) => uploadMediaFile(event.target.files?.[0] || null, "profile", "Student profile photo")}
                    disabled={uploadingKey === "profile"}
                  />
                  {uploadingKey === "profile" ? "Uploading..." : "Upload Photo"}
                </label>
                <div className="idBarcode">{studentWorkspace.student.admissionNo}</div>
              </article>
              <article className="panel">
                <div className="profileDetailGrid">
                  <div><span>Class</span><strong>{studentWorkspace.student.className}-{studentWorkspace.student.section}</strong></div>
                  <div><span>Roll No</span><strong>{studentWorkspace.student.rollNo || "Not added"}</strong></div>
                  <div><span>Gender</span><strong>{formatRoleLabel(studentWorkspace.student.gender)}</strong></div>
                  <div><span>Date of Birth</span><strong>{studentWorkspace.student.dob ? formatDate(studentWorkspace.student.dob) : "Not added"}</strong></div>
                  <div><span>Phone</span><strong>{studentWorkspace.student.phone || "Not added"}</strong></div>
                  <div><span>Status</span><strong>{formatRoleLabel(studentWorkspace.student.status)}</strong></div>
                  <div><span>Guardian</span><strong>{studentWorkspace.student.guardian?.name || "Not added"}</strong></div>
                  <div><span>Guardian Phone</span><strong>{studentWorkspace.student.guardian?.phone || "Not added"}</strong></div>
                  <div className="wide"><span>Address</span><strong>{studentWorkspace.student.address || "Not added"}</strong></div>
                </div>
                <div className="documentUploadBlock">
                  <div className="panelHeader">
                    <div>
                      <h2>My Documents</h2>
                      <p className="panelSub">Aadhaar, certificate, report card ya other PDF/image upload karein.</p>
                    </div>
                    <label className="miniBtn approveBtn mediaUploadBtn">
                      <input
                        type="file"
                        accept="image/*,.pdf,.doc,.docx"
                        onChange={(event) => uploadMediaFile(event.target.files?.[0] || null, "student-document", event.target.files?.[0]?.name || "Student document")}
                        disabled={uploadingKey === "student-document"}
                      />
                      {uploadingKey === "student-document" ? "Uploading..." : "Upload Document"}
                    </label>
                  </div>
                  {uploadStatus && <div className="successBox">{uploadStatus}</div>}
                  <div className="compactList">
                    {studentWorkspace.documents.map((document) => (
                      <article className="listItem" key={document.id}>
                        <div>
                          <strong>{document.title}</strong>
                          <span>{document.format || document.resourceType} | {formatDate(document.createdAt)}</span>
                        </div>
                        <a className="miniBtn" href={document.url} target="_blank" rel="noopener noreferrer">Open</a>
                      </article>
                    ))}
                    {!studentWorkspace.documents.length && <p className="emptyHint">No document uploaded yet.</p>}
                  </div>
                </div>
              </article>
            </section>
          </section>
        )}

        {role === "student" && studentWorkspace && activeTab === "homework" && (
          <section className="studentPortal">
            <section className="opsHero panel">
              <div>
                <p>My Homework</p>
                <h2>{pendingStudentHomework.length} pending task(s)</h2>
                <span>Teacher ke diye homework, due date, attachment aur submission status.</span>
              </div>
              <FileText size={34} />
            </section>
            <section className="homeworkList">
              {studentWorkspace.homework.map((homework) => (
                <article className="panel homeworkItem studentHomeworkItem" key={homework.id}>
                  <div>
                    <strong>{homework.title}</strong>
                    <span>{homework.subject} | {homework.teacherName} | Due {homework.dueDate ? formatDate(homework.dueDate) : "Not scheduled"}</span>
                    <p>{homework.description}</p>
                    {homework.attachmentUrl && <a className="inlineDetailLink" href={homework.attachmentUrl} target="_blank" rel="noopener noreferrer">Open Attachment</a>}
                  </div>
                  <div className="homeworkActionRow">
                    <span className={`statusBadge status-${homework.submissionStatus === "pending" ? "pending" : "paid"}`}>
                      {homework.submissionStatus}
                    </span>
                    <button
                      type="button"
                      className="miniBtn approveBtn"
                      onClick={() => onSubmitStudentHomework(homework.id)}
                      disabled={homework.submissionStatus !== "pending" || studentHomeworkSubmitting === homework.id}
                    >
                      {studentHomeworkSubmitting === homework.id ? "Submitting..." : "Mark Submitted"}
                    </button>
                  </div>
                </article>
              ))}
              {!studentWorkspace.homework.length && <p className="emptyHint">No homework assigned yet.</p>}
            </section>
          </section>
        )}

        {role === "student" && studentWorkspace && activeTab === "attendance" && (
          <section className="studentPortal">
            <section className="opsHero panel">
              <div>
                <p>Attendance Report</p>
                <h2>{studentWorkspace.attendance.summary.percent}% attendance</h2>
                <span>{studentWorkspace.attendance.summary.total} attendance records available.</span>
              </div>
              <ClipboardList size={34} />
            </section>
            <section className="recordsGrid">
              {studentWorkspace.attendance.history.map((record) => (
                <article className="panel recordCard" key={`${record.date}-${record.status}`}>
                  <strong>{formatDate(record.date)}</strong>
                  <span>{formatRoleLabel(record.status)}</span>
                  <span>{record.note || "No note"}</span>
                </article>
              ))}
            </section>
          </section>
        )}

        {role === "student" && studentWorkspace && activeTab === "exams" && (
          <section className="studentPortal">
            <section className="opsHero panel">
              <div>
                <p>Exam Calendar</p>
                <h2>{studentWorkspace.exams.length} exam record(s)</h2>
                <span>Upcoming exams aur result details yahan dikhenge.</span>
              </div>
              <BookOpenCheck size={34} />
            </section>
            <section className="recordsGrid">
              {studentWorkspace.exams.map((exam) => (
                <article className="panel recordCard" key={exam.id}>
                  <strong>{exam.title}</strong>
                  <span>{exam.subject} | {formatDate(exam.examDate)}</span>
                  <span>{exam.result ? `Marks ${exam.result.marks || "-"} | Grade ${exam.result.grade || "-"}` : `Max marks ${exam.maxMarks}`}</span>
                </article>
              ))}
            </section>
          </section>
        )}

        {role === "student" && studentWorkspace && activeTab === "fees" && (
          <section className="studentPortal">
            <section className="opsHero panel">
              <div>
                <p>Fee Ledger</p>
                <h2>{formatMoney(studentWorkspace.fees.totalDue)} due</h2>
                <span>{formatMoney(studentWorkspace.fees.totalPaid)} paid out of {formatMoney(studentWorkspace.fees.totalBilled)}.</span>
              </div>
              <WalletCards size={34} />
            </section>
            <section className="panel opsTablePanel">
              <div className="opsTable">
                <div className="opsTableHead">
                  <span>Invoice</span>
                  <span>Month</span>
                  <span>Amount</span>
                  <span>Status</span>
                </div>
                {studentWorkspace.fees.items.map((fee) => (
                  <div className="opsTableRow" key={fee.id}>
                    <strong>{fee.invoiceNo}</strong>
                    <span>{fee.month}</span>
                    <span>{formatMoney(fee.dueAmount)} due</span>
                    <small>{fee.status} | Due {fee.dueDate ? formatDate(fee.dueDate) : "-"}</small>
                  </div>
                ))}
              </div>
            </section>
          </section>
        )}

        {role === "student" && studentWorkspace && activeTab === "performance" && (
          <section className="studentPortal">
            <section className="opsHero panel">
              <div>
                <p>Performance Intelligence</p>
                <h2>{studentWorkspace.performance.riskLevel}</h2>
                <span>Attendance, homework, fee and exam readiness ka combined view.</span>
              </div>
              <LineChart size={34} />
            </section>
            <section className="teacherOverviewGrid">
              <article className="panel teacherFocusCard"><span>Attendance</span><strong>{studentWorkspace.performance.attendancePercent}%</strong></article>
              <article className="panel teacherFocusCard"><span>Homework Completion</span><strong>{studentWorkspace.performance.homeworkCompletion}%</strong></article>
              <article className="panel teacherFocusCard"><span>Fee Paid</span><strong>{studentWorkspace.performance.feePaidPercent}%</strong></article>
            </section>
            <section className="panel">
              <div className="panelHeader"><h2>Strengths and Focus Areas</h2></div>
              <div className="moduleGrid">
                {studentWorkspace.performance.strengths.map((item) => (
                  <article className="module" key={item}>
                    <span className="moduleChip">analysis</span>
                    <strong>{item}</strong>
                    <span>Auto-generated from latest student records.</span>
                  </article>
                ))}
              </div>
            </section>
          </section>
        )}

        {role === "teacher" && teacherWorkspace && (activeTab === "classes" || activeTab === "overview") && (
          <section className="teacherWorkspace">
            <section className="opsHero panel teacherHero">
              <div className="teacherHeroProfile">
                {teacherWorkspace.staff.profileImageUrl ? (
                  <img className="profilePhotoLarge" src={teacherWorkspace.staff.profileImageUrl} alt={teacherWorkspace.staff.name} />
                ) : (
                  <span className="profileAvatar large">{getInitials(teacherWorkspace.staff.name)}</span>
                )}
                <div>
                  <p>Teacher Class Command</p>
                  <h2>{teacherWorkspace.staff.name}</h2>
                  <span>
                    {teacherWorkspace.staff.department || "Department not added"} |{" "}
                    {teacherWorkspace.staff.subjects.join(", ") || "Subjects not added"}
                  </span>
                  <label className="miniBtn mediaUploadBtn light">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(event) => uploadMediaFile(event.target.files?.[0] || null, "teacher-photo", "Teacher website photo")}
                      disabled={uploadingKey === "teacher-photo"}
                    />
                    {uploadingKey === "teacher-photo" ? "Uploading..." : "Upload Website Photo"}
                  </label>
                </div>
              </div>
              <div className="opsHeroMetrics">
                <article>
                  <span>Classes</span>
                  <strong>{teacherWorkspace.classes.length}</strong>
                </article>
                <article>
                  <span>Students</span>
                  <strong>{totalTeacherStudents}</strong>
                </article>
              </div>
            </section>

            {activeTab === "overview" && (
              <section className="teacherOverviewGrid">
                <article className="panel teacherFocusCard">
                  <div className="chartHeader">
                    <div>
                      <p>Next Period</p>
                      <h3>{nextTeacherPeriod ? `Class ${nextTeacherPeriod.classLabel}` : "No period today"}</h3>
                    </div>
                    <CalendarDays size={18} />
                  </div>
                  <div className="insightList">
                    <div className="insightRow">
                      <span>Subject</span>
                      <strong>{nextTeacherPeriod?.subject || "Free / planning time"}</strong>
                    </div>
                    <div className="insightRow">
                      <span>Period</span>
                      <strong>{nextTeacherPeriod?.period || "-"}</strong>
                    </div>
                    <div className="insightRow">
                      <span>Today Classes</span>
                      <strong>{todaysTeacherPeriods.length}</strong>
                    </div>
                  </div>
                </article>

                <article className="panel teacherFocusCard">
                  <div className="chartHeader">
                    <div>
                      <p>Attendance Summary</p>
                      <h3>{teacherAttendanceCounts.total} marked today</h3>
                    </div>
                    <ClipboardList size={18} />
                  </div>
                  <div className="teacherMiniStats">
                    <span>Present <strong>{teacherAttendanceCounts.present}</strong></span>
                    <span>Late <strong>{teacherAttendanceCounts.late}</strong></span>
                    <span>Absent <strong>{teacherAttendanceCounts.absent}</strong></span>
                    <span>Leave <strong>{teacherAttendanceCounts.leave}</strong></span>
                  </div>
                </article>

                <article className="panel teacherFocusCard">
                  <div className="chartHeader">
                    <div>
                      <p>Work Queue</p>
                      <h3>{pendingHomeworkReviews} pending reviews</h3>
                    </div>
                    <FileText size={18} />
                  </div>
                  <div className="teacherQuickActions">
                    <button type="button" onClick={() => setActiveTab("attendance")}>Take Attendance</button>
                    <button type="button" onClick={() => setActiveTab("homework")}>Create Homework</button>
                    <button type="button" onClick={() => setActiveTab("parents")}>Send Student Update</button>
                  </div>
                </article>
              </section>
            )}

            <section className="teacherClassGrid">
              {teacherWorkspace.classes.map((classItem) => (
                <article className="panel teacherClassCard" key={classItem.id}>
                  <div className="panelHeader">
                    <div>
                      <h2>Class {classItem.name}-{classItem.section}</h2>
                      <p className="panelSub">{classItem.students.length} students | Capacity {classItem.capacity}</p>
                    </div>
                    <button type="button" className="miniBtn exportBtn" onClick={() => {
                      setSelectedTeacherClassId(classItem.id);
                      setActiveTab("attendance");
                    }}>
                      Take Attendance
                    </button>
                  </div>

                  <div className="teacherRoster">
                    {classItem.students.slice(0, 6).map((student) => (
                      <div className="teacherStudentMini" key={student.id}>
                        <span className="profileAvatar">{getInitials(student.name)}</span>
                        <div>
                          <strong>{student.name}</strong>
                          <small>Roll {student.rollNo || "-"} | {student.guardian?.name || "Guardian not added"}</small>
                        </div>
                      </div>
                    ))}
                    {!classItem.students.length && <p className="emptyHint">No students mapped to this class.</p>}
                  </div>
                </article>
              ))}
            </section>
          </section>
        )}

        {role === "teacher" && teacherWorkspace && activeTab === "attendance" && (
          <section className="teacherWorkspace">
            <section className="panel teacherToolHeader">
              <div>
                <p className="panelSub">Daily Attendance</p>
                <h2>Mark attendance for your class</h2>
              </div>
              <select value={selectedTeacherClass?.id || ""} onChange={(event) => setSelectedTeacherClassId(event.target.value)}>
                {teacherWorkspace.classes.map((item) => (
                  <option key={item.id} value={item.id}>Class {item.name}-{item.section}</option>
                ))}
              </select>
            </section>

            <section className="panel attendancePanel">
              <div className="panelHeader">
                <div>
                  <h2>{selectedTeacherClass ? `Class ${selectedTeacherClass.name}-${selectedTeacherClass.section}` : "Select Class"}</h2>
                  <p className="panelSub">{formatDayKey(toDayKey(new Date()))}</p>
                </div>
                <button type="button" className="miniBtn approveBtn" onClick={onSaveAttendance} disabled={attendanceSaving || !selectedTeacherClass?.students.length}>
                  <Save size={14} /> {attendanceSaving ? "Saving..." : "Save Attendance"}
                </button>
              </div>

              {attendanceStatus && <div className="successBox">{attendanceStatus}</div>}

              <div className="attendanceList">
                {selectedTeacherClass?.students.map((student) => (
                  <article className="attendanceRow" key={student.id}>
                    <div className="teacherStudentMini">
                      <span className="profileAvatar">{getInitials(student.name)}</span>
                      <div>
                        <strong>{student.name}</strong>
                        <small>Roll {student.rollNo || "-"} | {student.guardian?.phone || "No parent phone"}</small>
                      </div>
                    </div>
                    <div className="attendanceStatusGroup">
                      {(["present", "late", "absent", "leave"] as const).map((status) => (
                        <button
                          key={status}
                          type="button"
                          className={attendanceDraft[student.id] === status ? `active status-${status}` : ""}
                          onClick={() => onAttendanceStatusChange(student.id, status)}
                        >
                          {formatRoleLabel(status)}
                        </button>
                      ))}
                    </div>
                  </article>
                ))}
                {!selectedTeacherClass?.students.length && <p className="emptyHint">No students available for attendance.</p>}
              </div>
            </section>
          </section>
        )}

        {role === "teacher" && teacherWorkspace && activeTab === "parents" && (
          <section className="teacherWorkspace">
            <section className="panel teacherToolHeader">
              <div>
                <p className="panelSub">Student Communication</p>
                <h2>Send class update to students</h2>
              </div>
              <select value={selectedTeacherClass?.id || ""} onChange={(event) => setSelectedTeacherClassId(event.target.value)}>
                {teacherWorkspace.classes.map((item) => (
                  <option key={item.id} value={item.id}>Class {item.name}-{item.section}</option>
                ))}
              </select>
            </section>

            <section className="teacherMessageGrid">
              <article className="panel messageComposer">
                <div className="panelHeader">
                  <h2>Message Composer</h2>
                  <MessageSquareText size={18} />
                </div>
                <label className="websiteField">
                  <span>Title</span>
                  <input value={parentMessageTitle} onChange={(event) => setParentMessageTitle(event.target.value)} />
                </label>
                <label className="websiteField">
                  <span>Message</span>
                  <textarea
                    value={parentMessageBody}
                    onChange={(event) => setParentMessageBody(event.target.value)}
                    placeholder="Homework, attendance, PTM, fee reminder, class update..."
                  />
                </label>
                {parentMessageStatus && <div className="successBox">{parentMessageStatus}</div>}
                <button type="button" className="miniBtn approveBtn" onClick={onSendParentMessage} disabled={parentMessageSending}>
                  <Send size={14} /> {parentMessageSending ? "Sending..." : "Create Student Notice"}
                </button>
              </article>

              <article className="panel parentRecipientPanel">
                <div className="panelHeader">
                  <div>
                    <h2>Recipients</h2>
                    <p className="panelSub">{selectedTeacherClass?.students.length || 0} parent contacts</p>
                  </div>
                </div>
                <div className="compactList">
                  {selectedTeacherClass?.students.map((student) => (
                    <article className="listItem" key={student.id}>
                      <div>
                        <strong>{student.guardian?.name || "Guardian not added"}</strong>
                        <span>{student.name} | Roll {student.rollNo || "-"}</span>
                      </div>
                      <small>{student.guardian?.phone || "No phone"}</small>
                    </article>
                  ))}
                </div>
              </article>
            </section>
          </section>
        )}

        {role === "teacher" && teacherWorkspace && activeTab === "homework" && (
          <section className="teacherWorkspace">
            <section className="panel teacherToolHeader">
              <div>
                <p className="panelSub">Homework Module</p>
                <h2>Create and track homework</h2>
              </div>
              <select value={selectedTeacherClass?.id || ""} onChange={(event) => setSelectedTeacherClassId(event.target.value)}>
                {teacherWorkspace.classes.map((item) => (
                  <option key={item.id} value={item.id}>Class {item.name}-{item.section}</option>
                ))}
              </select>
            </section>

            <section className="teacherMessageGrid">
              <article className="panel messageComposer">
                <div className="panelHeader">
                  <h2>Create Homework</h2>
                  <FileText size={18} />
                </div>
                <label className="websiteField">
                  <span>Subject</span>
                  <input
                    value={homeworkSubject}
                    onChange={(event) => setHomeworkSubject(event.target.value)}
                    placeholder={teacherWorkspace.staff.subjects[0] || "General"}
                  />
                </label>
                <label className="websiteField">
                  <span>Title</span>
                  <input value={homeworkTitle} onChange={(event) => setHomeworkTitle(event.target.value)} />
                </label>
                <label className="websiteField">
                  <span>Description / Rich Text Instruction</span>
                  <textarea
                    value={homeworkDescription}
                    onChange={(event) => setHomeworkDescription(event.target.value)}
                    placeholder="Chapter, questions, voice instruction summary, rubric, reminder..."
                  />
                </label>
                <div className="twoCol">
                  <label className="websiteField">
                    <span>Due Date</span>
                    <input type="date" value={homeworkDueDate} onChange={(event) => setHomeworkDueDate(event.target.value)} />
                  </label>
                  <label className="websiteField">
                    <span>Attachment Link</span>
                    <input value={homeworkAttachmentUrl} onChange={(event) => setHomeworkAttachmentUrl(event.target.value)} placeholder="PDF/video/link" />
                  </label>
                </div>
                {homeworkStatus && <div className="successBox">{homeworkStatus}</div>}
                <button type="button" className="miniBtn approveBtn" onClick={onCreateHomework} disabled={homeworkSaving}>
                  <Save size={14} /> {homeworkSaving ? "Creating..." : "Create Homework"}
                </button>
              </article>

              <article className="panel homeworkTracker">
                <div className="panelHeader">
                  <div>
                    <h2>Homework Status</h2>
                    <p className="panelSub">{selectedClassHomework.length} homework item(s) for selected class</p>
                  </div>
                </div>
                <div className="homeworkList">
                  {selectedClassHomework.map((homework) => (
                    <article className="homeworkItem" key={homework.id}>
                      <div>
                        <strong>{homework.title}</strong>
                        <span>{homework.subject} | Due {homework.dueDate ? formatDate(homework.dueDate) : "Not scheduled"}</span>
                        <p>{homework.description}</p>
                      </div>
                      <div className="teacherMiniStats">
                        <span>Total <strong>{homework.total}</strong></span>
                        <span>Submitted <strong>{homework.submitted}</strong></span>
                        <span>Pending <strong>{homework.pending}</strong></span>
                        <span>Reviewed <strong>{homework.reviewed}</strong></span>
                      </div>
                    </article>
                  ))}
                  {!selectedClassHomework.length && <p className="emptyHint">No homework created for selected class yet.</p>}
                </div>
              </article>
            </section>
          </section>
        )}

        {role === "teacher" && teacherWorkspace && activeTab === "exams" && (
          <section className="teacherWorkspace">
            <section className="opsHero panel teacherHero">
              <div>
                <p>Class Exams</p>
                <h2>{teacherWorkspace.exams.length} scheduled records</h2>
                <span>Upcoming exams for assigned classes.</span>
              </div>
              <BookOpenCheck size={34} />
            </section>
            <section className="recordsGrid">
              {teacherWorkspace.exams.map((exam) => (
                <article className="panel recordCard" key={exam.id}>
                  <strong>{exam.title}</strong>
                  <span>{exam.classLabel} | {exam.subject}</span>
                  <span>{formatDate(exam.examDate)} | Max marks {exam.maxMarks}</span>
                </article>
              ))}
              {!teacherWorkspace.exams.length && <p className="emptyHint">No exams scheduled for your assigned classes.</p>}
            </section>
          </section>
        )}

        {role === "admin" && adminInsights && commandCenter && activeTab === "command" && (
          <section className="commandCenter">
            <article className="panel commandScorePanel">
              <div className="panelHeader">
                <div>
                  <h2>Command Center</h2>
                  <p className="panelSub">Live operational priority board from academics, finance and security data.</p>
                </div>
                <button type="button" className="miniBtn exportBtn" onClick={exportCommandCenter}>
                  <Download size={14} /> Export CSV
                </button>
              </div>

              <div className="scoreDial" style={{ "--score": `${commandCenter.score}%` } as CSSProperties & Record<string, string>}>
                <div>
                  <strong>{commandCenter.score}</strong>
                  <span>{commandCenter.scoreLabel}</span>
                </div>
              </div>

              <div className="commandMetrics">
                <article>
                  <span>Attendance</span>
                  <strong>{attendanceAverage}%</strong>
                  <small>7-day average</small>
                </article>
                <article>
                  <span>Fee Recovery</span>
                  <strong>{feeCollectionRate}%</strong>
                  <small>{formatMoney(totalDue)} due</small>
                </article>
                <article>
                  <span>Approvals</span>
                  <strong>{adminInsights.security.pendingApprovals}</strong>
                  <small>pending signups</small>
                </article>
              </div>
            </article>

            <article className="panel commandQueuePanel">
              <div className="panelHeader">
                <div>
                  <h2>Priority Queue</h2>
                  <p className="panelSub">Recommended next actions for the admin office.</p>
                </div>
                <Target size={18} />
              </div>

              <div className="commandTaskList">
                {commandCenter.tasks.map((task) => (
                  <article className={`commandTask priority-${task.priority}`} key={task.title}>
                    <div>
                      <span>{task.priority}</span>
                      <strong>{task.title}</strong>
                      <p>{task.detail}</p>
                    </div>
                    <button type="button" className="miniBtn" onClick={() => setActiveTab(task.tab)}>
                      {task.action}
                    </button>
                  </article>
                ))}
              </div>
            </article>

            <article className="panel commandForecastPanel">
              <div className="panelHeader">
                <div>
                  <h2>Next Critical Date</h2>
                  <p className="panelSub">Nearest event from exams, notices and fee deadlines.</p>
                </div>
                <CalendarDays size={18} />
              </div>
              {commandCenter.nextEvent ? (
                <div className="nextEventBlock">
                  <span className={`eventPill event-${commandCenter.nextEvent.type}`}>
                    {commandCenter.nextEvent.type.toUpperCase()}
                  </span>
                  <strong>{commandCenter.nextEvent.title}</strong>
                  <p>{commandCenter.nextEvent.meta}</p>
                  <small>{formatDate(commandCenter.nextEvent.date)}</small>
                </div>
              ) : (
                <p className="emptyHint">No dated operational event is currently available.</p>
              )}
            </article>
          </section>
        )}

        {role === "admin" && adminInsights && activeTab === "accounts" && (
          <section className="opsPage">
            <section className="opsHero panel">
              <div>
                <p>Accounts and Fee Ledger</p>
                <h2>{formatMoney(totalCollected)} collected</h2>
                <span>{formatMoney(totalDue)} receivable pending across active invoices.</span>
              </div>
              <div className="opsHeroMetrics">
                <article>
                  <span>Recovery</span>
                  <strong>{feeCollectionRate}%</strong>
                </article>
                <article>
                  <span>Net Position</span>
                  <strong>{formatMoney(netPosition)}</strong>
                </article>
              </div>
            </section>

            <section className="opsGrid">
              <article className="panel opsTablePanel">
                <div className="panelHeader">
                  <h2>Income and Expense Heads</h2>
                </div>
                <div className="opsTable">
                  <div className="opsTableHead">
                    <span>Head</span>
                    <span>Type</span>
                    <span>Amount</span>
                    <span>Note</span>
                  </div>
                  {accountsRows.map((row) => (
                    <div className="opsTableRow" key={row.head}>
                      <strong>{row.head}</strong>
                      <span>{row.type}</span>
                      <span>{formatMoney(row.amount)}</span>
                      <small>{row.note}</small>
                    </div>
                  ))}
                </div>
              </article>

              <article className="panel">
                <div className="panelHeader">
                  <h2>Fee Alerts</h2>
                  <Coins size={18} />
                </div>
                <div className="compactList">
                  {adminInsights.feeAlerts.map((feeAlert) => (
                    <article className="listItem" key={feeAlert.id}>
                      <div>
                        <strong>{feeAlert.studentName}</strong>
                        <span>{feeAlert.classLabel} | {feeAlert.invoiceNo}</span>
                      </div>
                      <div className="listMeta">
                        <small>{formatMoney(feeAlert.amountDue)}</small>
                        <span className={`statusBadge status-${feeAlert.status}`}>{feeAlert.status}</span>
                      </div>
                    </article>
                  ))}
                  {!adminInsights.feeAlerts.length && <p className="emptyHint">No active fee alerts.</p>}
                </div>
              </article>
            </section>
          </section>
        )}

        {role === "admin" && activeTab === "payroll" && (
          <section className="opsPage">
            <section className="opsHero panel">
              <div>
                <p>Teacher and Staff Salary</p>
                <h2>{formatMoney(totalPayroll)} monthly payroll</h2>
                <span>
                  Teachers: {teacherPayroll ? formatMoney(teacherPayroll.total) : formatMoney(0)} | Other staff:{" "}
                  {formatMoney(Math.max(0, totalPayroll - (teacherPayroll?.total || 0)))}
                </span>
              </div>
              <div className="opsHeroMetrics">
                <article>
                  <span>Staff</span>
                  <strong>{activeStaffCount}</strong>
                </article>
                <article>
                  <span>Salary Bands</span>
                  <strong>{payrollRows.length}</strong>
                </article>
              </div>
            </section>

            <section className="panel opsTablePanel">
              <div className="panelHeader">
                <h2>Salary Register</h2>
                <BriefcaseBusiness size={18} />
              </div>
              <div className="opsTable payrollTable">
                <div className="opsTableHead">
                  <span>Role</span>
                  <span>People</span>
                  <span>Per Person</span>
                  <span>Total Salary</span>
                  <span>Status</span>
                </div>
                {payrollRows.map((row) => (
                  <div className="opsTableRow" key={row.role}>
                    <strong>{row.label}</strong>
                    <span>{row.count}</span>
                    <span>{formatMoney(row.salary)}</span>
                    <span>{formatMoney(row.total)}</span>
                    <small>Configurable pay band</small>
                  </div>
                ))}
                {!payrollRows.length && <p className="emptyHint">No active staff records available.</p>}
              </div>
            </section>
          </section>
        )}

        {role === "admin" && activeTab === "transport" && (
          <section className="opsPage">
            <section className="opsHero panel">
              <div>
                <p>Bus and Transport Management</p>
                <h2>{projectedBusCount} route fleet plan</h2>
                <span>{driverCount} driver(s), {activeStudentCount} student capacity mapped for transport projection.</span>
              </div>
              <div className="opsHeroMetrics">
                <article>
                  <span>Income</span>
                  <strong>{formatMoney(transportMonthlyIncome)}</strong>
                </article>
                <article>
                  <span>Expense</span>
                  <strong>{formatMoney(transportMonthlyExpense)}</strong>
                </article>
              </div>
            </section>

            <section className="transportGrid">
              {Array.from({ length: Math.max(1, projectedBusCount || 1) }).map((_, index) => {
                const routeNo = index + 1;
                const capacityUsed = Math.min(45, Math.max(0, activeStudentCount - index * 45));
                return (
                  <article className="panel busCard" key={routeNo}>
                    <div className="panelHeader">
                      <h2>Bus Route {routeNo}</h2>
                      <Bus size={18} />
                    </div>
                    <div className="busMeter">
                      <span style={{ width: `${Math.max(8, Math.round((capacityUsed / 45) * 100))}%` }} />
                    </div>
                    <div className="insightList">
                      <div className="insightRow"><span>Capacity</span><strong>{capacityUsed}/45</strong></div>
                      <div className="insightRow"><span>Monthly Fee</span><strong>{formatMoney(capacityUsed * 1200)}</strong></div>
                      <div className="insightRow"><span>Fuel + Maintenance</span><strong>{formatMoney(18000)}</strong></div>
                      <div className="insightRow"><span>Status</span><strong>{capacityUsed >= 40 ? "Near Full" : "Available"}</strong></div>
                    </div>
                  </article>
                );
              })}
            </section>
          </section>
        )}

        {role === "admin" && activeTab === "records" && (
          <section className="opsPage">
            <section className="opsHero panel">
              <div>
                <p>Complete School Directory</p>
                <h2>Students, teachers and staff profiles</h2>
                <span>Class-wise student records, teacher list, staff register, profile details and CSV download.</span>
              </div>
              <div className="opsHeroMetrics">
                <article>
                  <span>Students</span>
                  <strong>{directoryStudents.length || activeStudentCount}</strong>
                </article>
                <article>
                  <span>Teachers</span>
                  <strong>{teacherDirectory.length}</strong>
                </article>
                <article>
                  <span>Staff</span>
                  <strong>{supportStaffDirectory.length || activeStaffCount}</strong>
                </article>
              </div>
            </section>

            <section className="panel directoryToolbar">
              <div className="directoryTabs" aria-label="Directory views">
                {[
                  { key: "students" as DirectoryView, label: "Students", count: directoryStudents.length },
                  { key: "teachers" as DirectoryView, label: "Teachers", count: teacherDirectory.length },
                  { key: "staff" as DirectoryView, label: "Staff", count: supportStaffDirectory.length }
                ].map((item) => (
                  <button
                    key={item.key}
                    type="button"
                    className={directoryView === item.key ? "active" : ""}
                    onClick={() => onDirectoryViewChange(item.key)}
                  >
                    <span>{item.label}</span>
                    <strong>{item.count}</strong>
                  </button>
                ))}
              </div>

              <div className="directoryControls">
                <label className="directorySearch">
                  <Search size={16} />
                  <input
                    value={directorySearch}
                    onChange={(event) => setDirectorySearch(event.target.value)}
                    placeholder="Search name, class, phone, subject..."
                  />
                </label>
                <button type="button" className="miniBtn exportBtn" onClick={exportDirectoryList} disabled={!currentDirectoryCount}>
                  <Download size={14} /> Download List
                </button>
              </div>

              {directoryView === "students" && (
                <div className="classFilterRail">
                  <button
                    type="button"
                    className={selectedClassKey === "all" ? "active" : ""}
                    onClick={() => setSelectedClassKey("all")}
                  >
                    All <strong>{directoryStudents.length}</strong>
                  </button>
                  {classSummary.map((item) => (
                    <button
                      type="button"
                      key={item.key}
                      className={selectedClassKey === item.key ? "active" : ""}
                      onClick={() => setSelectedClassKey(item.key)}
                    >
                      {item.label} <strong>{item.count}</strong>
                    </button>
                  ))}
                </div>
              )}
            </section>

            {directoryStatus && <div className="errorBox">{directoryStatus}</div>}

            {directoryLoading ? (
              <section className="panel directoryLoading">
                <AppLoader title="School records" message="Loading students, teachers and staff..." compact />
              </section>
            ) : (
              <section className="directoryLayout">
                <article className="panel directoryListPanel">
                  <div className="panelHeader">
                    <div>
                      <h2>
                        {directoryView === "students"
                          ? "Student List"
                          : directoryView === "teachers"
                            ? "Teacher List"
                            : "Staff List"}
                      </h2>
                      <p className="panelSub">{currentDirectoryCount} record(s) shown</p>
                    </div>
                  </div>

                  <div className="directoryList">
                    {directoryView === "students" &&
                      filteredStudents.map((student) => (
                        <button
                          type="button"
                          className={
                            selectedDirectoryProfile?.kind === "student" && selectedDirectoryProfile.id === student._id
                              ? "directoryRow active"
                              : "directoryRow"
                          }
                          key={student._id}
                          onClick={() => setSelectedDirectoryProfile({ kind: "student", id: student._id })}
                        >
                          <span className="profileAvatar">{getInitials(student.name)}</span>
                          <span>
                            <strong>{student.name}</strong>
                            <small>{student.admissionNo} | Class {student.className}-{student.section}</small>
                          </span>
                          <i>{student.rollNo || "No roll"}</i>
                        </button>
                      ))}

                    {directoryView === "teachers" &&
                      filteredTeachers.map((staff) => (
                        <button
                          type="button"
                          className={
                            selectedDirectoryProfile?.kind === "staff" && selectedDirectoryProfile.id === staff._id
                              ? "directoryRow active"
                              : "directoryRow"
                          }
                          key={staff._id}
                          onClick={() => setSelectedDirectoryProfile({ kind: "staff", id: staff._id })}
                        >
                          <span className="profileAvatar">{getInitials(staff.name)}</span>
                          <span>
                            <strong>{staff.name}</strong>
                            <small>{staff.employeeCode} | {(staff.subjects || []).join(", ") || "Subjects not added"}</small>
                          </span>
                          <i>{formatMoney(salaryBands.teacher)}</i>
                        </button>
                      ))}

                    {directoryView === "staff" &&
                      filteredSupportStaff.map((staff) => (
                        <button
                          type="button"
                          className={
                            selectedDirectoryProfile?.kind === "staff" && selectedDirectoryProfile.id === staff._id
                              ? "directoryRow active"
                              : "directoryRow"
                          }
                          key={staff._id}
                          onClick={() => setSelectedDirectoryProfile({ kind: "staff", id: staff._id })}
                        >
                          <span className="profileAvatar">{getInitials(staff.name)}</span>
                          <span>
                            <strong>{staff.name}</strong>
                            <small>{staff.employeeCode} | {formatRoleLabel(staff.role)}</small>
                          </span>
                          <i>{formatMoney(salaryBands[staff.role] || salaryBands.staff)}</i>
                        </button>
                      ))}

                    {!currentDirectoryCount && <p className="emptyHint">No matching records found.</p>}
                  </div>
                </article>

                <aside className="panel profilePanel">
                  {selectedStudentProfile && (
                    <>
                      <div className="profileHeroBlock">
                        <span className="profileAvatar large">{getInitials(selectedStudentProfile.name)}</span>
                        <div>
                          <p>Student Profile</p>
                          <h2>{selectedStudentProfile.name}</h2>
                          <span>{selectedStudentProfile.admissionNo} | Class {selectedStudentProfile.className}-{selectedStudentProfile.section}</span>
                        </div>
                      </div>
                      <div className="profileDetailGrid">
                        <div><span>Roll No</span><strong>{selectedStudentProfile.rollNo || "Not added"}</strong></div>
                        <div><span>Gender</span><strong>{formatRoleLabel(selectedStudentProfile.gender)}</strong></div>
                        <div><span>Date of Birth</span><strong>{selectedStudentProfile.dob ? formatDate(selectedStudentProfile.dob) : "Not added"}</strong></div>
                        <div><span>Phone</span><strong>{selectedStudentProfile.phone || "Not added"}</strong></div>
                        <div><span>Guardian</span><strong>{selectedStudentProfile.guardian?.name || "Not added"}</strong></div>
                        <div><span>Guardian Phone</span><strong>{selectedStudentProfile.guardian?.phone || "Not added"}</strong></div>
                        <div><span>Guardian Email</span><strong>{selectedStudentProfile.guardian?.email || "Not added"}</strong></div>
                        <div><span>Status</span><strong>{formatRoleLabel(selectedStudentProfile.status)}</strong></div>
                        <div className="wide"><span>Address</span><strong>{selectedStudentProfile.address || "Not added"}</strong></div>
                      </div>
                    </>
                  )}

                  {selectedStaffProfile && (
                    <>
                      <div className="profileHeroBlock">
                        {selectedStaffProfile.profileImageUrl ? (
                          <img className="profilePhotoLarge" src={selectedStaffProfile.profileImageUrl} alt={selectedStaffProfile.name} />
                        ) : (
                          <span className="profileAvatar large">{getInitials(selectedStaffProfile.name)}</span>
                        )}
                        <div>
                          <p>{selectedStaffProfile.role === "teacher" ? "Teacher Profile" : "Staff Profile"}</p>
                          <h2>{selectedStaffProfile.name}</h2>
                          <span>{selectedStaffProfile.employeeCode} | {formatRoleLabel(selectedStaffProfile.role)}</span>
                        </div>
                      </div>
                      <div className="profileDetailGrid">
                        <div><span>Department</span><strong>{selectedStaffProfile.department || "Not added"}</strong></div>
                        <div><span>Phone</span><strong>{selectedStaffProfile.phone || "Not added"}</strong></div>
                        <div><span>Email</span><strong>{selectedStaffProfile.email || "Not added"}</strong></div>
                        <div><span>Joined</span><strong>{selectedStaffProfile.joinedAt ? formatDate(selectedStaffProfile.joinedAt) : "Not added"}</strong></div>
                        <div><span>Salary</span><strong>{formatMoney(salaryBands[selectedStaffProfile.role] || salaryBands.staff)}</strong></div>
                        <div><span>Status</span><strong>{formatRoleLabel(selectedStaffProfile.status)}</strong></div>
                        <div className="wide"><span>Subjects</span><strong>{(selectedStaffProfile.subjects || []).join(", ") || "Not added"}</strong></div>
                        <div className="wide"><span>Education / Qualification</span><strong>{selectedStaffProfile.qualification || "Not added in staff record yet"}</strong></div>
                      </div>
                      {selectedStaffProfile.role === "teacher" && (
                        <div className="documentUploadBlock">
                          <div className="staffActionRow">
                            <label className="miniBtn approveBtn mediaUploadBtn">
                              <input
                                type="file"
                                accept="image/*"
                                onChange={(event) =>
                                  uploadMediaFile(
                                    event.target.files?.[0] || null,
                                    "teacher-photo",
                                    `${selectedStaffProfile.name} website photo`,
                                    selectedStaffProfile._id
                                  )
                                }
                                disabled={uploadingKey === "teacher-photo"}
                              />
                              {uploadingKey === "teacher-photo" ? "Uploading..." : "Upload Teacher Photo"}
                            </label>
                            <button type="button" className="miniBtn" onClick={() => toggleTeacherWebsite(selectedStaffProfile)}>
                              {selectedStaffProfile.showOnWebsite === false ? "Show on Website" : "Hide from Website"}
                            </button>
                          </div>
                          {uploadStatus && <div className="successBox">{uploadStatus}</div>}
                        </div>
                      )}
                    </>
                  )}

                  {!selectedStudentProfile && !selectedStaffProfile && (
                    <div className="emptyProfile">
                      <UsersRound size={28} />
                      <strong>Select a record</strong>
                      <span>List se kisi student, teacher ya staff member par click karein.</span>
                    </div>
                  )}
                </aside>
              </section>
            )}
          </section>
        )}

        {role === "admin" && adminInsights && (activeTab === "overview" || activeTab === "analytics") && (
          <>
            <section className="adminInsightsGrid">
              <article className="panel adminChartPanel">
                <div className="chartHeader">
                  <div>
                    <p>Admissions Momentum</p>
                    <h3>Last 6 Months</h3>
                  </div>
                  <LineChart size={18} />
                </div>
                <div className="metricInline">
                  <strong>{totalAdmissions}</strong>
                  <span>new admissions tracked</span>
                </div>
                <div className="lineChartWrap">
                  <svg width="100%" viewBox="0 0 300 130" preserveAspectRatio="none" aria-label="Admissions trend">
                    <path d={admissionsLine.area} className="lineArea" />
                    <polyline points={admissionsLine.line} className="lineStroke" />
                  </svg>
                </div>
                <div className="lineChartLabels">
                  {adminInsights.admissionsTrend.map((item) => (
                    <span key={item.month}>{item.month.split(" ")[0]}</span>
                  ))}
                </div>
              </article>

              <article className="panel adminChartPanel">
                <div className="chartHeader">
                  <div>
                    <p>Fee Collection</p>
                    <h3>{feeCollectionRate}% Recovery</h3>
                  </div>
                  <Coins size={18} />
                </div>
                <div className="metricInline">
                  <strong>{formatMoney(totalCollected)}</strong>
                  <span>collected out of {formatMoney(totalBilled)}</span>
                </div>
                <div className="financeBars">
                  {adminInsights.feeTrend.map((item) => {
                    const billedHeight = Math.max(8, Math.round((item.billed / maxFeeBilled) * 100));
                    const collectedHeight = Math.max(6, Math.round((item.collected / maxFeeBilled) * 100));
                    return (
                      <div className="financeBar" key={item.month}>
                        <div className="financeColumns">
                          <span className="financeColumn billed" style={{ height: `${billedHeight}%` }} />
                          <span className="financeColumn collected" style={{ height: `${collectedHeight}%` }} />
                        </div>
                        <small>{item.month.split(" ")[0]}</small>
                      </div>
                    );
                  })}
                </div>
              </article>

              <article className="panel adminChartPanel">
                <div className="chartHeader">
                  <div>
                    <p>Attendance Pulse</p>
                    <h3>{attendanceAverage}% Weekly Avg</h3>
                  </div>
                  <CalendarDays size={18} />
                </div>
                <div className="attendancePulseList">
                  {adminInsights.attendanceTrend.map((item) => (
                    <div className="pulseRow" key={item.day}>
                      <div className="pulseMeta">
                        <strong>{item.day}</strong>
                        <span>{item.attendanceRate}% in-time</span>
                      </div>
                      <div className="pulseTrack"><span style={{ width: `${item.attendanceRate}%` }} /></div>
                      <small>{item.total} records</small>
                    </div>
                  ))}
                </div>
              </article>
            </section>

            {activeTab === "overview" && <section className="split adminOpsSplit">
              <section className="panel adminCalendarPanel">
                <div className="panelHeader calendarHeader">
                  <h2>Operations Calendar</h2>
                  <div className="calendarNav">
                    <button className="miniIconBtn" type="button" onClick={() => changeCalendarMonth(-1)} aria-label="Previous month">
                      <ArrowLeft size={14} />
                    </button>
                    <strong>{calendarData?.monthLabel}</strong>
                    <button className="miniIconBtn" type="button" onClick={() => changeCalendarMonth(1)} aria-label="Next month">
                      <ArrowRight size={14} />
                    </button>
                  </div>
                </div>

                <div className="weekdayGrid">
                  {calendarData?.weekdays.map((weekday) => (
                    <span key={weekday}>{weekday}</span>
                  ))}
                </div>

                <div className="calendarGrid">
                  {calendarData?.cells.map((cell) => {
                    const classNames = ["calendarDay"];
                    if (!cell.isCurrentMonth) classNames.push("dayMuted");
                    if (cell.isToday) classNames.push("dayToday");
                    if (selectedDayKey === cell.key) classNames.push("daySelected");
                    if (cell.events.length > 0) classNames.push("dayHasEvents");

                    return (
                      <button
                        key={cell.key}
                        type="button"
                        className={classNames.join(" ")}
                        onClick={() => setSelectedDayKey(cell.key)}
                      >
                        <span>{cell.day}</span>
                        {cell.events.length > 0 && <i className="eventDot">{cell.events.length}</i>}
                      </button>
                    );
                  })}
                </div>

                <div className="calendarEventList">
                  <h4>Schedule: {selectedDayKey ? formatDayKey(selectedDayKey) : "Selected Day"}</h4>
                  {selectedDayEvents.length ? (
                    selectedDayEvents.map((event) => (
                      <article className="calendarEventItem" key={event.id}>
                        <span className={`eventPill event-${event.type}`}>{event.type.toUpperCase()}</span>
                        <div>
                          <strong>{event.title}</strong>
                          <small>{event.meta}</small>
                        </div>
                      </article>
                    ))
                  ) : (
                    <p className="emptyHint">No planned event for this date.</p>
                  )}
                </div>
              </section>

              <section className="panel adminRadar">
                <div className="panelHeader">
                  <h2>Operations Radar</h2>
                </div>

                <div className="radarList">
                  <article className="radarRow">
                    <CircleAlert size={16} />
                    <div>
                      <strong>{adminInsights.security.pendingApprovals}</strong>
                      <span>Pending signup approvals</span>
                    </div>
                  </article>
                  <article className="radarRow">
                    <AlertTriangle size={16} />
                    <div>
                      <strong>{adminInsights.security.overdueFees}</strong>
                      <span>Overdue fee cases</span>
                    </div>
                  </article>
                  <article className="radarRow">
                    <ShieldCheck size={16} />
                    <div>
                      <strong>{adminInsights.security.attendanceSyncToday}</strong>
                      <span>Attendance batches synced today</span>
                    </div>
                  </article>
                </div>

                <p className="authMode">{adminInsights.security.authMode}</p>

                <div className="listBlock">
                  <h3><BookOpenCheck size={15} /> Upcoming Exams</h3>
                  {adminInsights.upcomingExams.length ? (
                    <div className="compactList">
                      {adminInsights.upcomingExams.map((exam) => (
                        <article className="listItem" key={exam.id}>
                          <div>
                            <strong>{exam.title}</strong>
                            <span>{exam.classLabel} | {exam.subject}</span>
                          </div>
                          <small>{formatDate(exam.examDate)}</small>
                        </article>
                      ))}
                    </div>
                  ) : (
                    <p className="emptyHint">No upcoming exam schedule.</p>
                  )}
                </div>

                <div className="listBlock">
                  <h3><Coins size={15} /> Fee Alerts</h3>
                  {adminInsights.feeAlerts.length ? (
                    <div className="compactList">
                      {adminInsights.feeAlerts.map((feeAlert) => (
                        <article className="listItem" key={feeAlert.id}>
                          <div>
                            <strong>{feeAlert.studentName}</strong>
                            <span>
                              {feeAlert.classLabel} | {formatMoney(feeAlert.amountDue)}
                            </span>
                          </div>
                          <div className="listMeta">
                            <small>{formatDate(feeAlert.dueDate)}</small>
                            <span className={`statusBadge status-${feeAlert.status}`}>{feeAlert.status}</span>
                          </div>
                        </article>
                      ))}
                    </div>
                  ) : (
                    <p className="emptyHint">No active due alerts.</p>
                  )}
                </div>
              </section>
            </section>}

            <section className="panel" style={{ marginTop: 18 }}>
              <div className="panelHeader">
                <h2>Class Strength Snapshot</h2>
              </div>
              <div className="classStrengthList">
                {adminInsights.classStrength.map((item) => (
                  <article className="strengthRow" key={item.classLabel}>
                    <div>
                      <strong>{item.classLabel}</strong>
                      <span>{item.count} students</span>
                    </div>
                    <div className="strengthMeter">
                      <span style={{ width: `${Math.max(10, Math.round((item.count / maxClassStrength) * 100))}%` }} />
                    </div>
                  </article>
                ))}
                {!adminInsights.classStrength.length && <p className="emptyHint">No class data available.</p>}
              </div>
            </section>
          </>
        )}

        {role === "admin" && adminInsights && activeTab === "calendar" && (
          <section className="panel adminCalendarPanel">
            <div className="panelHeader calendarHeader">
              <h2>Operations Calendar</h2>
              <div className="calendarNav">
                <button className="miniIconBtn" type="button" onClick={() => changeCalendarMonth(-1)} aria-label="Previous month">
                  <ArrowLeft size={14} />
                </button>
                <strong>{calendarData?.monthLabel}</strong>
                <button className="miniIconBtn" type="button" onClick={() => changeCalendarMonth(1)} aria-label="Next month">
                  <ArrowRight size={14} />
                </button>
              </div>
            </div>

            <div className="weekdayGrid">
              {calendarData?.weekdays.map((weekday) => (
                <span key={weekday}>{weekday}</span>
              ))}
            </div>

            <div className="calendarGrid">
              {calendarData?.cells.map((cell) => {
                const classNames = ["calendarDay"];
                if (!cell.isCurrentMonth) classNames.push("dayMuted");
                if (cell.isToday) classNames.push("dayToday");
                if (selectedDayKey === cell.key) classNames.push("daySelected");
                if (cell.events.length > 0) classNames.push("dayHasEvents");

                return (
                  <button key={cell.key} type="button" className={classNames.join(" ")} onClick={() => setSelectedDayKey(cell.key)}>
                    <span>{cell.day}</span>
                    {cell.events.length > 0 && <i className="eventDot">{cell.events.length}</i>}
                  </button>
                );
              })}
            </div>

            <div className="calendarEventList">
              <h4>Schedule: {selectedDayKey ? formatDayKey(selectedDayKey) : "Selected Day"}</h4>
              {selectedDayEvents.length ? (
                selectedDayEvents.map((event) => (
                  <article className="calendarEventItem" key={event.id}>
                    <span className={`eventPill event-${event.type}`}>{event.type.toUpperCase()}</span>
                    <div>
                      <strong>{event.title}</strong>
                      <small>{event.meta}</small>
                    </div>
                  </article>
                ))
              ) : (
                <p className="emptyHint">No planned event for this date.</p>
              )}
            </div>
          </section>
        )}

        {role !== "staff" && (activeTab === "overview" || activeTab === "insights") && (
        <section className="split" style={{ marginTop: role === "admin" ? 18 : 0 }}>
          <section className="panel">
            <div className="panelHeader">
              <h2>{role[0].toUpperCase() + role.slice(1)} Module Access</h2>
            </div>
            <div className="moduleGrid">
              {filteredModules.map((module) => (
                <article className="module" key={module}>
                  <span className="moduleChip">{role}</span>
                  <strong>{module}</strong>
                  <span>Secure module view for {role} role.</span>
                </article>
              ))}
              {!filteredModules.length && <p className="emptyHint">No modules match your search.</p>}
            </div>
          </section>

          <section className="panel">
            <div className="panelHeader">
              <h2>{dashboardData.profile?.label || "Account Snapshot"}</h2>
            </div>
            <div className="insightList">
              {(dashboardData.profile?.items || []).map((item) => (
                <div key={item.key} className="insightRow">
                  <span>{item.key}</span>
                  <strong>{item.value}</strong>
                </div>
              ))}
            </div>
          </section>
        </section>
        )}

        {(activeTab === "overview" || activeTab === "notices") && <section className="panel" style={{ marginTop: 18 }}>
          <div className="panelHeader">
            <h2>Recent Notices</h2>
          </div>
          <div className="noticeGrid">
            {filteredNotices.map((notice) => (
              <article className={`noticeCard priority-${notice.priority}`} key={notice.id}>
                <p>{notice.priority.toUpperCase()}</p>
                <strong>{notice.title}</strong>
                <span>{notice.body}</span>
                <small>
                  {notice.audience} | {new Date(notice.publishAt).toLocaleDateString()}
                </small>
              </article>
            ))}
            {!filteredNotices.length && <p className="emptyHint">No notices match your search.</p>}
          </div>
        </section>}

        {role === "admin" && (activeTab === "overview" || activeTab === "approvals") && (
          <section className="panel" style={{ marginTop: 18 }}>
            <div className="panelHeader">
              <h2>Pending Signup Requests</h2>
            </div>
            <div className="table">
              <div className="tableHead">
                <span>Name</span>
                <span>Email</span>
                <span>Role</span>
                <span>Requested</span>
                <span>Action</span>
              </div>
              {(dashboardData.pendingApprovals || []).map((item) => (
                <div className="tableRow" key={item.id}>
                  <span>{item.name}</span>
                  <span>{item.email}</span>
                  <span>{item.role}</span>
                  <span>{new Date(item.createdAt).toLocaleDateString()}</span>
                  <span className="tableActions">
                    <button
                      className="miniBtn approveBtn"
                      disabled={actionLoading === `approve-${item.id}`}
                      onClick={() => onApprovalAction(item.id, "approve")}
                    >
                      Approve
                    </button>
                    <button
                      className="miniBtn rejectBtn"
                      disabled={actionLoading === `reject-${item.id}`}
                      onClick={() => onApprovalAction(item.id, "reject")}
                    >
                      Reject
                    </button>
                  </span>
                </div>
              ))}
              {!dashboardData.pendingApprovals?.length && (
                <div className="tableRow">
                  <span>No pending requests</span>
                  <span>-</span>
                  <span>-</span>
                  <span>-</span>
                  <span>-</span>
                </div>
              )}
            </div>
          </section>
        )}
      </section>
    </main>
  );
}
