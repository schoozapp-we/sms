import {
  defaultDownloadDocuments,
  defaultWebsiteContent,
  type WebsiteContent as WebsiteContentData,
  type WebsiteDownloadDocument
} from "@/app/data/schoolSite";
import { connectDb } from "./db";
import { WebsiteContent } from "./models/WebsiteContent";

type EditableWebsiteContentKey = Exclude<keyof WebsiteContentData, "updatedAt" | "downloadDocuments">;

const editableKeys = Object.keys(defaultWebsiteContent).filter(
  (key) => key !== "updatedAt" && key !== "downloadDocuments"
) as Array<EditableWebsiteContentKey>;

function normalizeSlug(value: string, fallback: string) {
  const normalized = value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
  return normalized || fallback;
}

export function normalizeDownloadDocuments(input: unknown): WebsiteDownloadDocument[] {
  if (!Array.isArray(input)) return defaultDownloadDocuments;

  const documents = input
    .map((item, index) => {
      if (!item || typeof item !== "object") return null;
      const record = item as Partial<WebsiteDownloadDocument>;
      const fallback = defaultDownloadDocuments[index] || defaultDownloadDocuments[0];
      const title = typeof record.title === "string" && record.title.trim() ? record.title.trim() : fallback.title;
      const slug = normalizeSlug(typeof record.slug === "string" ? record.slug : title, fallback.slug);
      const filename =
        typeof record.filename === "string" && record.filename.trim()
          ? record.filename.trim().replace(/[^a-zA-Z0-9._-]/g, "-")
          : `${slug}.pdf`;
      const body = typeof record.body === "string" && record.body.trim() ? record.body.trim() : fallback.body;
      return { slug, title, filename: filename.endsWith(".pdf") ? filename : `${filename}.pdf`, body };
    })
    .filter(Boolean) as WebsiteDownloadDocument[];

  return documents.length ? documents : defaultDownloadDocuments;
}

export function normalizeWebsiteContent(input: Partial<WebsiteContentData>) {
  const normalized: WebsiteContentData = { ...defaultWebsiteContent };
  editableKeys.forEach((key) => {
    const value = input[key];
    if (typeof value === "string" && value.trim()) {
      normalized[key] = value.trim();
    }
  });
  normalized.downloadDocuments = normalizeDownloadDocuments(input.downloadDocuments);
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
