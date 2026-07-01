import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { defaultWebsiteContent } from "@/app/data/schoolSite";
import { requireAuth, requireRoles } from "@/lib/server/auth";
import { connectDb } from "@/lib/server/db";
import { WebsiteContent } from "@/lib/server/models/WebsiteContent";
import { handleApiError } from "@/lib/server/response";
import { getWebsiteContent, normalizeWebsiteContent } from "@/lib/server/websiteContent";

const websiteContentSchema = z.object(
  Object.fromEntries(
    Object.keys(defaultWebsiteContent)
      .filter((key) => key !== "updatedAt")
      .map((key) => [key, z.string().min(1).max(1200)])
  ) as Record<Exclude<keyof typeof defaultWebsiteContent, "updatedAt">, z.ZodString>
);

export async function GET() {
  const content = await getWebsiteContent();
  return NextResponse.json({ content });
}

export async function PATCH(request: NextRequest) {
  try {
    await connectDb();
    const user = await requireAuth(request);
    requireRoles(user, "admin");

    const body = websiteContentSchema.parse(await request.json());
    const content = normalizeWebsiteContent(body);

    const updated = await WebsiteContent.findOneAndUpdate(
      { siteKey: "main" },
      { ...content, siteKey: "main", updatedBy: user._id },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    ).lean();

    return NextResponse.json({
      message: "Website content updated",
      content: {
        ...normalizeWebsiteContent(updated as Partial<typeof defaultWebsiteContent>),
        updatedAt:
          updated && "updatedAt" in updated && updated.updatedAt
            ? new Date(updated.updatedAt as Date).toISOString()
            : undefined
      }
    });
  } catch (error) {
    return handleApiError(error);
  }
}
