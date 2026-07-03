import { NextRequest, NextResponse } from "next/server";
import type { WebsiteContent } from "@/app/data/schoolSite";
import { getWebsiteContent } from "@/lib/server/websiteContent";

function pdfEscape(value: string) {
  return value.replace(/\\/g, "\\\\").replace(/\(/g, "\\(").replace(/\)/g, "\\)");
}

function makePdf(siteContent: WebsiteContent, title: string, rows: string[]) {
  const textLines = [
    siteContent.schoolName,
    siteContent.address,
    `Session ${siteContent.session}`,
    title,
    "",
    ...rows,
    "",
    `Generated from ${siteContent.shortName} website`
  ];

  const content = [
    "BT",
    "/F1 18 Tf",
    "50 780 Td",
    `(${pdfEscape(textLines[0])}) Tj`,
    "/F1 10 Tf",
    "0 -22 Td",
    ...textLines.slice(1).flatMap((line) => [`(${pdfEscape(line)}) Tj`, "0 -18 Td"]),
    "ET"
  ].join("\n");

  const objects = [
    "<< /Type /Catalog /Pages 2 0 R >>",
    "<< /Type /Pages /Kids [3 0 R] /Count 1 >>",
    "<< /Type /Page /Parent 2 0 R /MediaBox [0 0 595 842] /Resources << /Font << /F1 4 0 R >> >> /Contents 5 0 R >>",
    "<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>",
    `<< /Length ${Buffer.byteLength(content, "utf8")} >>\nstream\n${content}\nendstream`
  ];

  let pdf = "%PDF-1.4\n";
  const offsets = [0];
  objects.forEach((object, index) => {
    offsets.push(Buffer.byteLength(pdf, "utf8"));
    pdf += `${index + 1} 0 obj\n${object}\nendobj\n`;
  });
  const xrefOffset = Buffer.byteLength(pdf, "utf8");
  pdf += `xref\n0 ${objects.length + 1}\n0000000000 65535 f \n`;
  offsets.slice(1).forEach((offset) => {
    pdf += `${String(offset).padStart(10, "0")} 00000 n \n`;
  });
  pdf += `trailer\n<< /Size ${objects.length + 1} /Root 1 0 R >>\nstartxref\n${xrefOffset}\n%%EOF`;
  return Buffer.from(pdf, "utf8");
}

export async function GET(_request: NextRequest, { params }: { params: Promise<{ type: string }> }) {
  const { type } = await params;
  const siteContent = await getWebsiteContent();
  const doc = siteContent.downloadDocuments.find((item) => item.slug === type);
  if (!doc) {
    return NextResponse.json({ message: "Download not found" }, { status: 404 });
  }

  const rows = doc.body
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);
  const pdf = makePdf(siteContent, doc.title, rows);
  return new NextResponse(pdf, {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="${doc.filename}"`,
      "Cache-Control": "no-store"
    }
  });
}
