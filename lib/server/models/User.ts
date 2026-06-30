import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    passwordHash: { type: String, required: true },
    role: {
      type: String,
      enum: ["admin", "teacher", "accountant", "reception", "staff", "parent", "student"],
      default: "admin"
    },
    status: { type: String, enum: ["active", "pending", "blocked"], default: "active" },
    staffProfile: { type: mongoose.Schema.Types.ObjectId, ref: "Staff", default: null },
    studentProfile: { type: mongoose.Schema.Types.ObjectId, ref: "Student", default: null },
    childrenProfiles: [{ type: mongoose.Schema.Types.ObjectId, ref: "Student" }],
    passwordResetTokenHash: { type: String, default: null },
    passwordResetExpiresAt: { type: Date, default: null }
  },
  { timestamps: true }
);

export const User = mongoose.models.User || mongoose.model("User", userSchema);
