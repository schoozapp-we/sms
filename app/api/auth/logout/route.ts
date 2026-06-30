import { NextResponse } from "next/server";
import { authCookieName, clearCookieOptions } from "@/lib/server/config";

export async function POST() {
  const response = new NextResponse(null, { status: 204 });
  response.cookies.delete(authCookieName);
  response.cookies.set(authCookieName, "", { ...clearCookieOptions(), maxAge: 0 });
  return response;
}
