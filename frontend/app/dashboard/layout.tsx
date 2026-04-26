"use client";

import React, { useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { SidebarProvider, useSidebar } from "@/context/SidebarContext";
import { Menu, X } from "lucide-react";

function DashboardShell({
  children,
  sidebar,
}: {
  children: React.ReactNode;
  sidebar: React.ReactNode;
}) {
  const { isOpen, toggle, close } = useSidebar();

  return (
    <div className="flex h-screen w-full bg-[#030303] text-gray-100 overflow-hidden font-sans">

      {isOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/60 backdrop-blur-sm md:hidden"
          onClick={close}
          aria-hidden="true"
        />
      )}
      {sidebar}

      <main className="flex-1 flex flex-col h-full overflow-hidden min-w-0">
        {/* Top Navbar */}
        <nav className="h-14 border-b border-white/10 flex items-center px-4 sm:px-6 bg-black/50 backdrop-blur-xl z-20 sticky top-0 gap-3">
          {/* Hamburger – mobile only */}
          <button
            id="sidebar-toggle-btn"
            className="md:hidden flex items-center justify-center w-9 h-9 rounded-lg text-gray-400 hover:text-white hover:bg-white/8 transition-all"
            onClick={toggle}
            aria-label={isOpen ? "Close sidebar" : "Open sidebar"}
          >
            {isOpen ? <X size={20} /> : <Menu size={20} />}
          </button>

          <div className="font-heading text-base sm:text-lg font-semibold tracking-tight text-white">
            Dashboard
          </div>
        </nav>

        {/* Main Dashboard Content */}
        <div className="flex-1 overflow-y-auto no-scrollbar bg-gradient-to-br from-[#0a0a0c] to-[#030303]">
          <div className="w-full sm:px-6  sm:py-6 w-full">
            {children}
          </div> 
        </div>
      </main>
    </div>
  );
}

export default function DashboardLayout({
  children,
  sidebar,
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
    <SidebarProvider>
      <DashboardShell sidebar={sidebar}>{children}</DashboardShell>
    </SidebarProvider>
  );
}
