import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { requireAuth, requireRoles } from "@/lib/server/auth";
import { connectDb } from "@/lib/server/db";
import { Notice } from "@/lib/server/models/Notice";
import { handleApiError } from "@/lib/server/response";

const studentUpdateSchema = z.object({
  className: z.string().min(1),
  section: z.string().min(1),
  title: z.string().min(3),
  body: z.string().min(5),
  priority: z.enum(["low", "normal", "high"]).default("normal")
});

export async function POST(request: NextRequest) {
  try {
    await connectDb();
    const user = await requireAuth(request);
    requireRoles(user, "admin", "teacher");

    const data = studentUpdateSchema.parse(await request.json());
    const notice = await Notice.create({
      title: data.title,
      body: `Class ${data.className}-${data.section}: ${data.body}`,
      audience: "students",
      priority: data.priority
    });

    return NextResponse.json({
      message: "Student notice created",
      notice
    }, { status: 201 });
  } catch (error) {
    return handleApiError(error);
  }
}
