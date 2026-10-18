import { useState, type FormEvent } from "react";
import {
  CalendarCheck,
  CheckCircle2,
  CreditCard,
  Eye,
  EyeOff,
  Loader2,
  Lock,
  Mail,
  Stethoscope,
  TriangleAlert,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "./auth-context";
import { DEMO_ACCOUNTS } from "./auth-service";

const FEATURES = [
  { icon: CalendarCheck, text: "Book and manage appointments in one calendar" },
  { icon: Stethoscope, text: "Keep doctor schedules and availability up to date" },
  { icon: CreditCard, text: "Collect consultation fees at the time of booking" },
];

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function LoginPage() {
  const { signIn, notice } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(true);
  const [show, setShow] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    if (!EMAIL_RE.test(email.trim())) return setError("Enter a valid email address.");
    if (password.length < 6) return setError("Password must be at least 6 characters.");

    setError("");
    setLoading(true);
    try {
      await signIn(email, password, remember);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not sign in. Please try again.");
      setLoading(false);
    }
    // On success this page unmounts, so there's nothing to reset.
  };

  return (
    <div className="flex min-h-screen bg-white">
      {/* Brand panel */}
      <aside className="relative hidden w-[46%] flex-col justify-between overflow-hidden bg-gradient-to-br from-indigo-600 via-indigo-600 to-violet-700 p-12 text-white lg:flex">
        <div className="absolute -top-24 -right-24 size-80 rounded-full bg-white/10" />
        <div className="absolute -bottom-32 -left-20 size-96 rounded-full bg-white/5" />

        <div className="relative flex items-center gap-2.5">
          <div className="flex size-10 items-center justify-center rounded-xl bg-white/20">
            <svg className="size-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
            </svg>
          </div>
          <span className="text-xl font-extrabold tracking-tight">MindBridge</span>
        </div>

        <div className="relative">
          <h1 className="text-4xl leading-tight font-extrabold tracking-tight">
            Care that runs
            <br />
            on time.
          </h1>
          <p className="mt-3 max-w-sm text-indigo-100">
            Everything your front desk needs to keep patients, doctors and payments in sync.
          </p>
          <ul className="mt-10 space-y-4">
            {FEATURES.map(({ icon: Icon, text }) => (
              <li key={text} className="flex items-center gap-3 text-sm text-indigo-50">
                <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-white/15">
                  <Icon className="size-4" />
                </span>
                {text}
              </li>
            ))}
          </ul>
        </div>

        <p className="relative text-xs text-indigo-200">© {new Date().getFullYear()} MindBridge Health</p>
      </aside>

      {/* Form */}
      <main className="flex flex-1 items-center justify-center px-6 py-12">
        <div className="w-full max-w-sm">
          <div className="mb-8 flex items-center gap-2.5 lg:hidden">
            <div className="flex size-9 items-center justify-center rounded-xl bg-indigo-500 text-white">
              <svg className="size-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
              </svg>
            </div>
            <span className="text-lg font-extrabold tracking-tight text-indigo-600">MindBridge</span>
          </div>

          <h2 className="text-2xl font-bold tracking-tight text-slate-900">Welcome back</h2>
          <p className="mt-1 text-sm text-slate-500">Sign in to your account to continue.</p>

          {notice && (
            <div className="mt-5 flex items-start gap-2 rounded-lg bg-emerald-50 px-3 py-2.5 text-xs font-medium text-emerald-700">
              <CheckCircle2 className="mt-0.5 size-3.5 shrink-0" />
              {notice === "expired"
                ? "Your session expired. Please sign in again."
                : "You've been signed out."}
            </div>
          )}

          <form onSubmit={submit} noValidate className="mt-6 space-y-4">
            <div className="space-y-1.5">
              <label htmlFor="loginEmail" className="text-xs font-semibold tracking-wide text-slate-600 uppercase">
                Email
              </label>
              <div className="relative">
                <Mail className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-slate-400" />
                <Input
                  id="loginEmail"
                  type="email"
                  autoComplete="username"
                  autoFocus
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@hospital.com"
                  className="h-10 bg-slate-50 pl-9"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label htmlFor="loginPassword" className="text-xs font-semibold tracking-wide text-slate-600 uppercase">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-slate-400" />
                <Input
                  id="loginPassword"
                  type={show ? "text" : "password"}
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="h-10 bg-slate-50 pr-10 pl-9"
                />
                <button
                  type="button"
                  aria-label={show ? "Hide password" : "Show password"}
                  onClick={() => setShow((s) => !s)}
                  className="absolute top-1/2 right-3 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  {show ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between text-xs">
              <label className="flex cursor-pointer items-center gap-2 text-slate-600">
                <input
                  type="checkbox"
                  checked={remember}
                  onChange={(e) => setRemember(e.target.checked)}
                  className="size-3.5 accent-indigo-500"
                />
                Keep me signed in
              </label>
              <span className="text-slate-400">Forgot password? Ask your admin.</span>
            </div>

            {error && (
              <div role="alert" className="flex items-start gap-2 rounded-lg bg-red-50 px-3 py-2.5 text-xs font-medium text-red-600">
                <TriangleAlert className="mt-0.5 size-3.5 shrink-0" />
                {error}
              </div>
            )}

            <Button
              type="submit"
              disabled={loading}
              className="h-10 w-full bg-indigo-500 text-sm font-semibold text-white hover:bg-indigo-600"
            >
              {loading && <Loader2 className="size-4 animate-spin" />}
              {loading ? "Signing in…" : "Sign in"}
            </Button>
          </form>

          <div className="mt-8 rounded-lg border border-dashed border-slate-200 p-4">
            <p className="mb-2 text-[11px] font-bold tracking-wider text-slate-400 uppercase">Demo accounts</p>
            <div className="space-y-1.5">
              {DEMO_ACCOUNTS.map((a) => (
                <button
                  key={a.email}
                  type="button"
                  onClick={() => {
                    setEmail(a.email);
                    setPassword(a.password);
                    setError("");
                  }}
                  className="flex w-full items-center justify-between rounded-md px-2 py-1.5 text-left text-xs transition-colors hover:bg-indigo-50"
                >
                  <span className="font-medium text-slate-700">{a.email}</span>
                  <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-semibold text-slate-500">
                    {a.role}
                  </span>
                </button>
              ))}
            </div>
            <p className="mt-2 text-[11px] text-slate-400">Click one to fill the form. Password: {DEMO_ACCOUNTS[0].password}</p>
          </div>
        </div>
      </main>
    </div>
  );
}
