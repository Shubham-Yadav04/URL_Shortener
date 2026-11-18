"use client";

import { motion, AnimatePresence } from "motion/react";
import { useState, useMemo, useEffect } from "react";
import {
  Globe,
  Smartphone,
  Laptop,
  ArrowLeft,
  Search,
  Monitor,
  Tablet,
  BarChart2,
  PieChart,
} from "lucide-react";
import axios from "axios";
import { BACKEND_URL } from "@/lib/backend";

interface DetailedAnalyticsViewProps {
  urlData: {
    projectName?: string;
    longUrl?: string;
    totalCount?: number;
  };
  id: string;
  onBack: () => void;
}

type TabType = "country" | "device" | "platform";

interface CountryAnalytic {
  mappingId: number;
  country: string;
  count: number;
}

interface DeviceAnalytic {
  mappingId: number;
  device: string;
  count: number;
}

interface PlatformAnalytic {
  mappingId: number;
  platform: string;
  count: number;
}

export default function DetailedAnalyticsView({
  urlData,
  id,
  onBack,
}: DetailedAnalyticsViewProps) {
  const [activeTab, setActiveTab] = useState<TabType>("country");
  const [searchQuery, setSearchQuery] = useState<string>("");

  const [countryData, setCountryData] = useState<CountryAnalytic[]>([]);
  const [deviceData, setDeviceData] = useState<DeviceAnalytic[]>([]);
  const [platformData, setPlatformData] = useState<PlatformAnalytic[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const totalClicks = urlData?.totalCount || 0;

  useEffect(() => {
    if (!id) return;

    const baseUrl = `${BACKEND_URL}/`;

    const fetchAnalyticsData = async () => {
      setLoading(true);
      try {
        const [countryRes, deviceRes, platformRes] = await Promise.all([
          axios.get<CountryAnalytic[]>(`${baseUrl}mapping/${id}/country/`, { withCredentials: true }).catch(() => ({ data: [] })),
          axios.get<DeviceAnalytic[]>(`${baseUrl}mapping/${id}/device/`, { withCredentials: true }).catch(() => ({ data: [] })),
          axios.get<PlatformAnalytic[]>(`${baseUrl}mapping/${id}/platform/`, { withCredentials: true }).catch(() => ({ data: [] })),
        ]);
        setCountryData(countryRes.data || []);
        setDeviceData(deviceRes.data || []);
        setPlatformData(platformRes.data || []);
      } catch (error) {
        console.error("Failed to fetch analytics data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAnalyticsData();
  }, [id]);

  const filteredCountries = useMemo(() => {
    return countryData.filter((c) =>
      (c.country || "").toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [countryData, searchQuery]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.2 }}
      className="flex flex-col gap-6 w-full max-w-4xl mx-auto"
    >
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#e6e3da] dark:border-[#232329]">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onBack}
            className="p-2.5 rounded-xl border border-[#e6e3da] dark:border-[#232329] bg-white dark:bg-[#121215] text-[#141413] dark:text-[#f5f5f2] hover:bg-[#f4f2ea] dark:hover:bg-[#1c1c22] transition-colors flex items-center gap-1.5 text-xs font-semibold shadow-xs"
            title="Back to Telemetry Overview"
          >
            <ArrowLeft size={14} />
            <span>Overview</span>
          </button>

          <div className="min-w-0">
            <h1 className="font-serif text-2xl font-normal text-[#141413] dark:text-[#f5f5f2] tracking-tight">
              Detailed Telemetry Breakdown
            </h1>
            <p className="text-xs text-[#6e6d66] dark:text-[#8e8d86] font-mono truncate max-w-md mt-0.5">
              {urlData?.projectName || "Node Breakdown"} &bull; {urlData?.longUrl}
            </p>
          </div>
        </div>

        {/* Total Clicks Pill */}
        <div className="text-left sm:text-right shrink-0">
          <span className="text-[10px] text-[#8e8d86] font-mono uppercase tracking-wider block">
            Cumulative Traffic
          </span>
          <span className="font-serif text-2xl font-normal text-[#141413] dark:text-[#f5f5f2]">
            {totalClicks.toLocaleString()}{" "}
            <span className="text-xs font-mono text-[#8e8d86]">clicks</span>
          </span>
        </div>
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="flex justify-center sm:justify-start">
        <nav
          className="flex items-center gap-1 p-1 bg-[#f4f2ea] dark:bg-[#141418] border border-[#e6e3da] dark:border-[#232329] rounded-2xl w-full sm:w-auto"
          aria-label="Analytics Tabs"
        >
          <button
            type="button"
            onClick={() => setActiveTab("country")}
            className={`flex items-center justify-center gap-2 px-5 py-2 rounded-xl text-xs font-semibold transition-all flex-1 sm:flex-initial ${
              activeTab === "country"
                ? "bg-[#141413] text-white dark:bg-white dark:text-black shadow-xs"
                : "text-[#6e6d66] dark:text-[#8e8d86] hover:text-[#141413] dark:hover:text-white"
            }`}
          >
            <Globe size={14} />
            <span>Origin Geography</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("device")}
            className={`flex items-center justify-center gap-2 px-5 py-2 rounded-xl text-xs font-semibold transition-all flex-1 sm:flex-initial ${
              activeTab === "device"
                ? "bg-[#141413] text-white dark:bg-white dark:text-black shadow-xs"
                : "text-[#6e6d66] dark:text-[#8e8d86] hover:text-[#141413] dark:hover:text-white"
            }`}
          >
            <Smartphone size={14} />
            <span>Device Type</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("platform")}
            className={`flex items-center justify-center gap-2 px-5 py-2 rounded-xl text-xs font-semibold transition-all flex-1 sm:flex-initial ${
              activeTab === "platform"
                ? "bg-[#141413] text-white dark:bg-white dark:text-black shadow-xs"
                : "text-[#6e6d66] dark:text-[#8e8d86] hover:text-[#141413] dark:hover:text-white"
            }`}
          >
            <Laptop size={14} />
            <span>Operating Platform</span>
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
            <div className="rounded-3xl border border-[#e6e3da] dark:border-[#232329] bg-white dark:bg-[#121215] p-6 sm:p-8 shadow-xs flex flex-col gap-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[#e6e3da] dark:border-[#232329]">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 flex items-center justify-center">
                    <Globe size={15} />
                  </div>
                  <div>
                    <h3 className="font-serif text-lg font-normal text-[#141413] dark:text-[#f5f5f2]">
                      Geographic Origin Distribution
                    </h3>
                    <p className="text-xs text-[#6e6d66] dark:text-[#8e8d86]">
                      Traffic clustered by client IP country header
                    </p>
                  </div>
                </div>

                <div className="relative w-full sm:w-60">
                  <Search
                    size={14}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-[#8e8d86] pointer-events-none"
                  />
                  <input
                    type="text"
                    placeholder="Search country..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-[#faf8f5] dark:bg-[#18181d] border border-[#e6e3da] dark:border-[#232329] pl-8 pr-3 py-1.5 rounded-xl text-xs text-[#141413] dark:text-[#f5f5f2] placeholder-[#8e8d86] focus:outline-none focus:ring-1 focus:ring-emerald-500/50 font-sans"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-3">
                {loading ? (
                  <div className="text-center py-10 font-mono text-xs text-[#8e8d86]">
                    Aggregating geographic data...
                  </div>
                ) : (
                  <>
                    {filteredCountries.map((c, idx) => {
                      const count = c.count || 0;
                      const percent = totalClicks > 0 ? Math.round((count / totalClicks) * 100) : 0;
                      return (
                        <div
                          key={idx}
                          className="p-3.5 rounded-xl border border-[#e6e3da] dark:border-[#232329] bg-[#faf8f5]/60 dark:bg-[#16161b]/60 flex flex-col gap-2 hover:bg-[#f4f2ea] dark:hover:bg-[#1c1c22] transition-colors"
                        >
                          <div className="flex items-center justify-between text-xs font-normal">
                            <div className="flex items-center gap-2">
                              <Globe size={14} className="text-[#8e8d86]" />
                              <span className="font-semibold text-[#141413] dark:text-[#f5f5f2]">
                                {c.country || "Unresolved Location"}
                              </span>
                            </div>
                            <div className="flex items-center gap-3 font-mono text-[#6e6d66] dark:text-[#8e8d86]">
                              <span>{count.toLocaleString()} clicks</span>
                              <span className="font-semibold text-[#141413] dark:text-[#f5f5f2] w-9 text-right">
                                {percent}%
                              </span>
                            </div>
                          </div>
                          <div className="w-full h-1.5 bg-[#e6e3da] dark:bg-[#232329] rounded-full overflow-hidden">
                            <div
                              className="h-full bg-emerald-600 dark:bg-emerald-400 rounded-full transition-all duration-300"
                              style={{ width: `${Math.max(percent, 2)}%` }}
                            />
                          </div>
                        </div>
                      );
                    })}

                    {filteredCountries.length === 0 && (
                      <div className="text-center py-8 font-mono text-xs text-[#8e8d86]">
                        No matching countries recorded for this link.
                      </div>
                    )}
                  </>
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
            <div className="rounded-3xl border border-[#e6e3da] dark:border-[#232329] bg-white dark:bg-[#121215] p-6 sm:p-8 shadow-xs flex flex-col gap-5">
              <div className="flex items-center gap-2 pb-4 border-b border-[#e6e3da] dark:border-[#232329]">
                <div className="w-7 h-7 rounded-lg bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 flex items-center justify-center">
                  <Smartphone size={15} />
                </div>
                <div>
                  <h3 className="font-serif text-lg font-normal text-[#141413] dark:text-[#f5f5f2]">
                    Device Category Telemetry
                  </h3>
                  <p className="text-xs text-[#6e6d66] dark:text-[#8e8d86]">
                    Breakdown of desktop, mobile, and tablet invocations
                  </p>
                </div>
              </div>

              {loading ? (
                <div className="text-center py-10 font-mono text-xs text-[#8e8d86]">
                  Parsing device headers...
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {deviceData.map((d, idx) => {
                    const count = d.count || 0;
                    const percent = totalClicks > 0 ? Math.round((count / totalClicks) * 100) : 0;
                    const deviceName = d.device || "Other";
                    const Icon = deviceName.toLowerCase().includes("mobile")
                      ? Smartphone
                      : deviceName.toLowerCase().includes("tablet")
                      ? Tablet
                      : Monitor;

                    return (
                      <div
                        key={idx}
                        className="p-5 rounded-2xl border border-[#e6e3da] dark:border-[#232329] bg-[#faf8f5]/60 dark:bg-[#16161b]/60 flex flex-col justify-between gap-4"
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-semibold text-[#141413] dark:text-[#f5f5f2] capitalize">
                            {deviceName}
                          </span>
                          <Icon size={16} className="text-[#8e8d86]" />
                        </div>
                        <div>
                          <div className="font-serif text-2xl font-normal text-[#141413] dark:text-[#f5f5f2]">
                            {percent}%
                          </div>
                          <div className="text-[11px] font-mono text-[#6e6d66] dark:text-[#8e8d86]">
                            {count.toLocaleString()} clicks
                          </div>
                        </div>
                        <div className="w-full h-1.5 bg-[#e6e3da] dark:bg-[#232329] rounded-full overflow-hidden">
                          <div
                            className="h-full bg-emerald-600 dark:bg-emerald-400 rounded-full transition-all duration-300"
                            style={{ width: `${Math.max(percent, 2)}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}

                  {deviceData.length === 0 && (
                    <div className="col-span-3 text-center py-8 font-mono text-xs text-[#8e8d86]">
                      No device telemetry registered yet.
                    </div>
                  )}
                </div>
              )}
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
            className="flex flex-col gap-4"
          >
            <div className="rounded-3xl border border-[#e6e3da] dark:border-[#232329] bg-white dark:bg-[#121215] p-6 sm:p-8 shadow-xs flex flex-col gap-5">
              <div className="flex items-center gap-2 pb-4 border-b border-[#e6e3da] dark:border-[#232329]">
                <div className="w-7 h-7 rounded-lg bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 flex items-center justify-center">
                  <Laptop size={15} />
                </div>
                <div>
                  <h3 className="font-serif text-lg font-normal text-[#141413] dark:text-[#f5f5f2]">
                    Operating System & Platform Breakdown
                  </h3>
                  <p className="text-xs text-[#6e6d66] dark:text-[#8e8d86]">
                    Distribution across iOS, Android, macOS, Windows, and Linux
                  </p>
                </div>
              </div>

              {loading ? (
                <div className="text-center py-10 font-mono text-xs text-[#8e8d86]">
                  Parsing platform signatures...
                </div>
              ) : (
                <div className="flex flex-col gap-3">
                  {platformData.map((p, idx) => {
                    const count = p.count || 0;
                    const share = totalClicks > 0 ? Math.round((count / totalClicks) * 100) : 0;
                    return (
                      <div
                        key={idx}
                        className="p-3.5 rounded-xl border border-[#e6e3da] dark:border-[#232329] bg-[#faf8f5]/60 dark:bg-[#16161b]/60 flex flex-col gap-2 hover:bg-[#f4f2ea] dark:hover:bg-[#1c1c22] transition-colors"
                      >
                        <div className="flex items-center justify-between text-xs font-normal">
                          <span className="font-semibold text-[#141413] dark:text-[#f5f5f2]">
                            {p.platform || "Unspecified OS"}
                          </span>
                          <div className="flex items-center gap-3 font-mono text-[#6e6d66] dark:text-[#8e8d86]">
                            <span>{count.toLocaleString()} clicks</span>
                            <span className="font-semibold text-[#141413] dark:text-[#f5f5f2] w-9 text-right">
                              {share}%
                            </span>
                          </div>
                        </div>
                        <div className="w-full h-1.5 bg-[#e6e3da] dark:bg-[#232329] rounded-full overflow-hidden">
                          <div
                            className="h-full bg-emerald-600 dark:bg-emerald-400 rounded-full transition-all duration-300"
                            style={{ width: `${Math.max(share, 2)}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}

                  {platformData.length === 0 && (
                    <div className="text-center py-8 font-mono text-xs text-[#8e8d86]">
                      No platform records found.
                    </div>
                  )}
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
