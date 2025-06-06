"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function AuthCallBack() {
  const router = useRouter();

  useEffect(() => {
    // Handle the auth callback

    supabase.auth.onAuthStateChange((event, session) => {
      if (event === "SIGNED_IN") {
        // redirect to the trip details display earlier
        router.push("/trip-details");
      }
    });
  }, [router]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <h1 className="text-2xl font-bold mb-4">Verifying your email...</h1>
        <p>Please wait while we complete your registration.</p>
      </div>
    </div>
  );
}
