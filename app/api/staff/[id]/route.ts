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
  joinedAt: z.coerce.date().optional()
});

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await connectDb();
    const user = await requireAuth(request);
    requireRoles(user, "admin");
    const { id } = await params;

    const data = staffSchema.partial().parse(await request.json());
    const staff = await Staff.findByIdAndUpdate(id, data, { new: true, runValidators: true });
    if (!staff) {
      return NextResponse.json({ message: "Staff member not found" }, { status: 404 });
    }

    return NextResponse.json(staff);
  } catch (error) {
    return handleApiError(error);
  }
}
