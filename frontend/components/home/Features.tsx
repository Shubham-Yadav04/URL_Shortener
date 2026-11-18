import React from 'react'
import AnimatedSection from './AnimatedSection'
import { Zap,BarChart3,QrCode,Clock,Globe,Lock } from 'lucide-react'
function Features() {
  return (
     <AnimatedSection id="features" className="bg-[#f7f6f0] dark:bg-[#0c0c0f]">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
            <div>
              <span className="text-xs font-mono uppercase tracking-widest text-emerald-600 dark:text-emerald-400 font-semibold">
                04 / CAPABILITIES
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-normal tracking-tight text-[#141413] dark:text-[#f5f5f2] mt-2">
                Engineered for speed, built for confidence.
              </h2>
            </div>
            <p className="text-sm text-[#6e6d66] dark:text-[#8e8d86] max-w-md font-light leading-relaxed">
              Every detail is calibrated to eliminate latency, prevent link rot, and safeguard your visitors.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Card 01 */}
            <div className="p-8 rounded-2xl border border-[#e6e3da] dark:border-[#232329] bg-white dark:bg-[#121215] hover:border-[#d0ccc0] dark:hover:border-[#33333d] transition-all group">
              <div className="flex items-center justify-between mb-6">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 flex items-center justify-center group-hover:scale-105 transition-transform">
                  <Zap size={18} />
                </div>
                <span className="font-mono text-xs text-[#8e8d86]">01</span>
              </div>
              <h3 className="font-serif text-xl font-medium text-[#141413] dark:text-[#f5f5f2] mb-2.5">
                Sub-50ms Global Routing
              </h3>
              <p className="text-xs sm:text-sm text-[#6e6d66] dark:text-[#8e8d86] leading-relaxed font-light">
                Distributed edge infrastructure ensures redirects occur before browser rendering engines initialize.
              </p>
            </div>

            {/* Card 02 */}
            <div className="p-8 rounded-2xl border border-[#e6e3da] dark:border-[#232329] bg-white dark:bg-[#121215] hover:border-[#d0ccc0] dark:hover:border-[#33333d] transition-all group">
              <div className="flex items-center justify-between mb-6">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 flex items-center justify-center group-hover:scale-105 transition-transform">
                  <BarChart3 size={18} />
                </div>
                <span className="font-mono text-xs text-[#8e8d86]">02</span>
              </div>
              <h3 className="font-serif text-xl font-medium text-[#141413] dark:text-[#f5f5f2] mb-2.5">
                Deep Real-time Telemetry
              </h3>
              <p className="text-xs sm:text-sm text-[#6e6d66] dark:text-[#8e8d86] leading-relaxed font-light">
                Capture click volumes, top countries, browser families, and platform distributions as they happen.
              </p>
            </div>

            {/* Card 03 */}
            <div className="p-8 rounded-2xl border border-[#e6e3da] dark:border-[#232329] bg-white dark:bg-[#121215] hover:border-[#d0ccc0] dark:hover:border-[#33333d] transition-all group">
              <div className="flex items-center justify-between mb-6">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 flex items-center justify-center group-hover:scale-105 transition-transform">
                  <Lock size={18} />
                </div>
                <span className="font-mono text-xs text-[#8e8d86]">03</span>
              </div>
              <h3 className="font-serif text-xl font-medium text-[#141413] dark:text-[#f5f5f2] mb-2.5">
                Password Access Locks
              </h3>
              <p className="text-xs sm:text-sm text-[#6e6d66] dark:text-[#8e8d86] leading-relaxed font-light">
                Secure internal previews, sensitive documents, and VIP links with custom client-side password verification.
              </p>
            </div>

            {/* Card 04 */}
            <div className="p-8 rounded-2xl border border-[#e6e3da] dark:border-[#232329] bg-white dark:bg-[#121215] hover:border-[#d0ccc0] dark:hover:border-[#33333d] transition-all group">
              <div className="flex items-center justify-between mb-6">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 flex items-center justify-center group-hover:scale-105 transition-transform">
                  <QrCode size={18} />
                </div>
                <span className="font-mono text-xs text-[#8e8d86]">04</span>
              </div>
              <h3 className="font-serif text-xl font-medium text-[#141413] dark:text-[#f5f5f2] mb-2.5">
                Vector QR Code Generator
              </h3>
              <p className="text-xs sm:text-sm text-[#6e6d66] dark:text-[#8e8d86] leading-relaxed font-light">
                Generate high-resolution SVG QR codes alongside every link for packaging, digital menus, and retail displays.
              </p>
            </div>

            {/* Card 05 */}
            <div className="p-8 rounded-2xl border border-[#e6e3da] dark:border-[#232329] bg-white dark:bg-[#121215] hover:border-[#d0ccc0] dark:hover:border-[#33333d] transition-all group">
              <div className="flex items-center justify-between mb-6">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 flex items-center justify-center group-hover:scale-105 transition-transform">
                  <Clock size={18} />
                </div>
                <span className="font-mono text-xs text-[#8e8d86]">05</span>
              </div>
              <h3 className="font-serif text-xl font-medium text-[#141413] dark:text-[#f5f5f2] mb-2.5">
                Automated Link Expiry
              </h3>
              <p className="text-xs sm:text-sm text-[#6e6d66] dark:text-[#8e8d86] leading-relaxed font-light">
                Define exact timestamp cutoffs. Expired links cleanly deactivate according to your marketing calendar.
              </p>
            </div>

            {/* Card 06 */}
            <div className="p-8 rounded-2xl border border-[#e6e3da] dark:border-[#232329] bg-white dark:bg-[#121215] hover:border-[#d0ccc0] dark:hover:border-[#33333d] transition-all group">
              <div className="flex items-center justify-between mb-6">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 flex items-center justify-center group-hover:scale-105 transition-transform">
                  <Globe size={18} />
                </div>
                <span className="font-mono text-xs text-[#8e8d86]">06</span>
              </div>
              <h3 className="font-serif text-xl font-medium text-[#141413] dark:text-[#f5f5f2] mb-2.5">
                Developer API Architecture
              </h3>
              <p className="text-xs sm:text-sm text-[#6e6d66] dark:text-[#8e8d86] leading-relaxed font-light">
                Integrate programmatic shortening directly into your backend pipelines, CI/CD jobs, and automated alerts.
              </p>
            </div>
          </div>
        </div>
      </AnimatedSection>
  )
}

export default Features