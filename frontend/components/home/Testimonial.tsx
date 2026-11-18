import React from 'react'

function Testimonial() {
  return (
    <section className="py-20 px-4 sm:px-6 md:px-8 border-y border-[#e6e3da] dark:border-[#232329] bg-[#faf8f5] dark:bg-[#09090b]">
        <div className="max-w-4xl mx-auto text-center">
          <span className="font-serif text-5xl sm:text-6xl text-[#d0ccc0] dark:text-[#33333d] select-none block mb-2 leading-none">
            “
          </span>
          <blockquote className="font-serif text-2xl sm:text-3xl md:text-4xl font-normal tracking-tight text-[#141413] dark:text-[#f5f5f2] leading-snug mb-6">
            Shorten.it replaces noisy dashboards with calm, surgical clarity. We reduced our link redirect latency to under 15ms globally.
          </blockquote>
          <div className="text-xs font-mono text-[#6e6d66] dark:text-[#8e8d86]">
            — Engineering Lead, High-Growth Publishing Platform
          </div>
        </div>
      </section>
  )
}

export default Testimonial