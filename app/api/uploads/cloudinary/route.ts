/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/server/auth";
import { uploadToCloudinary } from "@/lib/server/cloudinary";
import { connectDb } from "@/lib/server/db";
import { MediaAsset } from "@/lib/server/models/MediaAsset";
import { Staff } from "@/lib/server/models/Staff";
import { Student } from "@/lib/server/models/Student";
import { handleApiError } from "@/lib/server/response";

const categoryFolders: Record<string, string> = {
  gallery: "school/gallery",
  profile: "school/profiles",
  "student-document": "school/student-documents",
  "teacher-photo": "school/teachers"
};

function getResourceType(category: string) {
  return category === "student-document" ? "auto" : "image";
}

export async function POST(request: NextRequest) {
  try {
    await connectDb();
    const user: any = await requireAuth(request);
    const formData = await request.formData();
    const file = formData.get("file");
    const category = String(formData.get("category") || "profile");
    const title = String(formData.get("title") || "Uploaded file");
    const description = String(formData.get("description") || "");
    const ownerId = String(formData.get("ownerId") || "");

    if (!(file instanceof File)) {
      return NextResponse.json({ message: "File required" }, { status: 400 });
    }
    if (!categoryFolders[category]) {
      return NextResponse.json({ message: "Invalid upload category" }, { status: 400 });
    }

    let ownerType: "student" | "staff" | "school" = "school";
    let ownerModel: "Student" | "Staff" | null = null;
    let owner: string | null = null;
    let isPublic = false;

    if (category === "gallery") {
      if (user.role !== "admin") return NextResponse.json({ message: "Only admin can upload gallery" }, { status: 403 });
      isPublic = true;
    }

    if (category === "student-document") {
      ownerType = "student";
      ownerModel = "Student";
      owner = user.role === "student" ? String(user.studentProfile || "") : ownerId;
      if (!owner || !["student", "admin", "reception"].includes(user.role)) {
        return NextResponse.json({ message: "Student document upload not allowed" }, { status: 403 });
      }
    }

    if (category === "profile") {
      if (user.role === "student") {
        ownerType = "student";
        ownerModel = "Student";
        owner = String(user.studentProfile || "");
      } else if (["teacher", "staff", "accountant", "reception"].includes(user.role)) {
        ownerType = "staff";
        ownerModel = "Staff";
        owner = String(user.staffProfile || "");
      } else if (user.role === "admin" && ownerId) {
        ownerType = "staff";
        ownerModel = "Staff";
        owner = ownerId;
      }
      if (!owner) return NextResponse.json({ message: "Profile is not linked" }, { status: 400 });
    }

    if (category === "teacher-photo") {
      ownerType = "staff";
      ownerModel = "Staff";
      owner = user.role === "teacher" ? String(user.staffProfile || "") : ownerId;
      if (!owner || !["admin", "teacher"].includes(user.role)) {
        return NextResponse.json({ message: "Teacher photo upload not allowed" }, { status: 403 });
      }
      isPublic = true;
    }

    const upload = await uploadToCloudinary({
      file,
      folder: categoryFolders[category],
      resourceType: getResourceType(category)
    });

    const asset = await MediaAsset.create({
      title,
      description,
      category,
      ownerType,
      owner,
      ownerModel,
      url: upload.url,
      secureUrl: upload.secure_url,
      publicId: upload.public_id,
      resourceType: upload.resource_type,
      format: upload.format,
      bytes: upload.bytes,
      width: upload.width,
      height: upload.height,
      folder: categoryFolders[category],
      isPublic,
      createdBy: user._id
    });

    if (category === "profile" && ownerType === "student") {
      await Student.findByIdAndUpdate(owner, { profileImageUrl: upload.secure_url });
    }
    if ((category === "profile" || category === "teacher-photo") && ownerType === "staff") {
      await Staff.findByIdAndUpdate(owner, { profileImageUrl: upload.secure_url, ...(category === "teacher-photo" ? { showOnWebsite: true } : {}) });
    }

    return NextResponse.json({ asset }, { status: 201 });
  } catch (error) {
    return handleApiError(error);
  }
}
