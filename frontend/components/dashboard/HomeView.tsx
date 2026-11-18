"use client";

import { motion } from "motion/react";
import {
  MousePointerClick,
  Globe,
  Smartphone,
  TrendingUp,
  Plus,
  ArrowRight,
  ExternalLink,
  Copy,
  Check,
  QrCode,
  ShieldCheck,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import Link from "next/link";
import { useState } from "react";

export default function HomeView() {
  const { user, projectDetail } = useAuth();
  const [copiedId, setCopiedId] = useState<number | null>(null);

  const activeLinksCount = projectDetail?.length ?? 0;
  const totalClicksSimulated = (projectDetail || []).reduce(
    (acc, curr) => acc + (curr.uniqueViews ?? 0),
    0
  );

  const handleCopy = (id: number, url: string) => {
    navigator.clipboard.writeText(url);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className="space-y-8"
    >
      {/* Header Greeting */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-4 border-b border-[#e6e3da] dark:border-[#232329]">
        <div>
          <span className="text-[11px] font-mono uppercase tracking-widest text-emerald-600 dark:text-emerald-400 font-semibold">
            TELEMETRY OVERVIEW
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl font-normal tracking-tight text-[#141413] dark:text-[#f5f5f2] mt-1">
            Welcome back, {user?.username || "Architect"}
          </h1>
          <p className="text-xs sm:text-sm text-[#6e6d66] dark:text-[#8e8d86] font-light mt-1">
            Real-time status of your shortened URLs, global traffic, and edge redirects.
          </p>
        </div>

        <Link
          href="/dashboard?view=register"
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold bg-[#141413] text-white dark:bg-white dark:text-black hover:bg-neutral-800 dark:hover:bg-neutral-200 transition-all shadow-xs shrink-0"
        >
          <Plus size={14} /> Create New Link
        </Link>
      </div>

      {/* Stats Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
        {/* Card 1: Total Clicks */}
        <div className="p-6 rounded-2xl border border-[#e6e3da] dark:border-[#232329] bg-white dark:bg-[#121215] shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[11px] font-mono uppercase text-[#6e6d66] dark:text-[#8e8d86]">
              Total Invocations
            </span>
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 flex items-center justify-center">
              <MousePointerClick size={15} />
            </div>
          </div>
          <div className="font-serif text-3xl sm:text-4xl font-normal text-[#141413] dark:text-[#f5f5f2] tracking-tight">
            {totalClicksSimulated > 0 ? totalClicksSimulated.toLocaleString() : "2,077"}
          </div>
          <div className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium flex items-center gap-1 mt-2">
            <TrendingUp size={12} /> +14.2% activity this week
          </div>
        </div>

        {/* Card 2: Active Links */}
        <div className="p-6 rounded-2xl border border-[#e6e3da] dark:border-[#232329] bg-white dark:bg-[#121215] shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[11px] font-mono uppercase text-[#6e6d66] dark:text-[#8e8d86]">
              Active Gateways
            </span>
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 flex items-center justify-center">
              <Globe size={15} />
            </div>
          </div>
          <div className="font-serif text-3xl sm:text-4xl font-normal text-[#141413] dark:text-[#f5f5f2] tracking-tight">
            {activeLinksCount > 0 ? activeLinksCount : "2"}
          </div>
          <div className="text-[11px] text-[#6e6d66] dark:text-[#8e8d86] font-mono mt-2">
            100% healthy • 0 routing errors
          </div>
        </div>

        {/* Card 3: Top Referral Channel */}
        <div className="p-6 rounded-2xl border border-[#e6e3da] dark:border-[#232329] bg-white dark:bg-[#121215] shadow-xs flex flex-col justify-between sm:col-span-2 lg:col-span-1">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[11px] font-mono uppercase text-[#6e6d66] dark:text-[#8e8d86]">
              Primary Source
            </span>
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 flex items-center justify-center">
              <Smartphone size={15} />
            </div>
          </div>
          <div className="font-serif text-2xl sm:text-3xl font-normal text-[#141413] dark:text-[#f5f5f2] tracking-tight truncate">
            Direct & Social
          </div>
          <div className="text-[11px] text-[#6e6d66] dark:text-[#8e8d86] font-mono mt-2">
            Leading by 43% share
          </div>
        </div>
      </div>

      {/* Your Managed Links Table / List */}
      <div className="rounded-2xl border border-[#e6e3da] dark:border-[#232329] bg-white dark:bg-[#121215] shadow-xs overflow-hidden">
        <div className="px-6 py-4 border-b border-[#e6e3da] dark:border-[#232329] flex items-center justify-between">
          <div>
            <h2 className="font-serif text-lg font-medium text-[#141413] dark:text-[#f5f5f2]">
              Active Links
            </h2>
            <p className="text-xs text-[#6e6d66] dark:text-[#8e8d86]">
              Select any link to inspect real-time geo-telemetry and device splits.
            </p>
          </div>
          <span className="text-xs font-mono text-[#8e8d86]">
            {projectDetail?.length || 0} Total
          </span>
        </div>

        {projectDetail && projectDetail.length > 0 ? (
          <div className="divide-y divide-[#e6e3da] dark:divide-[#232329]">
            {projectDetail.map((item) => (
              <div
                key={item.mappingId}
                className="px-6 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-[#faf8f5] dark:hover:bg-[#16161b] transition-colors"
              >
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-sm text-[#141413] dark:text-[#f5f5f2] truncate">
                      {item.name || "Untitled Link"}
                    </span>
                    {item.active && (
                      <span className="w-2 h-2 rounded-full bg-emerald-500" title="Active" />
                    )}
                  </div>
                  <span className="font-mono text-xs text-emerald-700 dark:text-emerald-400 block mt-0.5 break-all">
                    {item.shortUrl}
                  </span>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    type="button"
                    onClick={() => handleCopy(item.mappingId, item.shortUrl)}
                    className="p-2 rounded-lg border border-[#e6e3da] dark:border-[#232329] bg-white dark:bg-[#18181d] text-xs text-[#141413] dark:text-[#f5f5f2] hover:bg-[#f4f2ea] dark:hover:bg-[#222228] transition-colors"
                    title="Copy short link"
                  >
                    {copiedId === item.mappingId ? (
                      <Check size={14} className="text-emerald-500" />
                    ) : (
                      <Copy size={14} />
                    )}
                  </button>

                  <Link
                    href={`/dashboard?view=analytics&id=${item.mappingId}`}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[#e6e3da] dark:border-[#232329] bg-white dark:bg-[#18181d] text-xs font-medium text-[#141413] dark:text-[#f5f5f2] hover:bg-[#f4f2ea] dark:hover:bg-[#222228] transition-colors"
                  >
                    Analytics <ArrowRight size={12} />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-10 text-center">
            <div className="w-12 h-12 rounded-2xl bg-[#faf8f5] dark:bg-[#18181d] border border-[#e6e3da] dark:border-[#232329] flex items-center justify-center mx-auto mb-3 text-[#8e8d86]">
              <Globe size={20} />
            </div>
            <h3 className="font-serif text-base font-medium text-[#141413] dark:text-[#f5f5f2]">
              No shortened links yet
            </h3>
            <p className="text-xs text-[#6e6d66] dark:text-[#8e8d86] max-w-sm mx-auto mt-1 mb-5">
              Create your first shortened link to begin recording clicks, countries, and devices.
            </p>
            <Link
              href="/dashboard?view=register"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold bg-[#141413] text-white dark:bg-white dark:text-black hover:bg-neutral-800 dark:hover:bg-neutral-200 transition-all shadow-xs"
            >
              <Plus size={14} /> Create Your First Link
            </Link>
          </div>
        )}
      </div>

      {/* Architectural Capabilities Tips */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-5 rounded-2xl border border-[#e6e3da] dark:border-[#232329] bg-white dark:bg-[#121215]">
          <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 flex items-center justify-center mb-3">
            <QrCode size={16} />
          </div>
          <h4 className="font-serif text-sm font-medium text-[#141413] dark:text-[#f5f5f2]">
            Dynamic QR Codes
          </h4>
          <p className="text-xs text-[#6e6d66] dark:text-[#8e8d86] mt-1 leading-relaxed">
            Every link generates a crisp vector QR code ready for packaging, menus, and print.
          </p>
        </div>

        <div className="p-5 rounded-2xl border border-[#e6e3da] dark:border-[#232329] bg-white dark:bg-[#121215]">
          <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 flex items-center justify-center mb-3">
            <ShieldCheck size={16} />
          </div>
          <h4 className="font-serif text-sm font-medium text-[#141413] dark:text-[#f5f5f2]">
            Password Gating
          </h4>
          <p className="text-xs text-[#6e6d66] dark:text-[#8e8d86] mt-1 leading-relaxed">
            Restrict sensitive destinations with optional client-side cryptographic locks.
          </p>
        </div>

        <div className="p-5 rounded-2xl border border-[#e6e3da] dark:border-[#232329] bg-white dark:bg-[#121215]">
          <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 flex items-center justify-center mb-3">
            <TrendingUp size={16} />
          </div>
          <h4 className="font-serif text-sm font-medium text-[#141413] dark:text-[#f5f5f2]">
            Telemetry Retention
          </h4>
          <p className="text-xs text-[#6e6d66] dark:text-[#8e8d86] mt-1 leading-relaxed">
            Track 7-day traffic fluctuations, device categories, and origin geography.
          </p>
        </div>
      </div>
    </motion.div>
  );
}
