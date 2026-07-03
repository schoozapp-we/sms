import mongoose from "mongoose";

const contactEnquirySchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    phone: { type: String, required: true, trim: true },
    email: String,
    topic: { type: String, required: true, trim: true },
    message: { type: String, required: true, trim: true },
    source: { type: String, default: "website" },
    status: { type: String, enum: ["new", "contacted", "closed"], default: "new" }
  },
  { timestamps: true }
);

contactEnquirySchema.index({ name: "text", phone: "text", topic: "text", message: "text" });

export const ContactEnquiry =
  mongoose.models.ContactEnquiry || mongoose.model("ContactEnquiry", contactEnquirySchema);
