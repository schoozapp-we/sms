import { defaultWebsiteContent, type WebsiteContent as WebsiteContentData } from "@/app/data/schoolSite";
import { connectDb } from "./db";
import { WebsiteContent } from "./models/WebsiteContent";

type EditableWebsiteContentKey = Exclude<keyof WebsiteContentData, "updatedAt">;

const editableKeys = Object.keys(defaultWebsiteContent).filter((key) => key !== "updatedAt") as Array<
  EditableWebsiteContentKey
>;

export function normalizeWebsiteContent(input: Partial<WebsiteContentData>) {
  const normalized: WebsiteContentData = { ...defaultWebsiteContent };
  editableKeys.forEach((key) => {
    const value = input[key];
    if (typeof value === "string" && value.trim()) {
      normalized[key] = value.trim();
    }
  });
  return normalized;
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
