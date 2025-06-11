"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function AuthCallBack() {
  const router = useRouter();

  useEffect(() => {
    // Get the current session
    supabase.auth.getSession().then(({ data: { session }, error }) => {
      if (error) {
        console.error("Error getting session:", error);
        return;
      }
      console.log("Current session:", session);
    });

    // Set up the auth state change listener
    const { data: authListener } = supabase.auth.onAuthStateChange(
      (event, session) => {
        console.log("Auth event:", event);
        console.log("Session data:", session);

        if (event === "SIGNED_IN") {
          // redirect users based on where they clicked sign up
          const redirectPath = localStorage.getItem("authRedirectPath") || "/";
          router.push(redirectPath);
          localStorage.removeItem("authRedirectPath");
        }
      }
    );

    // Cleanup subscription on unmount
    return () => {
      authListener.subscription.unsubscribe();
    };
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
