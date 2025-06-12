import Form from "next/form";
import { ChangeEvent, useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";

interface AuthProps {
  onClose: () => void;
  redirectPath?: string;
}

export function Auth({ onClose, redirectPath }: AuthProps) {
  const [hasAccount, setHasAccount] = useState<boolean>(true);
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [signinPassword, setSigninPassword] = useState<string>("");
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const router = useRouter();
  const [signUpClicked, setSignUpClicked] = useState<boolean>(false);

  // Validate signup password
  useEffect(() => {
    if (!hasAccount) {
      if (password.length < 6) {
        setPasswordError("Password must be at least 6 characters");
      } else {
        if (password !== confirmPassword) {
          setPasswordError("Passwords do not match");
        } else {
          setPasswordError(null);
        }
      }
    }
  }, [password, confirmPassword]);

  // console.log(passwordError);

  const handleSubmit = async () => {
    if (!hasAccount) {
      // Check for password matching
      if (passwordError) {
        console.log(passwordError);
      } else {
        // Store the redirected path to redirect user after signing up
        if (redirectPath) {
          localStorage.setItem("authRedirectPath", redirectPath);
        }
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo:
              process.env.NODE_ENV === "production"
                ? "https://travel-planner-nine-sage.vercel.app/auth/callback"
                : `${window.location.origin}/auth/callback`,
          },
        });
        if (error) {
          console.error("Error signing up" + error.message);
          return;
        } else {
          setSignUpClicked(true);
        }
      }
    } else {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password: signinPassword,
      });
      if (error) {
        console.error("Error signing in" + error.message);
        return;
      }

      // If sign in is successful and user is on home page, redirect to user account page
      // Doing this improves UX
      if (redirectPath === "/") {
        router.push("/trips");
      }
      onClose();
    }
  };
  return (
    <div
      className="w-[100vw] h-dvh fixed top-0 left-0 bg-black/80 z-98
       flex justify-center items-center"
      onClick={() => onClose()}
    >
      <div
        className="fixed top-[20vh] z-99 w-[90%] sm:w-[min(50%,500px)]  bg-white text-gray-800
         flex flex-col gap-4 justify-between items-center p-4 px-6 rounded-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="w-full">
          {hasAccount ? (
            <div className="text-xl font-semibold">
              Sign In
              <div className="text-[1rem] font-normal"></div>
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
        {signUpClicked ? (
          <div className="">
            Thank you for joining{" "}
            <span className="font-semibold">Roamio! </span>
            Please check your email for a confirmation link to start your
            journey &#x2708;
          </div>
        ) : (
          <Form action={""} className="flex flex-col gap-2 w-full">
            <div>
              <input
                type="email"
                className="input-primary"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            {hasAccount && (
              <div>
                <input
                  type="password"
                  className="input-primary"
                  placeholder="Password"
                  value={signinPassword}
                  onChange={(e) => setSigninPassword(e.target.value)}
                />
              </div>
            )}
            {!hasAccount && (
              <>
                <div>
                  <input
                    type="password"
                    className="input-primary"
                    placeholder="Password at least 6 characters"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
                <div>
                  <input
                    type="password"
                    className="input-primary"
                    placeholder="Confirm Password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                  />
                </div>
              </>
            )}
            {passwordError && <p className="text-red-500">{passwordError}</p>}

            <button className="btn-primary mt-2" onClick={handleSubmit}>
              {hasAccount ? "Sign in" : " Sign up"}
            </button>
            <div
              className="cursor-pointer mt-2 text-center"
              onClick={() => setHasAccount(!hasAccount)}
            >
              {hasAccount ? (
                <>
                  Don&apos;t have an account?{" "}
                  <span className="underline">Sign up</span>
                </>
              ) : (
                <>
                  Already have an account?{" "}
                  <span
                    className="underline"
                    onClick={() => {
                      setHasAccount(true);
                      setPasswordError(null);
                      console.log(passwordError);
                    }}
                  >
                    Sign in
                  </span>
                </>
              )}
            </div>
          </Form>
        )}
      </div>
    </div>
  );
}
