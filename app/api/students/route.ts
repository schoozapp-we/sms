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

export async function GET(request: NextRequest) {
  try {
    await connectDb();
    await requireAuth(request);

    const q = request.nextUrl.searchParams.get("q");
    const className = request.nextUrl.searchParams.get("className");
    const page = Number(request.nextUrl.searchParams.get("page") || 1);
    const limit = Number(request.nextUrl.searchParams.get("limit") || 20);

    const filter: Record<string, unknown> = {};
    if (q) filter.$text = { $search: q };
    if (className) filter.className = className;

    const skip = (page - 1) * limit;
    const [items, total] = await Promise.all([
      Student.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit),
      Student.countDocuments(filter)
    ]);

    return NextResponse.json({ items, total, page, limit });
  } catch (error) {
    return handleApiError(error);
  }
}

export async function POST(request: NextRequest) {
  try {
    await connectDb();
    const user = await requireAuth(request);
    requireRoles(user, "admin", "reception");

    const data = studentSchema.parse(await request.json());
    const student = await Student.create(data);
    return NextResponse.json(student, { status: 201 });
  } catch (error) {
    return handleApiError(error);
  }
}
