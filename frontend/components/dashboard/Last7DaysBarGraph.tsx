"use client";

import { useEffect, useState } from "react";
import { BarChart3, TrendingUp } from "lucide-react";

export interface DailyCountDTO {
  day?: string;
  Day?: string;
  count: number;
}

interface Last7DaysBarGraphProps {
  id: string;
  className?: string;
}

export default function Last7DaysBarGraph({ id, className = "" }: Last7DaysBarGraphProps) {
  const [dailyData, setDailyData] = useState<DailyCountDTO[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;

    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8080/";
    const baseUrl = backendUrl.endsWith("/") ? backendUrl : `${backendUrl}/`;

    const fetchLast7DaysAnalytics = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(`${baseUrl}analytic/7Day/${id}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
        });

        if (!response.ok) {
         console.log(`Error ${response.status}: ${response.statusText}`);
        }

        const data = await response.json();
        console.log("Response from last 7 days analytics fetch:", data);
        if (Array.isArray(data)) {
          setDailyData(data);
        } else {
          setDailyData([]);
        }
      } catch (err: any) {
        console.error("Failed to fetch last 7 days analytics:", err);
        setError("Failed to load 7-day analytics");
      } finally {
        setLoading(false);
      }
    };

    fetchLast7DaysAnalytics();
  }, [id]);

  // Helper to format date string (e.g. "2026-09-07" -> "Mon" / "Sep 7")
  const formatDayLabel = (dateStr?: string, index?: number): string => {
    if (!dateStr) {
      const defaultDays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
      return defaultDays[(index ?? 0) % 7];
    }
    try {
      const date = new Date(dateStr);
      if (isNaN(date.getTime())) return dateStr;
      return date.toLocaleDateString("en-US", { weekday: "short" });
    } catch {
      return dateStr;
    }
  };

  const formatFullDate = (dateStr?: string): string => {
    if (!dateStr) return "";
    try {
      const date = new Date(dateStr);
      if (isNaN(date.getTime())) return dateStr;
      return date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
    } catch {
      return dateStr;
    }
  };

  // Compute maximum count for relative height scaling
  const maxCount = Math.max(...dailyData.map((d) => Number(d.count || 0)), 1);
  const total7DayClicks = dailyData.reduce((acc, curr) => acc + Number(curr.count || 0), 0);

  return (
    <div className={`bg-white/5 border border-white/10 p-6 sm:p-8 rounded-2xl ${className}`}>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="font-heading text-lg font-semibold text-white flex items-center gap-2">
            <BarChart3 size={20} className="text-white" /> Click Traffic (Last 7 Days)
          </h3>
          <p className="text-xs text-gray-400 mt-1">
            {total7DayClicks.toLocaleString()} total clicks in the past week
          </p>
        </div>
        {!loading && !error && (
          <div className="hidden sm:flex items-center gap-1 text-xs text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/20">
            <TrendingUp size={12} />
            <span>7-Day Active</span>
          </div>
        )}
      </div>

      {loading ? (
        <div className="h-[200px] flex items-center justify-center text-xs text-gray-400">
          <div className="flex flex-col items-center gap-2">
            <div className="w-6 h-6 border-2 border-white/20 border-t-white rounded-full animate-spin" />
            <span>Loading 7-day analytics...</span>
          </div>
        </div>
      ) : error ? (
        <div className="h-[200px] flex items-center justify-center text-xs text-red-400">
          {error}
        </div>
      ) : dailyData.length === 0 ? (
        <div className="h-[200px] flex items-center justify-center text-xs text-gray-500">
          No traffic data available for the last 7 days.
        </div>
      ) : (
        <>
          <div className="flex items-end h-[200px] gap-2 md:gap-4 pt-6">
            {dailyData.map((item, i) => {
              const rawDate = item.day || item.Day;
              const count = Number(item.count || 0);
              // Calculate percentage height relative to max count (min height 8% for visibility)
              const heightPercent = maxCount > 0 ? Math.max(Math.round((count / maxCount) * 100), count > 0 ? 12 : 6) : 6;
              const dayLabel = formatDayLabel(rawDate, i);
              const fullDateStr = formatFullDate(rawDate);

              return (
                <div key={i} className="flex-1 flex flex-col items-center h-full justify-end group relative">
                  {/* Hover Tooltip */}
                  <div className="absolute -top-10 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none bg-black/90 border border-white/20 text-white text-[11px] py-1 px-2.5 rounded-lg whitespace-nowrap z-10 shadow-xl flex flex-col items-center">
                    <span className="font-semibold text-white">{count.toLocaleString()} clicks</span>
                    {fullDateStr && <span className="text-[9px] text-gray-400">{fullDateStr}</span>}
                  </div>

                  {/* Bar */}
                  <div
                    className="w-full bg-gradient-to-t from-white/30 to-white/80 group-hover:from-white/50 group-hover:to-white rounded-t-md transition-all duration-300 relative"
                    style={{ height: `${heightPercent}%` }}
                  >
                    {/* Count overlay label for bars */}
                    {count > 0 && (
                      <span className="absolute -top-5 left-1/2 -translate-x-1/2 text-[10px] text-gray-300 font-medium opacity-80 group-hover:opacity-100">
                        {count}
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Day Labels */}
          <div className="flex justify-between mt-4 text-xs font-medium text-gray-400 tracking-wider">
            {dailyData.map((item, i) => (
              <span key={i} className="flex-1 text-center truncate px-0.5">
                {formatDayLabel(item.day || item.Day, i)}
              </span>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
