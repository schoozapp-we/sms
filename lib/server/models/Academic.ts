import mongoose from "mongoose";

const classRoomSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    section: { type: String, required: true },
    classTeacher: { type: mongoose.Schema.Types.ObjectId, ref: "Staff" },
    capacity: { type: Number, default: 40 },
    timetable: [
      {
        day: String,
        period: Number,
        subject: String,
        teacher: { type: mongoose.Schema.Types.ObjectId, ref: "Staff" }
      }
    ]
  },
  { timestamps: true }
);

const attendanceSchema = new mongoose.Schema(
  {
    date: { type: Date, required: true },
    className: { type: String, required: true },
    section: { type: String, required: true },
    records: [
      {
        student: { type: mongoose.Schema.Types.ObjectId, ref: "Student", required: true },
        status: { type: String, enum: ["present", "absent", "late", "leave"], required: true },
        note: String
      }
    ]
  },
  { timestamps: true }
);

const examSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    className: { type: String, required: true },
    section: String,
    subject: { type: String, required: true },
    examDate: Date,
    maxMarks: { type: Number, default: 100 },
    results: [
      {
        student: { type: mongoose.Schema.Types.ObjectId, ref: "Student" },
        marks: Number,
        grade: String,
        remarks: String
      }
    ]
  },
  { timestamps: true }
);

export const ClassRoom = mongoose.models.ClassRoom || mongoose.model("ClassRoom", classRoomSchema);
export const Attendance = mongoose.models.Attendance || mongoose.model("Attendance", attendanceSchema);
export const Exam = mongoose.models.Exam || mongoose.model("Exam", examSchema);
