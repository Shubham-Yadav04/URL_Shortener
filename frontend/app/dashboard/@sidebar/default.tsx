"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import {
  Home,
  PlusCircle,
  Link as LinkIcon,
  X,
  LogOut,
  Settings,
  Sparkles,
  Search,
  ExternalLink,
} from "lucide-react";
import { useEffect, useState, useMemo } from "react";
import { useAuth } from "@/context/AuthContext";
import { useSidebar } from "@/context/SidebarContext";
import { useRouter } from "next/navigation";
import ThemeToggle from "@/components/ThemeToggle";

export default function DashboardSidebar() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const view = searchParams.get("view");
  const { user, getAllMapping, logout } = useAuth();
  const { isOpen, close } = useSidebar();
  const router = useRouter();
  const [logoutError, setLogoutError] = useState(false);

  useEffect(() => {
    getAllMapping();
  }, [getAllMapping]);

  const isHome = pathname === "/dashboard" && !view;
  const isRegister = view === "register";
  const isSettings = view === "settings";

  const handleNavClick = () => close();

  return (
    <aside
      className={[
        // Desktop: always visible static column
        "md:relative md:translate-x-0 md:flex md:w-[260px] lg:w-[280px]",
        // Mobile: fixed off-canvas drawer
        "fixed inset-y-0 left-0 z-40",
        "w-[78vw] max-w-[290px]",
        // Slide animation
        "transition-transform duration-300 ease-in-out",
        isOpen ? "translate-x-0" : "-translate-x-full",
        // Flex column
        "flex flex-col",
        // Styling
        "bg-white dark:bg-[#0e0e11] border-r border-[#e6e3da] dark:border-[#232329] backdrop-blur-xl shadow-xs",
      ].join(" ")}
      aria-label="Sidebar navigation"
    >
      {/* Brand Header */}
      <div className="flex items-center justify-between px-5 pt-5 pb-4 border-b border-[#e6e3da] dark:border-[#232329]">
        <Link href="/" onClick={handleNavClick} className="flex items-center gap-2 group">
          <span className="w-6 h-6 rounded-md bg-[#141413] dark:bg-white text-white dark:text-black flex items-center justify-center font-serif text-xs font-bold">
            S.
          </span>
          <span className="font-serif text-lg font-semibold tracking-tight text-[#141413] dark:text-[#f5f5f2]">
            Shorten<span className="text-emerald-600 dark:text-emerald-400">.it</span>
          </span>
        </Link>

        {/* Mobile Close Button */}
        <button
          type="button"
          className="md:hidden flex items-center justify-center w-8 h-8 rounded-lg text-[#6e6d66] dark:text-[#8e8d86] hover:text-[#141413] dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/5 transition-all"
          onClick={close}
          aria-label="Close sidebar"
        >
          <X size={18} />
        </button>
      </div>

      {/* Quick Action Button */}
      <div className="p-3">
        <Link
          href="/dashboard?view=register"
          onClick={handleNavClick}
          className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl font-medium text-xs bg-[#141413] text-white dark:bg-white dark:text-black hover:bg-neutral-800 dark:hover:bg-neutral-200 transition-all shadow-xs"
        >
          <PlusCircle size={15} />
          <span>Register New URL</span>
        </Link>
      </div>

      {/* Nav links */}
      <div className="px-3 flex-1 overflow-y-auto no-scrollbar space-y-6">
        {/* Core Navigation Section */}
        <div>
          <div className="text-[10px] font-mono uppercase tracking-wider text-[#8e8d86] mb-2 px-3">
            Navigation
          </div>

          <Link
            href="/dashboard"
            onClick={handleNavClick}
            className={`flex items-center gap-2.5 px-3 py-2 rounded-xl transition-all duration-150 font-medium text-xs mb-1 ${
              isHome
                ? "bg-[#f4f2ea] text-[#141413] dark:bg-[#1a1a20] dark:text-[#f5f5f2] border border-[#e6e3da] dark:border-[#2b2b34] font-semibold"
                : "text-[#6e6d66] dark:text-[#8e8d86] hover:text-[#141413] dark:hover:text-white hover:bg-[#faf8f5] dark:hover:bg-[#15151a]"
            }`}
          >
            <Home size={15} className={isHome ? "text-emerald-600 dark:text-emerald-400" : ""} />
            <span>Overview</span>
          </Link>

          <Link
            href="/dashboard?view=register"
            onClick={handleNavClick}
            className={`flex items-center gap-2.5 px-3 py-2 rounded-xl transition-all duration-150 font-medium text-xs mb-1 ${
              isRegister
                ? "bg-[#f4f2ea] text-[#141413] dark:bg-[#1a1a20] dark:text-[#f5f5f2] border border-[#e6e3da] dark:border-[#2b2b34] font-semibold"
                : "text-[#6e6d66] dark:text-[#8e8d86] hover:text-[#141413] dark:hover:text-white hover:bg-[#faf8f5] dark:hover:bg-[#15151a]"
            }`}
          >
            <PlusCircle size={15} className={isRegister ? "text-emerald-600 dark:text-emerald-400" : ""} />
            <span>Create Short Link</span>
          </Link>

          <Link
            href="/dashboard?view=settings"
            onClick={handleNavClick}
            className={`flex items-center gap-2.5 px-3 py-2 rounded-xl transition-all duration-150 font-medium text-xs mb-1 ${
              isSettings
                ? "bg-[#f4f2ea] text-[#141413] dark:bg-[#1a1a20] dark:text-[#f5f5f2] border border-[#e6e3da] dark:border-[#2b2b34] font-semibold"
                : "text-[#6e6d66] dark:text-[#8e8d86] hover:text-[#141413] dark:hover:text-white hover:bg-[#faf8f5] dark:hover:bg-[#15151a]"
            }`}
          >
            <Settings size={15} className={isSettings ? "text-emerald-600 dark:text-emerald-400" : ""} />
            <span>Account Security</span>
          </Link>
        </div>

        {/* Project Links Section */}
        <ProjectLinksSection view={view} onNavClick={handleNavClick} />
      </div>

      {/* User Footer & Theme Controls */}
      <div className="p-3 border-t border-[#e6e3da] dark:border-[#232329] bg-[#faf8f5]/60 dark:bg-[#0a0a0c]/60">
        <div className="mb-2.5">
          <ThemeToggle variant="full" />
        </div>

        {/* User Card */}
        <div className="flex items-center justify-between p-2 rounded-xl bg-white dark:bg-[#121215] border border-[#e6e3da] dark:border-[#232329]">
          <div className="flex items-center gap-2 min-w-0">
            <div className="w-7 h-7 rounded-full bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 flex items-center justify-center font-serif text-xs font-semibold shrink-0">
              {user?.username?.charAt(0).toUpperCase() || "U"}
            </div>
            <div className="min-w-0">
              <div className="text-xs font-semibold text-[#141413] dark:text-[#f5f5f2] truncate">
                {user?.username || "Account"}
              </div>
              <div className="text-[10px] text-[#8e8d86] font-mono truncate">
                {user?.email || ""}
              </div>
            </div>
          </div>

          <button
            type="button"
            title="Sign out securely"
            onClick={async () => {
              setLogoutError(false);
              try {
                await logout();
                router.replace("/login");
              } catch {
                setLogoutError(true);
              }
            }}
            className="p-1.5 rounded-lg text-[#8e8d86] hover:text-red-500 hover:bg-red-500/10 transition-colors shrink-0"
            aria-label="Sign out"
          >
            <LogOut size={14} />
          </button>
        </div>

        {logoutError && (
          <p role="alert" className="mt-1 text-[10px] text-red-500 text-center">
            Could not sign out securely.
          </p>
        )}
      </div>
    </aside>
  );
}

