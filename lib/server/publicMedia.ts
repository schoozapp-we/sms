import { connectDb } from "./db";
import { MediaAsset } from "./models/MediaAsset";
import { Staff } from "./models/Staff";

export async function getPublicGallery() {
  try {
    await connectDb();
    const items = await MediaAsset.find({ category: "gallery", isPublic: true, isActive: true })
      .sort({ sortOrder: 1, createdAt: -1 })
      .limit(30)
      .lean();
    return items.map((item) => ({
      id: String(item._id),
      title: item.title,
      description: item.description || "",
      imageUrl: item.secureUrl
    }));
  } catch {
    return [];
  }
}

export async function getPublicTeachers() {
  try {
    await connectDb();
    const teachers = await Staff.find({ role: "teacher", status: "active", showOnWebsite: true })
      .select("name department subjects profileImageUrl qualification experience bio")
      .sort({ createdAt: -1 })
      .limit(12)
      .lean();
    return teachers.map((teacher) => ({
      id: String(teacher._id),
      name: teacher.name,
      department: teacher.department || "",
      subjects: teacher.subjects || [],
      profileImageUrl: teacher.profileImageUrl || "",
      qualification: teacher.qualification || "",
      experience: teacher.experience || "",
      bio: teacher.bio || ""
    }));
  } catch {
    return [];
  }
}
