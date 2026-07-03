import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { connectDb } from "@/lib/server/db";
import { requireAuth, requireRoles } from "@/lib/server/auth";
import { Staff } from "@/lib/server/models/Staff";
import { handleApiError } from "@/lib/server/response";

const staffSchema = z.object({
  employeeCode: z.string().min(1),
  name: z.string().min(2),
  role: z.enum(["teacher", "accountant", "reception", "driver", "admin"]),
  department: z.string().optional(),
  subjects: z.array(z.string()).default([]),
  phone: z.string().optional(),
  email: z.string().email().optional(),
  profileImageUrl: z.string().optional(),
  qualification: z.string().optional(),
  experience: z.string().optional(),
  bio: z.string().optional(),
  showOnWebsite: z.boolean().optional(),
  joinedAt: z.coerce.date().optional()
});

export async function GET(request: NextRequest) {
  try {
    await connectDb();
    await requireAuth(request);
    const staff = await Staff.find().sort({ createdAt: -1 });
    return NextResponse.json(staff);
  } catch (error) {
    return handleApiError(error);
  }
}

export async function POST(request: NextRequest) {
  try {
    await connectDb();
    const user = await requireAuth(request);
    requireRoles(user, "admin");

    const data = staffSchema.parse(await request.json());
    const staff = await Staff.create(data);
    return NextResponse.json(staff, { status: 201 });
  } catch (error) {
    return handleApiError(error);
  }
}
