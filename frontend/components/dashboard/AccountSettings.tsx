"use client";

import axios from "axios";
import { Lock, Shield, CheckCircle2, KeyRound } from "lucide-react";
import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { BACKEND_URL } from "@/lib/backend";

export default function AccountSettings() {
  const { user, checkAuth } = useAuth();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    setSuccess("");

    if (password.length < 8) {
      setError("Password must be at least 8 characters long.");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setIsSaving(true);
    try {
      await axios.put(
        `${BACKEND_URL}/user/password`,
        { password },
        { withCredentials: true },
      );
      await checkAuth();
      setPassword("");
      setConfirmPassword("");
      setSuccess("Password successfully set. You can now also authenticate with email and password.");
    } catch (requestError: unknown) {
      const message = axios.isAxiosError(requestError)
        ? typeof requestError.response?.data === "string"
          ? requestError.response.data
          : requestError.message
        : "Could not set your password.";
      setError(message);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <section className="mx-auto max-w-2xl rounded-3xl border border-[#e6e3da] dark:border-[#232329] bg-white dark:bg-[#121215] p-6 sm:p-10 shadow-xs space-y-6">
      <div className="pb-5 border-b border-[#e6e3da] dark:border-[#232329]">
        <span className="text-[10px] font-mono uppercase tracking-widest text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1.5">
          <Shield size={12} /> Account Governance
        </span>
        <h1 className="font-serif text-2xl sm:text-3xl font-normal text-[#141413] dark:text-[#f5f5f2] mt-1">
          Account Security & Credentials
        </h1>
        <p className="mt-1 text-xs text-[#6e6d66] dark:text-[#8e8d86] font-mono">
          Signed in as {user?.email}
        </p>
      </div>

      <div>
        <div className="flex items-center gap-2 mb-3">
          <KeyRound size={16} className="text-emerald-600 dark:text-emerald-400" />
          <h2 className="font-semibold text-sm text-[#141413] dark:text-[#f5f5f2]">
            Password Authentication
          </h2>
        </div>

        {user?.hasPassword ? (
          <div className="p-4 rounded-2xl border border-emerald-500/20 bg-emerald-500/10 flex items-center gap-3">
            <CheckCircle2 size={18} className="text-emerald-600 dark:text-emerald-400 shrink-0" />
            <div>
              <div className="text-xs font-semibold text-emerald-800 dark:text-emerald-300">
                Password is active
              </div>
              <p className="text-[11px] text-emerald-700/80 dark:text-emerald-400/80 mt-0.5">
                A secure password is configured for this account. You can log in using either email or Google.
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <p className="text-xs text-[#6e6d66] dark:text-[#8e8d86] leading-relaxed">
              Add a standalone password so you can sign in directly with your email without needing OAuth.
            </p>

            <form onSubmit={handleSubmit} className="flex flex-col gap-3.5">
              <div>
                <label className="text-[11px] font-mono uppercase text-[#6e6d66] dark:text-[#8e8d86] block mb-1">
                  New Password
                </label>
                <input
                  type="password"
                  autoComplete="new-password"
                  aria-label="New password"
                  placeholder="At least 8 characters"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  minLength={8}
                  required
                  className="w-full px-4 py-3 rounded-xl border border-[#e6e3da] dark:border-[#232329] bg-[#faf8f5] dark:bg-[#18181d] text-sm text-[#141413] dark:text-[#f5f5f2] placeholder-[#8e8d86] focus:outline-none focus:ring-1 focus:ring-emerald-500/50 transition-all font-sans"
                />
              </div>

              <div>
                <label className="text-[11px] font-mono uppercase text-[#6e6d66] dark:text-[#8e8d86] block mb-1">
                  Confirm Password
                </label>
                <input
                  type="password"
                  autoComplete="new-password"
                  aria-label="Confirm new password"
                  placeholder="Re-enter password"
                  value={confirmPassword}
                  onChange={(event) => setConfirmPassword(event.target.value)}
                  minLength={8}
                  required
                  className="w-full px-4 py-3 rounded-xl border border-[#e6e3da] dark:border-[#232329] bg-[#faf8f5] dark:bg-[#18181d] text-sm text-[#141413] dark:text-[#f5f5f2] placeholder-[#8e8d86] focus:outline-none focus:ring-1 focus:ring-emerald-500/50 transition-all font-sans"
                />
              </div>

              {error && (
                <p role="alert" className="text-xs text-red-500 font-medium">
                  {error}
                </p>
              )}
              {success && (
                <p role="status" className="text-xs text-emerald-600 dark:text-emerald-400 font-medium">
                  {success}
                </p>
              )}

              <button
                type="submit"
                disabled={isSaving}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl text-xs font-semibold uppercase tracking-wider bg-[#141413] text-white dark:bg-white dark:text-black hover:bg-neutral-800 dark:hover:bg-neutral-200 disabled:opacity-50 transition-all shadow-xs"
              >
                {isSaving ? "Saving..." : "Set Account Password"}
              </button>
            </form>
          </div>
        )}
      </div>
    </section>
  );
}
