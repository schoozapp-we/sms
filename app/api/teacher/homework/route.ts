/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { requireAuth, requireRoles } from "@/lib/server/auth";
import { connectDb } from "@/lib/server/db";
import { ClassRoom } from "@/lib/server/models/Academic";
import { Homework } from "@/lib/server/models/Homework";
import { Student } from "@/lib/server/models/Student";
import { handleApiError } from "@/lib/server/response";

const homeworkSchema = z.object({
  className: z.string().min(1),
  section: z.string().min(1),
  subject: z.string().min(1),
  title: z.string().min(3),
  description: z.string().min(5),
  dueDate: z.coerce.date().optional(),
  scheduleAt: z.coerce.date().optional(),
  attachmentType: z.enum(["none", "pdf", "video", "voice", "link"]).default("none"),
  attachmentUrl: z.string().optional(),
  status: z.enum(["draft", "scheduled", "active"]).default("active")
});

export async function GET(request: NextRequest) {
  try {
    await connectDb();
    const user: any = await requireAuth(request);
    requireRoles(user, "admin", "teacher");

    const filter: Record<string, unknown> = {};
    if (user.role === "teacher") {
      filter.teacher = user.staffProfile;
    }

    const items = await Homework.find(filter).sort({ createdAt: -1 }).limit(50).lean();
    return NextResponse.json({ items });
  } catch (error) {
    return handleApiError(error);
  }
}

export async function POST(request: NextRequest) {
  try {
    await connectDb();
    const user: any = await requireAuth(request);
    requireRoles(user, "admin", "teacher");

    const data = homeworkSchema.parse(await request.json());
    const teacherId = user.staffProfile;
    if (!teacherId) {
      return NextResponse.json({ message: "Teacher profile not linked" }, { status: 400 });
    }

    if (user.role === "teacher") {
      const classRoom = await ClassRoom.findOne({
        name: data.className,
        section: data.section,
        classTeacher: teacherId
      }).lean();
      if (!classRoom) {
        return NextResponse.json({ message: "Class is not assigned to this teacher" }, { status: 403 });
      }
    }

    const students = await Student.find({ className: data.className, section: data.section, status: "active" })
      .select("_id")
      .lean();

    const homework = await Homework.create({
      ...data,
      teacher: teacherId,
      submissions: students.map((student) => ({
        student: student._id,
        status: "pending"
      }))
    });

    return NextResponse.json(homework, { status: 201 });
  } catch (error) {
    return handleApiError(error);
  }
}
