import mongoose from "mongoose";

const homeworkSubmissionSchema = new mongoose.Schema(
  {
    student: { type: mongoose.Schema.Types.ObjectId, ref: "Student", required: true },
    status: { type: String, enum: ["pending", "submitted", "reviewed"], default: "pending" },
    submittedAt: Date,
    marks: Number,
    feedback: String
  },
  { _id: false }
);

const homeworkSchema = new mongoose.Schema(
  {
    teacher: { type: mongoose.Schema.Types.ObjectId, ref: "Staff", required: true },
    className: { type: String, required: true },
    section: { type: String, required: true },
    subject: { type: String, required: true },
    title: { type: String, required: true },
    description: { type: String, required: true },
    dueDate: Date,
    scheduleAt: Date,
    attachmentType: { type: String, enum: ["none", "pdf", "video", "voice", "link"], default: "none" },
    attachmentUrl: String,
    status: { type: String, enum: ["draft", "scheduled", "active", "closed"], default: "active" },
    submissions: [homeworkSubmissionSchema]
  },
  { timestamps: true }
);

homeworkSchema.index({ teacher: 1, className: 1, section: 1, dueDate: 1 });

export const Homework = mongoose.models.Homework || mongoose.model("Homework", homeworkSchema);
