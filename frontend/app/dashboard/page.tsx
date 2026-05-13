"use client";

import AnalyticsView from "@/components/dashboard/AnalyticView";
import HomeView from "@/components/dashboard/HomeView";
import RegisterView from "@/components/dashboard/RegisterView";
import { AnalyticProvider } from "@/context/AnalyticContext";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

function DashboardContent() {
  const searchParams = useSearchParams();
  const view = searchParams.get("view");
  const id = searchParams.get("id");

  if (view === "register") return <RegisterView />;
  if (view === "analytics" && id) return (
<AnalyticProvider>
    <AnalyticsView id={id} />
</AnalyticProvider>
  )
  return <HomeView />;
}

export default function DashboardPage() {
  return (
    <Suspense fallback={<div className="font-heading text-2xl font-bold tracking-tight text-white animate-pulse">Loading...</div>}>
      <DashboardContent />
    </Suspense>
  );
}
