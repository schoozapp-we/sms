import { defaultWebsiteContent, type WebsiteContent as WebsiteContentData } from "@/app/data/schoolSite";
import { connectDb } from "./db";
import { WebsiteContent } from "./models/WebsiteContent";

const editableKeys = Object.keys(defaultWebsiteContent).filter((key) => key !== "updatedAt") as Array<
  keyof WebsiteContentData
>;

export function normalizeWebsiteContent(input: Partial<WebsiteContentData>) {
  return editableKeys.reduce((acc, key) => {
    const fallback = defaultWebsiteContent[key];
    const value = input[key];
    acc[key] = typeof value === "string" && value.trim() ? value.trim() : fallback;
    return acc;
  }, {} as WebsiteContentData);
}

export async function getWebsiteContent(): Promise<WebsiteContentData> {
  try {
    await connectDb();
    const content = await WebsiteContent.findOne({ siteKey: "main" }).lean();
    if (!content) return defaultWebsiteContent;
    const normalized = normalizeWebsiteContent(content as Partial<WebsiteContentData>);
    return {
      ...normalized,
      updatedAt:
        content && "updatedAt" in content && content.updatedAt
          ? new Date(content.updatedAt as Date).toISOString()
          : undefined
    };
  } catch {
    return defaultWebsiteContent;
  }
}
