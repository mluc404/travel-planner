"use client";
import { useSession } from "../context/SessionContext";

export default function UserPage() {
  const session = useSession();
  return (
    <div className="p-4">
      <h1>Temporary User Profile page</h1>
      <div>User: {session?.user.email}</div>
    </div>
  );
}
