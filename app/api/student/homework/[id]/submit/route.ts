/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from "next/server";
import { requireAuth, requireRoles } from "@/lib/server/auth";
import { connectDb } from "@/lib/server/db";
import { Homework } from "@/lib/server/models/Homework";
import { Student } from "@/lib/server/models/Student";
import { handleApiError } from "@/lib/server/response";

type HomeworkStudent = {
  className: string;
  section: string;
  status: string;
};

export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await connectDb();
    const user: any = await requireAuth(request);
    requireRoles(user, "student");

    const { id } = await params;
    if (!user.studentProfile) {
      return NextResponse.json({ message: "Student profile not linked" }, { status: 400 });
    }

    const [studentProfile, homework] = await Promise.all([
      Student.findById(user.studentProfile).select("className section status").lean(),
      Homework.findById(id)
    ]);
    const student = studentProfile as HomeworkStudent | null;
    if (!student || student.status !== "active") {
      return NextResponse.json({ message: "Student profile is not active" }, { status: 403 });
    }
    if (!homework) {
      return NextResponse.json({ message: "Homework not found" }, { status: 404 });
    }
    if (homework.className !== student.className || homework.section !== student.section) {
      return NextResponse.json({ message: "Homework is not assigned to this student" }, { status: 403 });
    }

    const submission = homework.submissions.find((item: any) => String(item.student) === String(user.studentProfile));
    if (submission) {
      submission.status = "submitted";
      submission.submittedAt = new Date();
    } else {
      homework.submissions.push({
        student: user.studentProfile,
        status: "submitted",
        submittedAt: new Date()
      });
    }

    await homework.save();
    return NextResponse.json({ message: "Homework marked as submitted" });
  } catch (error) {
    return handleApiError(error);
  }
}
