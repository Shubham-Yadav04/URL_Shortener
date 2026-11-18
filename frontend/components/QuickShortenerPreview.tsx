"use client";

import React, { useState } from "react";
import { Copy, Check, ArrowRight, Sparkles, QrCode } from "lucide-react";
import { QRCodeSVG } from "qrcode.react";
import { motion, AnimatePresence } from "motion/react";
import Link from "next/link";

export default function QuickShortenerPreview() {
  const [url, setUrl] = useState("https://github.com/features/actions");
  const [slug, setSlug] = useState("octo-actions");
  const [copied, setCopied] = useState(false);
  const [showQr, setShowQr] = useState(false);

  const previewShortUrl = `https://shorten.it/${slug || "quick"}`;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(previewShortUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="w-full max-w-3xl mx-auto rounded-2xl border border-[#e6e3da] dark:border-[#232329] bg-white dark:bg-[#121215] p-5 sm:p-7 shadow-xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-5 pb-4 border-b border-[#e6e3da] dark:border-[#232329]">
        <div>
          <span className="text-[10px] font-mono uppercase tracking-widest text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1.5">
            <Sparkles size={12} /> Interactive Sandbox
          </span>
          <h3 className="font-serif text-xl font-medium text-[#141413] dark:text-[#f5f5f2] mt-0.5">
            Test the shortening engine in real time
          </h3>
        </div>
        <div className="text-xs font-mono text-[#6e6d66] dark:text-[#8e8d86]">
          No signup required for demo
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 mb-4">
        <div className="sm:col-span-7 flex flex-col gap-1.5">
          <label className="text-[11px] font-mono uppercase text-[#6e6d66] dark:text-[#8e8d86]">
            Destination URL
          </label>
          <input
            type="url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="https://your-domain.com/long-page-path"
            className="w-full px-3.5 py-2.5 rounded-xl border border-[#e6e3da] dark:border-[#232329] bg-[#faf8f5] dark:bg-[#18181d] text-sm text-[#141413] dark:text-[#f5f5f2] placeholder-[#8e8d86] focus:outline-none focus:ring-1 focus:ring-emerald-500/50 transition-all font-sans"
          />
        </div>

        <div className="sm:col-span-5 flex flex-col gap-1.5">
          <label className="text-[11px] font-mono uppercase text-[#6e6d66] dark:text-[#8e8d86]">
            Custom Slug
          </label>
          <div className="flex items-center rounded-xl border border-[#e6e3da] dark:border-[#232329] bg-[#faf8f5] dark:bg-[#18181d] px-3 py-2.5 focus-within:ring-1 focus-within:ring-emerald-500/50 transition-all">
            <span className="text-xs font-mono text-[#8e8d86] shrink-0">/</span>
            <input
              type="text"
              value={slug}
              onChange={(e) => setSlug(e.target.value.replace(/[^a-zA-Z0-9_-]/g, ""))}
              placeholder="custom-slug"
              className="w-full bg-transparent border-0 px-1 text-sm text-[#141413] dark:text-[#f5f5f2] placeholder-[#8e8d86] focus:outline-none font-mono"
            />
          </div>
        </div>
      </div>

      {/* Generated Result Output */}
      <div className="p-4 rounded-xl bg-[#f4f2ea] dark:bg-[#18181d] border border-[#e6e3da] dark:border-[#232329] flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" />
          <div className="truncate">
            <span className="text-[11px] font-mono uppercase text-[#6e6d66] dark:text-[#8e8d86] block">
              Generated Short URL
            </span>
            <span className="font-mono text-sm sm:text-base font-semibold text-emerald-700 dark:text-emerald-400 break-all">
              {previewShortUrl}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
          <button
            type="button"
            onClick={() => setShowQr(!showQr)}
            className="px-3 py-2 rounded-lg border border-[#e6e3da] dark:border-[#232329] bg-white dark:bg-[#121215] text-xs font-medium text-[#141413] dark:text-[#f5f5f2] hover:bg-[#eceae2] dark:hover:bg-[#202025] flex items-center gap-1.5 transition-colors"
          >
            <QrCode size={14} />
            {showQr ? "Hide QR" : "Show QR"}
          </button>

          <button
            type="button"
            onClick={copyToClipboard}
            className="px-4 py-2 rounded-lg bg-[#141413] text-white dark:bg-white dark:text-black text-xs font-medium hover:bg-neutral-800 dark:hover:bg-neutral-200 flex items-center gap-1.5 transition-all shadow-xs"
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
      </div>

      {/* Expandable Live QR Preview */}
      <AnimatePresence>
        {showQr && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden mt-4 pt-4 border-t border-[#e6e3da] dark:border-[#232329] flex flex-col sm:flex-row items-center gap-5"
          >
            <div className="bg-white p-3 rounded-xl border border-black/10 shadow-sm shrink-0">
              <QRCodeSVG value={previewShortUrl} size={110} />
            </div>
            <div>
              <span className="text-[10px] font-mono uppercase tracking-widest text-emerald-600 dark:text-emerald-400 font-semibold">
                Instant QR Engine
              </span>
              <h4 className="font-serif text-base font-medium text-[#141413] dark:text-[#f5f5f2] mt-0.5">
                Scan with any smartphone camera
              </h4>
              <p className="text-xs text-[#6e6d66] dark:text-[#8e8d86] mt-1 leading-relaxed">
                Automatically resolves with 302 edge caching. Sign in to customize styling, logos, password locks, and track click locations.
              </p>
              <Link
                href="/signup"
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-600 dark:text-emerald-400 mt-2 hover:underline"
              >
                Sign up for full analytics <ArrowRight size={12} />
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
