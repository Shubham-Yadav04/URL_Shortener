"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { Home, PlusCircle, Link as LinkIcon } from "lucide-react";
import { useState } from "react";

export default function DashboardSidebar() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const view = searchParams.get('view');
  
  // Real app gets items from API
  const [urls] = useState([
    { id: "1", name: "Campaign Alpha" },
    { id: "2", name: "Twitter Promo" },
  ]);

  const isHome = pathname === "/dashboard" && !view;
  const isRegister = view === "register";

  return (
    <aside className="w-[280px] hidden md:flex flex-col bg-[#0a0a0c]/95 border-r border-white/5 backdrop-blur-xl z-40 transition-transform">
      <div className="p-8 mb-4">
        <Link href="/">
          <div className="font-heading font-extrabold text-2xl tracking-tighter text-white">
            Shorten.it
          </div>
        </Link>
      </div>

      <div className="px-4 flex-1 overflow-y-auto">
        <div className="mb-8">
          <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4 px-4">Menu</div>
          <Link 
            href="/dashboard" 
            className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 font-medium text-sm mb-1 ${isHome ? 'bg-white/10 text-white shadow-inner' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}
          >
            <Home size={18} className={isHome ? 'text-white' : ''} />
            Home
          </Link>
          <Link 
            href="/dashboard?view=register" 
            className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 font-medium text-sm mb-1 ${isRegister ? 'bg-white/10 text-white shadow-inner' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}
          >
            <PlusCircle size={18} className={isRegister ? 'text-white' : ''} />
            Register URL
          </Link>
        </div>

        <div>
          <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4 px-4">Your Links</div>
          {urls.map((url) => {
            const isActive = view === "analytics" && searchParams.get('id') === url.id;
            return (
              <Link 
                href={`/dashboard?view=analytics&id=${url.id}`} 
                key={url.id} 
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 font-medium text-sm mb-1 ${isActive ? 'bg-white/10 text-white shadow-inner' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}
              >
                <LinkIcon size={18} className={isActive ? 'text-white' : ''} />
                <span className="truncate">{url.name}</span>
              </Link>
            )
          })}
        </div>
      </div>
    </aside>
  );
}
