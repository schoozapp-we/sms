import mongoose from "mongoose";

const websiteContentSchema = new mongoose.Schema(
  {
    siteKey: { type: String, required: true, unique: true, default: "main" },
    schoolName: { type: String, required: true },
    shortName: { type: String, required: true },
    tagline: { type: String, required: true },
    session: { type: String, required: true },
    phone: { type: String, required: true },
    email: { type: String, required: true },
    address: { type: String, required: true },
    heroEyebrow: { type: String, required: true },
    heroTitle: { type: String, required: true },
    heroBody: { type: String, required: true },
    aboutTitle: { type: String, required: true },
    aboutBody: { type: String, required: true },
    admissionTitle: { type: String, required: true },
    admissionBody: { type: String, required: true },
    contactTitle: { type: String, required: true },
    contactBody: { type: String, required: true },
    downloadDocuments: [
      {
        slug: { type: String, required: true },
        title: { type: String, required: true },
        filename: { type: String, required: true },
        body: { type: String, required: true }
      }
    ],
    updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null }
  },
  { timestamps: true }
);

export const WebsiteContent =
  mongoose.models.WebsiteContent || mongoose.model("WebsiteContent", websiteContentSchema);
