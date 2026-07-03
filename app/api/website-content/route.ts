import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { defaultWebsiteContent } from "@/app/data/schoolSite";
import { requireAuth, requireRoles } from "@/lib/server/auth";
import { connectDb } from "@/lib/server/db";
import { WebsiteContent } from "@/lib/server/models/WebsiteContent";
import { handleApiError } from "@/lib/server/response";
import { getWebsiteContent, normalizeDownloadDocuments, normalizeWebsiteContent } from "@/lib/server/websiteContent";

const websiteScalarSchema = Object.fromEntries(
  Object.keys(defaultWebsiteContent)
    .filter((key) => key !== "updatedAt" && key !== "downloadDocuments")
    .map((key) => [key, z.string().min(1).max(1200)])
) as Record<Exclude<keyof typeof defaultWebsiteContent, "updatedAt" | "downloadDocuments">, z.ZodString>;

const downloadDocumentSchema = z.object({
  slug: z.string().min(1).max(80),
  title: z.string().min(1).max(120),
  filename: z.string().min(1).max(140),
  body: z.string().min(1).max(4000)
});

const websiteContentSchema = z.object({
  ...websiteScalarSchema,
  downloadDocuments: z.array(downloadDocumentSchema).min(1).max(20).optional()
});

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
    const content = {
      ...normalizeWebsiteContent(body),
      downloadDocuments: normalizeDownloadDocuments(body.downloadDocuments)
    };

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
