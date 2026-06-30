import mongoose from "mongoose";

const feeSchema = new mongoose.Schema(
  {
    student: { type: mongoose.Schema.Types.ObjectId, ref: "Student", required: true },
    invoiceNo: { type: String, required: true, unique: true },
    month: { type: String, required: true },
    amount: { type: Number, required: true },
    paidAmount: { type: Number, default: 0 },
    dueDate: Date,
    paidAt: Date,
    status: { type: String, enum: ["paid", "partial", "pending", "overdue"], default: "pending" }
  },
  { timestamps: true }
);

export const Fee = mongoose.models.Fee || mongoose.model("Fee", feeSchema);
