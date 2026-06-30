import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { connectDb } from "@/lib/server/db";
import { requireAuth, requireRoles } from "@/lib/server/auth";
import { Student } from "@/lib/server/models/Student";
import { handleApiError } from "@/lib/server/response";

const studentSchema = z.object({
  admissionNo: z.string().min(1),
  name: z.string().min(2),
  gender: z.enum(["male", "female", "other"]),
  dob: z.coerce.date().optional(),
  className: z.string().min(1),
  section: z.string().default("A"),
  rollNo: z.string().optional(),
  phone: z.string().optional(),
  address: z.string().optional(),
  guardian: z
    .object({
      name: z.string().optional(),
      phone: z.string().optional(),
      email: z.string().email().optional(),
      relation: z.string().optional()
    })
    .optional()
});

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await connectDb();
    await requireAuth(request);
    const { id } = await params;
    const student = await Student.findById(id);
    if (!student) {
      return NextResponse.json({ message: "Student not found" }, { status: 404 });
    }
    return NextResponse.json(student);
  } catch (error) {
    return handleApiError(error);
  }
}

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await connectDb();
    const user = await requireAuth(request);
    requireRoles(user, "admin", "reception");
    const { id } = await params;

    const data = studentSchema.partial().parse(await request.json());
    const student = await Student.findByIdAndUpdate(id, data, { new: true, runValidators: true });
    if (!student) {
      return NextResponse.json({ message: "Student not found" }, { status: 404 });
    }

    return NextResponse.json(student);
  } catch (error) {
    return handleApiError(error);
  }
}
