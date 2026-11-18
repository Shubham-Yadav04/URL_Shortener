import React from 'react'
import { ArrowRight } from 'lucide-react'
import Link from 'next/link'
import AnimatedSection from './AnimatedSection'
function CTA() {
  return (
      <AnimatedSection className="bg-[#faf8f5] dark:bg-[#09090b]">
        <div className="max-w-4xl mx-auto rounded-3xl border border-[#e6e3da] dark:border-[#232329] bg-[#f4f2ea] dark:bg-[#121215] p-10 sm:p-16 text-center relative overflow-hidden shadow-xl">
          <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-500/10 dark:bg-emerald-500/15 blur-[100px] rounded-full pointer-events-none" />

          <span className="text-xs font-mono uppercase tracking-widest text-emerald-700 dark:text-emerald-400 font-semibold">
            05 / READY TO SCALE
          </span>
          <h2 className="font-serif text-3xl sm:text-5xl font-normal tracking-tight text-[#141413] dark:text-[#f5f5f2] mt-3 mb-4">
            Build clean connections today.
          </h2>
          <p className="text-sm sm:text-base text-[#6e6d66] dark:text-[#8e8d86] max-w-xl mx-auto font-light leading-relaxed mb-8">
            Create an account in 10 seconds. Enjoy unlimited short codes, real-time telemetry, and instant QR generation.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5">
            <Link
              href="/signup"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 text-sm font-semibold text-white bg-[#141413] dark:text-black dark:bg-white px-8 py-3.5 rounded-xl hover:bg-neutral-800 dark:hover:bg-neutral-200 transition-all shadow-xs"
            >
              Start Shortening Free
              <ArrowRight size={16} />
            </Link>
            <Link
              href="/login"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 text-sm font-medium text-[#141413] dark:text-[#f5f5f2] px-7 py-3.5 rounded-xl border border-[#e6e3da] dark:border-[#232329] bg-white dark:bg-[#18181d] hover:bg-[#eceae2] dark:hover:bg-[#202026] transition-colors"
            >
              Sign In to Existing Account
            </Link>
          </div>
        </div>
      </AnimatedSection>
  )
}

export default CTA