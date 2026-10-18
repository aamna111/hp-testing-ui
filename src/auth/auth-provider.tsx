import { useCallback, useEffect, useMemo, useState, type ReactNode } from "react";
import { AuthContext, type AuthNotice } from "./auth-context";
import { SESSION_KEY, clearSession, loadSession, login, type Session } from "./auth-service";

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(() => loadSession());
  const [notice, setNotice] = useState<AuthNotice>(null);

  const signIn = useCallback(async (email: string, password: string, remember: boolean) => {
    const s = await login(email, password, remember);
    setNotice(null);
    setSession(s);
  }, []);

  const signOut = useCallback(() => {
    clearSession();
    setNotice("signed-out");
    setSession(null);
  }, []);

  // Sign out automatically when the session runs out.
  useEffect(() => {
    if (!session) return;
    const ms = session.expiresAt - Date.now();
    const t = setTimeout(() => {
      clearSession();
      setNotice("expired");
      setSession(null);
    }, Math.min(Math.max(ms, 0), 2_147_000_000));
    return () => clearTimeout(t);
  }, [session]);

  // Signing out in one tab signs out the others too.
  useEffect(() => {
    const onStorage = (e: StorageEvent) => {
      if (e.key === SESSION_KEY && !e.newValue) {
        setNotice("signed-out");
        setSession(null);
      }
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  const value = useMemo(
    () => ({ user: session?.user ?? null, notice, signIn, signOut }),
    [session, notice, signIn, signOut]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
