import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { requireAuth, requireRoles } from "@/lib/server/auth";
import { connectDb } from "@/lib/server/db";
import { ContactEnquiry } from "@/lib/server/models/ContactEnquiry";
import { handleApiError } from "@/lib/server/response";

const enquirySchema = z.object({
  name: z.string().min(2),
  phone: z.string().min(7),
  email: z.string().email().optional().or(z.literal("")),
  topic: z.string().min(2),
  message: z.string().min(5),
  source: z.string().optional()
});

export async function GET(request: NextRequest) {
  try {
    await connectDb();
    const user = await requireAuth(request);
    requireRoles(user, "admin", "reception", "staff");

    const items = await ContactEnquiry.find().sort({ createdAt: -1 }).limit(100).lean();
    return NextResponse.json({ items });
  } catch (error) {
    return handleApiError(error);
  }
}

export async function POST(request: NextRequest) {
  try {
    await connectDb();
    const data = enquirySchema.parse(await request.json());
    const enquiry = await ContactEnquiry.create({
      ...data,
      email: data.email || undefined,
      source: data.source || "website"
    });

    return NextResponse.json(
      {
        message: "Enquiry submitted. School office will contact you.",
        enquiryId: String(enquiry._id)
      },
      { status: 201 }
    );
  } catch (error) {
    return handleApiError(error);
  }
}
