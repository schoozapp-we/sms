import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { requireAuth, requireRoles } from "@/lib/server/auth";
import { connectDb } from "@/lib/server/db";
import { AdmissionApplication } from "@/lib/server/models/AdmissionApplication";
import { handleApiError } from "@/lib/server/response";

const documentNames = [
  "Birth certificate",
  "Aadhaar card",
  "Previous report card",
  "Transfer certificate",
  "Passport size photos",
  "Parent ID proof"
];

const applicationSchema = z.object({
  studentName: z.string().min(2),
  gender: z.enum(["male", "female", "other"]),
  dob: z.coerce.date().optional(),
  className: z.string().min(1),
  section: z.string().default("A"),
  previousSchool: z.string().optional(),
  bloodGroup: z.string().optional(),
  phone: z.string().optional(),
  address: z.string().optional(),
  guardian: z.object({
    name: z.string().min(2),
    phone: z.string().min(7),
    email: z.string().email().optional().or(z.literal("")),
    relation: z.string().optional(),
    occupation: z.string().optional()
  }),
  notes: z.string().optional()
});

async function nextApplicationNo() {
  const year = new Date().getFullYear();
  const prefix = `APP-${year}-`;
  const count = await AdmissionApplication.countDocuments({ applicationNo: new RegExp(`^${prefix}`) });
  return `${prefix}${String(count + 1).padStart(4, "0")}`;
}

export async function GET(request: NextRequest) {
  try {
    await connectDb();
    const user = await requireAuth(request);
    requireRoles(user, "admin", "reception");

    const status = request.nextUrl.searchParams.get("status");
    const filter: Record<string, unknown> = {};
    if (status && status !== "all") filter.status = status;

    const items = await AdmissionApplication.find(filter)
      .populate("linkedStudent", "admissionNo name className section rollNo")
      .sort({ createdAt: -1 })
      .limit(100)
      .lean();

    return NextResponse.json({ items });
  } catch (error) {
    return handleApiError(error);
  }
}

export async function POST(request: NextRequest) {
  try {
    await connectDb();
    const data = applicationSchema.parse(await request.json());

    const application = await AdmissionApplication.create({
      ...data,
      guardian: {
        ...data.guardian,
        email: data.guardian.email || undefined,
        relation: data.guardian.relation || "Parent"
      },
      applicationNo: await nextApplicationNo(),
      documents: documentNames.map((name) => ({ name, status: "pending" }))
    });

    return NextResponse.json(
      {
        message: "Admission application submitted. School reception will review it.",
        applicationNo: application.applicationNo
      },
      { status: 201 }
    );
  } catch (error) {
    return handleApiError(error);
  }
}
