import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { connectDb } from "@/lib/server/db";
import { requireAuth, requireRoles } from "@/lib/server/auth";
import { Attendance } from "@/lib/server/models/Academic";
import { handleApiError } from "@/lib/server/response";

const attendanceSchema = z.object({
  date: z.coerce.date(),
  className: z.string().min(1),
  section: z.string().min(1),
  records: z.array(
    z.object({
      student: z.string().min(1),
      status: z.enum(["present", "absent", "late", "leave"]),
      note: z.string().optional()
    })
  )
});

export async function POST(request: NextRequest) {
  try {
    await connectDb();
    const user = await requireAuth(request);
    requireRoles(user, "admin", "teacher");

    const data = attendanceSchema.parse(await request.json());
    const created = await Attendance.create(data);
    return NextResponse.json(created, { status: 201 });
  } catch (error) {
    return handleApiError(error);
  }
}
