"use client";

import React, { useState } from "react";
import { Play, Pause, Maximize2, Sparkles, BarChart2, QrCode, ShieldCheck, Globe } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface MediaShowcaseProps {
  videoSrc?: string;
  imageSrc?: string;
  className?: string;
}

export default function MediaShowcase({
  videoSrc,
  imageSrc,
  className = "",
}: MediaShowcaseProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [activeTab, setActiveTab] = useState<"analytics" | "qr" | "security">("analytics");
  const videoRef = React.useRef<HTMLVideoElement>(null);

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    } else {
      setIsPlaying(!isPlaying);
    }
  };

  return (
    <div className={`w-full max-w-5xl mx-auto ${className}`}>
      {/* Outer Editorial Window Frame */}
      <div className="rounded-2xl sm:rounded-3xl border border-[#e6e3da] dark:border-[#232329] bg-white dark:bg-[#121215] shadow-2xl overflow-hidden transition-all duration-300">
        {/* Top Window Bar */}
        <div className="flex items-center justify-between px-4 sm:px-6 py-3.5 border-b border-[#e6e3da] dark:border-[#232329] bg-[#faf8f5] dark:bg-[#16161b]">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-[#e5e5e0] dark:bg-[#2e2e36] inline-block border border-black/5 dark:border-white/5" />
            <span className="w-3 h-3 rounded-full bg-[#e5e5e0] dark:bg-[#2e2e36] inline-block border border-black/5 dark:border-white/5" />
            <span className="w-3 h-3 rounded-full bg-[#e5e5e0] dark:bg-[#2e2e36] inline-block border border-black/5 dark:border-white/5" />
            <div className="hidden sm:flex items-center ml-4 px-3 py-1 rounded-md bg-white dark:bg-[#0c0c0e] border border-[#e6e3da] dark:border-[#232329] text-[11px] font-mono text-[#6e6d66] dark:text-[#8e8d86]">
              shorten.it/analytics/live-telemetry
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3 text-xs text-[#6e6d66] dark:text-[#8e8d86]">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 font-mono text-[11px]">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" /> Live Telemetry
            </span>
          </div>
        </div>

        {/* Media Canvas Area */}
        <div className="relative aspect-[16/10] sm:aspect-[16/9] w-full bg-[#f4f2ea] dark:bg-[#09090b] flex items-center justify-center overflow-hidden">
          {videoSrc ? (
            <video
              ref={videoRef}
              src={videoSrc}
              className="w-full h-full object-cover"
              loop
              muted
              playsInline
            />
          ) : imageSrc ? (
            <img
              src={imageSrc}
              alt="Dashboard preview"
              className="w-full h-full object-cover"
            />
          ) : (
            /* Elegant Editorial Interactive Mockup / Video Placeholder */
            <div className="relative w-full h-full p-4 sm:p-8 flex flex-col justify-between paper-texture">
              {/* Subtle background ambient glows */}
              <div className="absolute top-1/4 left-1/3 w-80 h-80 bg-emerald-500/10 dark:bg-emerald-500/15 blur-[100px] rounded-full pointer-events-none" />
              <div className="absolute bottom-10 right-10 w-60 h-60 bg-amber-500/10 dark:bg-amber-500/10 blur-[90px] rounded-full pointer-events-none" />

              {/* Top Sub-Navigation in Preview */}
              <div className="flex flex-wrap items-center justify-between gap-3 relative z-10">
                <div className="flex items-center gap-1.5 p-1 rounded-xl bg-white/80 dark:bg-[#18181d]/80 border border-[#e6e3da] dark:border-[#232329] backdrop-blur-md">
                  <button
                    type="button"
                    onClick={() => setActiveTab("analytics")}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                      activeTab === "analytics"
                        ? "bg-[#141413] text-white dark:bg-white dark:text-black shadow-xs"
                        : "text-[#6e6d66] dark:text-[#8e8d86] hover:text-[#141413] dark:hover:text-white"
                    }`}
                  >
                    <BarChart2 size={13} /> Real-time Analytics
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveTab("qr")}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                      activeTab === "qr"
                        ? "bg-[#141413] text-white dark:bg-white dark:text-black shadow-xs"
                        : "text-[#6e6d66] dark:text-[#8e8d86] hover:text-[#141413] dark:hover:text-white"
                    }`}
                  >
                    <QrCode size={13} /> QR Studio
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveTab("security")}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                      activeTab === "security"
                        ? "bg-[#141413] text-white dark:bg-white dark:text-black shadow-xs"
                        : "text-[#6e6d66] dark:text-[#8e8d86] hover:text-[#141413] dark:hover:text-white"
                    }`}
                  >
                    <ShieldCheck size={13} /> Edge Gatekeeper
                  </button>
                </div>

                <div className="hidden sm:flex items-center gap-2 text-xs font-mono text-[#6e6d66] dark:text-[#8e8d86]">
                  <span>P99: 14.2ms</span>
                  <span>•</span>
                  <span>99.99% SLA</span>
                </div>
              </div>

              {/* Center Content Mockup */}
              <div className="relative z-10 my-auto py-4">
                <AnimatePresence mode="wait">
                  {activeTab === "analytics" && (
                    <motion.div
                      key="analytics"
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -8 }}
                      transition={{ duration: 0.25 }}
                      className="grid grid-cols-1 sm:grid-cols-3 gap-3 max-w-3xl mx-auto"
                    >
                      <div className="p-4 rounded-xl bg-white/90 dark:bg-[#141417]/90 border border-[#e6e3da] dark:border-[#232329] backdrop-blur-md">
                        <span className="text-[11px] font-mono uppercase text-[#6e6d66] dark:text-[#8e8d86]">Total Invocations</span>
                        <div className="font-serif text-2xl sm:text-3xl font-normal mt-1 tracking-tight text-[#141413] dark:text-[#f5f5f2]">
                          482,910
                        </div>
                        <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium flex items-center gap-1 mt-1">
                          ↑ +24.8% vs last week
                        </span>
                      </div>

                      <div className="p-4 rounded-xl bg-white/90 dark:bg-[#141417]/90 border border-[#e6e3da] dark:border-[#232329] backdrop-blur-md">
                        <span className="text-[11px] font-mono uppercase text-[#6e6d66] dark:text-[#8e8d86]">Top Destination</span>
                        <div className="font-serif text-xl sm:text-2xl font-normal mt-1 truncate text-[#141413] dark:text-[#f5f5f2]">
                          United States
                        </div>
                        <span className="text-[11px] text-[#6e6d66] dark:text-[#8e8d86] font-mono mt-1 block">
                          68.4% desktop • 31.6% mobile
                        </span>
                      </div>

                      <div className="p-4 rounded-xl bg-white/90 dark:bg-[#141417]/90 border border-[#e6e3da] dark:border-[#232329] backdrop-blur-md">
                        <span className="text-[11px] font-mono uppercase text-[#6e6d66] dark:text-[#8e8d86]">Edge Speed</span>
                        <div className="font-serif text-2xl sm:text-3xl font-normal mt-1 text-[#141413] dark:text-[#f5f5f2]">
                          11.8ms
                        </div>
                        <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium flex items-center gap-1 mt-1">
                          ⚡ Zero cold start penalty
                        </span>
                      </div>
                    </motion.div>
                  )}

                  {activeTab === "qr" && (
                    <motion.div
                      key="qr"
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -8 }}
                      transition={{ duration: 0.25 }}
                      className="flex flex-col sm:flex-row items-center justify-center gap-6 max-w-xl mx-auto p-4 rounded-2xl bg-white/90 dark:bg-[#141417]/90 border border-[#e6e3da] dark:border-[#232329]"
                    >
                      <div className="w-28 h-28 p-2.5 rounded-xl bg-white dark:bg-white text-black flex items-center justify-center shadow-md">
                        <QrCode size={88} className="text-black" />
                      </div>
                      <div className="text-center sm:text-left">
                        <span className="text-[11px] font-mono uppercase tracking-wider text-emerald-600 dark:text-emerald-400 font-semibold">Vector SVG & PNG</span>
                        <h4 className="font-serif text-lg font-medium text-[#141413] dark:text-[#f5f5f2] mt-0.5">High-Resolution Physical Codes</h4>
                        <p className="text-xs text-[#6e6d66] dark:text-[#8e8d86] mt-1 max-w-xs leading-relaxed">
                          Export crisp vectors ready for print collateral, trade booths, product labels, and digital screens.
                        </p>
                      </div>
                    </motion.div>
                  )}

                  {activeTab === "security" && (
                    <motion.div
                      key="security"
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -8 }}
                      transition={{ duration: 0.25 }}
                      className="max-w-md mx-auto p-5 rounded-2xl bg-white/90 dark:bg-[#141417]/90 border border-[#e6e3da] dark:border-[#232329] text-center"
                    >
                      <div className="w-10 h-10 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto mb-3">
                        <ShieldCheck size={20} />
                      </div>
                      <h4 className="font-serif text-lg font-medium text-[#141413] dark:text-[#f5f5f2]">Client Gatekeeper Active</h4>
                      <p className="text-xs text-[#6e6d66] dark:text-[#8e8d86] mt-1 leading-relaxed">
                        Protected by client-side SHA-256 verification and automatic expiry thresholds.
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Bottom Video / Image Placeholder Indicator */}
              <div className="relative z-10 flex flex-col sm:flex-row items-center justify-between pt-3 border-t border-[#e6e3da] dark:border-[#232329] text-xs text-[#6e6d66] dark:text-[#8e8d86] gap-2">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-500" />
                  <span className="font-mono text-[11px]">Walkthrough Showcase Placeholder</span>
                </div>
                <div className="text-[11px] font-mono text-[#8e8d86] italic">
                  Drop your walkthrough video or demo MP4 into <code className="text-[#141413] dark:text-white not-italic font-semibold">/public/demo.mp4</code>
                </div>
              </div>
            </div>
          )}

          {/* Video Control Overlay if video is mounted */}
          {videoSrc && (
            <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
              <button
                type="button"
                onClick={togglePlay}
                aria-label={isPlaying ? "Pause video" : "Play video"}
                className="w-14 h-14 rounded-full bg-white text-black flex items-center justify-center shadow-xl hover:scale-105 transition-transform"
              >
                {isPlaying ? <Pause size={20} /> : <Play size={20} className="ml-1" />}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
