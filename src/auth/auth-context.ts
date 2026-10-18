import { createContext, useContext } from "react";
import type { User } from "./auth-service";

/** Why the login page is showing, if it isn't just a first visit. */
export type AuthNotice = "signed-out" | "expired" | null;

export interface AuthContextValue {
  user: User | null;
  notice: AuthNotice;
  signIn: (email: string, password: string, remember: boolean) => Promise<void>;
  signOut: () => void;
}

export const AuthContext = createContext<AuthContextValue | null>(null);

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside <AuthProvider>");
  return ctx;
}
