"use client";
import Image from "next/image";
import Link from "next/link";
import { useSession } from "../context/SessionContext";

export default function Header() {
  const session = useSession();
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
        <button className="btn-primary">Sign In</button>
        <Link href="/create-trip">
          <button className="btn-primary">Create Trip</button>
        </Link>
        {session && (
          <Link href="/user-page">
            <button className="btn-primary">Account</button>
          </Link>
        )}
      </div>
    </div>
  );
}
