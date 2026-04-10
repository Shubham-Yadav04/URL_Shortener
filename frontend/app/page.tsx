"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowRight, Link as LinkIcon, BarChart3, ShieldCheck } from "lucide-react";
import Link from "next/link";
import { useRef } from "react";

function AnimatedSection({ children, className = "", id }: { children: React.ReactNode, className?: string, id?: string }) {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["0 1", "1 1"]
  });
  
  const opacity = useTransform(scrollYProgress, [0, 0.5], [0, 1]);
  const y = useTransform(scrollYProgress, [0, 0.5], [100, 0]);

  return (
    <motion.section 
      ref={ref}
      style={{ opacity, y }}
      className={`min-h-screen py-24 px-6 flex flex-col justify-center items-center relative overflow-hidden ${className}`}
      id={id}
    >
      {children}
    </motion.section>
  );
}

export default function LandingPage() {
  return (
    <div className="w-full bg-[#030303] text-gray-100 font-sans selection:bg-white/30">
      {/* Navbar */}
      <nav className="fixed top-0 left-0 w-full px-6 md:px-12 py-1 flex items-center justify-between z-50 backdrop-blur-sm  shadow-sm">
        <div className="font-heading font-extrabold text-2xl tracking-tighter text-white">
          Shorten.it
        </div>
        {/* <div className="hidden md:flex items-center gap-10 text-sm font-medium text-gray-400">
          <Link href="#features" className="hover:text-white transition-colors duration-200">Features</Link>
          <Link href="#contact" className="hover:text-white transition-colors duration-200">Contact</Link>
        </div> */}
        <div className="flex items-center gap-4">
          <Link href="/login" className="text-sm font-medium text-white px-5 py-2 rounded-xl border border-white/10 hover:bg-white/5 transition-all">Log in</Link>
          <Link href="/signup" className="text-sm font-medium text-black bg-white px-5 py-2 rounded-xl hover:bg-gray-200 hover:shadow-[0_0_20px_rgba(255,255,255,0.3)] transition-all">Sign up</Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="min-h-screen pt-32 pb-16 px-6 flex flex-col justify-center items-center relative overflow-hidden">
        <motion.div 
          className="text-center max-w-4xl mx-auto z-10"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <h1 className="font-heading text-5xl md:text-7xl font-bold tracking-tight mb-6 text-white leading-tight">
            Make every <span className="bg-gradient-to-r from-gray-200 to-white bg-clip-text text-transparent">connection</span> count
          </h1>
          <p className="text-lg md:text-xl text-gray-400 mb-12 max-w-2xl mx-auto font-light leading-relaxed">
            A professional, fast, and secure URL shortener designed for teams. Track your links, generate QR codes, and scale your reach.
          </p>
          <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
            <Link href="/dashboard" className="w-full sm:w-auto text-base font-semibold text-black bg-white px-8 py-4 rounded-xl hover:-translate-y-1 hover:shadow-[0_10px_30px_rgba(255,255,255,0.2)] transition-all duration-300">
              Get Started
            </Link>
            <Link href="#features" className="w-full sm:w-auto text-base font-semibold text-white px-8 py-4 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 transition-all duration-300">
              Learn More
            </Link>
          </div>
        </motion.div>
        {/* Subtle Background Glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-white/5 blur-[120px] rounded-full pointer-events-none" />
      </section>

      {/* Features Section */}
      <AnimatedSection id="features" className="bg-gradient-to-b from-[#030303] via-[#0a0a0c] to-[#030303]">
        <h2 className="font-heading text-4xl md:text-5xl font-bold tracking-tight mb-20 text-center text-white">Why Choose Us?</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl w-full mx-auto">
          {/* Card 1 */}
          <div className="group bg-white/[0.02] border border-white/5 backdrop-blur-sm p-10 rounded-3xl hover:bg-white/[0.04] hover:border-white/10 transition-all duration-500 hover:-translate-y-2">
            <div className="w-14 h-14 rounded-2xl bg-white/10 border border-white/20 flex items-center justify-center text-white mb-8 group-hover:scale-110 transition-transform duration-500 shadow-[0_0_30px_rgba(255,255,255,0.05)]">
              <LinkIcon size={24} />
            </div>
            <h3 className="font-heading text-xl font-semibold mb-4 text-gray-100">Lightning Fast</h3>
            <p className="text-gray-400 leading-relaxed font-light">
              Instantly resolve and redirect links under 50ms globally, ensuring your users never have to wait.
            </p>
          </div>
          {/* Card 2 */}
          <div className="group bg-white/[0.02] border border-white/5 backdrop-blur-sm p-10 rounded-3xl hover:bg-white/[0.04] hover:border-white/10 transition-all duration-500 hover:-translate-y-2">
            <div className="w-14 h-14 rounded-2xl bg-white/10 border border-white/20 flex items-center justify-center text-white mb-8 group-hover:scale-110 transition-transform duration-500 shadow-[0_0_30px_rgba(255,255,255,0.05)]">
              <BarChart3 size={24} />
            </div>
            <h3 className="font-heading text-xl font-semibold mb-4 text-gray-100">Deep Analytics</h3>
            <p className="text-gray-400 leading-relaxed font-light">
              Track clicks, geographical locations, devices, and referrals in real-time within your private dashboard.
            </p>
          </div>
          {/* Card 3 */}
          <div className="group bg-white/[0.02] border border-white/5 backdrop-blur-sm p-10 rounded-3xl hover:bg-white/[0.04] hover:border-white/10 transition-all duration-500 hover:-translate-y-2">
            <div className="w-14 h-14 rounded-2xl bg-white/10 border border-white/20 flex items-center justify-center text-white mb-8 group-hover:scale-110 transition-transform duration-500 shadow-[0_0_30px_rgba(255,255,255,0.05)]">
              <ShieldCheck size={24} />
            </div>
            <h3 className="font-heading text-xl font-semibold mb-4 text-gray-100">Secure & Reliable</h3>
            <p className="text-gray-400 leading-relaxed font-light">
              Enterprise-grade encryption and 99.99% uptime SLA. Built to handle millions of clicks effortlessly.
            </p>
          </div>
        </div>
      </AnimatedSection>

      {/* Custom QR Code callout */}
      <AnimatedSection>
        <div className="text-center max-w-4xl w-full mx-auto bg-gradient-to-tr from-white/[0.02] to-white/[0.05] border border-white/10 p-12 md:p-24 rounded-[3rem] backdrop-blur-lg relative overflow-hidden">
          <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-white/5 blur-[100px] rounded-full pointer-events-none" />
          <h2 className="font-heading text-4xl md:text-5xl font-bold tracking-tight mb-6 text-white relative z-10">Print to Digital, Instantly</h2>
          <p className="text-lg text-gray-400 mb-10 font-light leading-relaxed max-w-2xl mx-auto relative z-10">
            Generate high-quality secure QR codes for every shortened link. Perfect for events, menus, and marketing collateral.
          </p>
          <Link href="/dashboard" className="relative z-10 inline-flex items-center gap-2 text-base font-semibold text-black bg-white px-8 py-4 rounded-xl hover:bg-gray-200 hover:shadow-[0_0_30px_rgba(255,255,255,0.2)] transition-all duration-300 group">
            Try it out <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </AnimatedSection>

      {/* Footer */}
      <footer className="border-t border-white/5 bg-[#030303] pt-24 pb-12 px-8" id="contact">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12 mb-20">
          <div className="md:col-span-1">
            <div className="font-heading font-extrabold text-3xl tracking-tighter text-white mb-6">Shorten.it</div>
            <p className="text-sm text-gray-400 leading-relaxed font-light">
              Empowering individuals and teams to build robust, measurable connections across the web.
            </p>
          </div>
          
          <div className="flex flex-col gap-5">
            <h4 className="font-heading font-semibold text-white tracking-wide">Product</h4>
            <Link href="#" className="text-sm text-gray-400 hover:text-white transition-colors">Features</Link>
            <Link href="#" className="text-sm text-gray-400 hover:text-white transition-colors">Pricing</Link>
            <Link href="#" className="text-sm text-gray-400 hover:text-white transition-colors">API</Link>
          </div>

          <div className="flex flex-col gap-5">
            <h4 className="font-heading font-semibold text-white tracking-wide">Company</h4>
            <Link href="#" className="text-sm text-gray-400 hover:text-white transition-colors">About Us</Link>
            <Link href="#" className="text-sm text-gray-400 hover:text-white transition-colors">Careers</Link>
            <Link href="#" className="text-sm text-gray-400 hover:text-white transition-colors">hi@shorten.it</Link>
          </div>

          <div className="flex flex-col gap-5">
            <h4 className="font-heading font-semibold text-white tracking-wide">Legal</h4>
            <Link href="#" className="text-sm text-gray-400 hover:text-white transition-colors">Privacy Policy</Link>
            <Link href="#" className="text-sm text-gray-400 hover:text-white transition-colors">Terms of Service</Link>
          </div>
        </div>
        <div className="max-w-6xl mx-auto pt-8 border-t border-white/5 text-center text-xs text-gray-500 font-light">
          &copy; {new Date().getFullYear()} Shorten.it. All rights reserved. Designed for excellence.
        </div>
      </footer>
    </div>
  );
}
