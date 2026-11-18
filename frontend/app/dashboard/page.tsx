"use client";

import AnalyticsView from "@/components/dashboard/AnalyticView";
import HomeView from "@/components/dashboard/HomeView";
import RegisterView from "@/components/dashboard/RegisterView";
import AccountSettings from "@/components/dashboard/AccountSettings";
import { AnalyticProvider } from "@/context/AnalyticContext";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

function DashboardContent() {
  const searchParams = useSearchParams();
  const view = searchParams.get("view");
  const id = searchParams.get("id");

  if (view === "register") return <RegisterView />;
  if (view === "settings") return <AccountSettings />;
  if (view === "analytics" && id)
    return (
      <AnalyticProvider>
        <AnalyticsView id={id} />
      </AnalyticProvider>
    );
  return <HomeView />;
}

export default function DashboardPage() {
  return (
    <Suspense
      fallback={
        <div className="py-24 flex flex-col items-center justify-center gap-3">
          <div className="w-8 h-8 rounded-full border-2 border-emerald-500 border-t-transparent animate-spin" />
          <p className="font-mono text-xs text-[#8e8d86]">Loading workspace...</p>
        </div>
      }
    >
      <DashboardContent />
    </Suspense>
  );
}
