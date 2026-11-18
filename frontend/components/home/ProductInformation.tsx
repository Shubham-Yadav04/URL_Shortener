import React from 'react'
import AnimatedSection from './AnimatedSection'
import Link from 'next/link'
import { CheckCircle2 } from 'lucide-react'
import { ArrowRight } from 'lucide-react'
function ProductInformation() {
  return (
     <AnimatedSection id="dual-architecture" className="bg-[#f7f6f0] dark:bg-[#0c0c0f]">
        <div className="max-w-6xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs font-mono uppercase tracking-widest text-emerald-600 dark:text-emerald-400 font-semibold">
              02 / DUAL CAPABILITY SYSTEM
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-normal tracking-tight text-[#141413] dark:text-[#f5f5f2] mt-2 mb-4">
              Two sides of one powerful engine.
            </h2>
            <p className="text-sm sm:text-base text-[#6e6d66] dark:text-[#8e8d86] font-light leading-relaxed">
              Whether you are distributing content across media channels or managing programmatic redirects at scale, Shorten.it is tuned for both disciplines.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Column A: For Creators & Marketers */}
            <div className="p-8 sm:p-10 rounded-3xl border border-[#e6e3da] dark:border-[#232329] bg-white dark:bg-[#121215] flex flex-col justify-between shadow-xs hover:border-[#d0ccc0] dark:hover:border-[#33333d] transition-all">
              <div>
                <div className="flex items-center justify-between mb-8">
                  <span className="px-3 py-1 rounded-full text-[11px] font-mono uppercase tracking-wider bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 font-medium">
                    For Growth & Marketing
                  </span>
                  <span className="font-mono text-xs text-[#8e8d86]">02.A</span>
                </div>

                <h3 className="font-serif text-2xl sm:text-3xl font-medium text-[#141413] dark:text-[#f5f5f2] mb-3">
                  Vanity URLs with instant physical-to-digital translation.
                </h3>
                <p className="text-sm text-[#6e6d66] dark:text-[#8e8d86] leading-relaxed mb-6 font-light">
                  Replace clumsy query strings with memorable, branded slugs. Generate high-density QR codes for business cards, billboards, packaging, and printed collateral with zero friction.
                </p>

                <ul className="space-y-3 mb-8 text-sm text-[#141413] dark:text-[#f5f5f2]">
                  <li className="flex items-center gap-2.5">
                    <CheckCircle2 size={16} className="text-emerald-600 dark:text-emerald-400 shrink-0" />
                    <span>Branded, memorable slugs that build domain authority</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <CheckCircle2 size={16} className="text-emerald-600 dark:text-emerald-400 shrink-0" />
                    <span>Print-ready SVG & PNG QR code downloads</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <CheckCircle2 size={16} className="text-emerald-600 dark:text-emerald-400 shrink-0" />
                    <span>Configurable expiration dates for time-sensitive campaigns</span>
                  </li>
                </ul>
              </div>

              <div className="pt-6 border-t border-[#e6e3da] dark:border-[#232329]">
                <Link
                  href="/dashboard?view=register"
                  className="inline-flex items-center gap-2 text-xs font-semibold text-emerald-700 dark:text-emerald-400 hover:gap-3 transition-all"
                >
                  Create a custom campaign link <ArrowRight size={14} />
                </Link>
              </div>
            </div>

            {/* Column B: For Engineers & Data Teams */}
            <div className="p-8 sm:p-10 rounded-3xl border border-[#e6e3da] dark:border-[#232329] bg-white dark:bg-[#121215] flex flex-col justify-between shadow-xs hover:border-[#d0ccc0] dark:hover:border-[#33333d] transition-all">
              <div>
                <div className="flex items-center justify-between mb-8">
                  <span className="px-3 py-1 rounded-full text-[11px] font-mono uppercase tracking-wider bg-neutral-200/60 dark:bg-neutral-800 text-neutral-800 dark:text-neutral-200 font-medium">
                    For Engineering & Security
                  </span>
                  <span className="font-mono text-xs text-[#8e8d86]">02.B</span>
                </div>

                <h3 className="font-serif text-2xl sm:text-3xl font-medium text-[#141413] dark:text-[#f5f5f2] mb-3">
                  Granular telemetry without intrusive surveillance.
                </h3>
                <p className="text-sm text-[#6e6d66] dark:text-[#8e8d86] leading-relaxed mb-6 font-light">
                  Inspect origin countries, user devices, operating systems, and hourly distribution curves in your dashboard. Enforce client-side cryptographic passwords before routing traffic.
                </p>

                <ul className="space-y-3 mb-8 text-sm text-[#141413] dark:text-[#f5f5f2]">
                  <li className="flex items-center gap-2.5">
                    <CheckCircle2 size={16} className="text-emerald-600 dark:text-emerald-400 shrink-0" />
                    <span>Real-time country, device, and browser breakdown</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <CheckCircle2 size={16} className="text-emerald-600 dark:text-emerald-400 shrink-0" />
                    <span>7-day click trend analytics with histogram views</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <CheckCircle2 size={16} className="text-emerald-600 dark:text-emerald-400 shrink-0" />
                    <span>Optional password gatekeeper for confidential assets</span>
                  </li>
                </ul>
              </div>

              <div className="pt-6 border-t border-[#e6e3da] dark:border-[#232329]">
                <Link
                  href="/dashboard"
                  className="inline-flex items-center gap-2 text-xs font-semibold text-emerald-700 dark:text-emerald-400 hover:gap-3 transition-all"
                >
                  Inspect telemetry dashboard <ArrowRight size={14} />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </AnimatedSection>

  )
}

export default ProductInformation