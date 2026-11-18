"use client";

import React, { useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter, useSearchParams } from "next/navigation";
import { SidebarProvider, useSidebar } from "@/context/SidebarContext";
import { Menu, X, Plus, Sparkles, ExternalLink } from "lucide-react";
import Link from "next/link";
import ThemeToggle from "@/components/ThemeToggle";

function DashboardShell({
  children,
  sidebar,
}: {
  children: React.ReactNode;
  sidebar: React.ReactNode;
}) {
  const { isOpen, toggle, close } = useSidebar();
  const searchParams = useSearchParams();
  const view = searchParams.get("view");

  const viewTitle =
    view === "register"
      ? "Create Short Link"
      : view === "settings"
      ? "Account Security"
      : view === "analytics"
      ? "Link Telemetry"
      : "Overview";

  return (
    <div className="flex h-screen w-full bg-[#faf8f5] dark:bg-[#09090b] text-[#141413] dark:text-[#f5f5f2] overflow-hidden font-sans transition-colors duration-200">
      {/* Mobile Drawer Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/40 dark:bg-black/70 backdrop-blur-xs md:hidden"
          onClick={close}
          aria-hidden="true"
        />
      )}

      {/* Sidebar Slot */}
      {sidebar}

      <main className="flex-1 flex flex-col h-full overflow-hidden min-w-0">
        {/* Top Sticky Navbar */}
        <nav className="h-14 sm:h-16 border-b border-[#e6e3da] dark:border-[#232329] flex items-center justify-between px-4 sm:px-8 bg-white/80 dark:bg-[#121215]/80 backdrop-blur-md z-20 sticky top-0 transition-colors">
          <div className="flex items-center gap-3">
            {/* Hamburger – mobile only */}
            <button
              id="sidebar-toggle-btn"
              type="button"
              className="md:hidden flex items-center justify-center w-8 h-8 rounded-lg text-[#6e6d66] dark:text-[#8e8d86] hover:text-[#141413] dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/5 transition-all"
              onClick={toggle}
              aria-label={isOpen ? "Close sidebar" : "Open sidebar"}
            >
              {isOpen ? <X size={18} /> : <Menu size={18} />}
            </button>

            {/* Breadcrumb / Title */}
            <div className="flex items-center gap-2 text-xs sm:text-sm">
              <span className="font-mono text-[#8e8d86] hidden sm:inline">Workspace /</span>
              <span className="font-serif text-base sm:text-lg font-medium text-[#141413] dark:text-[#f5f5f2]">
                {viewTitle}
              </span>
            </div>
          </div>

          {/* Right Header Action Cluster */}
          <div className="flex items-center gap-2 sm:gap-3">
            <Link
              href="/dashboard?view=register"
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-[#141413] text-white dark:bg-white dark:text-black hover:bg-neutral-800 dark:hover:bg-neutral-200 transition-all shadow-xs"
            >
              <Plus size={14} /> New Link
            </Link>

            <ThemeToggle variant="icon" />

            <Link
              href="/"
              target="_blank"
              title="View Public Landing Page"
              className="hidden md:flex items-center justify-center w-9 h-9 rounded-full border border-[#e6e3da] dark:border-[#232329] text-[#6e6d66] dark:text-[#8e8d86] hover:text-[#141413] dark:hover:text-white hover:bg-[#f4f2ea] dark:hover:bg-[#1c1c22] transition-colors"
            >
              <ExternalLink size={14} />
            </Link>
          </div>
        </nav>

        {/* Main Dashboard Content Canvas */}
        <div className="flex-1 overflow-y-auto no-scrollbar bg-[#faf8f5] dark:bg-[#09090b] paper-texture">
          <div className="w-full max-w-6xl mx-auto px-4 sm:px-8 py-6 sm:py-8">
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
      <div className="flex h-screen w-full bg-[#faf8f5] dark:bg-[#09090b] items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 rounded-full border-2 border-emerald-500 border-t-transparent animate-spin" />
          <div className="font-serif text-lg font-medium text-[#141413] dark:text-[#f5f5f2]">
            Verifying credentials...
          </div>
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
