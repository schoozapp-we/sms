import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { connectDb } from "@/lib/server/db";
import { requireAuth, requireRoles, publicUser } from "@/lib/server/auth";
import { User } from "@/lib/server/models/User";
import { handleApiError } from "@/lib/server/response";

const approvalSchema = z.object({
  action: z.enum(["approve", "reject"])
});

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await connectDb();
    const authUser = await requireAuth(request);
    requireRoles(authUser, "admin");

    const { id } = await params;
    const { action } = approvalSchema.parse(await request.json());

    const user = await User.findById(id);
    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    if (user.role === "admin" && action === "reject") {
      return NextResponse.json({ message: "Admin account cannot be rejected" }, { status: 400 });
    }

    user.status = action === "approve" ? "active" : "blocked";
    await user.save();

    return NextResponse.json({
      message: action === "approve" ? "User approved successfully" : "User request rejected",
      user: publicUser(user)
    });
  } catch (error) {
    return handleApiError(error);
  }
}
