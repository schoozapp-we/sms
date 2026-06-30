import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { connectDb } from "@/lib/server/db";
import { requireAuth, requireRoles } from "@/lib/server/auth";
import { ClassRoom } from "@/lib/server/models/Academic";
import { handleApiError } from "@/lib/server/response";

const classRoomSchema = z.object({
  name: z.string().min(1),
  section: z.string().min(1),
  classTeacher: z.string().optional(),
  capacity: z.number().int().positive().default(40),
  timetable: z
    .array(
      z.object({
        day: z.string().min(1),
        period: z.number().int().positive(),
        subject: z.string().min(1),
        teacher: z.string().optional()
      })
    )
    .default([])
});

export async function GET(request: NextRequest) {
  try {
    await connectDb();
    await requireAuth(request);
    const classes = await ClassRoom.find().populate("classTeacher").sort({ name: 1, section: 1 });
    return NextResponse.json(classes);
  } catch (error) {
    return handleApiError(error);
  }
}

export async function POST(request: NextRequest) {
  try {
    await connectDb();
    const user = await requireAuth(request);
    requireRoles(user, "admin");

    const data = classRoomSchema.parse(await request.json());
    const created = await ClassRoom.create(data);
    return NextResponse.json(created, { status: 201 });
  } catch (error) {
    return handleApiError(error);
  }
}
