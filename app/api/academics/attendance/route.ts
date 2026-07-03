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
    const dayStart = new Date(data.date);
    dayStart.setHours(0, 0, 0, 0);
    const dayEnd = new Date(dayStart);
    dayEnd.setDate(dayEnd.getDate() + 1);

    const attendance = await Attendance.findOneAndUpdate(
      {
        date: { $gte: dayStart, $lt: dayEnd },
        className: data.className,
        section: data.section
      },
      {
        $set: {
          date: dayStart,
          className: data.className,
          section: data.section,
          records: data.records
        }
      },
      { upsert: true, new: true, runValidators: true }
    );

    return NextResponse.json(attendance, { status: 201 });
  } catch (error) {
    return handleApiError(error);
  }
}
