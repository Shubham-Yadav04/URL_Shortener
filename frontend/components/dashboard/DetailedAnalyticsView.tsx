"use client";

import { motion, AnimatePresence } from "motion/react";
import { useState, useMemo } from "react";
import {
  Globe,
  Smartphone,
  Laptop,
  ArrowLeft,
  Search,
  Compass,
  Monitor,
  Tablet,
} from "lucide-react";

interface DetailedAnalyticsViewProps {
  urlData: any;
  onBack: () => void;
}

type TabType = "country" | "device" | "platform";

export default function DetailedAnalyticsView({
  urlData,
  onBack,
}: DetailedAnalyticsViewProps) {
  const [activeTab, setActiveTab] = useState<TabType>("country");
  const [searchQuery, setSearchQuery] = useState<string>("");

  const totalClicks = urlData?.totalCount || 1248;

  // Granular analytics datasets
  const countryData = useMemo(
    () => [
      { code: "US", name: "United States", clicks: Math.round(totalClicks * 0.42), flag: "🇺🇸" },
      { code: "IN", name: "India", clicks: Math.round(totalClicks * 0.22), flag: "🇮🇳" },
      { code: "DE", name: "Germany", clicks: Math.round(totalClicks * 0.12), flag: "🇩🇪" },
      { code: "GB", name: "United Kingdom", clicks: Math.round(totalClicks * 0.1), flag: "🇬🇧" },
      { code: "JP", name: "Japan", clicks: Math.round(totalClicks * 0.07), flag: "🇯🇵" },
      { code: "CA", name: "Canada", clicks: Math.round(totalClicks * 0.04), flag: "🇨🇦" },
      { code: "FR", name: "France", clicks: Math.round(totalClicks * 0.03), flag: "🇫🇷" },
    ],
    [totalClicks]
  );

  const deviceData = useMemo(
    () => [
      { type: "Mobile", clicks: Math.round(totalClicks * 0.58), icon: Smartphone, percent: 58 },
      { type: "Desktop", clicks: Math.round(totalClicks * 0.34), icon: Monitor, percent: 34 },
      { type: "Tablet", clicks: Math.round(totalClicks * 0.08), icon: Tablet, percent: 8 },
    ],
    [totalClicks]
  );

  const osData = useMemo(
    () => [
      { name: "iOS", clicks: Math.round(totalClicks * 0.36), share: 36 },
      { name: "Android", clicks: Math.round(totalClicks * 0.31), share: 31 },
      { name: "Windows", clicks: Math.round(totalClicks * 0.20), share: 20 },
      { name: "macOS", clicks: Math.round(totalClicks * 0.10), share: 10 },
      { name: "Linux", clicks: Math.round(totalClicks * 0.03), share: 3 },
    ],
    [totalClicks]
  );

  const browserData = useMemo(
    () => [
      { name: "Chrome", clicks: Math.round(totalClicks * 0.52), share: 52 },
      { name: "Safari", clicks: Math.round(totalClicks * 0.32), share: 32 },
      { name: "Firefox", clicks: Math.round(totalClicks * 0.09), share: 9 },
      { name: "Edge", clicks: Math.round(totalClicks * 0.05), share: 5 },
      { name: "Opera", clicks: Math.round(totalClicks * 0.02), share: 2 },
    ],
    [totalClicks]
  );

  const filteredCountries = useMemo(() => {
    return countryData.filter(
      (c) =>
        c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.code.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [countryData, searchQuery]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.2 }}
      className="flex flex-col gap-6 w-full max-w-4xl mx-auto py-2"
    >
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/10">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="p-2 rounded-xl bg-white/5 border border-white/10 text-gray-300 hover:text-white hover:bg-white/10 transition-colors flex items-center gap-1.5 text-xs font-medium"
            title="Back to Overview"
          >
            <ArrowLeft size={14} />
            <span>Back</span>
          </button>

          <div>
            <h1 className="text-xl font-semibold text-white tracking-tight">
              Detailed Analytics
            </h1>
            <p className="text-xs text-gray-400 truncate max-w-md mt-0.5">
              {urlData?.projectName || "URL Breakdown"} &bull; {urlData?.longURL}
            </p>
          </div>
        </div>

        {/* Total Clicks Summary */}
        <div className="text-left sm:text-right">
          <span className="text-[11px] text-gray-400 font-normal uppercase tracking-wider block">
            Total Traffic
          </span>
          <span className="text-lg font-semibold text-white">
            {totalClicks.toLocaleString()} <span className="text-xs font-normal text-gray-400">clicks</span>
          </span>
        </div>
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="flex justify-center">
        <nav
          className="flex items-center gap-1 p-1 bg-white/[0.03] border border-white/10 rounded-xl w-full sm:w-auto"
          aria-label="Analytics Tabs"
        >
          <button
            onClick={() => setActiveTab("country")}
            className={`flex items-center justify-center gap-2 px-5 py-2 rounded-lg text-xs font-medium transition-all flex-1 sm:flex-initial ${
              activeTab === "country"
                ? "bg-white text-black shadow-sm"
                : "text-gray-400 hover:text-white"
            }`}
          >
            <Globe size={14} />
            <span>Country</span>
          </button>

          <button
            onClick={() => setActiveTab("device")}
            className={`flex items-center justify-center gap-2 px-5 py-2 rounded-lg text-xs font-medium transition-all flex-1 sm:flex-initial ${
              activeTab === "device"
                ? "bg-white text-black shadow-sm"
                : "text-gray-400 hover:text-white"
            }`}
          >
            <Smartphone size={14} />
            <span>Device</span>
          </button>

          <button
            onClick={() => setActiveTab("platform")}
            className={`flex items-center justify-center gap-2 px-5 py-2 rounded-lg text-xs font-medium transition-all flex-1 sm:flex-initial ${
              activeTab === "platform"
                ? "bg-white text-black shadow-sm"
                : "text-gray-400 hover:text-white"
            }`}
          >
            <Laptop size={14} />
            <span>Platform</span>
          </button>
        </nav>
      </div>

      {/* Main Tab Content */}
      <AnimatePresence mode="wait">
        {/* COUNTRY TAB */}
        {activeTab === "country" && (
          <motion.div
            key="country-tab"
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.15 }}
            className="flex flex-col gap-4"
          >
            <div className="bg-white/[0.02] border border-white/10 p-5 rounded-2xl flex flex-col gap-4">
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-2 text-sm font-medium text-white">
                  <Globe size={16} className="text-gray-400" />
                  <span>Country Breakdown</span>
                </div>
                <div className="relative w-44 sm:w-56">
                  <Search
                    size={13}
                    className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
                  />
                  <input
                    type="text"
                    placeholder="Search country..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-black/40 border border-white/10 pl-7 pr-2.5 py-1 rounded-lg text-xs text-white placeholder:text-gray-500 focus:outline-none focus:border-white/30"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-2.5 mt-1">
                {filteredCountries.map((c) => {
                  const percent = Math.round((c.clicks / totalClicks) * 100);
                  return (
                    <div
                      key={c.code}
                      className="p-3 rounded-xl bg-white/[0.02] border border-white/5 flex flex-col gap-2 hover:bg-white/[0.04] transition-colors"
                    >
                      <div className="flex items-center justify-between text-xs font-normal">
                        <div className="flex items-center gap-2 text-gray-200">
                          <span className="text-sm">{c.flag}</span>
                          <span className="font-medium text-white">{c.name}</span>
                        </div>
                        <div className="flex items-center gap-3 text-gray-400">
                          <span>{c.clicks.toLocaleString()} clicks</span>
                          <span className="text-white font-medium w-8 text-right">
                            {percent}%
                          </span>
                        </div>
                      </div>
                      <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-white/60 rounded-full transition-all duration-300"
                          style={{ width: `${Math.max(percent, 2)}%` }}
                        />
                      </div>
                    </div>
                  );
                })}

                {filteredCountries.length === 0 && (
                  <div className="text-center py-6 text-xs text-gray-400">
                    No matching countries found.
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}

        {/* DEVICE TAB */}
        {activeTab === "device" && (
          <motion.div
            key="device-tab"
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.15 }}
            className="flex flex-col gap-4"
          >
            <div className="bg-white/[0.02] border border-white/10 p-5 rounded-2xl flex flex-col gap-4">
              <div className="flex items-center gap-2 text-sm font-medium text-white">
                <Smartphone size={16} className="text-gray-400" />
                <span>Device Category Distribution</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {deviceData.map((d) => {
                  const Icon = d.icon;
                  return (
                    <div
                      key={d.type}
                      className="p-4 rounded-xl bg-white/[0.02] border border-white/5 flex flex-col justify-between gap-3"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-medium text-gray-300">
                          {d.type}
                        </span>
                        <Icon size={16} className="text-gray-400" />
                      </div>
                      <div>
                        <div className="text-lg font-semibold text-white">
                          {d.percent}%
                        </div>
                        <div className="text-xs text-gray-400 font-normal">
                          {d.clicks.toLocaleString()} clicks
                        </div>
                      </div>
                      <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden mt-1">
                        <div
                          className="h-full bg-white/60 rounded-full transition-all duration-300"
                          style={{ width: `${d.percent}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </motion.div>
        )}

        {/* PLATFORM TAB */}
        {activeTab === "platform" && (
          <motion.div
            key="platform-tab"
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.15 }}
            className="grid grid-cols-1 md:grid-cols-2 gap-4"
          >
            {/* OS Breakdown */}
            <div className="bg-white/[0.02] border border-white/10 p-5 rounded-2xl flex flex-col gap-4">
              <div className="flex items-center gap-2 text-sm font-medium text-white">
                <Laptop size={16} className="text-gray-400" />
                <span>Operating Systems</span>
              </div>

              <div className="flex flex-col gap-2.5">
                {osData.map((os) => (
                  <div
                    key={os.name}
                    className="p-3 rounded-xl bg-white/[0.02] border border-white/5 flex flex-col gap-2"
                  >
                    <div className="flex items-center justify-between text-xs font-normal">
                      <span className="font-medium text-white">{os.name}</span>
                      <div className="flex items-center gap-3 text-gray-400">
                        <span>{os.clicks.toLocaleString()} clicks</span>
                        <span className="text-white font-medium w-8 text-right">
                          {os.share}%
                        </span>
                      </div>
                    </div>
                    <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-white/60 rounded-full transition-all duration-300"
                        style={{ width: `${os.share}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Browser Share */}
            <div className="bg-white/[0.02] border border-white/10 p-5 rounded-2xl flex flex-col gap-4">
              <div className="flex items-center gap-2 text-sm font-medium text-white">
                <Compass size={16} className="text-gray-400" />
                <span>Browsers</span>
              </div>

              <div className="flex flex-col gap-2.5">
                {browserData.map((b) => (
                  <div
                    key={b.name}
                    className="p-3 rounded-xl bg-white/[0.02] border border-white/5 flex flex-col gap-2"
                  >
                    <div className="flex items-center justify-between text-xs font-normal">
                      <span className="font-medium text-white">{b.name}</span>
                      <div className="flex items-center gap-3 text-gray-400">
                        <span>{b.clicks.toLocaleString()} clicks</span>
                        <span className="text-white font-medium w-8 text-right">
                          {b.share}%
                        </span>
                      </div>
                    </div>
                    <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-white/60 rounded-full transition-all duration-300"
                        style={{ width: `${b.share}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
