"use client";

import { useEffect, useState } from "react";
import { BarChart3, TrendingUp, Calendar } from "lucide-react";
import { BACKEND_URL } from "@/lib/backend";

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

    const fetchLast7DaysAnalytics = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(`${BACKEND_URL}/analytic/7Day/${id}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
        });

        if (!response.ok) {
          throw new Error(`Request failed: ${response.status}`);
        }

        const data = await response.json();
        if (Array.isArray(data)) {
          setDailyData(data);
        } else {
          setDailyData([]);
        }
      } catch (err: unknown) {
        console.error("Failed to fetch last 7 days analytics:", err);
        setError("Failed to load 7-day analytics");
      } finally {
        setLoading(false);
      }
    };

    fetchLast7DaysAnalytics();
  }, [id]);

  // Helper to format date string
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

  const maxCount = Math.max(...dailyData.map((d) => Number(d.count || 0)), 1);
  const total7DayClicks = dailyData.reduce((acc, curr) => acc + Number(curr.count || 0), 0);

  return (
    <div className={`rounded-3xl border border-[#e6e3da] dark:border-[#232329] bg-white dark:bg-[#121215] p-6 sm:p-8 shadow-xs ${className}`}>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6 pb-4 border-b border-[#e6e3da] dark:border-[#232329]">
        <div>
          <span className="text-[10px] font-mono uppercase tracking-widest text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1.5">
            <BarChart3 size={13} /> Time Series
          </span>
          <h3 className="font-serif text-xl sm:text-2xl font-normal text-[#141413] dark:text-[#f5f5f2] mt-0.5">
            Click Traffic (Last 7 Days)
          </h3>
          <p className="text-xs text-[#6e6d66] dark:text-[#8e8d86] mt-0.5">
            {total7DayClicks.toLocaleString()} total edge invocations in the rolling 7-day window.
          </p>
        </div>

        {!loading && !error && (
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full border border-emerald-500/20 bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 text-xs font-mono shrink-0">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <TrendingUp size={12} />
            <span>Active Stream</span>
          </div>
        )}
      </div>

      {loading ? (
        <div className="h-[210px] flex items-center justify-center text-xs text-[#6e6d66] dark:text-[#8e8d86]">
          <div className="flex flex-col items-center gap-2.5">
            <div className="w-6 h-6 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
            <span className="font-mono">Aggregating telemetry...</span>
          </div>
        </div>
      ) : error ? (
        <div className="h-[210px] flex items-center justify-center text-xs text-red-500 font-mono">
          {error}
        </div>
      ) : dailyData.length === 0 ? (
        <div className="h-[210px] flex items-center justify-center text-xs text-[#8e8d86] font-mono">
          No traffic logged in this 7-day cycle.
        </div>
      ) : (
        <>
          <div className="flex items-end h-[210px] gap-2 sm:gap-4 pt-6 px-2">
            {dailyData.map((item, i) => {
              const rawDate = item.day || item.Day;
              const count = Number(item.count || 0);
              const heightPercent =
                maxCount > 0 ? Math.max(Math.round((count / maxCount) * 100), count > 0 ? 12 : 6) : 6;
              const dayLabel = formatDayLabel(rawDate, i);
              const fullDateStr = formatFullDate(rawDate);

              return (
                <div key={i} className="flex-1 flex flex-col items-center h-full justify-end group relative">
                  {/* Hover Tooltip */}
                  <div className="absolute -top-12 opacity-0 group-hover:opacity-100 transition-opacity duration-150 pointer-events-none bg-[#141413] dark:bg-[#1e1e24] text-white text-[11px] py-1.5 px-3 rounded-lg whitespace-nowrap z-20 shadow-xl border border-white/10 flex flex-col items-center">
                    <span className="font-semibold">{count.toLocaleString()} clicks</span>
                    {fullDateStr && <span className="text-[9px] text-neutral-400 font-mono">{fullDateStr}</span>}
                  </div>

                  {/* Relative Bar */}
                  <div
                    className="w-full bg-[#141413] dark:bg-emerald-500/80 group-hover:bg-emerald-600 dark:group-hover:bg-emerald-400 rounded-t-lg transition-all duration-200 relative"
                    style={{ height: `${heightPercent}%` }}
                  >
                    {count > 0 && (
                      <span className="absolute -top-5 left-1/2 -translate-x-1/2 text-[10px] font-mono text-[#6e6d66] dark:text-[#8e8d86] font-semibold opacity-80 group-hover:opacity-100">
                        {count}
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Day Labels */}
          <div className="flex justify-between mt-4 pt-2 border-t border-[#e6e3da] dark:border-[#232329] text-[11px] font-mono text-[#6e6d66] dark:text-[#8e8d86]">
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
