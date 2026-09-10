"use client";

import { useSearchParams } from "next/navigation";
import Last7DaysBarGraph from "@/components/dashboard/Last7DaysBarGraph";

export default function BargraphSlotDefault() {
  const searchParams = useSearchParams();
  const view = searchParams.get("view");
  const id = searchParams.get("id");

  if (view === "analytics" && id) {
    return <Last7DaysBarGraph id={id} />;
  }

  return null;
}
