"use client";

import { Suspense, useEffect, useMemo, useState } from "react";
import { ShieldCheck, BookOpen, UserRound, BriefcaseBusiness, Check, Shield } from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";

type Role = "admin" | "teacher" | "staff" | "student" | "parent";

const roles: { key: Role; label: string; icon: React.ReactNode }[] = [
  { key: "admin", label: "Admin", icon: <Shield size={16} /> },
  { key: "teacher", label: "Teacher", icon: <BookOpen size={16} /> },
  { key: "staff", label: "Staff", icon: <BriefcaseBusiness size={16} /> },
  { key: "student", label: "Student", icon: <UserRound size={16} /> },
  { key: "parent", label: "Parent/User", icon: <ShieldCheck size={16} /> }
];

const roleToLogin: Record<Role, string> = {
  admin: "/admin/login",
  teacher: "/teacher/login",
  staff: "/staff/login",
  student: "/student/login",
  parent: "/parent/login"
};

function SignupForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const roleFromQuery = searchParams.get("role");

  const normalizedRole = useMemo<Role>(() => {
    if (
      roleFromQuery === "admin" ||
      roleFromQuery === "teacher" ||
      roleFromQuery === "staff" ||
      roleFromQuery === "student" ||
      roleFromQuery === "parent"
    ) {
      return roleFromQuery;
    }
    return "teacher";
  }, [roleFromQuery]);

  const [role, setRole] = useState<Role>(normalizedRole);
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    adminInviteCode: ""
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setRole(normalizedRole);
  }, [normalizedRole]);

  const set = (key: string) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((prev) => ({ ...prev, [key]: e.target.value }));

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.firstName || !form.email || !form.password) {
      setError("First name, email aur password zaroori hai.");
      return;
    }
    if (form.password.length < 8) {
      setError("Password kam se kam 8 characters ka hona chahiye.");
      return;
    }
    if (role === "admin" && !form.adminInviteCode.trim()) {
      setError("Admin invite code required hai.");
      return;
    }

    setError("");
    setSuccess("");
    setLoading(true);

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          name: `${form.firstName} ${form.lastName}`.trim(),
          email: form.email,
          password: form.password,
          role,
          ...(role === "admin" ? { adminInviteCode: form.adminInviteCode } : {})
        })
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "Signup failed");
        return;
      }

      if (res.status === 202) {
        setSuccess(data.message || "Signup request submitted. Wait for admin approval.");
        setTimeout(() => {
          router.push(roleToLogin[role]);
        }, 1600);
        return;
      }

      if (data.user) {
        localStorage.setItem("user", JSON.stringify(data.user));
        router.push("/dashboard");
        return;
      }

      setSuccess("Signup request submitted successfully.");
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
          <div className="brandMark">
            <ShieldCheck size={20} />
          </div>
          <div>
            <strong>EduSphere</strong>
            <span>School ERP</span>
          </div>
        </div>
        <div className="authLeftInfo">
          <h2>Request account access</h2>
          <p>Signup request admin approval ke baad active hota hai. Direct login tabhi possible hoga.</p>
          <ul className="featureList">
            {[
              "Role-based approval",
              "Secure cookie auth",
              "Portal-specific access",
              "Reset password support"
            ].map((f) => (
              <li key={f}>
                <Check size={14} />
                {f}
              </li>
            ))}
          </ul>
        </div>
      </aside>

      <section className="authRight">
        <div className="authCard">
          <div className="authTabs">
            <Link href={roleToLogin[role]} className="authTab">
              Sign in
            </Link>
            <Link href={`/signup?role=${role}`} className="authTab active">
              Request signup
            </Link>
          </div>

          <h1>Create request</h1>
          <p className="authSub">Admin approval ke liye details submit karein</p>

          {error && <div className="errorBox">{error}</div>}
          {success && <div className="successBox">{success}</div>}

          <form onSubmit={handleSignup}>
            <p className="roleLabel">Select role</p>
            <div className="roleGrid">
              {roles.map(({ key, label, icon }) => (
                <button
                  key={key}
                  type="button"
                  className={`roleCard${role === key ? " active" : ""}`}
                  onClick={() => setRole(key)}
                >
                  {icon} {label}
                </button>
              ))}
            </div>

            <div className="twoCol">
              <div className="field">
                <label htmlFor="firstName">First name</label>
                <input id="firstName" type="text" placeholder="Rahul" value={form.firstName} onChange={set("firstName")} />
              </div>
              <div className="field">
                <label htmlFor="lastName">Last name</label>
                <input id="lastName" type="text" placeholder="Sharma" value={form.lastName} onChange={set("lastName")} />
              </div>
            </div>

            <div className="field">
              <label htmlFor="semail">Email</label>
              <input
                id="semail"
                type="email"
                placeholder="you@school.edu"
                value={form.email}
                onChange={set("email")}
              />
            </div>

            <div className="field">
              <label htmlFor="spass">Password</label>
              <input
                id="spass"
                type="password"
                placeholder="Min 8 characters"
                value={form.password}
                onChange={set("password")}
                autoComplete="new-password"
              />
            </div>

            {role === "admin" && (
              <div className="field">
                <label htmlFor="adminInviteCode">Admin Invite Code</label>
                <input
                  id="adminInviteCode"
                  type="text"
                  placeholder="Enter admin setup code"
                  value={form.adminInviteCode}
                  onChange={set("adminInviteCode")}
                  autoComplete="off"
                />
              </div>
            )}

            <button type="submit" className="primaryBtn" disabled={loading}>
              {loading ? "Submitting..." : "Submit for approval"}
            </button>
          </form>
        </div>
      </section>
    </main>
  );
}

export default function SignupPage() {
  return (
    <Suspense
      fallback={
        <main className="authShell">
          <section className="authRight" style={{ width: "100%" }}>
            <div className="authCard">
              <h1>Create request</h1>
              <p className="authSub">Loading signup form...</p>
            </div>
          </section>
        </main>
      }
    >
      <SignupForm />
    </Suspense>
  );
}
