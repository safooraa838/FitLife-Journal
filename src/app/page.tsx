
"use client";

import { useFirebase } from "@/contexts/FirebaseProvider";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { AppSpinner } from "@/components/AppSpinner";

export default function HomePage() {
  const { user, loading } = useFirebase();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      if (user) {
        router.replace("/dashboard");
      } else {
        router.replace("/login");
      }
    }
  }, [user, loading, router]);

  return (
    <div className="flex h-screen w-screen items-center justify-center bg-background">
      <AppSpinner size="lg" />
    </div>
  );
}
