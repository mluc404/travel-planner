"use client";
import { useSession } from "../context/SessionContext";

export default function UserPage() {
  const session = useSession();
  return (
    <div className="p-4">
      <div className="text-[1.2rem]">User: {session?.user.email}</div>
    </div>
  );
}
