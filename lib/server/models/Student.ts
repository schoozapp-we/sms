import mongoose from "mongoose";

const guardianSchema = new mongoose.Schema(
  {
    name: String,
    phone: String,
    email: String,
    relation: String
  },
  { _id: false }
);

const studentSchema = new mongoose.Schema(
  {
    admissionNo: { type: String, required: true, unique: true, trim: true },
    name: { type: String, required: true, trim: true },
    gender: { type: String, enum: ["male", "female", "other"], required: true },
    dob: Date,
    className: { type: String, required: true },
    section: { type: String, default: "A" },
    rollNo: String,
    phone: String,
    address: String,
    profileImageUrl: String,
    guardian: guardianSchema,
    status: { type: String, enum: ["active", "inactive", "alumni"], default: "active" }
  },
  { timestamps: true }
);

studentSchema.index({ name: "text", admissionNo: "text", className: "text" });

export const Student = mongoose.models.Student || mongoose.model("Student", studentSchema);
