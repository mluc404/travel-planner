"use client";
import Image from "next/image";
import Link from "next/link";
import { useSession } from "../context/SessionContext";
import { Auth } from "./auth";
import { useState } from "react";
import { usePathname } from "next/navigation";

export default function Header() {
  const session = useSession();
  const [isSignInOpen, setIsSignInOpen] = useState<boolean>(false);
  const pathName = usePathname();

  return (
    <div
      className="p-2 sm:px-4 flex justify-between items-center 
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
              onClick={() => {
                setIsSignInOpen(!isSignInOpen);
                console.log(pathName);
              }}
            >
              Sign in
            </button>
          </div>
        )}

        {isSignInOpen && (
          <Auth
            onClose={() => setIsSignInOpen(false)}
            redirectPath={pathName}
          />
        )}

        {session && (
          <Link href="/user-page">
            <button className="btn-primary">Account</button>
          </Link>
        )}
      </div>
    </div>
  );
}