function ProjectLinksSection({
  view,
  onNavClick,
}: {
  view: string | null;
  onNavClick: () => void;
}) {
  const { projectDetail } = useAuth();
  const searchParams = useSearchParams();
  const [filterText, setFilterText] = useState("");

  const filteredLinks = useMemo(() => {
    const list = projectDetail || [];
    if (!filterText.trim()) return list;
    return list.filter(
      (item) =>
        item.name.toLowerCase().includes(filterText.toLowerCase()) ||
        item.shortUrl.toLowerCase().includes(filterText.toLowerCase())
    );
  }, [projectDetail, filterText]);

  return (
    <div>
      <div className="flex items-center justify-between mb-2 px-3">
        <span className="text-[10px] font-mono uppercase tracking-wider text-[#8e8d86]">
          Your Links ({projectDetail?.length || 0})
        </span>
      </div>

      {/* Mini search filter if more than 4 links */}
      {(projectDetail || []).length > 4 && (
        <div className="px-2 mb-2">
          <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-[#e6e3da] dark:border-[#232329] bg-[#faf8f5] dark:bg-[#141418] text-xs">
            <Search size={12} className="text-[#8e8d86]" />
            <input
              type="text"
              placeholder="Filter links..."
              value={filterText}
              onChange={(e) => setFilterText(e.target.value)}
              className="w-full bg-transparent border-0 text-[11px] text-[#141413] dark:text-[#f5f5f2] placeholder-[#8e8d86] focus:outline-none font-sans"
            />
          </div>
        </div>
      )}

      {filteredLinks.length > 0 ? (
        <div className="space-y-0.5">
          {filteredLinks.map((url) => {
            const isActive =
              view === "analytics" &&
              searchParams.get("id") === url.mappingId.toString();

            return (
              <Link
                href={`/dashboard?view=analytics&id=${url.mappingId}`}
                key={url.mappingId}
                onClick={onNavClick}
                className={`flex items-center gap-2 px-3 py-2 rounded-xl transition-all duration-150 text-xs mb-0.5 group ${
                  isActive
                    ? "bg-[#f4f2ea] text-[#141413] dark:bg-[#1a1a20] dark:text-[#f5f5f2] border border-[#e6e3da] dark:border-[#2b2b34] font-semibold"
                    : "text-[#6e6d66] dark:text-[#8e8d86] hover:text-[#141413] dark:hover:text-white hover:bg-[#faf8f5] dark:hover:bg-[#15151a]"
                }`}
              >
                <LinkIcon
                  size={14}
                  className={`shrink-0 ${
                    isActive ? "text-emerald-600 dark:text-emerald-400" : "text-[#8e8d86] group-hover:text-emerald-600 dark:group-hover:text-emerald-400"
                  }`}
                />
                <span className="truncate">{url.name || url.shortUrl}</span>
              </Link>
            );
          })}
        </div>
      ) : (
        <div className="px-3 py-3 text-center rounded-xl border border-dashed border-[#e6e3da] dark:border-[#232329] bg-[#faf8f5]/40 dark:bg-[#141417]/40">
          <p className="text-[11px] text-[#8e8d86] leading-relaxed">
            No links yet. Register your first link above!
          </p>
        </div>
      )}
    </div>
  );
}
