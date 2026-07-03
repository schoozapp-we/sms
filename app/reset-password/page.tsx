"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";
import AppLoader from "../components/AppLoader";

function ResetPasswordForm() {
  const searchParams = useSearchParams();
  const [token, setToken] = useState(searchParams.get("token") || "");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/reset-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ token, password })
      });

      const data = await response.json();
      setMessage(data.message || (response.ok ? "Password reset complete" : "Reset failed"));
    } catch {
      setMessage("Reset failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="authShell">
      <section className="authRight" style={{ width: "100%" }}>
        <div className="authCard">
          <h1>Reset password</h1>
          <p className="authSub">Use token and set a new password (minimum 8 chars).</p>

          {message && <div className="successBox">{message}</div>}

          <form onSubmit={onSubmit}>
            <div className="field">
              <label htmlFor="token">Reset token</label>
              <input id="token" value={token} onChange={(e) => setToken(e.target.value)} required />
            </div>
            <div className="field">
              <label htmlFor="password">New password</label>
              <input
                id="password"
                type="password"
                minLength={8}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <button type="submit" className="primaryBtn" disabled={loading}>
              {loading ? "Updating..." : "Update Password"}
            </button>
          </form>

          <Link href="/" className="secondaryBtn">Back to Home</Link>
        </div>
      </section>
    </main>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense
      fallback={
        <main className="loaderPage">
          <AppLoader title="Reset password" message="Loading reset form..." compact />
        </main>
      }
    >
      <ResetPasswordForm />
    </Suspense>
  );
}
