import bcrypt from "bcryptjs";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { connectDb } from "@/lib/server/db";
import { User } from "@/lib/server/models/User";
import { authCookieName, getCookieOptions } from "@/lib/server/config";
import { publicUser, signToken } from "@/lib/server/auth";
import { handleApiError } from "@/lib/server/response";

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
  portal: z.enum(["admin", "teacher", "student", "parent", "user", "staff"]).optional()
});

function getAllowedRolesByPortal(portal?: string) {
  switch (portal) {
    case "admin":
      return ["admin"];
    case "teacher":
      return ["teacher"];
    case "student":
      return ["student"];
    case "parent":
    case "user":
      return ["parent"];
    case "staff":
      return ["staff", "accountant", "reception"];
    default:
      return null;
  }
}

export async function POST(request: NextRequest) {
  try {
    await connectDb();
    const data = loginSchema.parse(await request.json());
    const user = await User.findOne({ email: data.email });

    if (!user || !(await bcrypt.compare(data.password, user.passwordHash))) {
      return NextResponse.json({ message: "Invalid credentials" }, { status: 401 });
    }

    if (user.status !== "active") {
      if (user.status === "pending") {
        return NextResponse.json({ message: "Your account is pending admin approval" }, { status: 403 });
      }
      return NextResponse.json({ message: "Your account is blocked. Please contact admin." }, { status: 403 });
    }

    const allowedRoles = getAllowedRolesByPortal(data.portal);
    if (allowedRoles && !allowedRoles.includes(user.role)) {
      return NextResponse.json({ message: "This account is not allowed for selected portal" }, { status: 403 });
    }

    const token = signToken(user);
    const response = NextResponse.json({ user: publicUser(user) });
    response.cookies.set(authCookieName, token, getCookieOptions());
    return response;
  } catch (error) {
    return handleApiError(error);
  }
}
