import { useEffect, useState } from "react";
import type { Session, User } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";

/**
 * Reactive auth state — updates instantly via onAuthStateChange.
 * No reload needed when user logs in / logs out.
 */
export function useAuth() {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;

    const syncAuthState = async (nextSession: Session | null) => {
      if (!active) return;

      console.log("[Auth] Session:", nextSession);

      if (!nextSession) {
        setSession(null);
        setUser(null);
        setLoading(false);
        return;
      }

      const { data, error } = await supabase.auth.getUser();

      if (!active) return;

      if (error) {
        console.error("[Auth] getUser failed:", error);
      }

      const verifiedUser = data.user ?? nextSession.user ?? null;

      console.log("[Auth] Current user ID:", verifiedUser?.id ?? null);

      setSession(nextSession);
      setUser(verifiedUser);
      setLoading(false);
    };

    const { data: listener } = supabase.auth.onAuthStateChange(
      (event, nextSession) => {
        console.log("[Auth] State changed:", event, nextSession);
        void syncAuthState(nextSession);
      },
    );

    supabase.auth.getSession().then(({ data: { session: currentSession }, error }) => {
      if (error) {
        console.error("[Auth] getSession failed:", error);
      }

      void syncAuthState(currentSession);
    });

    return () => {
      active = false;
      listener.subscription.unsubscribe();
    };
  }, []);

  return {
    session,
    user,
    loading,
    isAuthenticated: Boolean(session && user),
  };
}
