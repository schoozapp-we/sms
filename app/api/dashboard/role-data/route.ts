import { NextRequest, NextResponse } from "next/server";
import { connectDb } from "@/lib/server/db";
import { requireAuth } from "@/lib/server/auth";
import { Attendance, ClassRoom, Exam } from "@/lib/server/models/Academic";
import { Fee } from "@/lib/server/models/Finance";
import { Notice } from "@/lib/server/models/Notice";
import { Staff } from "@/lib/server/models/Staff";
import { Student } from "@/lib/server/models/Student";
import { User } from "@/lib/server/models/User";
import { handleApiError } from "@/lib/server/response";

function getAudienceByRole(role: string) {
  if (role === "student") return "students";
  if (role === "parent") return "parents";
  return "staff";
}

function toDashboardRole(role: string) {
  if (["admin", "teacher", "student", "parent", "staff"].includes(role)) return role;
  if (["accountant", "reception"].includes(role)) return "staff";
  return "staff";
}

function formatNotice(notice: any) {
  return {
    id: notice._id,
    title: notice.title,
    body: notice.body,
    priority: notice.priority,
    audience: notice.audience,
    publishAt: notice.publishAt
  };
}

const MONTH_NAMES = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

function toDayKey(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function toMonthKey(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  return `${year}-${month}`;
}

function buildMonthSeries(length: number, endDate = new Date()) {
  const start = new Date(endDate.getFullYear(), endDate.getMonth(), 1);
  const series: Array<{ key: string; label: string; monthStart: Date }> = [];
  for (let i = length - 1; i >= 0; i -= 1) {
    const monthDate = new Date(start.getFullYear(), start.getMonth() - i, 1);
    series.push({
      key: toMonthKey(monthDate),
      label: `${MONTH_NAMES[monthDate.getMonth()]} ${String(monthDate.getFullYear()).slice(-2)}`,
      monthStart: monthDate
    });
  }
  return series;
}

export async function GET(request: NextRequest) {
  try {
    await connectDb();
    const authUser: any = await requireAuth(request);
    const role = toDashboardRole(authUser.role);
    const todayStart = new Date(new Date().setHours(0, 0, 0, 0));
    const audience = getAudienceByRole(authUser.role);

    const user: any = await User.findById(authUser._id)
      .select("name email role staffProfile studentProfile childrenProfiles")
      .lean();

    if (!user) {
      return NextResponse.json({ message: "Invalid session" }, { status: 401 });
    }

    const noticeFilter = role === "admin" ? {} : { audience: { $in: ["all", audience] } };
    const notices: any[] = await Notice.find(noticeFilter).sort({ publishAt: -1 }).limit(6).lean();

    if (role === "student") {
      const student: any = user.studentProfile ? await Student.findById(user.studentProfile).lean() : null;
      if (!student) {
        return NextResponse.json({
          role,
          title: "Student Dashboard",
          intro: "Account approved hai, lekin student profile abhi school admin ne map nahi ki hai.",
          stats: [
            { label: "Profile Mapping", value: "Pending", trend: "Admin action required" },
            { label: "Recent Notices", value: String(notices.length), trend: "Student + all audience" },
            { label: "Attendance", value: "N/A", trend: "Profile not linked" },
            { label: "Fee Status", value: "N/A", trend: "Profile not linked" }
          ],
          modules: ["Profile Setup Pending", "Notices", "Support Desk", "Help Center"],
          profile: {
            label: "Student Profile",
            items: [
              { key: "Name", value: user.name },
              { key: "Email", value: user.email },
              { key: "Link Status", value: "Not linked" },
              { key: "Next Step", value: "Contact school admin" }
            ]
          },
          notices: notices.map(formatNotice)
        });
      }

      const [fees, attendanceDocs, exams] = await Promise.all([
        Fee.find({ student: student._id }).sort({ dueDate: -1 }).lean(),
        Attendance.find({ "records.student": student._id }).select("date records").sort({ date: -1 }).lean(),
        Exam.find({ className: student.className, section: { $in: [student.section, null, ""] } })
          .sort({ examDate: 1 })
          .limit(10)
          .lean()
      ]);

      const attendanceSummary = (attendanceDocs as any[]).reduce(
        (acc, doc) => {
          const record = doc.records.find((item: any) => String(item.student) === String(student._id));
          if (!record) return acc;
          acc.total += 1;
          if (record.status === "present") acc.present += 1;
          if (record.status === "late") acc.late += 1;
          if (record.status === "absent") acc.absent += 1;
          return acc;
        },
        { total: 0, present: 0, late: 0, absent: 0 }
      );

      const attendancePercent = attendanceSummary.total
        ? Math.round(((attendanceSummary.present + attendanceSummary.late) / attendanceSummary.total) * 100)
        : 0;

      const totalDue = (fees as any[]).reduce((sum, fee) => sum + Math.max(0, fee.amount - fee.paidAmount), 0);

      return NextResponse.json({
        role,
        title: "Student Dashboard",
        intro: `Welcome ${student.name}. Your personal attendance, exams and fee updates are live.`,
        stats: [
          { label: "Attendance", value: `${attendancePercent}%`, trend: `${attendanceSummary.total} records` },
          { label: "Pending Fee", value: `Rs ${totalDue}`, trend: totalDue > 0 ? "Action required" : "All clear" },
          { label: "Upcoming Exams", value: String((exams as any[]).length), trend: `${student.className}-${student.section}` },
          { label: "Recent Notices", value: String(notices.length), trend: "Student + all audience" }
        ],
        modules: ["My Attendance", "My Fee Status", "Exam Calendar", "School Notices"],
        profile: {
          label: "Student Profile",
          items: [
            { key: "Admission No", value: student.admissionNo },
            { key: "Class", value: `${student.className}-${student.section}` },
            { key: "Roll No", value: student.rollNo || "N/A" },
            { key: "Guardian", value: student.guardian?.name || "N/A" }
          ]
        },
        notices: notices.map(formatNotice)
      });
    }

    if (role === "parent") {
      const children: any[] = await Student.find({ _id: { $in: user.childrenProfiles || [] } }).lean();
      if (!children.length) {
        return NextResponse.json({
          role,
          title: "Parent / User Dashboard",
          intro: "Account active hai, lekin abhi koi child profile linked nahi hai.",
          stats: [
            { label: "Linked Children", value: "0", trend: "Mapping pending" },
            { label: "Recent Notices", value: String(notices.length), trend: "Parent + all audience" },
            { label: "Attendance", value: "N/A", trend: "No child linked" },
            { label: "Fee Due", value: "N/A", trend: "No child linked" }
          ],
          modules: ["Child Mapping Pending", "School Notices", "Support Desk", "Help Center"],
          profile: {
            label: "Parent Profile",
            items: [
              { key: "Name", value: user.name },
              { key: "Email", value: user.email },
              { key: "Children Linked", value: "0" },
              { key: "Next Step", value: "Contact school admin" }
            ]
          },
          notices: notices.map(formatNotice)
        });
      }

      const childIds = children.map((child) => child._id);

      const [fees, attendanceDocs, exams] = await Promise.all([
        Fee.find({ student: { $in: childIds } }).lean(),
        Attendance.find({ "records.student": { $in: childIds } }).select("date records").lean(),
        Exam.find({ className: { $in: [...new Set(children.map((child) => child.className))] } }).limit(12).lean()
      ]);

      let attendanceRecords = 0;
      let presentOrLate = 0;
      (attendanceDocs as any[]).forEach((doc) => {
        doc.records.forEach((record: any) => {
          if (childIds.some((id: any) => String(id) === String(record.student))) {
            attendanceRecords += 1;
            if (record.status === "present" || record.status === "late") {
              presentOrLate += 1;
            }
          }
        });
      });

      const attendancePercent = attendanceRecords ? Math.round((presentOrLate / attendanceRecords) * 100) : 0;
      const totalDue = (fees as any[]).reduce((sum, fee) => sum + Math.max(0, fee.amount - fee.paidAmount), 0);

      return NextResponse.json({
        role,
        title: "Parent / User Dashboard",
        intro: `Track live progress for ${children.length} linked child account(s).`,
        stats: [
          { label: "Linked Children", value: String(children.length), trend: "Parent mapping active" },
          { label: "Combined Attendance", value: `${attendancePercent}%`, trend: `${attendanceRecords} records` },
          { label: "Total Fee Due", value: `Rs ${totalDue}`, trend: totalDue > 0 ? "Payment pending" : "No dues" },
          { label: "Relevant Notices", value: String(notices.length), trend: "Parent + all audience" }
        ],
        modules: ["Child Attendance", "Fee Ledger", "Exam Updates", "School Communication"],
        profile: {
          label: "Linked Students",
          items: children.map((child) => ({ key: child.name, value: `${child.className}-${child.section}` }))
        },
        notices: notices.map(formatNotice),
        meta: {
          examsVisible: (exams as any[]).length
        }
      });
    }

    if (role === "teacher") {
      const staffProfile: any = user.staffProfile
        ? await Staff.findById(user.staffProfile).lean()
        : await Staff.findOne({ email: user.email, role: "teacher" }).lean();

      if (!staffProfile) {
        return NextResponse.json({
          role,
          title: "Teacher Dashboard",
          intro: "Login successful hai, but teacher staff profile abhi linked nahi hai.",
          stats: [
            { label: "Assigned Classes", value: "0", trend: "Mapping pending" },
            { label: "Students", value: "0", trend: "No class linked" },
            { label: "Attendance", value: "N/A", trend: "No class linked" },
            { label: "Recent Notices", value: String(notices.length), trend: "Staff + all audience" }
          ],
          modules: ["Class Mapping Pending", "Notices", "Support Desk", "Help Center"],
          profile: {
            label: "Teacher Profile",
            items: [
              { key: "Name", value: user.name },
              { key: "Email", value: user.email },
              { key: "Staff Link", value: "Not linked" },
              { key: "Next Step", value: "Contact school admin" }
            ]
          },
          notices: notices.map(formatNotice)
        });
      }

      const classes: any[] = await ClassRoom.find({ classTeacher: staffProfile._id }).lean();
      const classPairs = classes.map((item) => ({ name: item.name, section: item.section }));

      const studentFilter = classPairs.length
        ? { $or: classPairs.map((pair) => ({ className: pair.name, section: pair.section })) }
        : { _id: null };

      const [studentCount, attendanceToday, exams] = await Promise.all([
        Student.countDocuments(studentFilter),
        classPairs.length
          ? Attendance.countDocuments({
              date: { $gte: todayStart },
              $or: classPairs.map((pair) => ({ className: pair.name, section: pair.section }))
            })
          : 0,
        classPairs.length
          ? Exam.countDocuments({ $or: classPairs.map((pair) => ({ className: pair.name, section: pair.section })) })
          : 0
      ]);

      return NextResponse.json({
        role,
        title: "Teacher Dashboard",
        intro: `Welcome ${staffProfile.name}. Data shown for your assigned classes only.`,
        stats: [
          { label: "Assigned Classes", value: String(classes.length), trend: "Teacher mapping" },
          { label: "Students", value: String(studentCount), trend: "In your sections" },
          { label: "Today Attendance", value: String(attendanceToday), trend: "Batches submitted" },
          { label: "Class Exams", value: String(exams), trend: "Scheduled records" }
        ],
        modules: ["Class Attendance", "Exam Marks", "Class Notices", "Assignment Planner"],
        profile: {
          label: "Teacher Profile",
          items: [
            { key: "Employee Code", value: staffProfile.employeeCode },
            { key: "Department", value: staffProfile.department || "N/A" },
            { key: "Subjects", value: (staffProfile.subjects || []).join(", ") || "N/A" },
            { key: "Classes", value: classPairs.map((item) => `${item.name}-${item.section}`).join(", ") || "None" }
          ]
        },
        notices: notices.map(formatNotice)
      });
    }

    if (role === "staff") {
      const [studentCount, staffCount, pendingFeesCount, overdueFeesCount] = await Promise.all([
        Student.countDocuments({ status: "active" }),
        Staff.countDocuments({ status: "active" }),
        Fee.countDocuments({ status: { $in: ["pending", "partial"] } }),
        Fee.countDocuments({ status: "overdue" })
      ]);

      return NextResponse.json({
        role,
        title: "Staff Operations Dashboard",
        intro: "Office operations and follow-ups with secure role-based data visibility.",
        stats: [
          { label: "Students", value: String(studentCount), trend: "Managed records" },
          { label: "Active Staff", value: String(staffCount), trend: "Operational team" },
          { label: "Fee Followups", value: String(pendingFeesCount), trend: "Pending + partial" },
          { label: "Urgent Dues", value: String(overdueFeesCount), trend: "Overdue records" }
        ],
        modules: ["Admission Desk", "Document Control", "Transport Desk", "Front Office Alerts"],
        profile: {
          label: "Staff Access",
          items: [
            { key: "User", value: user.name },
            { key: "Role", value: user.role },
            { key: "Scope", value: "Operational" },
            { key: "Status", value: "Active" }
          ]
        },
        notices: notices.map(formatNotice)
      });
    }

    const attendanceStart = new Date(todayStart);
    attendanceStart.setDate(attendanceStart.getDate() - 6);

    const monthSeries = buildMonthSeries(6);
    const monthSeriesStart = monthSeries[0].monthStart;

    const [
      studentCount,
      staffCount,
      classCount,
      examCount,
      attendanceTodayCount,
      pendingFeesCount,
      overdueFeesCount,
      pendingApprovals,
      attendanceHistory,
      recentFees,
      recentAdmissions,
      classStrength,
      upcomingExams,
      dueFees
    ] = await Promise.all([
      Student.countDocuments({ status: "active" }),
      Staff.countDocuments({ status: "active" }),
      ClassRoom.countDocuments({}),
      Exam.countDocuments({}),
      Attendance.countDocuments({ date: { $gte: todayStart } }),
      Fee.countDocuments({ status: { $in: ["pending", "partial"] } }),
      Fee.countDocuments({ status: "overdue" }),
      User.find({ status: "pending" }).select("name email role createdAt").sort({ createdAt: -1 }).limit(10).lean(),
      Attendance.find({ date: { $gte: attendanceStart } }).select("date records").lean(),
      Fee.find({ createdAt: { $gte: monthSeriesStart } }).select("amount paidAmount createdAt").lean(),
      Student.find({ createdAt: { $gte: monthSeriesStart } }).select("createdAt").lean(),
      Student.aggregate([
        { $match: { status: "active" } },
        { $group: { _id: { className: "$className", section: "$section" }, count: { $sum: 1 } } },
        { $sort: { count: -1 } },
        { $limit: 7 }
      ]),
      Exam.find({ examDate: { $gte: todayStart } })
        .select("title subject className section examDate")
        .sort({ examDate: 1 })
        .limit(8)
        .lean(),
      Fee.find({ status: { $in: ["pending", "partial", "overdue"] }, dueDate: { $ne: null } })
        .populate("student", "name className section")
        .select("student invoiceNo amount paidAmount status dueDate")
        .sort({ dueDate: 1 })
        .limit(8)
        .lean()
    ]);

    const attendanceBuckets = new Map<
      string,
      { day: string; present: number; late: number; absent: number; leave: number; total: number }
    >();
    for (let i = 0; i < 7; i += 1) {
      const dayDate = new Date(attendanceStart);
      dayDate.setDate(attendanceStart.getDate() + i);
      const key = toDayKey(dayDate);
      attendanceBuckets.set(key, {
        day: dayDate.toLocaleDateString("en-IN", { weekday: "short" }),
        present: 0,
        late: 0,
        absent: 0,
        leave: 0,
        total: 0
      });
    }

    (attendanceHistory as any[]).forEach((doc) => {
      const key = toDayKey(new Date(doc.date));
      const bucket = attendanceBuckets.get(key);
      if (!bucket) return;

      (doc.records || []).forEach((record: any) => {
        bucket.total += 1;
        if (record.status === "present") bucket.present += 1;
        if (record.status === "late") bucket.late += 1;
        if (record.status === "absent") bucket.absent += 1;
        if (record.status === "leave") bucket.leave += 1;
      });
    });

    const attendanceTrend = Array.from(attendanceBuckets.values()).map((item) => ({
      ...item,
      attendanceRate: item.total ? Math.round(((item.present + item.late) / item.total) * 100) : 0
    }));

    const feeBuckets = new Map<string, { month: string; billed: number; collected: number }>();
    monthSeries.forEach((month) => {
      feeBuckets.set(month.key, { month: month.label, billed: 0, collected: 0 });
    });
    (recentFees as any[]).forEach((fee) => {
      const key = toMonthKey(new Date(fee.createdAt || Date.now()));
      const bucket = feeBuckets.get(key);
      if (!bucket) return;
      const billed = Number(fee.amount || 0);
      const collected = Math.min(billed, Number(fee.paidAmount || 0));
      bucket.billed += billed;
      bucket.collected += collected;
    });
    const feeTrend = Array.from(feeBuckets.values()).map((item) => ({
      ...item,
      due: Math.max(0, item.billed - item.collected)
    }));

    const admissionsBuckets = new Map<string, { month: string; count: number }>();
    monthSeries.forEach((month) => {
      admissionsBuckets.set(month.key, { month: month.label, count: 0 });
    });
    (recentAdmissions as any[]).forEach((student) => {
      const key = toMonthKey(new Date(student.createdAt));
      const bucket = admissionsBuckets.get(key);
      if (bucket) bucket.count += 1;
    });
    const admissionsTrend = Array.from(admissionsBuckets.values());

    const classStrengthData = (classStrength as any[]).map((item) => ({
      classLabel: `${item._id.className}-${item._id.section}`,
      count: item.count
    }));

    const upcomingExamItems = (upcomingExams as any[]).map((exam) => ({
      id: String(exam._id),
      title: exam.title,
      subject: exam.subject,
      classLabel: `${exam.className}-${exam.section || "All"}`,
      examDate: exam.examDate
    }));

    const feeAlerts = (dueFees as any[]).map((fee) => {
      const studentData = fee.student as { name?: string; className?: string; section?: string } | null;
      const amountDue = Math.max(0, Number(fee.amount || 0) - Number(fee.paidAmount || 0));
      return {
        id: String(fee._id),
        invoiceNo: fee.invoiceNo,
        studentName: studentData?.name || "Unknown Student",
        classLabel:
          studentData?.className && studentData?.section
            ? `${studentData.className}-${studentData.section}`
            : "N/A",
        amountDue,
        status: fee.status,
        dueDate: fee.dueDate
      };
    });

    const calendarEvents = [
      ...upcomingExamItems.map((exam) => ({
        id: `exam-${exam.id}`,
        title: exam.title,
        date: exam.examDate,
        type: "exam",
        meta: `${exam.subject} | ${exam.classLabel}`
      })),
      ...feeAlerts.map((fee) => ({
        id: `fee-${fee.id}`,
        title: `Fee Due: ${fee.studentName}`,
        date: fee.dueDate,
        type: "fee",
        meta: `${fee.classLabel} | Rs ${fee.amountDue}`
      })),
      ...(notices as any[]).map((notice) => ({
        id: `notice-${notice._id}`,
        title: notice.title,
        date: notice.publishAt,
        type: "notice",
        meta: `${notice.audience} audience`
      }))
    ]
      .filter((event) => !!event.date)
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
      .slice(0, 18);

    return NextResponse.json({
      role: "admin",
      title: "Admin Control Dashboard",
      intro: "Institution-wide live governance metrics across academics, operations and finance.",
      stats: [
        { label: "Active Students", value: String(studentCount), trend: "Live from DB" },
        { label: "Active Staff", value: String(staffCount), trend: "Live from DB" },
        { label: "Classes", value: String(classCount), trend: "Configured sections" },
        { label: "Exams", value: String(examCount), trend: "Scheduled records" },
        { label: "Attendance Today", value: String(attendanceTodayCount), trend: "Submitted batches" },
        { label: "Pending Fees", value: String(pendingFeesCount + overdueFeesCount), trend: "Pending + overdue" },
        { label: "Signup Requests", value: String((pendingApprovals as any[]).length), trend: "Needs admin review" }
      ],
      modules: ["Governance", "Academics", "Finance", "Compliance", "Transport", "Communication"],
      profile: {
        label: "Admin Access",
        items: [
          { key: "Admin", value: user.name },
          { key: "Scope", value: "Full System" },
          { key: "Environment", value: process.env.NODE_ENV || "development" },
          { key: "Security", value: "Cookie + Role Protected" }
        ]
      },
      notices: notices.map(formatNotice),
      adminInsights: {
        attendanceTrend,
        feeTrend,
        admissionsTrend,
        classStrength: classStrengthData,
        upcomingExams: upcomingExamItems,
        feeAlerts,
        calendarEvents,
        security: {
          pendingApprovals: (pendingApprovals as any[]).length,
          overdueFees: overdueFeesCount,
          attendanceSyncToday: attendanceTodayCount,
          authMode: "HTTP Only Cookie + Role Guard"
        }
      },
      pendingApprovals: (pendingApprovals as any[]).map((item) => ({
        id: item._id,
        name: item.name,
        email: item.email,
        role: item.role,
        createdAt: item.createdAt
      }))
    });
  } catch (error) {
    return handleApiError(error);
  }
}
