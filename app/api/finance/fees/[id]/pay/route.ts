import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { connectDb } from "@/lib/server/db";
import { requireAuth, requireRoles } from "@/lib/server/auth";
import { Fee } from "@/lib/server/models/Finance";
import { handleApiError } from "@/lib/server/response";

const paymentSchema = z.object({
  amount: z.number().positive()
});

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await connectDb();
    const user = await requireAuth(request);
    requireRoles(user, "admin", "accountant");
    const { id } = await params;
    const data = paymentSchema.parse(await request.json());

    const fee = await Fee.findById(id);
    if (!fee) {
      return NextResponse.json({ message: "Fee record not found" }, { status: 404 });
    }

    fee.paidAmount = Math.min(fee.amount, fee.paidAmount + data.amount);
    fee.status = fee.paidAmount >= fee.amount ? "paid" : "partial";
    fee.paidAt = new Date();
    await fee.save();

    return NextResponse.json(fee);
  } catch (error) {
    return handleApiError(error);
  }
}
