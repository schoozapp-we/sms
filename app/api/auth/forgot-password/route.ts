import crypto from "crypto";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { connectDb } from "@/lib/server/db";
import { User } from "@/lib/server/models/User";
import { handleApiError } from "@/lib/server/response";

const resetTokenMinutes = Number(process.env.PASSWORD_RESET_TOKEN_MINUTES || 20);

const forgotPasswordSchema = z.object({
  email: z.string().email()
});

function hashToken(rawToken: string) {
  return crypto.createHash("sha256").update(rawToken).digest("hex");
}

export async function POST(request: NextRequest) {
  try {
    await connectDb();
    const { email } = forgotPasswordSchema.parse(await request.json());
    const user = await User.findOne({ email });

    if (user) {
      const rawToken = crypto.randomBytes(32).toString("hex");
      user.passwordResetTokenHash = hashToken(rawToken);
      user.passwordResetExpiresAt = new Date(Date.now() + resetTokenMinutes * 60 * 1000);
      await user.save();

      if (process.env.NODE_ENV !== "production") {
        return NextResponse.json({
          message: "Password reset token generated (dev only)",
          resetToken: rawToken
        });
      }
    }

    return NextResponse.json({
      message: "If the email is registered, password reset instructions have been generated."
    });
  } catch (error) {
    return handleApiError(error);
  }
}
