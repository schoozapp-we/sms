import bcrypt from "bcryptjs";
import { NextRequest, NextResponse } from "next/server";
import { connectDb } from "@/lib/server/db";
import { Attendance, ClassRoom, Exam } from "@/lib/server/models/Academic";
import { Fee } from "@/lib/server/models/Finance";
import { Notice } from "@/lib/server/models/Notice";
import { Staff } from "@/lib/server/models/Staff";
import { Student } from "@/lib/server/models/Student";
import { User } from "@/lib/server/models/User";
import { handleApiError } from "@/lib/server/response";

export async function POST(_request: NextRequest) {
  try {
    if (process.env.NODE_ENV === "production") {
      return NextResponse.json({ message: "Seed route is disabled in production" }, { status: 403 });
    }

    await connectDb();

    await Promise.all([
      User.deleteMany(),
      Staff.deleteMany(),
      Student.deleteMany(),
      ClassRoom.deleteMany(),
      Attendance.deleteMany(),
      Exam.deleteMany(),
      Fee.deleteMany(),
      Notice.deleteMany()
    ]);

    const passwordHash = await bcrypt.hash("Admin@12345", 12);

    const teacherStaff = await Staff.create({
      employeeCode: "EMP-001",
      name: "Neha Teacher",
      role: "teacher",
      department: "Science",
      subjects: ["Physics", "Chemistry"],
      phone: "9999999999",
      email: "teacher@school.test"
    });

    const officeStaff = await Staff.create({
      employeeCode: "EMP-002",
      name: "Ramesh Staff",
      role: "reception",
      department: "Administration",
      subjects: [],
      phone: "9888888888",
      email: "staff@school.test"
    });

    await ClassRoom.insertMany([
      { name: "10", section: "A", classTeacher: teacherStaff._id, capacity: 45 },
      { name: "10", section: "B", classTeacher: teacherStaff._id, capacity: 45 }
    ]);

    const students = await Student.insertMany([
      {
        admissionNo: "ADM-1001",
        name: "Aarav Mehta",
        gender: "male",
        className: "10",
        section: "A",
        rollNo: "1",
        guardian: { name: "Rohit Mehta", phone: "9880000001", relation: "father" }
      },
      {
        admissionNo: "ADM-1002",
        name: "Anaya Singh",
        gender: "female",
        className: "10",
        section: "A",
        rollNo: "2",
        guardian: { name: "Kavita Singh", phone: "9880000002", relation: "mother" }
      }
    ]);

    await Attendance.create({
      date: new Date(),
      className: "10",
      section: "A",
      records: [
        { student: students[0]._id, status: "present" },
        { student: students[1]._id, status: "late" }
      ]
    });

    await Exam.create({
      title: "Unit Test 1",
      className: "10",
      section: "A",
      subject: "Mathematics",
      examDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
      maxMarks: 100,
      results: []
    });

    await Fee.insertMany([
      {
        student: students[0]._id,
        invoiceNo: "INV-2026-001",
        month: "June-2026",
        amount: 4200,
        paidAmount: 4200,
        status: "paid",
        dueDate: new Date()
      },
      {
        student: students[1]._id,
        invoiceNo: "INV-2026-002",
        month: "June-2026",
        amount: 4200,
        paidAmount: 2000,
        status: "partial",
        dueDate: new Date()
      }
    ]);

    await Notice.insertMany([
      {
        title: "PTM Scheduled",
        body: "Parent teacher meeting is scheduled this Friday at 11:00 AM.",
        audience: "parents",
        priority: "high"
      },
      {
        title: "Unit Test Calendar",
        body: "Unit test timetable has been published on student portal.",
        audience: "students",
        priority: "normal"
      },
      {
        title: "Staff Briefing",
        body: "Weekly operations briefing at 8:30 AM in conference hall.",
        audience: "staff",
        priority: "normal"
      },
      {
        title: "School Foundation Day",
        body: "Foundation day celebration rehearsal starts from Monday.",
        audience: "all",
        priority: "low"
      }
    ]);

    await User.create({
      name: "School Admin",
      email: "admin@school.test",
      passwordHash,
      role: "admin"
    });

    await User.create({
      name: "Neha Teacher",
      email: "teacher@school.test",
      passwordHash,
      role: "teacher",
      staffProfile: teacherStaff._id
    });

    await User.create({
      name: "Ramesh Staff",
      email: "staff@school.test",
      passwordHash,
      role: "staff",
      staffProfile: officeStaff._id
    });

    await User.create({
      name: "Sunita Parent",
      email: "parent@school.test",
      passwordHash,
      role: "parent",
      childrenProfiles: [students[0]._id, students[1]._id]
    });

    await User.create({
      name: "Aarav Student",
      email: "student@school.test",
      passwordHash,
      role: "student",
      studentProfile: students[0]._id
    });

    return NextResponse.json({
      message: "Seed complete",
      logins: [
        "admin@school.test / Admin@12345",
        "teacher@school.test / Admin@12345",
        "staff@school.test / Admin@12345",
        "parent@school.test / Admin@12345",
        "student@school.test / Admin@12345"
      ]
    });
  } catch (error) {
    return handleApiError(error);
  }
}
