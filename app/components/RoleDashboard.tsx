"use client";

import {
  AlertTriangle,
  ArrowLeft,
  ArrowRight,
  Bell,
  BookOpenCheck,
  CalendarDays,
  ClipboardList,
  CircleAlert,
  Coins,
  ExternalLink,
  FileText,
  Globe2,
  LayoutDashboard,
  LineChart,
  LogOut,
  Menu,
  Save,
  Search,
  ShieldCheck,
  Sparkles
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { defaultWebsiteContent, type WebsiteContent } from "../data/schoolSite";

type Role = "admin" | "teacher" | "student" | "parent" | "staff";

type DashboardStat = {
  label: string;
  value: string;
  trend: string;
};

type RoleDashboardProps = {
  role: Role;
};

type DashboardTab = "overview" | "analytics" | "calendar" | "approvals" | "website" | "insights" | "notices";

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
};

type WebsiteContentResponse = {
  content: WebsiteContent;
};

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
  onReset,
  onSave
}: Readonly<{
  draft: WebsiteContent;
  status: string;
  saving: boolean;
  onChange: (key: keyof WebsiteContent, value: string) => void;
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

  const navItems: Array<{ label: string; key: DashboardTab; icon: typeof LayoutDashboard }> =
    role === "admin"
      ? [
          { label: "Overview", key: "overview", icon: LayoutDashboard },
          { label: "Analytics", key: "analytics", icon: LineChart },
          { label: "Calendar", key: "calendar", icon: CalendarDays },
          { label: "Website Editor", key: "website", icon: Globe2 },
          { label: "Approvals", key: "approvals", icon: ClipboardList }
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
  const feeCollectionRate = totalBilled ? Math.round((totalCollected / totalBilled) * 100) : 0;
  const attendanceAverage = adminInsights?.attendanceTrend.length
    ? Math.round(
        adminInsights.attendanceTrend.reduce((sum, item) => sum + item.attendanceRate, 0) /
          adminInsights.attendanceTrend.length
      )
    : 0;
  const maxFeeBilled = Math.max(1, ...(adminInsights?.feeTrend.map((item) => item.billed) || [1]));
  const maxClassStrength = Math.max(1, ...(adminInsights?.classStrength.map((item) => item.count) || [1]));

  const changeCalendarMonth = (offset: number) => {
    setCalendarMonth((prev) => new Date(prev.getFullYear(), prev.getMonth() + offset, 1));
    setSelectedDayKey("");
  };

  if (loading || !dashboardData) {
    return (
      <main className="workspace" style={{ minHeight: "100vh", display: "grid", placeItems: "center" }}>
        <p>Loading secure dashboard...</p>
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

        {showQuickActions && (
          <section className="quickActionPanel" aria-label="Quick actions">
            {[
              { label: role === "admin" ? "Review approvals" : "Open today view", icon: ClipboardList, tab: role === "admin" ? "approvals" : "calendar" },
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

        {role === "admin" && activeTab === "website" && (
          <WebsiteEditor
            draft={websiteDraft}
            status={websiteStatus}
            saving={websiteSaving}
            onChange={onWebsiteDraftChange}
            onReset={() => {
              setWebsiteDraft(defaultWebsiteContent);
              setWebsiteStatus("Default content loaded. Save karne par website par apply hoga.");
            }}
            onSave={onWebsiteSave}
          />
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
          <section className="panel adminCalendarPanel" style={{ marginTop: 18 }}>
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

        {(activeTab === "overview" || activeTab === "insights") && (
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
