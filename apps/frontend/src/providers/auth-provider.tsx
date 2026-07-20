"use client";

import { useEffect, useState, type ReactNode } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuthStore } from "@/stores/auth-store";
import { LoadingSpinner } from "@/components/shared/loading-spinner";

const publicRoutes = ["/login", "/register", "/forgot-password"];

export function AuthProvider({ children }: { children: ReactNode }) {
  const { isAuthenticated } = useAuthStore();
  const router = useRouter();
  const pathname = usePathname();
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    if (!isAuthenticated && !publicRoutes.includes(pathname)) {
      router.push("/login");
    } else if (isAuthenticated && publicRoutes.includes(pathname)) {
      router.push("/dashboard");
    } else {
      setChecked(true);
    }
  }, [isAuthenticated, pathname, router]);

  if (!checked) {
    return (
      <div className="flex h-screen items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return <>{children}</>;
}
