import mongoose from "mongoose";

const staffSchema = new mongoose.Schema(
  {
    employeeCode: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    role: { type: String, enum: ["teacher", "accountant", "reception", "driver", "admin"], required: true },
    department: String,
    subjects: [String],
    phone: String,
    email: String,
    joinedAt: Date,
    status: { type: String, enum: ["active", "inactive"], default: "active" }
  },
  { timestamps: true }
);

export const Staff = mongoose.models.Staff || mongoose.model("Staff", staffSchema);
