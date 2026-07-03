/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/server/auth";
import { connectDb } from "@/lib/server/db";
import { MediaAsset } from "@/lib/server/models/MediaAsset";
import { handleApiError } from "@/lib/server/response";

export async function GET(request: NextRequest) {
  try {
    await connectDb();
    const user: any = await requireAuth(request);
    const category = request.nextUrl.searchParams.get("category");
    const filter: Record<string, unknown> = { isActive: true };
    if (category) filter.category = category;

    if (user.role === "student") {
      filter.$or = [
        { ownerType: "student", owner: user.studentProfile },
        { isPublic: true, category: "gallery" }
      ];
    } else if (user.role !== "admin") {
      filter.$or = [
        { ownerType: "staff", owner: user.staffProfile },
        { isPublic: true, category: { $in: ["gallery", "teacher-photo"] } }
      ];
    }

    const items = await MediaAsset.find(filter).sort({ sortOrder: 1, createdAt: -1 }).limit(200).lean();
    return NextResponse.json({ items });
  } catch (error) {
    return handleApiError(error);
  }
}
