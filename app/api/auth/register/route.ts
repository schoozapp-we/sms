import bcrypt from "bcryptjs";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { connectDb } from "@/lib/server/db";
import { User } from "@/lib/server/models/User";
import { getAuthUserOrNull, publicUser, signToken } from "@/lib/server/auth";
import { authCookieName, getCookieOptions } from "@/lib/server/config";
import { handleApiError } from "@/lib/server/response";

const registerSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(8),
  role: z.enum(["admin", "teacher", "accountant", "reception", "staff", "parent", "student"]).default("admin"),
  adminInviteCode: z.string().optional()
});

const selfSignupRoles = new Set(["teacher", "staff", "parent", "student", "accountant", "reception"]);

export async function POST(request: NextRequest) {
  try {
    await connectDb();
    const data = registerSchema.parse(await request.json());

    const exists = await User.exists({ email: data.email });
    if (exists) {
      return NextResponse.json({ message: "Email already registered" }, { status: 409 });
    }

    const usersExist = await User.exists({});

    if (!usersExist) {
      if (data.role !== "admin") {
        return NextResponse.json({ message: "First setup account must be admin" }, { status: 400 });
      }

      const passwordHash = await bcrypt.hash(data.password, 12);
      const user = await User.create({
        name: data.name,
        email: data.email,
        passwordHash,
        role: data.role,
        status: "active"
      });

      const token = signToken(user);
      const response = NextResponse.json({ user: publicUser(user) }, { status: 201 });
      response.cookies.set(authCookieName, token, getCookieOptions());
      return response;
    }

    const authUser = await getAuthUserOrNull(request);
    const isAdminCreator = authUser?.role === "admin" && authUser?.status === "active";

    if (isAdminCreator) {
      const passwordHash = await bcrypt.hash(data.password, 12);
      const user = await User.create({
        name: data.name,
        email: data.email,
        passwordHash,
        role: data.role,
        status: "active"
      });

      return NextResponse.json(
        { message: "Account created by admin", user: publicUser(user) },
        { status: 201 }
      );
    }

    if (data.role === "admin") {
      const adminInviteCode = process.env.ADMIN_INVITE_CODE;
      if (!adminInviteCode) {
        return NextResponse.json(
          { message: "Admin signup is disabled. Set ADMIN_INVITE_CODE to enable it." },
          { status: 403 }
        );
      }

      if (data.adminInviteCode !== adminInviteCode) {
        return NextResponse.json({ message: "Invalid admin invite code" }, { status: 403 });
      }

      const passwordHash = await bcrypt.hash(data.password, 12);
      const user = await User.create({
        name: data.name,
        email: data.email,
        passwordHash,
        role: data.role,
        status: "active"
      });

      const token = signToken(user);
      const response = NextResponse.json(
        { message: "Admin account created successfully", user: publicUser(user) },
        { status: 201 }
      );
      response.cookies.set(authCookieName, token, getCookieOptions());
      return response;
    }

    if (!selfSignupRoles.has(data.role)) {
      return NextResponse.json({ message: "Invalid signup role" }, { status: 400 });
    }

    const passwordHash = await bcrypt.hash(data.password, 12);
    const user = await User.create({
      name: data.name,
      email: data.email,
      passwordHash,
      role: data.role,
      status: "pending"
    });

    return NextResponse.json(
      {
        message: "Signup request submitted. Please wait for admin approval.",
        request: { id: user._id, role: user.role, status: user.status }
      },
      { status: 202 }
    );
  } catch (error) {
    return handleApiError(error);
  }
}
