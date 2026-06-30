import { NextResponse } from "next/server";
import { ZodError } from "zod";
import { ApiError } from "@/lib/server/errors";

export function handleApiError(error: unknown) {
  if (error instanceof ApiError) {
    return NextResponse.json({ message: error.message }, { status: error.status });
  }

  if (error instanceof ZodError) {
    return NextResponse.json({ message: error.issues[0]?.message || "Validation failed" }, { status: 400 });
  }

  if (error && typeof error === "object" && "status" in error && "message" in error) {
    const status = typeof (error as { status?: unknown }).status === "number" ? (error as { status: number }).status : 500;
    const message = String((error as { message?: unknown }).message || "Server error");
    return NextResponse.json({ message }, { status });
  }

  return NextResponse.json({ message: "Server error" }, { status: 500 });
}
