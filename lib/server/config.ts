export const authCookieName = process.env.AUTH_COOKIE_NAME || "token";

export function getCookieOptions() {
  const isProduction = process.env.NODE_ENV === "production";
  const sameSite = (process.env.AUTH_COOKIE_SAME_SITE || "lax") as "lax" | "strict" | "none";
  const secureFromEnv = process.env.AUTH_COOKIE_SECURE;
  const secure = secureFromEnv ? secureFromEnv === "true" : isProduction;
  const maxAgeDays = Number(process.env.AUTH_COOKIE_MAX_AGE_DAYS || 7);
  const domain = process.env.AUTH_COOKIE_DOMAIN || undefined;

  return {
    httpOnly: true,
    secure,
    sameSite,
    maxAge: maxAgeDays * 24 * 60 * 60,
    path: "/",
    ...(domain ? { domain } : {})
  };
}

export function clearCookieOptions() {
  const { maxAge, ...rest } = getCookieOptions();
  return rest;
}
