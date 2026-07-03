"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Check, Eye, EyeOff, KeyRound, ShieldCheck } from "lucide-react";

type Portal = "admin" | "teacher" | "student" | "parent" | "user" | "staff";

const roleToDashboard: Record<string, string> = {
  admin: "/dashboard/admin",
  teacher: "/dashboard/teacher",
  student: "/dashboard/student",
  parent: "/dashboard/parent",
  staff: "/dashboard/staff",
  accountant: "/dashboard/staff",
  reception: "/dashboard/staff"
};

const portalAllowedRoles: Record<Portal, string[]> = {
  admin: ["admin"],
  teacher: ["teacher"],
  student: ["student"],
  parent: ["parent"],
  user: ["parent"],
  staff: ["staff", "accountant", "reception"]
};

type PortalLoginFormProps = {
  portal: Portal;
  title: string;
  subtitle: string;
  signupHref?: string;
};

export default function PortalLoginForm({ portal, title, subtitle, signupHref }: PortalLoginFormProps) {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const clearWrongPortalSession = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/me`, {
          credentials: "include"
        });
        if (!response.ok) return;

        const data = await response.json();
        const currentRole = data.user?.role;
        if (currentRole && !portalAllowedRoles[portal].includes(currentRole)) {
          await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/logout`, {
            method: "POST",
            credentials: "include"
          });
          localStorage.removeItem("user");
        }
      } catch {
        localStorage.removeItem("user");
      }
    };

    clearWrongPortalSession();
  }, [portal]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ email, password, portal })
      });

      const data = await response.json();
      if (!response.ok) {
        setError(data.message || "Login failed");
        return;
      }

      localStorage.setItem("user", JSON.stringify(data.user));
      const destination = roleToDashboard[data.user.role] || "/";
      router.push(destination);
      router.refresh();
    } catch {
      setError("Server se connect nahi ho pa raha. Backend chal raha hai?");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="authShell">
      <aside className="authLeft">
        <div className="brand">
          <div className="brandMark"><ShieldCheck size={20} /></div>
          <div>
            <strong>EduSphere</strong>
            <span>School ERP</span>
          </div>
        </div>
        <div className="authLeftInfo">
          <h2>Enterprise grade school ERP access.</h2>
          <p>Every portal enforces role checks, secure server cookies and protected route access.</p>
          <ul className="featureList">
            {["Role-based access controls", "Secure cookie session", "Portal-wise restrictions", "Password reset workflow"].map((f) => (
              <li key={f}><Check size={14} />{f}</li>
            ))}
          </ul>
          <div className="authHint">
            <KeyRound size={14} />
            <span>Demo password: Admin@12345</span>
          </div>
        </div>
      </aside>

      <section className="authRight">
        <div className="authCard">
          <h1>{title}</h1>
          <p className="authSub">{subtitle}</p>

          {error && <div className="errorBox">{error}</div>}

          <form onSubmit={handleLogin}>
            <div className="field">
              <label htmlFor="email">Email</label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@school.edu"
                autoComplete="username"
                required
              />
            </div>

            <div className="field">
              <label htmlFor="password">Password</label>
              <div className="passwordInputWrap">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  autoComplete="current-password"
                  required
                />
                <button
                  type="button"
                  className="passwordToggle"
                  onClick={() => setShowPassword((prev) => !prev)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  title={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              <Link href="/forgot-password" className="forgotLink">Forgot password?</Link>
            </div>

            <button type="submit" className="primaryBtn" disabled={loading}>
              {loading ? "Signing in..." : `Sign in to ${portal} portal`}
            </button>
          </form>

          {signupHref ? (
            <p className="authSub" style={{ marginTop: 14 }}>
              New account?{" "}
              <Link href={signupHref}>
                {portal === "admin" ? "Create admin account (invite code)" : "Request signup approval"}
              </Link>
            </p>
          ) : (
            <p className="authSub" style={{ marginTop: 14 }}>
              New account required? Please contact school admin.
            </p>
          )}

          <div className="authDivider">Home</div>
          <Link href="/" className="secondaryBtn">Back to School Portal</Link>
        </div>
      </section>
    </main>
  );
}
