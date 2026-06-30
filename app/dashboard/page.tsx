"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

const roleToDashboard: Record<string, string> = {
  admin: "/dashboard/admin",
  teacher: "/dashboard/teacher",
  student: "/dashboard/student",
  parent: "/dashboard/parent",
  staff: "/dashboard/staff",
  accountant: "/dashboard/staff",
  reception: "/dashboard/staff"
};

export default function DashboardRedirectPage() {
  const router = useRouter();

  useEffect(() => {
    const route = async () => {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/me`, {
        credentials: "include"
      });

      if (!response.ok) {
        router.replace("/");
        return;
      }

      const data = await response.json();
      router.replace(roleToDashboard[data.user.role] || "/");
    };

    route().catch(() => router.replace("/"));
  }, [router]);

  return <main className="workspace">Redirecting to your dashboard...</main>;
}
