import React from 'react'
import Link from 'next/link'
import ThemeToggle from '../ThemeToggle'
function HomeFooter() {
  return (
        <footer className="border-t border-[#e6e3da] dark:border-[#232329] bg-[#f7f6f0] dark:bg-[#0c0c0f] pt-16 pb-12 px-4 sm:px-8">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-10 mb-14">
          <div className="md:col-span-1">
            <Link href="/" className="inline-flex items-center gap-2 mb-4">
              <span className="w-6 h-6 rounded-md bg-[#141413] dark:bg-white text-white dark:text-black flex items-center justify-center font-serif text-xs font-bold">
                S.
              </span>
              <span className="font-serif text-lg font-semibold tracking-tight text-[#141413] dark:text-[#f5f5f2]">
                Shorten.it
              </span>
            </Link>
            <p className="text-xs text-[#6e6d66] dark:text-[#8e8d86] leading-relaxed font-light mb-4">
              Editorial URL infrastructure and real-time telemetry for discerning creators and engineers.
            </p>
            <div className="flex items-center gap-2 text-[11px] font-mono text-[#6e6d66] dark:text-[#8e8d86]">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              <span>All Systems Operational</span>
            </div>
          </div>

          <div className="flex flex-col gap-3">
            <h4 className="text-xs font-mono uppercase tracking-wider text-[#141413] dark:text-[#f5f5f2] font-semibold">
              Platform
            </h4>
            <Link href="#features" className="text-xs text-[#6e6d66] dark:text-[#8e8d86] hover:text-[#141413] dark:hover:text-white transition-colors">
              Features
            </Link>
            <Link href="#dual-architecture" className="text-xs text-[#6e6d66] dark:text-[#8e8d86] hover:text-[#141413] dark:hover:text-white transition-colors">
              Architecture
            </Link>
            <Link href="#showcase" className="text-xs text-[#6e6d66] dark:text-[#8e8d86] hover:text-[#141413] dark:hover:text-white transition-colors">
              Video Walkthrough
            </Link>
            <Link href="/dashboard?view=register" className="text-xs text-[#6e6d66] dark:text-[#8e8d86] hover:text-[#141413] dark:hover:text-white transition-colors">
              Link Generator
            </Link>
          </div>

          <div className="flex flex-col gap-3">
            <h4 className="text-xs font-mono uppercase tracking-wider text-[#141413] dark:text-[#f5f5f2] font-semibold">
              Resources
            </h4>
            <Link href="/login" className="text-xs text-[#6e6d66] dark:text-[#8e8d86] hover:text-[#141413] dark:hover:text-white transition-colors">
              Account Login
            </Link>
            <Link href="/signup" className="text-xs text-[#6e6d66] dark:text-[#8e8d86] hover:text-[#141413] dark:hover:text-white transition-colors">
              Registration
            </Link>
            <Link href="/dashboard" className="text-xs text-[#6e6d66] dark:text-[#8e8d86] hover:text-[#141413] dark:hover:text-white transition-colors">
              Analytics Hub
            </Link>
          </div>

          <div className="flex flex-col gap-3">
            <h4 className="text-xs font-mono uppercase tracking-wider text-[#141413] dark:text-[#f5f5f2] font-semibold">
              Appearance
            </h4>
            <p className="text-xs text-[#6e6d66] dark:text-[#8e8d86] font-light">
              Toggle theme preference:
            </p>
            <div className="mt-1">
              <ThemeToggle variant="pill" />
            </div>
          </div>
        </div>

        <div className="max-w-6xl mx-auto pt-8 border-t border-[#e6e3da] dark:border-[#232329] flex flex-col sm:flex-row items-center justify-between text-xs text-[#8e8d86] font-light gap-3">
          <div>
            &copy; {new Date().getFullYear()} Shorten.it Infrastructure. Crafted with editorial restraint.
          </div>
          <div className="flex items-center gap-4 text-[11px] font-mono">
            <span>Latency: &lt;15ms</span>
            <span>•</span>
            <span>Edge: Global Anycast</span>
          </div>
        </div>
      </footer>
  )
}

export default HomeFooter