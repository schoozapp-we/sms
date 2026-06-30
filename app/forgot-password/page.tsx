"use client";

import Link from "next/link";
import { useState } from "react";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [token, setToken] = useState("");
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    setToken("");

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/forgot-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ email })
      });
      const data = await response.json();
      setMessage(data.message || "Request processed");
      if (data.resetToken) {
        setToken(data.resetToken);
      }
    } catch {
      setMessage("Request failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="authShell">
      <section className="authRight" style={{ width: "100%" }}>
        <div className="authCard">
          <h1>Forgot password</h1>
          <p className="authSub">Enter your email to generate reset token.</p>

          {message && <div className="successBox">{message}</div>}
          {token && (
            <div className="successBox">
              Dev reset token: {token} | <Link href={`/reset-password?token=${token}`}>Reset now</Link>
            </div>
          )}

          <form onSubmit={onSubmit}>
            <div className="field">
              <label htmlFor="email">Email</label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <button type="submit" className="primaryBtn" disabled={loading}>
              {loading ? "Generating..." : "Generate Reset Token"}
            </button>
          </form>

          <Link href="/" className="secondaryBtn">Back to Home</Link>
        </div>
      </section>
    </main>
  );
}
