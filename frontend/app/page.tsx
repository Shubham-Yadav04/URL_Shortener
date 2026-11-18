"use client";

import React, { useRef } from "react";
import Link from "next/link";
import { motion, useScroll, useTransform } from "motion/react";
import {
  ArrowRight,
  Link as LinkIcon,
  BarChart3,
  ShieldCheck,
  QrCode,
  Zap,
  Globe,
  Lock,
  Clock,
  ChevronRight,
  CheckCircle2,
  ExternalLink,
} from "lucide-react";
import ThemeToggle from "@/components/ThemeToggle";
import MediaShowcase from "@/components/MediaShowcase";
import QuickShortenerPreview from "@/components/QuickShortenerPreview";
import SlidingDiv from "@/components/animation/SlidingDiv";

function AnimatedSection({
  children,
  className = "",
  id,
}: {
  children: React.ReactNode;
  className?: string;
  id?: string;
}) {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["0 1", "1 1"],
  });

  const opacity = useTransform(scrollYProgress, [0, 0.35], [0, 1]);
  const y = useTransform(scrollYProgress, [0, 0.35], [40, 0]);

  return (
    <motion.section
      ref={ref}
      style={{ opacity, y }}
      className={`py-20 sm:py-28 px-4 sm:px-6 md:px-8 relative overflow-hidden ${className}`}
      id={id}
    >
      {children}
    </motion.section>
  );
}

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
          {/* Eyebrow Pill */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-[#e6e3da] dark:border-[#232329] bg-white/70 dark:bg-[#121215]/70 backdrop-blur-sm text-xs font-mono text-[#6e6d66] dark:text-[#8e8d86] mb-8"
          >
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>01 / EDITORIAL LINK INFRASTRUCTURE</span>
          </motion.div>

          {/* Jack & Jill Inspired Editorial Headline */}
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
            Sub-50ms edge redirects, privacy-conscious geographic telemetry, and instant vector QR delivery.
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

      {/* Signature Jack & Jill Dual-Perspective Architecture Split */}
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

      {/* Editorial Pull-Quote / Testimonial */}
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

      {/* Final Editorial Call to Action */}
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

      {/* Architectural Editorial Footer */}
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
    </div>
  );
}
