import mongoose from "mongoose";

const noticeSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    body: { type: String, required: true },
    audience: { type: String, enum: ["all", "students", "parents", "staff"], default: "all" },
    priority: { type: String, enum: ["low", "normal", "high"], default: "normal" },
    publishAt: { type: Date, default: Date.now }
  },
  { timestamps: true }
);

export const Notice = mongoose.models.Notice || mongoose.model("Notice", noticeSchema);
