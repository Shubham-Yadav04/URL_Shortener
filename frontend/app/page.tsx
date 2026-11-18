"use client";

import React, { useRef } from "react";
import Link from "next/link";
import { motion } from "motion/react";
import {
  ArrowRight 
} from "lucide-react";
import ThemeToggle from "@/components/ThemeToggle";
import MediaShowcase from "@/components/MediaShowcase";
import QuickShortenerPreview from "@/components/QuickShortenerPreview";
import HomeFooter from "@/components/home/footer";
import AnimatedSection from "@/components/home/AnimatedSection";
import CTA from "@/components/home/CTA";
import Testimonial from "@/components/home/Testimonial";
import Features from "@/components/home/Features";
export default function LandingPage() {
  return (
    <div className="w-full bg-[#faf8f5] dark:bg-[#09090b] text-[#141413] dark:text-[#f5f5f2] font-sans selection:bg-emerald-500/20 dark:selection:bg-emerald-500/30 transition-colors duration-200">
      {/* Floating Editorial Navbar */}
      <header className="fixed top-0 left-0 w-full z-50 px-4 sm:px-8 pt-4 pb-2 transition-all">
        <nav className="max-w-6xl mx-auto px-4 sm:px-6 py-3 rounded-2xl border border-[#e6e3da] dark:border-[#232329] bg-white/80 dark:bg-[#121215]/85 backdrop-blur-md flex items-center justify-between shadow-xs transition-colors">
          <Link href="/" className="flex items-center gap-2 group">
            <span className="w-7 h-7 rounded-lg bg-[#141413] dark:bg-white text-white dark:text-black flex items-center justify-center font-serif text-sm font-bold tracking-tighter">
              S.
            </span>
            <span className="font-serif text-lg sm:text-xl font-semibold tracking-tight text-[#141413] dark:text-[#f5f5f2]">
              Shorten<span className="text-emerald-600 dark:text-emerald-400">.it</span>
            </span>
          </Link>

          <div className="hidden md:flex items-center gap-7 text-xs font-medium text-[#6e6d66] dark:text-[#8e8d86]">
            <Link href="#features" className="hover:text-[#141413] dark:hover:text-white transition-colors">
              Features
            </Link>
            <Link href="#dual-architecture" className="hover:text-[#141413] dark:hover:text-white transition-colors">
              Architecture
            </Link>
            <Link href="#showcase" className="hover:text-[#141413] dark:hover:text-white transition-colors">
              Product Demo
            </Link>
            <Link href="#analytics" className="hover:text-[#141413] dark:hover:text-white transition-colors">
              Telemetry
            </Link>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <ThemeToggle variant="icon" />
            <Link
              href="/login"
              className="text-xs font-medium text-[#141413] dark:text-[#f5f5f2] px-3.5 py-2 rounded-xl border border-[#e6e3da] dark:border-[#232329] hover:bg-[#f4f2ea] dark:hover:bg-[#1c1c22] transition-colors"
            >
              Log in
            </Link>
            <Link
              href="/signup"
              className="text-xs font-semibold text-white bg-[#141413] dark:text-black dark:bg-white px-4 py-2 rounded-xl hover:bg-neutral-800 dark:hover:bg-neutral-200 transition-all shadow-xs"
            >
              Get Started
            </Link>
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="min-h-screen pt-36 sm:pt-40 pb-20 px-4 sm:px-6 md:px-8 flex flex-col justify-center items-center relative overflow-hidden paper-texture">
        {/* Soft Ambient Radiance */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[550px] bg-emerald-500/8 dark:bg-emerald-500/10 blur-[130px] rounded-full pointer-events-none" />

        <div className="text-center max-w-4xl mx-auto z-10">
         

          <motion.h1
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="font-serif text-4xl sm:text-6xl md:text-7xl lg:text-7xl font-normal tracking-tight text-[#141413] dark:text-[#f5f5f2] mb-6 leading-[1.1]"
          >
            Where every link finds its audience with{" "}
            <span className="italic font-normal text-emerald-800 dark:text-emerald-400">
              quiet precision.
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-base sm:text-lg md:text-xl text-[#6e6d66] dark:text-[#8e8d86] mb-10 max-w-2xl mx-auto font-light leading-relaxed"
          >
            A disciplined, ultra-fast link engine designed for modern teams.
            Sub-15ms edge redirects, privacy-conscious geographic telemetry, and instant vector QR delivery.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-col sm:flex-row justify-center items-center gap-3.5 mb-16"
          >
            <Link
              href="/dashboard"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 text-sm font-semibold text-white bg-[#141413] dark:text-black dark:bg-white px-7 py-3.5 rounded-xl hover:bg-neutral-800 dark:hover:bg-neutral-200 transition-all shadow-xs group"
            >
              Open Dashboard
              <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </Link>

            <Link
              href="#showcase"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 text-sm font-medium text-[#141413] dark:text-[#f5f5f2] px-6 py-3.5 rounded-xl border border-[#e6e3da] dark:border-[#232329] bg-white dark:bg-[#121215] hover:bg-[#f4f2ea] dark:hover:bg-[#18181d] transition-colors"
            >
              Watch Walkthrough
            </Link>
          </motion.div>

          {/* Trust Metrics Strip */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 pt-8 border-t border-[#e6e3da] dark:border-[#232329] max-w-3xl mx-auto text-left"
          >
            <div>
              <span className="text-[11px] font-mono text-[#6e6d66] dark:text-[#8e8d86] uppercase">Latency</span>
              <div className="font-serif text-2xl font-normal text-[#141413] dark:text-[#f5f5f2] mt-0.5">&lt; 15ms</div>
              <span className="text-[11px] text-emerald-600 dark:text-emerald-400">Global edge routing</span>
            </div>
            <div>
              <span className="text-[11px] font-mono text-[#6e6d66] dark:text-[#8e8d86] uppercase">Reliability</span>
              <div className="font-serif text-2xl font-normal text-[#141413] dark:text-[#f5f5f2] mt-0.5">99.99%</div>
              <span className="text-[11px] text-[#6e6d66] dark:text-[#8e8d86]">Uptime guarantee</span>
            </div>
            <div>
              <span className="text-[11px] font-mono text-[#6e6d66] dark:text-[#8e8d86] uppercase">Telemetry</span>
              <div className="font-serif text-2xl font-normal text-[#141413] dark:text-[#f5f5f2] mt-0.5">Real-time</div>
              <span className="text-[11px] text-[#6e6d66] dark:text-[#8e8d86]">No sampling delay</span>
            </div>
            <div>
              <span className="text-[11px] font-mono text-[#6e6d66] dark:text-[#8e8d86] uppercase">Security</span>
              <div className="font-serif text-2xl font-normal text-[#141413] dark:text-[#f5f5f2] mt-0.5">SHA-256</div>
              <span className="text-[11px] text-emerald-600 dark:text-emerald-400">Password protection</span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Interactive Sandbox Section */}
      <section className="py-12 px-4 sm:px-6 md:px-8 border-y border-[#e6e3da] dark:border-[#232329] bg-[#faf8f5]/50 dark:bg-[#0c0c0e]/50">
        <div className="max-w-5xl mx-auto">
          <QuickShortenerPreview />
        </div>
      </section>

      {/* Video & Interface Showcase Section (User Requested!) */}
      <AnimatedSection id="showcase" className="bg-[#faf8f5] dark:bg-[#09090b]">
        <div className="max-w-6xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="text-xs font-mono uppercase tracking-widest text-emerald-600 dark:text-emerald-400 font-semibold">
              03 / PRODUCT DEMO & WALKTHROUGH
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-normal tracking-tight text-[#141413] dark:text-[#f5f5f2] mt-2 mb-4">
              See the interface in motion.
            </h2>
            <p className="text-sm sm:text-base text-[#6e6d66] dark:text-[#8e8d86] font-light leading-relaxed">
              Explore live analytics, QR generation, and edge security inside our minimal workspace. Add your own video walkthrough or review the interactive prototype below.
            </p>
          </div>

          {/* Media Showcase Component */}
          <MediaShowcase />
        </div>
      </AnimatedSection>

      {/* 6 Modular Editorial Features Grid */}
     <Features/>

      {/* Editorial Pull-Quote / Testimonial */}
      <Testimonial/>

      {/* Final Editorial Call to Action */}
    
<CTA/>
      {/* Architectural Editorial Footer */}
 <HomeFooter/>
    </div>
  );
}
