import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { requireAuth, requireRoles } from "@/lib/server/auth";
import { connectDb } from "@/lib/server/db";
import { AdmissionApplication } from "@/lib/server/models/AdmissionApplication";
import { Student } from "@/lib/server/models/Student";
import { handleApiError } from "@/lib/server/response";

const statusSchema = z.object({
  action: z.enum(["verify", "admit", "reject"]),
  notes: z.string().optional()
});

async function nextAdmissionNo(className: string) {
  const normalizedClass = className.replace(/\D/g, "") || "0";
  const prefix = `ADM-${normalizedClass}`;
  const count = await Student.countDocuments({ admissionNo: new RegExp(`^${prefix}`) });
  return `${prefix}${String(count + 1).padStart(3, "0")}`;
}

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await connectDb();
    const user = await requireAuth(request);
    requireRoles(user, "admin", "reception");

    const { id } = await params;
    const data = statusSchema.parse(await request.json());
    const application = await AdmissionApplication.findById(id);
    if (!application) {
      return NextResponse.json({ message: "Admission application not found" }, { status: 404 });
    }

    application.reviewedBy = user.id;
    application.reviewedAt = new Date();
    application.notes = data.notes || application.notes;

    if (data.action === "verify") {
      application.status = "verified";
    }

    if (data.action === "reject") {
      application.status = "rejected";
    }

    if (data.action === "admit") {
      if (!application.linkedStudent) {
        const student = await Student.create({
          admissionNo: await nextAdmissionNo(application.className),
          name: application.studentName,
          gender: application.gender,
          dob: application.dob,
          className: application.className,
          section: application.section,
          phone: application.phone,
          address: application.address,
          guardian: application.guardian,
          status: "active"
        });
        application.linkedStudent = student._id;
      }
      application.status = "admitted";
      application.documents = application.documents.map((item: { name: string; status: string }) => ({
        name: item.name,
        status: item.status === "pending" ? "received" : item.status
      }));
    }

    await application.save();
    await application.populate("linkedStudent", "admissionNo name className section rollNo");

    return NextResponse.json(application);
  } catch (error) {
    return handleApiError(error);
  }
}
