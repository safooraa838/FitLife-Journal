
"use client";

import type { ReactNode } from "react";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useFirebase } from "@/contexts/FirebaseProvider";
import { AppSpinner } from "@/components/AppSpinner";

export function AuthGuard({ children }: { children: ReactNode }) {
  const { user, loading } = useFirebase();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.replace("/login");
    }
  }, [user, loading, router]);

  if (loading || !user) {
    return (
      <div className="flex h-screen w-screen items-center justify-center bg-background">
        <AppSpinner size="lg" />
      </div>
    );
  }

  return <>{children}</>;
}
