import mongoose from "mongoose";

const admissionGuardianSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    phone: { type: String, required: true },
    email: String,
    relation: { type: String, default: "Parent" },
    occupation: String
  },
  { _id: false }
);

const admissionDocumentSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    status: { type: String, enum: ["pending", "received", "verified"], default: "pending" }
  },
  { _id: false }
);

const admissionApplicationSchema = new mongoose.Schema(
  {
    applicationNo: { type: String, required: true, unique: true, trim: true },
    studentName: { type: String, required: true, trim: true },
    gender: { type: String, enum: ["male", "female", "other"], required: true },
    dob: Date,
    className: { type: String, required: true },
    section: { type: String, default: "A" },
    previousSchool: String,
    bloodGroup: String,
    phone: String,
    address: String,
    guardian: admissionGuardianSchema,
    documents: [admissionDocumentSchema],
    status: { type: String, enum: ["new", "verified", "admitted", "rejected"], default: "new" },
    source: { type: String, default: "online" },
    notes: String,
    reviewedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },
    reviewedAt: Date,
    linkedStudent: { type: mongoose.Schema.Types.ObjectId, ref: "Student", default: null }
  },
  { timestamps: true }
);

admissionApplicationSchema.index({
  studentName: "text",
  applicationNo: "text",
  className: "text",
  "guardian.phone": "text"
});

export const AdmissionApplication =
  mongoose.models.AdmissionApplication || mongoose.model("AdmissionApplication", admissionApplicationSchema);
