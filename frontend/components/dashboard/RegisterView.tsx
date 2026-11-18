"use client";

import { motion } from "motion/react";
import { useState, useRef, ChangeEvent } from "react";
import { Copy, Check, CheckCircle2, QrCode, Lock, Globe, Sparkles, Calendar, ArrowLeft, ArrowRight } from "lucide-react";
import { QRCodeSVG } from "qrcode.react";
import { useAuth, ProjectDetail } from "@/context/AuthContext";
import axios from "axios";
import { BACKEND_URL } from "@/lib/backend";

export default function RegisterView() {
  const { user, setProjectDetail } = useAuth();
  const [copied, setCopied] = useState(false);
  const inputRef = useRef<Record<string, string | boolean>>({});
  const [created, setCreated] = useState<{ shortUrl: string; mappingId?: number } | null>(null);
  const [isPasswordProtected, setIsPasswordProtected] = useState(false);
  const [customCode, setCustomCode] = useState("");
  const [codeAvailability, setCodeAvailability] = useState<"empty" | "checking" | "available" | "unavailable">("empty");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    inputRef.current[name] = value;
    if (name === "shortCode") {
      setCustomCode(value);
      setCodeAvailability(value.trim() ? "checking" : "empty");
    }
  };

  const checkCodeAvailability = async (code: string) => {
    if (!code.trim()) {
      setCodeAvailability("empty");
      return true;
    }
    setCodeAvailability("checking");
    try {
      const response = await axios.get(`${BACKEND_URL}/mapping/short-code/availability`, {
        params: { code: code.trim() },
        withCredentials: true,
      });
      const available = response.data.available === true;
      setCodeAvailability(available ? "available" : "unavailable");
      return available;
    } catch (requestError: unknown) {
      setCodeAvailability("unavailable");
      const message =
        axios.isAxiosError(requestError) && typeof requestError.response?.data === "string"
          ? requestError.response.data
          : "Could not verify this short code.";
      setError(message);
      return false;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      setError("Please sign in before creating a link.");
      return;
    }
    setError(null);
    setIsSubmitting(true);
    try {
      const shortCode = customCode.trim();
      if (shortCode && !(await checkCodeAvailability(shortCode))) {
        setError("This short code is unavailable. Choose another one.");
        return;
      }

      const expiryValue = inputRef.current.expiresAt;
      const expiresAt =
        typeof expiryValue === "string" && expiryValue
          ? new Date(expiryValue).toISOString()
          : null;

      const payload = {
        projectName: inputRef.current.projectName || "",
        longUrl: inputRef.current.longUrl || "",
        shortCode: shortCode || null,
        isProtected: isPasswordProtected,
        password: isPasswordProtected ? inputRef.current.password || "" : null,
        expiresAt,
      };

      const response = await axios.post(`${BACKEND_URL}/mapping/shorten`, payload, {
        withCredentials: true,
      });
      const data = response.data;
      setCreated(data);

      const project: ProjectDetail = {
        mappingId: data.mappingId,
        name: data.projectName,
        shortUrl: data.shortUrl,
        expiresAt: data.expiresAt ?? null,
        active: data.active,
        uniqueViews: data.uniqueViews ?? 0,
      };
      setProjectDetail((previous) => [...(previous ?? []), project]);
    } catch (requestError: unknown) {
      const message = axios.isAxiosError(requestError)
        ? typeof requestError.response?.data === "string"
          ? requestError.response.data
          : requestError.message
        : "An unexpected error occurred.";
      setError(`URL creation failed: ${message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className="max-w-3xl mx-auto"
    >
      <div className="text-center mb-8">
        <span className="text-[11px] font-mono uppercase tracking-widest text-emerald-600 dark:text-emerald-400 font-semibold">
          NEW GATEWAY
        </span>
        <h1 className="font-serif text-3xl sm:text-4xl font-normal tracking-tight text-[#141413] dark:text-[#f5f5f2] mt-1 mb-2">
          Register a Short Link
        </h1>
        <p className="text-xs sm:text-sm text-[#6e6d66] dark:text-[#8e8d86] font-light max-w-lg mx-auto">
          Create an edge-redirected short link with custom slugging, expiration timestamps, and QR delivery.
        </p>
      </div>

      {!created?.shortUrl ? (
        <form
          onSubmit={handleSubmit}
          className="rounded-3xl border border-[#e6e3da] dark:border-[#232329] bg-white dark:bg-[#121215] p-6 sm:p-10 shadow-lg space-y-6"
        >
          {/* Project Name */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[11px] font-mono uppercase tracking-wider text-[#6e6d66] dark:text-[#8e8d86]">
              Project Name <span className="normal-case font-light text-[#8e8d86]">(Optional)</span>
            </label>
            <input
              type="text"
              name="projectName"
              placeholder="e.g. Q3 Launch Campaign"
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-xl border border-[#e6e3da] dark:border-[#232329] bg-[#faf8f5] dark:bg-[#18181d] text-sm text-[#141413] dark:text-[#f5f5f2] placeholder-[#8e8d86] focus:outline-none focus:ring-1 focus:ring-emerald-500/50 transition-all font-sans"
            />
          </div>

          {/* Destination Long URL */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[11px] font-mono uppercase tracking-wider text-[#6e6d66] dark:text-[#8e8d86]">
              Destination Long URL <span className="text-emerald-600 dark:text-emerald-400 font-semibold">*</span>
            </label>
            <input
              type="url"
              name="longUrl"
              placeholder="https://yourdomain.com/path-to-destination"
              required
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-xl border border-[#e6e3da] dark:border-[#232329] bg-[#faf8f5] dark:bg-[#18181d] text-sm text-[#141413] dark:text-[#f5f5f2] placeholder-[#8e8d86] focus:outline-none focus:ring-1 focus:ring-emerald-500/50 transition-all font-sans"
            />
          </div>

          {/* Slug & Availability */}
          <div className="flex flex-col gap-1.5">
            <div className="flex items-center justify-between">
              <label className="text-[11px] font-mono uppercase tracking-wider text-[#6e6d66] dark:text-[#8e8d86]">
                Custom Vanity Slug <span className="normal-case font-light text-[#8e8d86]">(Optional)</span>
              </label>
              {customCode.trim() && (
                <span
                  id="short-code-status"
                  className={`text-[11px] font-mono ${
                    codeAvailability === "available"
                      ? "text-emerald-600 dark:text-emerald-400 font-semibold"
                      : codeAvailability === "unavailable"
                      ? "text-red-500 font-semibold"
                      : "text-[#8e8d86]"
                  }`}
                >
                  {codeAvailability === "available"
                    ? "✓ Slug is available"
                    : codeAvailability === "unavailable"
                    ? "✕ Slug is unavailable"
                    : "Checking availability..."}
                </span>
              )}
            </div>

            <div className="flex items-center rounded-xl border border-[#e6e3da] dark:border-[#232329] bg-[#faf8f5] dark:bg-[#18181d] px-3.5 py-3 focus-within:ring-1 focus-within:ring-emerald-500/50 transition-all">
              <span className="text-xs font-mono text-[#8e8d86] shrink-0 mr-1.5">
                shorten.it/
              </span>
              <input
                type="text"
                name="shortCode"
                placeholder="vanity-slug"
                onChange={handleChange}
                onBlur={() => checkCodeAvailability(customCode)}
                minLength={3}
                maxLength={32}
                pattern="[A-Za-z0-9_-]{3,32}"
                aria-describedby="short-code-status"
                className="w-full bg-transparent border-0 text-sm text-[#141413] dark:text-[#f5f5f2] placeholder-[#8e8d86] focus:outline-none font-mono"
              />
            </div>
            <p className="text-[11px] text-[#8e8d86] font-mono">
              3 to 32 characters (letters, numbers, hyphens, and underscores).
            </p>
          </div>

          {/* Expiration Date */}
          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="expiresAt"
              className="text-[11px] font-mono uppercase tracking-wider text-[#6e6d66] dark:text-[#8e8d86]"
            >
              Expiration Date & Time <span className="normal-case font-light text-[#8e8d86]">(Optional)</span>
            </label>
            <input
              id="expiresAt"
              type="datetime-local"
              name="expiresAt"
              min={new Date(Date.now() - new Date().getTimezoneOffset() * 60000).toISOString().slice(0, 16)}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-xl border border-[#e6e3da] dark:border-[#232329] bg-[#faf8f5] dark:bg-[#18181d] text-sm text-[#141413] dark:text-[#f5f5f2] focus:outline-none focus:ring-1 focus:ring-emerald-500/50 transition-all font-sans"
            />
            <p className="text-[11px] text-[#8e8d86]">
              Leave empty for permanent edge redirection.
            </p>
          </div>

          {/* Password Protection Toggle */}
          <div className="p-4 rounded-2xl border border-[#e6e3da] dark:border-[#232329] bg-[#faf8f5]/60 dark:bg-[#18181d]/60 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 flex items-center justify-center shrink-0">
                  <Lock size={15} />
                </div>
                <div>
                  <div className="text-xs font-semibold text-[#141413] dark:text-[#f5f5f2]">
                    Password Protection
                  </div>
                  <div className="text-[11px] text-[#6e6d66] dark:text-[#8e8d86]">
                    Require visitors to enter a passphrase before routing.
                  </div>
                </div>
              </div>

              <button
                type="button"
                role="switch"
                aria-checked={isPasswordProtected}
                onClick={() => setIsPasswordProtected(!isPasswordProtected)}
                className={`w-11 h-6 flex items-center rounded-full p-1 transition-colors duration-200 outline-none focus:ring-2 focus:ring-emerald-500/40 ${
                  isPasswordProtected
                    ? "bg-[#141413] dark:bg-emerald-500"
                    : "bg-[#e6e3da] dark:bg-[#282830]"
                }`}
              >
                <div
                  className={`w-4 h-4 rounded-full bg-white transition-transform duration-200 ${
                    isPasswordProtected ? "translate-x-5" : "translate-x-0"
                  }`}
                />
              </button>
            </div>

            {isPasswordProtected && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                className="overflow-hidden pt-2"
              >
                <label className="text-[11px] font-mono uppercase tracking-wider text-[#6e6d66] dark:text-[#8e8d86] block mb-1">
                  Access Passphrase
                </label>
                <input
                  type="password"
                  name="password"
                  placeholder="Enter a secure passphrase"
                  required={isPasswordProtected}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 rounded-xl border border-[#e6e3da] dark:border-[#232329] bg-white dark:bg-[#121215] text-sm text-[#141413] dark:text-[#f5f5f2] placeholder-[#8e8d86] focus:outline-none focus:ring-1 focus:ring-emerald-500/50 transition-all font-sans"
                />
              </motion.div>
            )}
          </div>

          {/* Submission feedback & button */}
          <div className="pt-2 text-center">
            {error && (
              <p role="alert" className="text-xs text-red-500 font-medium mb-3">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={isSubmitting || (!!customCode.trim() && codeAvailability === "unavailable")}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl font-semibold text-xs uppercase tracking-wider bg-[#141413] text-white dark:bg-white dark:text-black hover:bg-neutral-800 dark:hover:bg-neutral-200 disabled:opacity-50 transition-all shadow-xs"
            >
              {isSubmitting ? "Deploying Link..." : "Create Short Link"}
            </button>
          </div>
        </form>
      ) : (
        /* Successfully Created Screen */
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          className="rounded-3xl border border-[#e6e3da] dark:border-[#232329] bg-white dark:bg-[#121215] p-6 sm:p-10 shadow-lg text-center"
        >
          <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto mb-4">
            <CheckCircle2 size={30} />
          </div>

          <h2 className="font-serif text-2xl sm:text-3xl font-medium text-[#141413] dark:text-[#f5f5f2] mb-1">
            Link Deployed Successfully
          </h2>
          <p className="text-xs sm:text-sm text-[#6e6d66] dark:text-[#8e8d86] font-light mb-8">
            Your link is live on the global edge network and actively capturing telemetry.
          </p>

          {/* Short URL Box */}
          <div className="p-4 rounded-2xl border border-[#e6e3da] dark:border-[#232329] bg-[#faf8f5] dark:bg-[#18181d] flex flex-col sm:flex-row items-center justify-between gap-3 max-w-xl mx-auto mb-8">
            <span className="font-mono text-sm sm:text-base font-semibold text-emerald-700 dark:text-emerald-400 break-all text-left">
              {created.shortUrl}
            </span>
            <button
              type="button"
              onClick={() => {
                navigator.clipboard.writeText(created.shortUrl);
                setCopied(true);
                setTimeout(() => setCopied(false), 2000);
              }}
              className="px-4 py-2 rounded-xl bg-[#141413] text-white dark:bg-white dark:text-black text-xs font-semibold hover:bg-neutral-800 dark:hover:bg-neutral-200 flex items-center gap-1.5 transition-all shrink-0"
            >
              {copied ? (
                <>
                  <Check size={14} className="text-emerald-400 dark:text-emerald-700" />
                  Copied!
                </>
              ) : (
                <>
                  <Copy size={14} />
                  Copy Link
                </>
              )}
            </button>
          </div>

          {/* QR Code Presentation */}
          <div className="mb-8 p-6 rounded-2xl border border-[#e6e3da] dark:border-[#232329] bg-[#faf8f5]/60 dark:bg-[#141418]/60 max-w-xs mx-auto">
            <span className="text-[10px] font-mono uppercase tracking-widest text-[#8e8d86] block mb-3">
              Printable Vector QR Code
            </span>
            <div className="bg-white p-3.5 rounded-xl border border-black/10 shadow-sm w-fit mx-auto">
              <QRCodeSVG value={created.shortUrl} size={180} />
            </div>
            <p className="text-[11px] text-[#6e6d66] dark:text-[#8e8d86] mt-3 font-mono">
              Scan to test your redirection
            </p>
          </div>

          {/* Actions */}
          <button
            type="button"
            onClick={() => {
              setCreated(null);
              inputRef.current = {};
              setCustomCode("");
            }}
            className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#141413] dark:text-white hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors"
          >
            <ArrowLeft size={14} /> Register Another URL
          </button>
        </motion.div>
      )}
    </motion.div>
  );
}
