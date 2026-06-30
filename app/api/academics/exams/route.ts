import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { connectDb } from "@/lib/server/db";
import { requireAuth, requireRoles } from "@/lib/server/auth";
import { Exam } from "@/lib/server/models/Academic";
import { handleApiError } from "@/lib/server/response";

const examSchema = z.object({
  title: z.string().min(1),
  className: z.string().min(1),
  section: z.string().optional(),
  subject: z.string().min(1),
  examDate: z.coerce.date().optional(),
  maxMarks: z.number().positive().default(100),
  results: z
    .array(
      z.object({
        student: z.string().min(1),
        marks: z.number().min(0),
        grade: z.string().optional(),
        remarks: z.string().optional()
      })
    )
    .default([])
});

export async function GET(request: NextRequest) {
  try {
    await connectDb();
    await requireAuth(request);
    const exams = await Exam.find().sort({ examDate: -1 });
    return NextResponse.json(exams);
  } catch (error) {
    return handleApiError(error);
  }
}

export async function POST(request: NextRequest) {
  try {
    await connectDb();
    const user = await requireAuth(request);
    requireRoles(user, "admin", "teacher");

    const data = examSchema.parse(await request.json());
    const created = await Exam.create(data);
    return NextResponse.json(created, { status: 201 });
  } catch (error) {
    return handleApiError(error);
  }
}
