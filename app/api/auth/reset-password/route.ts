import bcrypt from "bcryptjs";
import crypto from "crypto";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { connectDb } from "@/lib/server/db";
import { User } from "@/lib/server/models/User";
import { handleApiError } from "@/lib/server/response";

const resetPasswordSchema = z.object({
  token: z.string().min(20),
  password: z.string().min(8)
});

function hashToken(rawToken: string) {
  return crypto.createHash("sha256").update(rawToken).digest("hex");
}

export async function POST(request: NextRequest) {
  try {
    await connectDb();
    const data = resetPasswordSchema.parse(await request.json());
    const tokenHash = hashToken(data.token);
    const user = await User.findOne({
      passwordResetTokenHash: tokenHash,
      passwordResetExpiresAt: { $gt: new Date() }
    });

    if (!user) {
      return NextResponse.json({ message: "Invalid or expired reset token" }, { status: 400 });
    }

    user.passwordHash = await bcrypt.hash(data.password, 12);
    user.passwordResetTokenHash = null;
    user.passwordResetExpiresAt = null;
    await user.save();

    return NextResponse.json({ message: "Password reset successful. Please login." });
  } catch (error) {
    return handleApiError(error);
  }
}
