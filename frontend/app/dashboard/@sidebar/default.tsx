"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { Home, PlusCircle, Link as LinkIcon, X } from "lucide-react";
import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useSidebar } from "@/context/SidebarContext";

export default function DashboardSidebar() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const view = searchParams.get("view");

  const [urls, setUrls] = useState<Array<{ id: string; name: string }>>([]);
  const { user } = useAuth();
  const { isOpen, close } = useSidebar();
  const backendUrl = "http://localhost:8080";

  useEffect(() => {
    const getProjects = async () => {
      if (!user) return;
      try {
        const res = await fetch(`${backendUrl}/mapping/user/${user.id}`, {
          method: "GET",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
        });
        const data = await res.json();
        setUrls(data);
      } catch (err: any) {
        console.log("Failed to fetch projects", err);
      }
    };
    getProjects();
  }, [user]);

  const isHome = pathname === "/dashboard" && !view;
  const isRegister = view === "register";

  // Close sidebar when navigating on mobile
  const handleNavClick = () => close();

  return (
    <aside
      className={[
        // Desktop: always visible static column
        "md:relative md:translate-x-0 md:flex md:w-[260px] lg:w-[280px]",
        // Mobile: fixed off-canvas drawer
        "fixed inset-y-0 left-0 z-40",
        "w-[75vw] max-w-[280px]",
        // Slide animation
        "transition-transform duration-300 ease-in-out",
        isOpen ? "translate-x-0" : "-translate-x-full",
        // Always flex column
        "flex flex-col",
        // Styling
        "bg-[#0a0a0c] border-r border-white/8 backdrop-blur-xl",
      ].join(" ")}
      aria-label="Sidebar navigation"
    >
      {/* Header row with logo + mobile close button */}
      <div className="flex items-center justify-between px-6 pt-5 pb-4">
        <Link href="/" onClick={handleNavClick}>
          <span className="font-heading font-extrabold text-lg sm:text-xl tracking-tighter text-white">
            Shorten.it
          </span>
        </Link>
        {/* Close button — mobile only */}
        <button
          className="md:hidden flex items-center justify-center w-8 h-8 rounded-lg text-gray-500 hover:text-white hover:bg-white/8 transition-all"
          onClick={close}
          aria-label="Close sidebar"
        >
          <X size={18} />
        </button>
      </div>

      {/* Nav links */}
      <div className="px-3 flex-1 overflow-y-auto no-scrollbar">
        {/* Menu section */}
        <div className="mb-6">
          <div className="text-[10px] font-semibold text-gray-600 uppercase tracking-wider mb-3 px-3">
            Menu
          </div>

          <Link
            href="/dashboard"
            onClick={handleNavClick}
            className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 font-medium text-sm mb-1 ${
              isHome
                ? "bg-white/10 text-white shadow-inner"
                : "text-gray-400 hover:text-white hover:bg-white/5"
            }`}
          >
            <Home size={17} className={isHome ? "text-white" : ""} />
            Home
          </Link>

          <Link
            href="/dashboard?view=register"
            onClick={handleNavClick}
            className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 font-medium text-sm mb-1 ${
              isRegister
                ? "bg-white/10 text-white shadow-inner"
                : "text-gray-400 hover:text-white hover:bg-white/5"
            }`}
          >
            <PlusCircle size={17} className={isRegister ? "text-white" : ""} />
            Register URL
          </Link>
        </div>

        {/* Your Links section */}
        <div>
          <div className="text-[10px] font-semibold text-gray-600 uppercase tracking-wider mb-3 px-3">
            Your Links
          </div>
          {urls?.length > 0 ? (
            urls.map((url) => {
              const isActive =
                view === "analytics" &&
                searchParams.get("id") === url.id;
              return (
                <Link
                  href={`/dashboard?view=analytics&id=${url.id}`}
                  key={url.id}
                  onClick={handleNavClick}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 font-medium text-sm mb-1 ${
                    isActive
                      ? "bg-white/10 text-white shadow-inner"
                      : "text-gray-400 hover:text-white hover:bg-white/5"
                  }`}
                >
                  <LinkIcon
                    size={17}
                    className={isActive ? "text-white" : "shrink-0"}
                  />
                  <span className="truncate">{url.name}</span>
                </Link>
              );
            })
          ) : (
            <p className="text-xs text-gray-600 px-3 py-2">
              No links yet. Create one!
            </p>
          )}
        </div>
      </div>

      {/* Footer hint */}
      <div className="px-6 py-4 border-t border-white/5">
        <p className="text-[10px] text-gray-600 leading-relaxed">
          Shorten.it — powerful URL management
        </p>
      </div>
    </aside>
  );
}
