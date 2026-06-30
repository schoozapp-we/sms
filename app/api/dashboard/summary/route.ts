import { NextRequest, NextResponse } from "next/server";
import { connectDb } from "@/lib/server/db";
import { requireAuth } from "@/lib/server/auth";
import { Student } from "@/lib/server/models/Student";
import { Staff } from "@/lib/server/models/Staff";
import { Attendance } from "@/lib/server/models/Academic";
import { Fee } from "@/lib/server/models/Finance";
import { handleApiError } from "@/lib/server/response";

export async function GET(request: NextRequest) {
  try {
    await connectDb();
    await requireAuth(request);

    const [students, staff, attendanceToday, pendingFees] = await Promise.all([
      Student.countDocuments({ status: "active" }),
      Staff.countDocuments({ status: "active" }),
      Attendance.countDocuments({ date: { $gte: new Date(new Date().setHours(0, 0, 0, 0)) } }),
      Fee.countDocuments({ status: { $in: ["pending", "partial", "overdue"] } })
    ]);

    return NextResponse.json({
      stats: [
        { label: "Active Students", value: students },
        { label: "Active Staff", value: staff },
        { label: "Attendance Batches", value: attendanceToday },
        { label: "Pending Fee Items", value: pendingFees }
      ]
    });
  } catch (error) {
    return handleApiError(error);
  }
}
