import { NextRequest, NextResponse } from "next/server";
import { connectDb } from "@/lib/server/db";
import { requireAuth, requireRoles } from "@/lib/server/auth";
import { User } from "@/lib/server/models/User";
import { handleApiError } from "@/lib/server/response";

export async function GET(request: NextRequest) {
  try {
    await connectDb();
    const authUser = await requireAuth(request);
    requireRoles(authUser, "admin");

    const users = await User.find({ status: "pending" })
      .select("name email role status createdAt")
      .sort({ createdAt: -1 });

    return NextResponse.json({
      items: users.map((user) => ({
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        status: user.status,
        createdAt: user.createdAt
      }))
    });
  } catch (error) {
    return handleApiError(error);
  }
}
