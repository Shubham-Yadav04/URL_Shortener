import React from "react";

export default function DashboardLayout({ 
  children,
  sidebar
}: { 
  children: React.ReactNode;
  sidebar: React.ReactNode;
}) {
  return (
    <div className="flex h-screen w-full bg-[#030303] text-gray-100 overflow-hidden font-sans">
      {/* Parallel Sidebar Slot */}
      {sidebar}

      <main className="flex-1 flex flex-col h-full overflow-hidden">
        {/* Navbar inside Main */}
        <nav className="h-20 border-b border-white/10 flex items-center px-8 bg-black/50 backdrop-blur-xl z-30 sticky top-0">
          <div className="font-heading text-xl font-semibold tracking-tight text-white">Dashboard</div>
        </nav>
        
        {/* Main Dashboard Content */}
        <div className="flex-1 p-8 overflow-y-auto bg-gradient-to-br from-[#0a0a0c] to-[#030303]">
          <div className="max-w-6xl mx-auto">
            {children}
          </div>
        </div>
      </main>
    </div>
  );
}
