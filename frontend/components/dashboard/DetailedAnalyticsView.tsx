"use client";

import { motion, AnimatePresence } from "motion/react";
import { useState, useMemo, useEffect } from "react";
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
import axios from "axios";

interface DetailedAnalyticsViewProps {
  urlData: any;
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
    if (!urlData?.id) return;

    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8080";
    const baseUrl = backendUrl.endsWith("/") ? backendUrl : `${backendUrl}/`;

    const fetchAnalyticsData = async () => {
      setLoading(true);
      try {
        const [countryRes, deviceRes, platformRes] = await Promise.all([
          axios.get<CountryAnalytic[]>(`${baseUrl}mapping/${urlData.id}/country/`).catch(() => ({ data: [] })),
          axios.get<DeviceAnalytic[]>(`${baseUrl}mapping/${urlData.id}/device/`).catch(() => ({ data: [] })),
          axios.get<PlatformAnalytic[]>(`${baseUrl}mapping/${urlData.id}/platform/`).catch(() => ({ data: [] })),
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
  }, [urlData?.id]);

  const filteredCountries = useMemo(() => {
    return countryData.filter((c) =>
      (c.country || "").toLowerCase().includes(searchQuery.toLowerCase())
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
                {loading ? (
                  <div className="text-center py-6 text-xs text-gray-400">Loading country analytics...</div>
                ) : (
                  <>
                    {filteredCountries.map((c, idx) => {
                      const count = c.count || 0;
                      const percent = totalClicks > 0 ? Math.round((count / totalClicks) * 100) : 0;
                      return (
                        <div
                          key={c.mappingId || idx}
                          className="p-3 rounded-xl bg-white/[0.02] border border-white/5 flex flex-col gap-2 hover:bg-white/[0.04] transition-colors"
                        >
                          <div className="flex items-center justify-between text-xs font-normal">
                            <div className="flex items-center gap-2 text-gray-200">
                              <Globe size={14} className="text-gray-400" />
                              <span className="font-medium text-white">{c.country || "Unknown"}</span>
                            </div>
                            <div className="flex items-center gap-3 text-gray-400">
                              <span>{count.toLocaleString()} clicks</span>
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
            <div className="bg-white/[0.02] border border-white/10 p-5 rounded-2xl flex flex-col gap-4">
              <div className="flex items-center gap-2 text-sm font-medium text-white">
                <Smartphone size={16} className="text-gray-400" />
                <span>Device Category Distribution</span>
              </div>

              {loading ? (
                <div className="text-center py-6 text-xs text-gray-400">Loading device analytics...</div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
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
                        key={d.mappingId || idx}
                        className="p-4 rounded-xl bg-white/[0.02] border border-white/5 flex flex-col justify-between gap-3"
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-medium text-gray-300">
                            {deviceName}
                          </span>
                          <Icon size={16} className="text-gray-400" />
                        </div>
                        <div>
                          <div className="text-lg font-semibold text-white">
                            {percent}%
                          </div>
                          <div className="text-xs text-gray-400 font-normal">
                            {count.toLocaleString()} clicks
                          </div>
                        </div>
                        <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden mt-1">
                          <div
                            className="h-full bg-white/60 rounded-full transition-all duration-300"
                            style={{ width: `${Math.max(percent, 2)}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}

                  {deviceData.length === 0 && (
                    <div className="col-span-3 text-center py-6 text-xs text-gray-400">
                      No device analytics found.
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
            <div className="bg-white/[0.02] border border-white/10 p-5 rounded-2xl flex flex-col gap-4">
              <div className="flex items-center gap-2 text-sm font-medium text-white">
                <Laptop size={16} className="text-gray-400" />
                <span>Platform Breakdown</span>
              </div>

              {loading ? (
                <div className="text-center py-6 text-xs text-gray-400">Loading platform analytics...</div>
              ) : (
                <div className="flex flex-col gap-2.5">
                  {platformData.map((p, idx) => {
                    const count = p.count || 0;
                    const share = totalClicks > 0 ? Math.round((count / totalClicks) * 100) : 0;
                    return (
                      <div
                        key={p.mappingId || idx}
                        className="p-3 rounded-xl bg-white/[0.02] border border-white/5 flex flex-col gap-2"
                      >
                        <div className="flex items-center justify-between text-xs font-normal">
                          <span className="font-medium text-white">{p.platform || "Unknown"}</span>
                          <div className="flex items-center gap-3 text-gray-400">
                            <span>{count.toLocaleString()} clicks</span>
                            <span className="text-white font-medium w-8 text-right">
                              {share}%
                            </span>
                          </div>
                        </div>
                        <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-white/60 rounded-full transition-all duration-300"
                            style={{ width: `${Math.max(share, 2)}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}

                  {platformData.length === 0 && (
                    <div className="text-center py-6 text-xs text-gray-400">
                      No platform analytics found.
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

