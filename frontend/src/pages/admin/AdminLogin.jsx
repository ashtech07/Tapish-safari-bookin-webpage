import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { DollarSign } from "lucide-react";
import { api } from "@/lib/api";
import { toast } from "sonner";

const LOCK_KEY = "rtc_admin_lock_until";
const FAIL_KEY = "rtc_admin_fails";
const LOCKOUT_MS = 10 * 60 * 1000;
const MAX_FAILS = 3;

export default function AdminLogin() {
  const [pin, setPin] = useState("");
  const [error, setError] = useState("");
  const [lockedUntil, setLockedUntil] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const checkExistingLockAndAuth = useCallback(() => {
    const stored = sessionStorage.getItem(LOCK_KEY);
    if (stored) {
      const t = Number(stored);
      if (t > Date.now()) setLockedUntil(t);
      else sessionStorage.removeItem(LOCK_KEY);
    }
    // The admin token now lives in an httpOnly cookie we can't read from JS,
    // so ask the backend whether the current session cookie is still valid.
    api.get("/admin/session").then(() => {
      navigate("/admin/overview", { replace: true });
    }).catch(() => {});
  }, [navigate]);

  useEffect(() => {
    checkExistingLockAndAuth();
  }, [checkExistingLockAndAuth]);

  async function submit(e) {
    e.preventDefault();
    if (lockedUntil && lockedUntil > Date.now()) return;
    setLoading(true);
    setError("");
    try {
      await api.post("/admin/login", { pin });
      sessionStorage.removeItem(FAIL_KEY);
      toast.success("Welcome back.");
      navigate("/admin/overview", { replace: true });
    } catch {
      const fails = Number(sessionStorage.getItem(FAIL_KEY) || "0") + 1;
      sessionStorage.setItem(FAIL_KEY, String(fails));
      if (fails >= MAX_FAILS) {
        const until = Date.now() + LOCKOUT_MS;
        sessionStorage.setItem(LOCK_KEY, String(until));
        setLockedUntil(until);
        setError("Too many attempts. Try again in 10 minutes.");
      } else {
        setError("Incorrect PIN. Try again.");
      }
    } finally {
      setLoading(false);
    }
  }

  const locked = lockedUntil && lockedUntil > Date.now();
  const minutesLeft = locked ? Math.ceil((lockedUntil - Date.now()) / 60000) : 0;

  return (
    <div className="min-h-screen bg-[#111111] flex items-center justify-center px-6">
      <div className="w-full max-w-sm bg-[#1E1E1E] rounded-2xl p-8 border border-white/10 shadow-2xl">
        <div className="w-14 h-14 rounded-full bg-[#C8860A]/20 flex items-center justify-center mb-6">
          <DollarSign className="w-7 h-7 text-[#C8860A]" />
        </div>
        <h1 className="font-serif text-3xl text-white mb-1">Admin Access</h1>
        <p className="text-stone-400 text-sm mb-6">Enter your admin PIN to continue</p>
        <form onSubmit={submit} className="space-y-4">
          <input
            data-testid="admin-pin-input"
            type="password"
            inputMode="numeric"
            pattern="[0-9]*"
            maxLength={8}
            value={pin}
            onChange={(e) => setPin(e.target.value.replace(/\D/g, ""))}
            placeholder="••••••••"
            disabled={locked}
            className="w-full px-4 py-3 rounded-lg bg-black/40 text-white text-center tracking-[0.5em] border border-[#C8860A]/40 focus:outline-none focus:ring-2 focus:ring-[#C8860A]/60"
          />
          {error && <div data-testid="admin-error" className="text-sm text-red-400">{error}{locked ? ` (${minutesLeft} min)` : ""}</div>}
          <button
            data-testid="admin-login-submit"
            type="submit"
            disabled={loading || locked || !pin}
            className="w-full py-3 rounded-lg bg-[#8B6914] hover:bg-[#a07f1d] text-white font-semibold disabled:opacity-50 transition-colors"
          >{loading ? "Verifying..." : "Login"}</button>
        </form>
      </div>
    </div>
  );
}
