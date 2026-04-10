"use client";

import { useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";
import { QRCodeSVG } from "qrcode.react";
import { Copy, Check, BarChart3, Globe, Smartphone, MousePointerClick, TrendingUp } from "lucide-react";
import { motion } from "framer-motion";

// Mock Data
const mockUrls = [
  { id: "1", name: "Campaign Alpha", originalUrl: "https://example.com/marketing/campaign-alpha?utm_source=twitter", shortUrl: "https://sh.it/ca1", clicks: 1245 },
  { id: "2", name: "Twitter Promo", originalUrl: "https://example.com/promo/spring", shortUrl: "https://sh.it/tw2", clicks: 832 },
];

function HomeView() {
  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
      <h1 className="font-heading text-3xl font-bold tracking-tight text-white mb-2">Welcome back, User</h1>
      <p className="text-gray-400 mb-8">Here's a quick overview of your link performance.</p>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <div className="bg-white/5 border border-white/10 p-6 rounded-2xl flex flex-col gap-2">
          <div className="flex items-center gap-2 text-gray-400 text-sm font-medium"><MousePointerClick size={16}/> Total Clicks</div>
          <div className="text-4xl font-bold text-white tracking-tight">2,077</div>
          <div className="text-xs text-white flex items-center gap-1 mt-1"><TrendingUp size={12}/> +12% this week</div>
        </div>
        <div className="bg-white/5 border border-white/10 p-6 rounded-2xl flex flex-col gap-2">
          <div className="flex items-center gap-2 text-gray-400 text-sm font-medium"><Globe size={16}/> Active Links</div>
          <div className="text-4xl font-bold text-white tracking-tight">2</div>
        </div>
        <div className="bg-white/5 border border-white/10 p-6 rounded-2xl flex flex-col gap-2">
          <div className="flex items-center gap-2 text-gray-400 text-sm font-medium"><Smartphone size={16}/> Top Source</div>
          <div className="text-4xl font-bold text-white tracking-tight">Twitter</div>
        </div>
      </div>

      <div className="bg-white/5 border border-white/10 p-8 rounded-2xl">
        <h2 className="font-heading text-xl font-semibold text-white mb-2">Recent Activity</h2>
        <p className="text-sm text-gray-400">Select a link from the sidebar to view detailed analytics.</p>
      </div>
    </motion.div>
  );
}

function RegisterView() {
  const [copied, setCopied] = useState(false);
  const [created, setCreated] = useState<any>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setCreated({
      name: "New Project Link",
      originalUrl: "https://example.com/new-project",
      shortUrl: "https://sh.it/np3"
    });
  };

  return (
    <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} className="max-w-2xl mx-auto bg-white/5 border border-white/10 p-8 md:p-12 rounded-[2rem]">
      <h2 className="font-heading text-2xl font-bold tracking-tight text-white mb-8">Register a new URL</h2>
      
      {!created ? (
        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-gray-300">Destination URL</label>
            <input type="url" placeholder="https://your-long-url.com/path" className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-white/30 transition-all" required />
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-gray-300">Project / Name (Optional)</label>
            <input type="text" placeholder="e.g. Summer Campaign" className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-white/30 transition-all" />
          </div>
          <button type="submit" className="w-full bg-white text-black font-semibold rounded-xl py-3 mt-4 hover:bg-gray-200 transition-all shadow-[0_0_15px_rgba(255,255,255,0.1)]">
            Shorten URL
          </button>
        </form>
      ) : (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <div className="flex items-center justify-between gap-4 bg-black/40 border border-white/10 p-4 rounded-xl mb-8">
            <span className="font-mono text-white text-sm">{created.shortUrl}</span>
            <button 
              className="bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 transition-all"
              onClick={() => {
                navigator.clipboard.writeText(created.shortUrl);
                setCopied(true);
                setTimeout(() => setCopied(false), 2000);
              }}
            >
              {copied ? <Check size={16} className="text-green-400" /> : <Copy size={16} />}
              {copied ? "Copied" : "Copy"}
            </button>
          </div>
          
          <div className="bg-white p-6 rounded-2xl max-w-[200px] mx-auto text-center shadow-[0_0_40px_rgba(255,255,255,0.1)] mb-8">
            <QRCodeSVG value={created.shortUrl} size={152} />
            <p className="text-xs text-gray-500 mt-4 font-medium">Scan to test</p>
          </div>

          <button onClick={() => setCreated(null)} className="w-full bg-transparent border border-white/20 text-white font-medium rounded-xl py-3 hover:bg-white/5 transition-all">
            Create Another
          </button>
        </motion.div>
      )}
    </motion.div>
  );
}

