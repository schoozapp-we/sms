import mongoose from "mongoose";

const mediaAssetSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: String,
    category: {
      type: String,
      enum: ["gallery", "profile", "student-document", "teacher-photo"],
      required: true
    },
    ownerType: { type: String, enum: ["student", "staff", "school"], default: "school" },
    owner: { type: mongoose.Schema.Types.ObjectId, refPath: "ownerModel", default: null },
    ownerModel: { type: String, enum: ["Student", "Staff"], default: null },
    url: { type: String, required: true },
    secureUrl: { type: String, required: true },
    publicId: { type: String, required: true },
    resourceType: { type: String, enum: ["image", "raw", "video", "auto"], default: "image" },
    format: String,
    bytes: Number,
    width: Number,
    height: Number,
    folder: String,
    isPublic: { type: Boolean, default: false },
    isActive: { type: Boolean, default: true },
    sortOrder: { type: Number, default: 0 },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null }
  },
  { timestamps: true }
);

mediaAssetSchema.index({ category: 1, isActive: 1, sortOrder: 1, createdAt: -1 });
mediaAssetSchema.index({ ownerType: 1, owner: 1, category: 1 });

export const MediaAsset = mongoose.models.MediaAsset || mongoose.model("MediaAsset", mediaAssetSchema);
