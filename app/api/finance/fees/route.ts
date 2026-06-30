import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { connectDb } from "@/lib/server/db";
import { requireAuth, requireRoles } from "@/lib/server/auth";
import { Fee } from "@/lib/server/models/Finance";
import { handleApiError } from "@/lib/server/response";

const feeSchema = z.object({
  student: z.string().min(1),
  invoiceNo: z.string().min(1),
  month: z.string().min(1),
  amount: z.number().positive(),
  paidAmount: z.number().min(0).default(0),
  dueDate: z.coerce.date().optional(),
  status: z.enum(["paid", "partial", "pending", "overdue"]).default("pending")
});

export async function GET(request: NextRequest) {
  try {
    await connectDb();
    const user = await requireAuth(request);
    requireRoles(user, "admin", "accountant");

    const fees = await Fee.find().populate("student").sort({ createdAt: -1 });
    return NextResponse.json(fees);
  } catch (error) {
    return handleApiError(error);
  }
}

export async function POST(request: NextRequest) {
  try {
    await connectDb();
    const user = await requireAuth(request);
    requireRoles(user, "admin", "accountant");

    const data = feeSchema.parse(await request.json());
    const fee = await Fee.create(data);
    return NextResponse.json(fee, { status: 201 });
  } catch (error) {
    return handleApiError(error);
  }
}