function AnalyticsView({ id }: { id: string }) {
  const urlData = mockUrls.find(u => u.id === id) || mockUrls[0];
  const [copied, setCopied] = useState(false);

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col gap-8">
      <div className="mb-2">
        <h1 className="font-heading text-3xl font-bold tracking-tight text-white mb-2">{urlData.name}</h1>
        <p className="text-sm text-gray-400 break-all">{urlData.originalUrl}</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 flex flex-col gap-8">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-white/5 border border-white/10 p-5 rounded-2xl">
              <div className="flex items-center gap-2 text-gray-400 text-sm font-medium mb-1"><MousePointerClick size={16} /> Total Clicks</div>
              <div className="text-3xl font-bold text-white">{urlData.clicks.toLocaleString()}</div>
            </div>
            <div className="bg-white/5 border border-white/10 p-5 rounded-2xl">
              <div className="flex items-center gap-2 text-gray-400 text-sm font-medium mb-1"><Globe size={16} /> Top Location</div>
              <div className="text-3xl font-bold text-white">USA</div>
            </div>
            <div className="bg-white/5 border border-white/10 p-5 rounded-2xl">
              <div className="flex items-center gap-2 text-gray-400 text-sm font-medium mb-1"><Smartphone size={16} /> Mobile</div>
              <div className="text-3xl font-bold text-white">68%</div>
            </div>
          </div>

          <div className="bg-white/5 border border-white/10 p-8 rounded-2xl">
            <h3 className="font-heading text-lg font-semibold text-white flex items-center gap-2 mb-8"><BarChart3 size={20} className="text-white" /> Click Traffic</h3>
            <div className="flex items-end h-[200px] gap-2 md:gap-4">
              {[40, 70, 45, 90, 65, 80, 100].map((h, i) => (
                <div key={i} className="flex-1 bg-white/50 rounded-t-md opacity-80" style={{ height: `${h}%` }} />
              ))}
            </div>
            <div className="flex justify-between mt-4 text-xs font-medium text-gray-500 uppercase tracking-wider">
              <span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span><span>Sat</span><span>Sun</span>
            </div>
          </div>
        </div>

        <div className="lg:col-span-1">
          <div className="bg-white/5 border border-white/10 p-6 rounded-2xl sticky top-8">
            <h3 className="font-heading text-lg font-semibold text-white mb-6">Link Details</h3>
            
            <div className="bg-black/50 border border-white/10 p-3 rounded-xl flex items-center justify-between mb-8">
              <span className="font-mono text-white text-sm truncate">{urlData.shortUrl}</span>
              <button 
                onClick={() => {
                  navigator.clipboard.writeText(urlData.shortUrl);
                  setCopied(true);
                  setTimeout(() => setCopied(false), 2000);
                }}
                className="text-gray-400 hover:text-white transition-colors"
                title="Copy shortUrl"
              >
                {copied ? <Check size={18} className="text-green-400" /> : <Copy size={18} />}
              </button>
            </div>

            <h4 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4">QR Code</h4>
            <div className="bg-white p-4 rounded-xl flex justify-center w-max mx-auto shadow-[0_0_30px_rgba(255,255,255,0.05)]">
              <QRCodeSVG value={urlData.shortUrl} size={160} />
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function DashboardContent() {
  const searchParams = useSearchParams();
  const view = searchParams.get("view");
  const id = searchParams.get("id");

  if (view === "register") return <RegisterView />;
  if (view === "analytics" && id) return <AnalyticsView id={id} />;
  return <HomeView />;
}

export default function DashboardPage() {
  return (
    <Suspense fallback={<div className="font-heading text-2xl font-bold tracking-tight text-white animate-pulse">Loading...</div>}>
      <DashboardContent />
    </Suspense>
  );
}
