"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import DetailedAnalyticsView from "@/components/dashboard/DetailedAnalyticsView";
import { BACKEND_URL } from "@/lib/backend";

interface DetailData {
  projectName?: string;
  longUrl?: string;
  totalCount?: number;
}

function DetailViewContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const id = searchParams.get("id");
  const [detail, setDetail] = useState<DetailData | null>(null);

  useEffect(() => {
    if (!id) return;
    const loadDetail = async () => {
      try {
        const [mappingResponse, summaryResponse] = await Promise.all([
          fetch(`${BACKEND_URL}/mapping/${id}`, { credentials: "include" }),
          fetch(`${BACKEND_URL}/analytic/summary/${id}`, { credentials: "include" }),
        ]);
        if (!mappingResponse.ok || !summaryResponse.ok) {
          throw new Error("Could not load this link's analytics.");
        }
        const [mapping, summary] = await Promise.all([
          mappingResponse.json(),
          summaryResponse.json(),
        ]);
        setDetail({
          projectName: mapping.projectName,
          longUrl: mapping.longUrl,
          totalCount: summary.totalCount ?? 0,
        });
      } catch (error) {
        console.error("Failed to load link details:", error);
        setDetail({});
      }
    };
    loadDetail();
  }, [id]);

  if (!id) {
    return (
      <div className="py-20 text-center font-mono text-xs text-[#8e8d86]">
        Select a link from your dashboard to view its analytics.
      </div>
    );
  }
  if (detail === null) {
    return (
      <div className="py-20 flex flex-col items-center justify-center gap-3">
        <div className="w-8 h-8 rounded-full border-2 border-emerald-500 border-t-transparent animate-spin" />
        <p className="font-mono text-xs text-[#8e8d86]">Loading analytics...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#faf8f5] dark:bg-[#09090b] text-[#141413] dark:text-[#f5f5f2] px-4 py-8 paper-texture">
      <DetailedAnalyticsView
        id={id}
        urlData={detail}
        onBack={() => router.push(`/dashboard?view=analytics&id=${id}`)}
      />
    </div>
  );
}

export default function DetailViewPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#faf8f5] dark:bg-[#09090b] py-20 flex flex-col items-center justify-center gap-3">
          <div className="w-8 h-8 rounded-full border-2 border-emerald-500 border-t-transparent animate-spin" />
          <p className="font-mono text-xs text-[#8e8d86]">Initializing view...</p>
        </div>
      }
    >
      <DetailViewContent />
    </Suspense>
  );
}
