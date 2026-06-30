import jwt from "jsonwebtoken";
import type { NextRequest } from "next/server";
import { User } from "@/lib/server/models/User";
import { ApiError } from "@/lib/server/errors";
import { authCookieName } from "@/lib/server/config";
import { connectDb } from "@/lib/server/db";

export function signToken(user: { _id: string; role: string }) {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error("JWT_SECRET is required");
  }
  return jwt.sign({ sub: user._id, role: user.role }, secret, { expiresIn: "7d" });
}

export function getTokenFromRequest(request: NextRequest) {
  const header = request.headers.get("authorization");
  const bearerToken = header?.startsWith("Bearer ") ? header.slice(7) : null;
  const cookieToken = request.cookies.get(authCookieName)?.value || null;
  return bearerToken || cookieToken;
}

export async function getAuthUserOrNull(request: NextRequest) {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error("JWT_SECRET is required");
  }

  const token = getTokenFromRequest(request);
  if (!token) return null;

  try {
    const payload = jwt.verify(token, secret) as { sub: string };
    await connectDb();
    return await User.findById(payload.sub).select("-passwordHash -passwordResetTokenHash -passwordResetExpiresAt");
  } catch {
    return null;
  }
}

export async function requireAuth(request: NextRequest) {
  const user = await getAuthUserOrNull(request);
  if (!user || user.status !== "active") {
    throw new ApiError(401, "Authentication required");
  }
  return user;
}

export function requireRoles(user: { role: string }, ...roles: string[]) {
  if (!roles.includes(user.role)) {
    throw new ApiError(403, "Insufficient permissions");
  }
}

export function publicUser(user: { _id: string; name: string; email: string; role: string; status?: string }) {
  return {
    id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    ...(user.status ? { status: user.status } : {})
  };
}
