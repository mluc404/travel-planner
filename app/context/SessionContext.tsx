"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
  Children,
} from "react";
import { Session } from "@supabase/supabase-js";
import { supabase } from "@/lib/supabase";

interface SessionContextType {
  session: Session | null;
  //   setSession: (session: Session | null) => void;
}

const SessionContext = createContext<Session | null>(null);

export function SessionProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);

  useEffect(() => {
    const fetchSession = async () => {
      const currentSession = await supabase.auth.getSession();
      console.log("intitial session: ", currentSession.data.session);
      setSession(currentSession.data.session);
    };
    fetchSession();

    const { data: authListener } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setSession(session);
        console.log("Auth state changed: ", event, session);
      }
    );

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  return (
    <SessionContext.Provider value={session}>
      {children}
    </SessionContext.Provider>
  );
}

export function useSession() {
  const session = useContext(SessionContext);
  return session;
}
