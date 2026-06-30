import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/server/auth";
import { handleApiError } from "@/lib/server/response";

export async function GET(request: NextRequest) {
  try {
    const user = await requireAuth(request);
    return NextResponse.json({ user });
  } catch (error) {
    return handleApiError(error);
  }
}
