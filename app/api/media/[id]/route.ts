import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { requireAuth, requireRoles } from "@/lib/server/auth";
import { connectDb } from "@/lib/server/db";
import { MediaAsset } from "@/lib/server/models/MediaAsset";
import { handleApiError } from "@/lib/server/response";

const mediaUpdateSchema = z.object({
  title: z.string().min(1).optional(),
  description: z.string().optional(),
  isPublic: z.boolean().optional(),
  isActive: z.boolean().optional(),
  sortOrder: z.number().optional()
});

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await connectDb();
    const user = await requireAuth(request);
    requireRoles(user, "admin");
    const { id } = await params;
    const data = mediaUpdateSchema.parse(await request.json());
    const item = await MediaAsset.findByIdAndUpdate(id, data, { new: true });
    if (!item) return NextResponse.json({ message: "Media not found" }, { status: 404 });
    return NextResponse.json(item);
  } catch (error) {
    return handleApiError(error);
  }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await connectDb();
    const user = await requireAuth(request);
    requireRoles(user, "admin");
    const { id } = await params;
    const item = await MediaAsset.findByIdAndUpdate(id, { isActive: false }, { new: true });
    if (!item) return NextResponse.json({ message: "Media not found" }, { status: 404 });
    return NextResponse.json({ message: "Media removed" });
  } catch (error) {
    return handleApiError(error);
  }
}
