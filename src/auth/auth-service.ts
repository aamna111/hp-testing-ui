/**
 * MOCK auth service.
 *
 * The UI only talks to these functions, so connecting a real backend later
 * only touches this file:
 *
 *   login()        -> POST /api/auth/login  (server checks the password and
 *                     sets an httpOnly session cookie or returns a JWT)
 *   loadSession()  -> GET  /api/auth/me     (who am I?)
 *   clearSession() -> POST /api/auth/logout
 *
 * Passwords are checked in the browser here only because there is no server.
 * Never ship real credentials or password checks in frontend code.
 */

export type Role = "Admin" | "Receptionist";

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
}

export interface Session {
  user: User;
  token: string;
  /** epoch ms */
  expiresAt: number;
}

export class AuthError extends Error {}

interface Account extends User {
  password: string;
}

const ACCOUNTS: Account[] = [
  { id: "u1", name: "Sarah Mitchell", email: "admin@mindbridge.com", password: "Admin@123", role: "Admin" },
  { id: "u2", name: "Riya Sharma", email: "frontdesk@mindbridge.com", password: "Desk@123", role: "Receptionist" },
];

/** Shown on the login page so the demo is easy to try. */
export const DEMO_ACCOUNTS = ACCOUNTS.map(({ email, password, role }) => ({ email, password, role }));

const KEY = "mindbridge.session";
const HOUR = 3_600_000;
const wait = (ms: number) => new Promise((r) => setTimeout(r, ms));

export async function login(email: string, password: string, remember: boolean): Promise<Session> {
  await wait(800);
  const account = ACCOUNTS.find(
    (a) => a.email.toLowerCase() === email.trim().toLowerCase() && a.password === password
  );
  if (!account) throw new AuthError("Incorrect email or password.");

  const { password: _pw, ...user } = account;
  void _pw;
  const session: Session = {
    user,
    token: `mock.${crypto.randomUUID()}`,
    expiresAt: Date.now() + (remember ? 30 * 24 * HOUR : 8 * HOUR),
  };
  saveSession(session, remember);
  return session;
}

// Browser storage can throw (private mode, blocked cookies), so every access is guarded.
export function saveSession(session: Session, remember: boolean) {
  try {
    clearSession();
    (remember ? localStorage : sessionStorage).setItem(KEY, JSON.stringify(session));
  } catch {
    /* session just won't survive a refresh */
  }
}

export function loadSession(): Session | null {
  try {
    const raw = localStorage.getItem(KEY) ?? sessionStorage.getItem(KEY);
    if (!raw) return null;
    const session = JSON.parse(raw) as Session;
    if (!session?.user || session.expiresAt <= Date.now()) {
      clearSession();
      return null;
    }
    return session;
  } catch {
    return null;
  }
}

export function clearSession() {
  try {
    localStorage.removeItem(KEY);
    sessionStorage.removeItem(KEY);
  } catch {
    /* ignore */
  }
}

export const SESSION_KEY = KEY;
