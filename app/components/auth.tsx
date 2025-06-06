import Form from "next/form";
import { useState } from "react";
import { supabase } from "@/lib/supabase";

interface AuthProps {
  onClose: () => void;
}

export function Auth({ onClose }: AuthProps) {
  const [hasAccount, setHasAccount] = useState<boolean>(false);
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  const handleSubmit = async () => {
    if (!hasAccount) {
      const { error } = await supabase.auth.signUp({ email, password });
      if (error) {
        console.error("Error signing up" + error.message);
        return;
      }
    } else {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) {
        console.error("Error signing in" + error.message);
        return;
      }
    }
  };
  return (
    <div
      className="w-[100vw] h-dvh fixed top-0 bg-black/80
       flex justify-center items-center"
      onClick={() => onClose()}
    >
      <div
        className="fixed top-[20vh] z-99 w-[min(300px,80vw)] bg-white
         flex flex-col gap-4 justify-between items-center p-4 px-6 rounded-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="w-full">
          {hasAccount ? (
            <div className="text-xl font-semibold">
              Welcome back!
              <div className="text-[1rem] font-normal">
                Sign in to your account
              </div>
            </div>
          ) : (
            <div className="text-xl font-semibold">
              Sign Up
              <div className="text-[1rem] font-normal">
                Create a new account
              </div>
            </div>
          )}
        </div>

        <Form action={""} className="flex flex-col gap-2 w-full">
          <div>
            {/* <div>Email</div> */}
            <input
              type="email"
              className="input-primary"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div>
            {/* <div>Password</div> */}
            <input
              type="password"
              className="input-primary"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button className="btn-primary mt-2" onClick={handleSubmit}>
            {hasAccount ? "Sign in" : " Sign up"}
          </button>
          <div
            className="cursor-pointer mt-2 text-center"
            onClick={() => setHasAccount(!hasAccount)}
          >
            {hasAccount ? (
              <>
                Don't have an account?{" "}
                <span className="underline">Sign up</span>
              </>
            ) : (
              <>
                Already have an account?{" "}
                <span className="underline">Sign in</span>
              </>
            )}
          </div>
        </Form>
      </div>
    </div>
  );
}
