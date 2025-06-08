"use client";
import Image from "next/image";
import Link from "next/link";
import { useSession } from "../context/SessionContext";
import { Auth } from "./auth";
import { useState } from "react";
import { supabase } from "@/lib/supabase";

export default function Header() {
  const session = useSession();
  const [isSignInOpen, setIsSignInOpen] = useState<boolean>(false);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
  };
  return (
    <div
      className="p-2 flex justify-between items-center 
    bg-[#15191d] "
    >
      <Link href="/">
        <div className="flex items-center">
          <Image src="/logo.png" alt="Travel app logo" width={50} height={50} />
          <h1 className="text-xl font-bold">Roamio</h1>
        </div>
      </Link>
      <div className="flex gap-4">
        {!session && (
          <div className="mt-auto">
            <button
              className="btn-primary"
              onClick={() => setIsSignInOpen(!isSignInOpen)}
            >
              Sign in
            </button>
          </div>
        )}

        {isSignInOpen && <Auth onClose={() => setIsSignInOpen(false)} />}

        {/* <Link href="/create-trip">
          <button className="btn-primary">Create Trip</button>
        </Link> */}
        {session && (
          <Link href="/user-page">
            <button className="btn-primary">Account</button>
          </Link>
        )}
      </div>
    </div>
  );
}
