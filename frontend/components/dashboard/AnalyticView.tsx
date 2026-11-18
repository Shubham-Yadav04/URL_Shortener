"use client";

import { motion } from "motion/react";
import { useEffect, useState } from "react";
import {
  Copy,
  Check,
  Globe,
  Smartphone,
  MousePointerClick,
  Sparkles,
  ArrowRight,
  ExternalLink,
  Laptop,
  Users,
} from "lucide-react";
import { QRCodeSVG } from "qrcode.react";
import { useAnalytic } from "@/context/AnalyticContext";
import { useAuth, ProjectDetail } from "@/context/AuthContext";
import DetailedAnalyticsView from "@/components/dashboard/DetailedAnalyticsView";
import Last7DaysBarGraph from "@/components/dashboard/Last7DaysBarGraph";
import { BACKEND_URL } from "@/lib/backend";

interface AnalyticsData {
  id: string;
  totalCount: number;
  topCountry: string;
  topDevice: string;
  topPlatform: string;
  uniqueViews: number;
  projectName: string;
  longUrl: string;
  shortUrl: string;
}

export default function AnalyticsView({ id }: { id: string }) {
  const [urlData, setUrlData] = useState<AnalyticsData | null>(null);
  const [showDetailedView, setShowDetailedView] = useState<boolean>(false);
  const { setProjectSummary } = useAnalytic();

  useEffect(() => {
    const fetchProjectData = async () => {
      try {
        const [summaryResponse, mappingResponse] = await Promise.all([
          fetch(`${BACKEND_URL}/analytic/summary/${id}`, { credentials: "include" }),
          fetch(`${BACKEND_URL}/mapping/${id}`, { credentials: "include" }),
        ]);
        if (!summaryResponse.ok || !mappingResponse.ok) {
          throw new Error("Unable to load this link's analytics.");
        }
        const [summary, mapping] = await Promise.all([
          summaryResponse.json(),
          mappingResponse.json(),
        ]);
        const data: AnalyticsData = {
          ...summary,
          ...mapping,
          id,
          totalCount: summary.totalCount ?? 0,
          topCountry: summary.topCountry ?? "",
          topDevice: summary.topDevice ?? "",
          topPlatform: summary.topPlatform ?? "",
          uniqueViews: summary.uniqueViews ?? 0,
        };
        setUrlData(data);
        setProjectSummary((previous) => [
          ...previous.filter((project) => project.id !== id),
          data,
        ]);
      } catch (error) {
        console.error("Error fetching project analytics:", error);
      }
    };
    fetchProjectData();
  }, [id, setProjectSummary]);

  if (urlData === null) {
    return (
      <div className="w-full py-28 flex flex-col items-center justify-center gap-3">
        <div className="w-8 h-8 rounded-full border-2 border-emerald-500 border-t-transparent animate-spin" />
        <p className="font-mono text-xs text-[#8e8d86]">Fetching edge telemetry...</p>
      </div>
    );
  }

  if (showDetailedView) {
    return (
      <DetailedAnalyticsView
        urlData={urlData}
        id={id}
        onBack={() => setShowDetailedView(false)}
      />
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="space-y-8"
    >
      {/* Editorial Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-5 border-b border-[#e6e3da] dark:border-[#232329]">
        <div className="min-w-0">
          <span className="text-[11px] font-mono uppercase tracking-widest text-emerald-600 dark:text-emerald-400 font-semibold">
            TELEMETRY NODE #{id}
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl font-normal tracking-tight text-[#141413] dark:text-[#f5f5f2] mt-1 mb-1 truncate">
            {urlData.projectName || "Link Analytics"}
          </h1>
          <p className="text-xs text-[#6e6d66] dark:text-[#8e8d86] font-mono truncate max-w-2xl">
            Target: {urlData.longUrl}
          </p>
        </div>

        {/* Detailed Analytics Switch */}
        <button
          type="button"
          onClick={() => setShowDetailedView(true)}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-semibold bg-[#141413] text-white dark:bg-white dark:text-black hover:bg-neutral-800 dark:hover:bg-neutral-200 transition-all shadow-xs shrink-0"
        >
          <Sparkles size={14} className="text-amber-400" />
          <span>Detailed Breakdown</span>
          <ArrowRight size={14} />
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
        <div className="lg:col-span-2 space-y-6 sm:space-y-8">
          {/* Key Metrics Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Total Clicks */}
            <div className="p-5 rounded-2xl border border-[#e6e3da] dark:border-[#232329] bg-white dark:bg-[#121215] shadow-xs">
              <div className="flex items-center justify-between text-[#6e6d66] dark:text-[#8e8d86] text-xs font-mono mb-2">
                <span className="uppercase">Total Invocations</span>
                <MousePointerClick size={15} />
              </div>
              <div className="font-serif text-3xl sm:text-4xl font-normal text-[#141413] dark:text-[#f5f5f2] tracking-tight">
                {(urlData.totalCount || 0).toLocaleString()}
              </div>
              <p className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium mt-1">
                Edge 302 redirects executed
              </p>
            </div>

            {/* Unique Visitors */}
            <div className="p-5 rounded-2xl border border-[#e6e3da] dark:border-[#232329] bg-white dark:bg-[#121215] shadow-xs">
              <div className="flex items-center justify-between text-[#6e6d66] dark:text-[#8e8d86] text-xs font-mono mb-2">
                <span className="uppercase">Unique Visitors</span>
                <Users size={15} />
              </div>
              <div className="font-serif text-3xl sm:text-4xl font-normal text-[#141413] dark:text-[#f5f5f2] tracking-tight">
                {(urlData.uniqueViews || 0).toLocaleString()}
              </div>
              <p className="text-[11px] text-[#8e8d86] font-mono mt-1">
                HyperLogLog probabilistic card
              </p>
            </div>

            {/* Top Country */}
            <div className="p-5 rounded-2xl border border-[#e6e3da] dark:border-[#232329] bg-white dark:bg-[#121215] shadow-xs">
              <div className="flex items-center justify-between text-[#6e6d66] dark:text-[#8e8d86] text-xs font-mono mb-2">
                <span className="uppercase">Dominant Origin</span>
                <Globe size={15} />
              </div>
              <div className="font-serif text-2xl font-normal text-[#141413] dark:text-[#f5f5f2] tracking-tight truncate">
                {urlData.topCountry || "Pending Data"}
              </div>
              <p className="text-[11px] text-[#8e8d86] font-mono mt-1">
                Resolved by Cloud IP geolocation
              </p>
            </div>

            {/* Top Device / Platform */}
            <div className="p-5 rounded-2xl border border-[#e6e3da] dark:border-[#232329] bg-white dark:bg-[#121215] shadow-xs">
              <div className="flex items-center justify-between text-[#6e6d66] dark:text-[#8e8d86] text-xs font-mono mb-2">
                <span className="uppercase">Device & Platform</span>
                <Laptop size={15} />
              </div>
              <div className="font-serif text-2xl font-normal text-[#141413] dark:text-[#f5f5f2] tracking-tight truncate">
                {urlData.topDevice || urlData.topPlatform
                  ? `${urlData.topDevice || "Unknown"} • ${urlData.topPlatform || ""}`
                  : "Pending Data"}
              </div>
              <p className="text-[11px] text-[#8e8d86] font-mono mt-1">
                User-Agent client categorization
              </p>
            </div>
          </div>

          {/* 7-Day Histogram Component */}
          <Last7DaysBarGraph id={id} />
        </div>

        {/* Side Panel: QR & Direct URL Details */}
        <div className="lg:col-span-1">
          <UrlDetails id={id} />
        </div>
      </div>
    </motion.div>
  );
}

function UrlDetails({ id }: { id: string }) {
  const { projectDetail } = useAuth();
  const [copied, setCopied] = useState(false);
  const shortUrl =
    projectDetail?.find((project: ProjectDetail) => project.mappingId === Number(id))?.shortUrl ?? "";

  return (
    <div className="p-6 rounded-3xl border border-[#e6e3da] dark:border-[#232329] bg-white dark:bg-[#121215] shadow-xs sticky top-20 space-y-6">
      <div>
        <span className="text-[10px] font-mono uppercase tracking-widest text-emerald-600 dark:text-emerald-400 font-semibold">
          LIVE ENDPOINT
        </span>
        <h3 className="font-serif text-lg font-medium text-[#141413] dark:text-[#f5f5f2] mt-0.5">
          Public Gateway
        </h3>
      </div>

      <div className="p-3.5 rounded-xl border border-[#e6e3da] dark:border-[#232329] bg-[#faf8f5] dark:bg-[#18181d] flex items-center justify-between gap-2">
        <span className="font-mono text-xs sm:text-sm font-semibold text-emerald-700 dark:text-emerald-400 truncate">
          {shortUrl || "shorten.it/..."}
        </span>
        <button
          type="button"
          onClick={() => {
            if (shortUrl) {
              navigator.clipboard.writeText(shortUrl);
              setCopied(true);
              setTimeout(() => setCopied(false), 2000);
            }
          }}
          className="p-2 rounded-lg border border-[#e6e3da] dark:border-[#232329] bg-white dark:bg-[#121215] text-[#141413] dark:text-[#f5f5f2] hover:bg-[#f4f2ea] dark:hover:bg-[#202025] transition-colors shrink-0"
          title="Copy short link"
        >
          {copied ? <Check size={14} className="text-emerald-500" /> : <Copy size={14} />}
        </button>
      </div>

      <div>
        <span className="text-[10px] font-mono uppercase tracking-widest text-[#8e8d86] block mb-3 text-center">
          Vector SVG QR Code
        </span>
        <div className="bg-white p-3.5 rounded-xl border border-black/10 shadow-xs w-fit mx-auto">
          {shortUrl ? (
            <QRCodeSVG value={shortUrl} size={160} />
          ) : (
            <div className="w-[160px] h-[160px] flex items-center justify-center text-xs text-[#8e8d86]">
              Loading...
            </div>
          )}
        </div>
        <p className="text-[11px] text-[#6e6d66] dark:text-[#8e8d86] text-center mt-2.5 font-mono">
          Ready for print, menus, and media
        </p>
      </div>
    </div>
  );
}
