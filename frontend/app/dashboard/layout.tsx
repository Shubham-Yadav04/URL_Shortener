"use client";

import React, { useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";

export default function DashboardLayout({ 
  children,
  sidebar
}: { 
  children: React.ReactNode;
  sidebar: React.ReactNode;
}) {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push("/login");
    }
  }, [isLoading, isAuthenticated, router]);

  if (isLoading) {
    return (
      <div className="flex h-screen w-full bg-[#030303] items-center justify-center">
        <div className="font-heading text-2xl font-bold tracking-tight text-white animate-pulse">
          Authenticating...
        </div>
      </div>
    );
  }

  if (!isAuthenticated) return null;

  return (
    <div className="flex h-screen w-full bg-[#030303] text-gray-100 overflow-hidden font-sans">

      {sidebar}

      <main className="flex-1 flex flex-col h-full overflow-hidden">
        <nav className="h-14 border-b border-white/10 flex items-center px-4 sm:px-6 bg-black/50 backdrop-blur-xl z-30 sticky top-0">
          <div className="font-heading text-base sm:text-lg font-semibold tracking-tight text-white">Dashboard</div>
        </nav>
        
        {/* Main Dashboard Content */}
        <div className="flex-1 overflow-y-auto no-scrollbar bg-gradient-to-br from-[#0a0a0c] to-[#030303]">
          <div className="max-w-5xl mx-auto p-4 sm:p-6 lg:p-8">
            {children}
          </div>
        </div>
      </main>
    </div>
  );
}
